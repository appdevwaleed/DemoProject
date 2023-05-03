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
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import HomeCategoryCard2 from '../../Components/HomeCategoryCard2';
import CategorySubDesign from "../../Components/MainCategories/CategorySubDesign";
import BannerLoader from '../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../Components/MarketCard3';
import ProductsComp from '../../Components/ProductsComp';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import stylesFunc from '../../Screens/Home/styles';//
import { SvgUri } from 'react-native-svg';
import {
  getImageUrl
} from '../../utils/helperFunctions';
import { useScrollToTop } from '@react-navigation/native';
import staticStrings from '../../constants/staticStrings';
import imagePath from '../../constants/imagePath';
import { getItem, setItem } from '../../utils/utils';
import GradientButton from '../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import { hitSlopProp } from '../../styles/commonStyles';
import {
  googleLogin
} from '../../utils/socialLogin';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import actions from '../../redux/actions';
import LinearGradient from "react-native-linear-gradient";

export default function MainCategories({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {}
}) {
  console.log("Home - MainCategories.js")
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
  console.log("allCategory", allCategory);
  
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);
  const { vendorsData, isViewMore } = state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  
  const {height, width} = Dimensions.get('window');
  
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


  const itemWidth = ((width-55) / 2); //we are having already 20 px gap from both sides means 40 in total plus 10 is distance between items so total 70
  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ width:itemWidth, marginLeft:(index+1)%2==0?15:0 }}>
        <CategorySubDesign
          data={item}
          onPress={() => onPressCategory(item)}
          isLoading={isLoading}
          itemIndex={index}
          itemDisabled={index>2?true:false}
        />
      </View>
    )
  };


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
      <View style={{paddingTop:10}}>
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories.length && (
            <View
              style={{
                // marginHorizontal: moderateScale(8),
                // marginTop: moderateScaleVertical(10),
                
              }}>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} >

              <FlatList
                columnWrapperStyle={{
                    flex: 1,
                    alignItems: "space-around",
                    marginBottom:20,
                    paddingHorizontal:20
                }}
            //    scrollEnabled={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
                // horizontal
                data={[...appMainData?.categories]}
                keyExtractor={(item) => item.id.toString()}
                // showsHorizontalScrollIndicator={false}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => (
                  <View style={{ }} />
                )}
                // ListHeaderComponent={() => (
                //   <View style={{ marginLeft: moderateScale(12) }} />
                // )}
                // ListFooterComponent={() => (
                //   <View style={{ marginRight: moderateScale(12) }} />
                // )}
              />
              </ScrollView>
            </View>
          )}
        {/* <View style={{ marginTop: moderateScaleVertical(16) }}>
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
        </View> */}
      </View>
    );
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
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
        <View>
            {appMainData && appMainData?.allCategory && appMainData.allCategory.length < 1 && (<View style={{
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
        </View>)}
        </View>

        <Animatable.View animation={'fadeInUp'} delay={200}>
          {categoriesBanners()}
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
// children
// : 
// (3) [{…}, {…}, {…}]
// icon
// : 
// {proxy_url: 'https://images.runrun.ae/insecure/fill/', image_path: '/sm/0/plain/https://runrun-assets.s3.me-south-1.am…icon/CaoQ4WSr3IEGL9VoULcM26kTPy4ET4xhqg38ufYv.png', image_fit: 'https://images.runrun.ae/insecure/fit/'}
// id
// : 
// 2
// image
// : 
// {proxy_url: 'https://images.runrun.ae/insecure/fill/', image_path: '/sm/0/plain/https://runrun-assets.s3.me-south-1.am…mage/lDrMOVE8ViAdFmPkIokYN1o7Gn11VajMgRaV2SiL.png', image_fit: 'https://images.runrun.ae/insecure/fit/'}
// name
// : 
// "Grocery"
// parent_id
// : 
// 1
// products_count
// : 
// 0
// redirect_to
// : 
// "Vendor"
// slug
// : 
// "grocery"
// template_type_id
// : 
// 1
// warning_page_id
// : 
// null