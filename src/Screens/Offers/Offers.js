import React, {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View, Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import OffersCard from '../../Components/OffersCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptyOffers from './ListEmptyOffers';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import OffersCard2 from '../../Components/OffersCard2';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import fontFamily from '../../styles/fontFamily';

export default function Offer({route, navigation}) {
  console.log("Offers - Offers.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    allAvailableCoupons: [],
    isLoadingB: false,
  });

  const vendorInfo = route?.params?.data;
  console.log(vendorInfo);
  console.log("THIS IS MY VENDORINFO");
  const {isTaxi} = vendorInfo;
  const {appData, appStyle, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  useEffect(() => {
    if (vendorInfo?.cabOrder) {
      _getAllPromoCodesForCabs();
    } else {
      _getAllPromoCodes();
    }
  }, []);

  //Get all promo codes for cab booking
  const _getAllPromoCodesForCabs = () => {
    let data = {};
    data['vendor_id'] = vendorInfo?.vendor?.vendor_id;
    data['product_id'] = vendorInfo?.vendor?.id;
    data['amount'] = vendorInfo?.vendor?.tags_price;

    actions
      .getAllPromoCodesForCaB(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({isLoading: false});

        if (res && res.data) {
          updateState({allAvailableCoupons: res.data});
        }
      })
      .catch(errorMethod);
  };
  //Get all promo codes
  const _getAllPromoCodes = () => {
    let data = {};
    data['vendor_id'] = vendorInfo.vendor.id;
    data['cart_id'] = vendorInfo.cartId;
    actions
      .getAllPromoCodes(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({isLoading: false});

        if (res && res.data) {
          updateState({allAvailableCoupons: res.data});
        }
      })
      .catch(errorMethod);
  };

  //Verify your promo code
  const _verifyPromoCode = (item) => {
    let data = {};
    data['vendor_id'] = vendorInfo.vendor.id;
    data['cart_id'] = vendorInfo.cartId;
    data['coupon_id'] = item.id;
    updateState({isLoadingB: true});
    actions
      .verifyPromocode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({isLoadingB: false});
        if (res) {
          showSuccess(res?.message || res?.error);
          navigation.navigate(navigationStrings.CART, {
            promocodeDetail: {
              couponInfo: item,
              vendorInfo: vendorInfo,
            },
          });
        }
      })
      .catch(errorMethod);
  };

  // {
  //   "amount": 100.00,
  //   "wallet": false,
  //   "coupon_id": 6
  // }
  //Verify your promo code
  const _verifyPromoCodeForCab = (item) => {
    console.log(vendorInfo.pickUp,'PICKUPPICKUP');
    let data = {};
    data['coupon_id'] = item.id;
    data['cart_id']=vendorInfo.delivery_cart_id
    updateState({isLoadingB: true});
    console.log(data,'Appy coupon');
    actions
      .verifyPromocodeForCabOrders(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res,'Applied RESULT');
        updateState({isLoadingB: false});
        if (res) {
          showSuccess(res?.message || res?.error);
          if (vendorInfo?.pickUp) {
            navigation.navigate(navigationStrings.SHIPPING_DETAILS, {
              promocodeDetail: {
                couponInfo: res?.data,
                vendorInfo: vendorInfo,
              },
            });
          } else {
            navigation.navigate(
              !!isTaxi
                ? navigationStrings.CHOOSECARTYPEANDTIMETAXI
                : navigationStrings.CHOOSECARTYPEANDTIME,
              {
                promocodeDetail: {
                  couponInfo: res?.data,
                  vendorInfo: vendorInfo,
                },
              },
            );
          }
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const rightHeader = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <Image source={imagePath.search} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={{marginLeft: 10}} source={imagePath.cartShop} />
        </TouchableOpacity>
      </View>
    );
  };

  const _renderItem = ({item, index}) => {
    {
      return (
          <OffersCard2
            data={item}
            onPress={() =>
              vendorInfo?.cabOrder
                ? _verifyPromoCodeForCab(item)
                : _verifyPromoCode(item)
            }
          />
        ) 
      // return appStyle?.homePageLayout === 3 ? (
      //   <OffersCard2
      //     data={item}
      //     onPress={() =>
      //       vendorInfo?.cabOrder
      //         ? _verifyPromoCodeForCab(item)
      //         : _verifyPromoCode(item)
      //     }
      //   />
      // ) : (
      //   <OffersCard
      //     data={item}
      //     onPress={() =>
      //       vendorInfo?.cabOrder
      //         ? _verifyPromoCodeForCab(item)
      //         : _verifyPromoCode(item)
      //     }
      //   />
      // );
    }
  };
  const _headerComponent = () => {
    {
      return(
          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginVertical: moderateScaleVertical(16),
            }}>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.AVAILABLE_PROMO_CODE}
            </Text>
          </View>
        )
      // return appStyle?.homePageLayout === 3 ? (
      //   <View
      //     style={{
      //       marginHorizontal: moderateScale(16),
      //       marginVertical: moderateScaleVertical(16),
      //     }}>
      //     <Text
      //       style={{
      //         fontSize: textScale(14),
      //         fontFamily: fontFamily.medium,
      //         color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      //       }}>
      //       {strings.AVAILABLE_PROMO_CODE}
      //     </Text>
      //   </View>
      // ) : (
      //   <View style={{height: 20}} />
      // );
    }
  };
  const {isLoading, allAvailableCoupons, isLoadingB} = state;
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      <Header
        centerTitle={strings.OFFERS}
        leftIcon={
           imagePath.icBackb
        }
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <View style={{flex: 1}}>
        <FlatList
          data={isLoading ? [] : allAvailableCoupons}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={_headerComponent}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={<ListEmptyOffers isLoading={isLoading} />}
          ListFooterComponent={() => <View style={{height: 20}} />}
          renderItem={_renderItem}
        />
      </View>
    </WrapperContainer>
  );
}
