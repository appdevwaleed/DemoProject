import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Animated,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp from '../../../Components/ProductsComp';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import stylesFunc from '../styles';
import { SvgUri } from 'react-native-svg';
import {
  getImageUrl
} from '../../../utils/helperFunctions';
import { useScrollToTop } from '@react-navigation/native';
import staticStrings from '../../../constants/staticStrings';
import imagePath from '../../../constants/imagePath';
import { getItem, setItem } from '../../../utils/utils';
import GradientButton from '../../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../../Components/ButtonComponent';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
  googleLogin
} from '../../../utils/socialLogin';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import actions from '../../../redux/actions';
import LinearGradient from "react-native-linear-gradient";

export default function DashBoardFive({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {}
}) {
  console.log("Home - DashBoardFive.js")
  const [modalVisible, setModalVisible] = useState(false);
  const userData = useSelector((state) => state?.auth?.userData);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const {
    currencies,
    languages,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: [],
    isViewMore: false,
  });

  const appMainData = useSelector((state) => state?.home?.appMainData);
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );


  const allCategory = appMainData?.categories;
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);
  const { vendorsData, isViewMore } = state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));


  useEffect(() => {
    getItem('isLoggedInDevice').then((data) => {
      if (data !== 'true') {
        setModalVisible(true)
      }
    }).catch(() => { })
  }, []);
  
  useEffect(() => {
    if (appMainData?.vendors && appMainData?.vendors.length) {
      updateState({
        vendorsData: appMainData?.vendors.slice(0, appMainData?.categories?.length ? appMainData?.categories?.length : 4),
      });
      return;
    }
    updateState({
      vendorsData: [],
    });
  }, [appMainData?.vendors]);


  const getCartDetail = () => {
    actions
      .getCartDetail(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
      })
      .catch((error) => { });
  };

  //Saving login user to backend

  const _saveSocailLogin = async (socialLoginData, type) => {
    console.log("_saveSocailLogin Called");
    let userStaticName = DeviceInfo.getBundleId();
    userStaticName = userStaticName.split('.')

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName || `${userStaticName[userStaticName.length - 1]} user`;
    data['auth_id'] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();
    data['fcm_token'] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();

    let query = '';
    if (
      type == 'facebook' ||
      type == 'twitter' ||
      type == 'google' ||
      type == 'apple'
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        setItem('isLoggedInDevice', 'true');
        if (!!res.data) {
          //  if (
          //    !!res.data?.client_preference?.verify_email &&
          //    !!res.data?.client_preference?.verify_phone
          //  ) {
          if (
            !!res.data?.verify_details?.is_email_verified &&
            !!res.data?.verify_details?.is_phone_verified
          ) {
            navigation.push(navigationStrings.DRAWER_ROUTES);
          } else {
            moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
          }
        }
        //    else if (
        //      !!res.data?.client_preference?.verify_email ||
        //      !!res.data?.client_preference?.verify_phone
        //    ) {
        //      if (
        //        !!res.data?.verify_details?.is_email_verified ||
        //        !!res.data?.verify_details?.is_phone_verified
        //      ) {
        //        navigation.push(navigationStrings.DRAWER_ROUTES);
        //      } else {
        //        moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
        //      }
        //    } else {
        //      navigation.push(navigationStrings.DRAWER_ROUTES);
        //    }
        //  }
        updateState({ isLoading: false });
        getCartDetail();
      })
      .catch(errorMethod);
  };

  const openGmailLogin = () => {
    updateState({ isLoading: true });
    googleLogin()
      .then((res) => {
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({ isLoading: false });
        }
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ marginRight: moderateScale(8), width: width / 6.2 }}>
        <HomeCategoryCard2
          data={item}
          onPress={() => onPressCategory(item)}
          isLoading={isLoading}
        />
      </View>
    )
  };

  const _renderVendors = ({ item, index }) => (
    <View style={{ marginHorizontal: moderateScale(16) }}>
      <MarketCard3
        data={item}
        onPress={() => onPressCategory(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  );

  const scaleInAnimated = new Animated.Value(0);

  const renderBanners = ({ item }) => {
    const imageUrl = getImageUrl(
      item.image.image_fit,
      item.image.image_path,
      '400/600',
    );

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => bannerPress(item)}
      // style={getScaleTransformationStyle(scaleInAnimated)}
      // onPressIn={() => pressInAnimation(scaleInAnimated)}
      // onPressOut={() => pressOutAnimation(scaleInAnimated)}
      >
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.high }}
          style={{
            height: height / 3.8,
            width: moderateScale(160),
            borderRadius: moderateScale(16),
          }}
          resizeMode={FastImage.resizeMode.cover}
        />

      </TouchableOpacity>
    );
  };

  const categoriesBanners = () => {
    return (
      <View style={{}}>
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories.length && (
            <View
              style={{
                // marginHorizontal: moderateScale(8),
                marginTop: moderateScaleVertical(10),
              }}>
              <FlatList
                horizontal
                data={
                  isViewMore
                    ? appMainData?.categories
                    : appMainData?.categories.filter((item, indx) => indx <= 7)
                }
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
                ListHeaderComponent={() => (
                  <View style={{ marginLeft: moderateScale(12) }} />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
              />
            </View>
          )}
        <View style={{ marginTop: moderateScaleVertical(16) }}>
          {!!appData?.mobile_banners?.length && (
            <View>
              <FlatList
                horizontal
                data={appData?.mobile_banners}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderBanners}
                ItemSeparatorComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
                ListHeaderComponent={() => (
                  <View style={{ marginLeft: moderateScale(16) }} />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };
  const renderBrands = ({ item }) => {
    // const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '800/600');
    const imageURI = getImageUrl(
      item.image.proxy_url,
      item.image.image_path,
      '800/600',
    );
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      // style={{
      //   ...getScaleTransformationStyle(scaleInAnimated),
      // }}
      // onPressIn={() => pressInAnimation(scaleInAnimated)}
      // onPressOut={() => pressOutAnimation(scaleInAnimated)}
      >
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{ uri: imageURI, priority: FastImage.priority.high }}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const onViewAll = (type, data) => {
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const listHeader = (type, data = [], isViewAll = false) => {
    return (
      <View style={styles.viewAllVeiw}>
        <Text
          style={{
            ...styles.exploreStoresTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginTop: 0,
          }}>
          {type}
        </Text>
        {!!isViewAll && !!vendorsData && vendorsData.length > 1 && (
          <TouchableOpacity onPress={() => onViewAll(type, data)}>
            <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFeaturedProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const renderSale = ({ item }) => {
    return (
      <ProductsComp
        // isDiscount
        item={item}
        imageStyle={{ height: moderateScale(186) }}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        {/* <SearchLoader viewStyles={{marginTop: moderateScale(15)}} /> */}
        <CategoryLoader2 viewStyles={{ marginTop: moderateScale(25) }} />
        <CategoryLoader2 viewStyles={{ marginTop: moderateScale(35) }} />

        <View style={{ flexDirection: 'row' }}>
          <HeaderLoader
            viewStyles={{ marginVertical: 30 }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginVertical: 30, marginLeft: 0 }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginVertical: 30, marginLeft: 0 }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <HeaderLoader
            viewStyles={{ marginTop: 5 }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(20)}
            rectHeightLeft={moderateScaleVertical(20)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 5 }}
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScaleVertical(20)}
            rectHeightLeft={moderateScaleVertical(20)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>

        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(20) }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(25) }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(25) }}
        />
        {/* <HomeLoader /> */}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal
        backdropColor={"black"}
        backdropOpacity={0.7}
        animationType={'none'}
        isVisible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ marginTop: moderateScaleVertical(15) }}>
              <GradientButton
                btnText={strings.SIGNUP_NEW_USER}
                btnStyle={{
                  flexDirection: 'row',
                }}
                onPress={() => {
                  navigation.navigate(navigationStrings.SIGN_UP, {});
                  setModalVisible(!modalVisible)
                }
                }
              />
            </View>
            <View style={{ marginTop: moderateScaleVertical(15) }}>
              <GradientButton
                btnText={strings.SIGNIN_EXISTING_USER}
                btnStyle={{
                  flexDirection: 'row',
                }}
                onPress={() => {
                  navigation.navigate(navigationStrings.LOGIN, {});
                  setModalVisible(!modalVisible)
                }
                }
              />
            </View>
            {/* <View style={{ marginTop: moderateScaleVertical(15) }}>
              <TransparentButtonWithTxtAndIcon
                icon={imagePath.ic_google2}
                btnText={strings.CONTINUE_GOOGLE}
                containerStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  borderColor: colors.borderColorD,
                  borderWidth: 1,
                }}
                textStyle={{
                  color: isDarkMode ? colors.white : colors.textGreyB,
                  marginHorizontal: moderateScale(15),
                }}
                onPress={() => {
                  setModalVisible(!modalVisible)
                  openGmailLogin()
                }}
              />
            </View> */}
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Pressable
                hitSlop={hitSlopProp}
                onPress={() => {
                  console.log("Cancel Clicked")
                  setModalVisible(!modalVisible)
                }}>
                <Text
                  style={{
                    color: themeColors.primary_color,
                    // lineHeight:24,
                    fontFamily: fontFamily.bold,
                  }}>
                  {strings.SKIP}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }>
        <View>{appMainData && appMainData?.vendors && appMainData.vendors.length < 1 && (<View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text  style={
              isDarkMode
                ? {...styles.txtSmall, color: MyDarkTheme.colors.text}
                : {...styles.txtSmall, color: colors.textGreyLight}
            }>
            {strings.NO_DELIVERY}
          </Text>
        </View>)}</View>
        <Animatable.View animation={'fadeInUp'} delay={200}>
          {categoriesBanners()}
          {vendorsData && !!vendorsData?.length && (
            <>
              <View style={styles.viewAllVeiw}>
                <Text
                  style={{
                    ...styles.exploreStoresTxt,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    marginTop: 0,
                  }}>
                  {`${strings.NEARBY} ${appData?.profile?.preferences?.vendors_nomenclature}`}
                </Text>
              </View>
              {
                vendorsData.map((item) => {
                  return (
                    
                    <View   key={item.id.toString()}>
                      <View style={{ marginHorizontal: moderateScale(16) }}>
                 
                        <MarketCard3
                          data={item}
                          onPress={() => onPressCategory(item)}
                          extraStyles={{ margin: 2 }}
                        />
                      </View>
                      <View style={{ height: moderateScale(10) }} />
                    </View>)
                })}
              <View style={{...styles.viewAllVeiw,justifyContent: 'flex-end'}}>
                {!!vendorsData && vendorsData.length > 1 && (
                  <TouchableOpacity onPress={() => onViewAll(`${strings.NEARBY} ${appData?.profile?.preferences?.vendors_nomenclature}`, appMainData?.vendors)}>
                    <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
                  </TouchableOpacity>
                )}
              </View>



              {/* <FlatList
                scrollEnabled={false}
                ListHeaderComponent={() =>
                  listHeader(
                    `${strings.NEARBY} ${appData?.profile?.preferences?.vendors_nomenclature}`,
                    [],
                    false,
                  )
                }
                ListFooterComponent={() =>
                  listHeader(
                   '',
                    appMainData?.vendors,
                    true,
                  )
                }
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={true}
                // ref={ref}
                data={vendorsData}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderVendors}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScale(10) }} />
                )}
              /> */}

              {checkForBrand && (
                <View style={{}}>
                  {appMainData &&
                    appMainData?.brands &&
                    !!appMainData?.brands.length && (
                      <>
                        <View>{listHeader(strings.POPULAR_BRANDS)}</View>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          data={appMainData?.brands}
                          renderItem={renderBrands}
                          keyExtractor={(item) => item.id.toString()}
                          ItemSeparatorComponent={() => (
                            <View style={{ marginRight: moderateScale(12) }} />
                          )}
                          ListHeaderComponent={() => (
                            <View style={{ marginLeft: moderateScale(16) }} />
                          )}
                          ListFooterComponent={() => (
                            <View style={{ marginRight: moderateScale(16) }} />
                          )}
                        />
                      </>
                    )}
                </View>
              )}
            </>
          )}

          <View style={{}}>
            {appMainData &&
              appMainData?.featured_products &&
              !!appMainData?.featured_products.length && (
                <>
                  <View>{listHeader(strings.FEATURED_PRODUCTS)}</View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={appMainData?.featured_products}
                    renderItem={renderFeaturedProducts}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                    ListHeaderComponent={() => (
                      <View style={{ marginLeft: moderateScale(16) }} />
                    )}
                    ListFooterComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                  />
                </>
              )}
          </View>

          <View style={{}}>
            {appMainData &&
              appMainData?.new_products &&
              !!appMainData?.new_products.length && (
                <>
                  <View>{listHeader(strings.NEW_PRODUCTS)}</View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={appMainData?.new_products}
                    renderItem={renderFeaturedProducts}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                    ListHeaderComponent={() => (
                      <View style={{ marginLeft: moderateScale(16) }} />
                    )}
                    ListFooterComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                  />
                </>
              )}
          </View>

          <View>
            {appMainData &&
              appMainData?.on_sale_products &&
              !!appMainData?.on_sale_products.length && (
                <>
                  <View>{listHeader(strings.ON_SALE)}</View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    keyExtractor={(item) => item?.id.toString() || ''}
                    data={appMainData?.on_sale_products}
                    renderItem={renderSale}
                    ItemSeparatorComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                    ListHeaderComponent={() => (
                      <View style={{ marginLeft: moderateScale(16) }} />
                    )}
                    ListFooterComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                  />
                </>
              )}
          </View>
        </Animatable.View>
        <View
          style={{
            height:
              Platform.OS == 'ios' ? moderateScale(60) : moderateScale(90),
          }}
        />
      </ScrollView>
    </View>
  );
}
