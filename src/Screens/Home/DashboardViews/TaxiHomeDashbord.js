import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import BannerHome from '../../../Components/BannerHome';
import BrickList from '../../../Components/BrickList';
import ImgCardForBrickList from '../../../Components/ImgCardForBrickList';
import CardLoader from '../../../Components/Loaders/CardLoader';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {
  height,
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';

import navigationStrings from '../../../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';

import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import actions from '../../../redux/actions';
import BottomViewModal from '../../../Components/BottomViewModal';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import TaxiHomeCategoryCard from '../../../Components/TaxiHomeCategoryCard';
import TaxiBannerHome from '../../../Components/TaxiBannerHome';
import SelectTimeModalView from '../../CourierService/ChooseCarTypeAndTime/SelectTimeModalView';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import GradientButton from '../../../Components/GradientButton';
import AddressModal3 from '../../../Components/AddressModal3';
import AddressModal from '../../../Components/AddressModal';
import Loader from '../../../Components/Loader';
import staticStrings from '../../../constants/staticStrings';

export default function TaxiHomeDashbord({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = false,
  isRefreshing = false,
  onPressCategory = () => {},
  selectedToggle,
  toggleData,
  isDineInSelected = false,
}) {
  console.log("Home - TaxiHomeDashbord.js")
  const mapRef = React.createRef();
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    date: new Date(),
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    allSavedAddress: [],
    isVisible: false,
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    isVisible1: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    selectedAvailableTimeOption: null,
    selectedTime: null,
    selectedDateAndTime: null,
    slectedDate: null,
    newAddressAdded: null,
    isLoadingModal: false,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  let findCabCategory = appMainData?.categories?.find(
    (x) => x?.redirect_to == staticStrings.PICKUPANDDELIEVRY,
  );
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {
    slider1ActiveSlide,
    newCategoryData,
    homeCategoryData,
    region,
    coordinate,
    allSavedAddress,
    isVisible,
    date,
    availAbleTimes,
    selectedAvailableTimeOption,
    selectedTime,
    selectedDateAndTime,
    slectedDate,
    isVisible1,
    updateData,
    indicator,
    type,
    del,
    isLoadingModal,
  } = state;
  const styles = stylesFunc({themeColors, fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const newCategoryAry = [...appMainData?.categories];

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      updateState({
        selectedTime: null,
        selectedDateAndTime: null,
        slectedDate: null,
      });
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        // actions.saveAllUserAddress(res.data);
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const continueWithNaxtScreen = (item) => {
    onPressCategory(item);
  };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };
  // console.log(slectedDate, selectedTime, 'jskjsnsdkjgndsgkdsgj');
  const _onDateChange = (date) => {
    // alert(213);
    let time = moment(date).format('HH:mm');
    let dateSelectd = moment(date).format('YYYY-MM-DD');

    updateState({
      selectedDateAndTime: `${dateSelectd} ${time}`,
      slectedDate: dateSelectd,
      selectedTime: moment(date).format('HH:mm'),
      date: date,
    });
  };
  const onDateChange = (value) => {
    _onDateChange(value);
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);
    updateState({isLoading: true});

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({del: del ? false : true});
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };


  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible1: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const _renderItem = ({item}) => {
    return (
      <TaxiHomeCategoryCard
        data={item}
        onPress={() => continueWithNaxtScreen(item)}
      />
    );
  };

  const _ModalMainView = () => {
    return (
      <View style={styles.modalContainer}>
        <View>
          <View
            style={{
              alignItems: 'center',
              height: height / 3.5,
            }}>
            <DatePicker
              date={date}
              mode="datetime"
              textColor={isDarkMode ? '#fff' : colors.blackB}
              minimumDate={new Date()}
              style={{
                width: width - 20,
                height: height / 4.1,
              }}
              // onDateChange={setDate}
              onDateChange={(value) => onDateChange(value)}
            />
            <TouchableOpacity
              style={{
                width: width - 40,
                height: 40,
                backgroundColor: themeColors.primary_color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                updateState({
                  isVisible: false,
                  isLoadingModal: true,
                });

                setTimeout(() => {
                  updateState({isLoadingModal: false});
                  navigation.navigate(navigationStrings.ADDADDRESS, {
                    cat: appMainData?.categories[0],
                    datetime: {slectedDate, selectedTime},
                    pickUpTimeType: slectedDate || selectedTime ? '' : 'now',
                  });
                }, 2000);
              }}>
              <Text
                style={{color: colors.white, fontFamily: fontFamily.regular}}>
                {strings.SETPICKUPTIME}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{width: width}}>
            <TouchableOpacity
              key={inx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                justifyContent: 'space-between',
                marginLeft: moderateScale(20),
                width: width - 60,
              }}
              onPress={moveToNewScreen(
                navigationStrings.ADDADDRESS,
                appMainData?.categories[0],
              )}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  marginRight: 20,
                  width: width - 70,
                }}>
                <View>
                  <Image source={image} />
                </View>
                <View
                  style={{
                    marginHorizontal: moderateScale(10),
                  }}>
                  <Text numberOfLines={2} style={[styles.addressTitle]}>
                    {itm?.street}
                  </Text>
                  <Text numberOfLines={2} style={[styles.address]}>
                    {itm?.address}
                  </Text>
                </View>
              </View>
              <Image
                style={{
                  tintColor: colors.textGreyLight,
                  marginRight: moderateScale(20),
                }}
                source={imagePath.goRight}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.textGreyLight.substr(1),
                  40,
                ),
                width: width / 1.2,
                marginLeft: moderateScale(60),
                height: 0.5,
              }}></View>
          </ScrollView>
        );
      })
    );
  };
  const savedPlaceView1 = (image) => {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{width: width}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            justifyContent: 'space-between',
            marginLeft: moderateScale(20),
            width: width - 20,
          }}
          onPress={() => {
            userData?.auth_token
              ? navigation.navigate(navigationStrings.ADDADDRESS, {
                  data: appMainData?.categories[0],
                })
              : navigation.navigate(navigationStrings.LOGIN);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View>
              <Image source={image} />
            </View>
            <View style={{marginHorizontal: moderateScale(10)}}>
              <Text numberOfLines={2} style={[styles.address]}>
                {strings.CHOOSESAVEDPLACE}
              </Text>
            </View>
          </View>
          <Image
            style={{
              tintColor: colors.textGreyLight,
              marginRight: moderateScale(20),
            }}
            source={imagePath.goRight}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.textGreyLight.substr(1),
              40,
            ),
            width: width / 1.2,
            marginLeft: moderateScale(60),
            height: 0.5,
          }}></View>
      </ScrollView>
    );
  };

  return (
    <>
      <ScrollView
        // bounces={false}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, zIndex: 1000}}>
        <>
          <TaxiBannerHome
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={[appData?.mobile_banners[0]]}
            sliderWidth={sliderWidth + 20}
            itemWidth={itemWidth + 20}
            onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
            onPress={(item) => bannerPress(item)}
          />
          <View style={{height: moderateScaleVertical(5)}} />
        </>
        <Loader isLoading={isLoadingModal} />

        <FlatList
          horizontal
          data={appMainData?.categories}
          style={{
            marginTop: moderateScaleVertical(10),
            marginHorizontal: moderateScale(10),
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: moderateScaleVertical(20),
                  marginLeft: moderateScale(10),
                }}></View>
            );
          }}
          renderItem={_renderItem}
        />

        {!!findCabCategory && (
          <>
            <View
              style={{
                marginHorizontal: moderateScale(10),
                height: moderateScaleVertical(50),
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.taxiCategoryGrayColor.substr(1),
                  30,
                ),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{width: width - width / 3}}
                onPress={() => {
                  userData?.auth_token
                    ? navigation.navigate(navigationStrings.ADDADDRESS, {
                        cat: appMainData?.categories[0],
                        datetime: {slectedDate, selectedTime},
                        pickUpTimeType:
                          slectedDate || selectedTime ? '' : 'now',
                      })
                    : navigation.navigate(navigationStrings.LOGIN);
                }}>
                <Text
                  style={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.Medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  userData?.auth_token
                    ? updateState({
                        isVisible: true,
                      })
                    : navigation.navigate(navigationStrings.LOGIN);
                }}>
                <View
                  style={{
                    backgroundColor: colors.white,
                    width: moderateScale(80),
                    height: moderateScaleVertical(26),
                    borderRadius: 20,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(5),
                  }}>
                  <Image source={imagePath.clock} />
                  <Text>{strings.NOW}</Text>
                  <Image
                    style={{
                      transform: [{rotate: '90deg'}],
                      height: moderateScaleVertical(8),
                      width: moderateScale(8),
                    }}
                    source={imagePath.goRight}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {allSavedAddress.length && userData?.auth_token ? (
              <></>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  justifyContent: 'space-between',
                  marginLeft: moderateScale(20),
                  width: width - 20,
                  marginTop: moderateScaleVertical(10),
                }}
                onPress={() => {
                  userData?.auth_token
                    ? setModalVisible(true, 'addAddress')
                    : navigation.navigate(navigationStrings.LOGIN);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View>
                    <Image source={imagePath.plushRoundedBackground} />
                  </View>
                  <View style={{marginHorizontal: moderateScale(10)}}>
                    <Text numberOfLines={2} style={[styles.address]}>
                      {'Add new address'}
                    </Text>
                  </View>
                </View>
                <Image
                  style={{
                    tintColor: colors.textGreyLight,
                    marginRight: moderateScale(20),
                  }}
                  source={imagePath.goRight}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: moderateScale(20),
                marginBottom: moderateScaleVertical(20),
              }}>
              {addressView(imagePath.locationRoundedBackground)}
              {savedPlaceView1(imagePath.starRoundedBackground)}
            </View>

            <View style={{marginHorizontal: moderateScale(20)}}>
              <Text
                style={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.AROUNDYOU}
              </Text>

              <View
                style={{
                  height: height / 4,
                  width: width - 45,
                  borderRadius: 12,
                  marginTop: moderateScaleVertical(20),
                  alignItems: 'center',
                }}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                //  customMapStyle={mapStyleGrey}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    borderRadius: 12,
                  }}
                  // provider={MapView.PROVIDER_GOOGLE}
                  region={region}
                  initialRegion={region}
                  showsUserLocation={true}
                  //showsMyLocationButton={true}
                  // pointerEvents={'none'}
                ></MapView>
              </View>
            </View>
          </>
        )}

        <BottomViewModal
          isDatetimePicker={true}
          show={isVisible}
          mainContainView={_ModalMainView}
          closeModal={_modalClose}
        />

        <View style={{height: moderateScaleVertical(65)}} />
      </ScrollView>
      <AddressModal3
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible1}
        indicator={indicator}
        onClose={() => setModalVisible(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
        // onPress={currentLocation}
      />
    </>
  );
}
