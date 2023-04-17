import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import HTMLView from 'react-native-htmlview';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Pagination } from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import Banner from '../../Components/Banner';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard from '../../Components/ProductCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import AddonModal from './AddonModal';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../styles/theme';
import HorizontalLine from '../../Components/HorizontalLine';
//import StarRating from 'react-native-star-rating';
import Banner2 from '../../Components/Banner2';
import MarketCard3 from '../../Components/MarketCard3';
import ProductsComp from '../../Components/ProductsComp';
import { AirbnbRating } from 'react-native-ratings';

export default function ProductDetail({ route, navigation }) {
  console.log("ProductDetail - ProductDetail.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  const { productListData } = useSelector((state) => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const { data } = route.params;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    isLoadingC: false,
    productId: data.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    showErrorMessageTitle: false,
    typeId: null,
  });
  //Saving the initial state
  const initialState = cloneDeep(state);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { bannerRef } = useRef();
  const {
    productDetailData,
    productPriceData,
    isLoadingC,
    addonSet,
    variantSet,
    showListOfAddons,
    venderDetail,
    productTotalQuantity,
    productSku,
    productVariantId,
    relatedProducts,
    isVisibleAddonModal,
    lightBox,
    productQuantityForCart,
    showErrorMessageTitle,
    typeId,
  } = state;

  const customRight = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={imagePath.search} />
      </View>
    );
  };

  let plainHtml = productDetailData?.translation[0]?.body_html || null;
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0].variant_id,
                optionId: find[0].id,
              };
            }
          })
          .filter((x) => x != undefined);
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  useEffect(() => {
    getProductDetail();
  }, [state.productId, state.isLoadingB]);

  // useEffect(() => {
  //   if (variantSet.length) {
  //     let variantSetData = variantSet
  //       .map((i, inx) => {
  //         let find = i.options.filter((x) => x.value);
  //         if (find.length) {
  //           return {
  //             variant_id: find[0].variant_id,
  //             optionId: find[0].id,
  //           };
  //         }
  //       })
  //       .filter((x) => x != undefined);
  //     console.log(variantSetData, 'variantSetData');
  //     if (variantSetData.length) {
  //       getProductDetailBasedOnFilter(variantSetData);
  //     } else {
  //       getProductDetail();
  //     }
  //   }
  // }, [variantSet]);

  //Get Product detail

  const getProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${state.productId}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          productDetailData: res.data.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,
          typeId: res.data.products.category.category_detail.type_id,
          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
        });
        if (
          res.data.products.variant_set.length &&
          variantSet &&
          !variantSet.length
        ) {
          updateState({ variantSet: res.data.products.variant_set });
        }
      })
      .catch(errorMethod);
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = (variantSetData) => {
    updateState({ isLoadingC: true });
    let data = {};
    data['variants'] = variantSetData.map((i) => i.variant_id);
    data['options'] = variantSetData.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          productDetailData: res.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
          showErrorMessageTitle: false,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    if (error?.message?.alert == 1) {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart() },
      ]);
    } else {
      if (error?.data?.variant_empty) {
        updateState({
          isLoading: false,
          showErrorMessageTitle: true,
          isLoadingB: false,
          isLoadingC: false,
        });
      } else {
        updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
        showError(error?.message || error?.error);
      }
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    console.log(error.message.alert, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart(addonSet) },
      ]);
    } else {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      showError(error?.message || error?.error);
    }
  };

  const clearCart = (addonSet) => {
    actions
      .clearCart(
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
        // updateState({
        //   cartItems: [],
        //   cartData: {},
        //   isLoadingB: false,
        // });
        // addToCart();
        if (addonSet) {
          _finalAddToCart(addonSet);
        } else {
          addToCart();
        }
        // _finalAddToCart(addonSet);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //add Product to wishlist
  const _onAddtoWishlist = (item) => {

    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.product_id || item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          showSuccess(res.message);

          if (item.inwishlist) {
            item.inwishlist = null;
            updateState({ productDetailData: item });
          } else {
            item.inwishlist = { product_id: item.id };
            updateState({ productDetailData: item });
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  useEffect(() => {
    myRef.current.scrollToPosition(1, 0, true);
  }, [state.productId]);

  const selectSpecificOptions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    updateState({
      variantSet: variantSet.map((vi, vnx) => {
        if (vi.variant_type_id == i.variant_id) {
          return {
            ...vi,
            options: newArray.map((j, jnx) => {
              if (j.id == i.id) {
                return {
                  ...j,
                  value: i?.value ? false : true,
                };
              }
              return {
                ...j,
                value: false,
              };
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };

  const radioButtonView = (options) => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((i, inx) => {
          return (
            <View>
              <TouchableOpacity
                disabled={options && options.length == 1 ? true : false}
                onPress={() => selectSpecificOptions(options, i, inx)}
                style={{
                  ...styles.boxView,
                  backgroundColor: i?.value
                    ? themeColors?.primary_color
                    : isDarkMode
                      ? colors.whiteOpacity15
                      : '#D8D8D8',
                }}>
                {/* <Image source={i?.value ? imagePath.check : imagePath.unCheck} /> */}
                <Text
                  style={{
                    ...styles.variantValue,
                    color: i?.value
                      ? colors.white
                      : isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                  }}>
                  {i.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  const circularView = (options) => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {options.map((i, inx) => {
          return (
            <TouchableOpacity
              disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(5),
                marginBottom: moderateScaleVertical(10),
              }}>
              <View
                style={[
                  styles.variantSizeViewTwo,
                  {
                    backgroundColor: colors.white,
                    borderWidth: i?.value ? 1 : 0,

                    borderColor:
                      i?.value &&
                        (i.hexacode == '#FFFFFF' || i.hexacode == '#FFF')
                        ? colors.textGrey
                        : i.hexacode,
                  },
                ]}>
                <View
                  style={[
                    styles.variantSizeViewOne,
                    {
                      backgroundColor: i.hexacode,
                      borderWidth:
                        i.hexacode == '#FFFFFF' || i.hexacode == '#FFF'
                          ? StyleSheet.hairlineWidth
                          : 0,
                    },
                  ]}></View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const variantSetValue = ({ options, type }) => {
    if (type == 1) {
      return <>{radioButtonView(options)}</>;
    }
    return <>{circularView(options)}</>;
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <View style={{}}>
        {variantSetData.map((i, inx) => {
          return (
            <View
              key={inx}
              style={{
                vertical: moderateScaleVertical(5),
              }}>
              <Text
                style={{
                  ...styles.descriptiontitle,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  marginBottom: moderateScaleVertical(8),
                }}>{`${i?.title}`}</Text>
              {i?.options ? variantSetValue(i) : null}
              <HorizontalLine
                lineStyle={{ marginVertical: moderateScaleVertical(8) }}
              />
            </View>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({ addonSet: data?.addonSetData });
      setTimeout(() => {
        _finalAddToCart(data?.addonSetData);
      }, 1000);
    }
  }, [data?.addonSetData, data?.randomValue]);

  const checkSingleVendor = async (id, vendorId) => {
    //  let vendorData = { vendor_id: categoryInfo?.id };
    let vendorData = { vendor_id: vendorId };
   // updateState({ selectedItemID: id });
    return new Promise((resolve, reject) => {
      actions
        .checkSingleVendor(vendorData, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          errorMethod(error)
       //  reject(error);
       //   updateState({ selectedItemID: -1 });
        });
    });
  };

  const clearCartAndAddProduct = async (addonSet) => {
    actions
      .clearCart(
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
       // addSingleItem(item, section);
        // showSuccess(res?.message); 
        const addon_ids = [];
        const addon_options = [];
        addonSet.map((i, inx) => {
          i.setoptions.map((j, jnx) => {
            if (j?.value == true) {
              addon_ids.push(j?.addon_id);
              addon_options.push(j?.id);
            }
          });
        });
    
        let data = {};
        data['sku'] = productSku;
        data['quantity'] = productQuantityForCart;
        data['product_variant_id'] = productVariantId;
        data['type'] = dine_In_Type;
    
        if (addonSet && addonSet.length) {
          // console.log(addonSetData, 'addonSetData');
          data['addon_ids'] = addon_ids;
          data['addon_options'] = addon_options;
        }
       // console.log(data, productDetailData, 'THIS IS MY PRODUCT');
       // updateState({ isLoadingC: true, isVisibleAddonModal: false });
        actions
          .addProductsToCart(data, {
            code: appData.profile.code,
            currency: currencies.primary_currency.id,
            language: languages.primary_language.id,
            systemuser: DeviceInfo.getUniqueId(),
          })
          .then((res) => {
            actions.cartItemQty(res);
    
            showSuccess(strings.PRODUCT_ADDED_SUCCESS);
    
            updateState({ isLoadingC: false });
            navigation.goBack();
          })
          .catch((error) => errorMethodSecond(error, addonSet));
      })
      .catch(errorMethod);
   
   // updateState({ updateQtyLoader: true });
  };
  const _finalAddToCart = async (addonSet = addonSet) => {
    let vendorId = productDetailData?.vendor_id;
    let productId = productDetailData?.id;
    updateState({ isLoadingC: true, isVisibleAddonModal: false });
    let isSingleVendor = await checkSingleVendor(productId, vendorId);
    //console.log(isSingleVendor,'Message');
    if (
      isSingleVendor.isSingleVendorEnabled !== 0 &&
      isSingleVendor.otherVendorExists !== 0
    ) {
      // updateState({
      //   updateQtyLoader: false,
      //   selectedItemID: -1,
      //   btnLoader: false,
      // });
      updateState({ isLoadingC: false})
      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => { },
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
         // onPress: () => clearCartAndAddProduct(item, section),
         onPress: () => clearCartAndAddProduct(addonSet),
        },
      ]);
      return;
    }

    const addon_ids = [];
    const addon_options = [];
    addonSet.map((i, inx) => {
      i.setoptions.map((j, jnx) => {
        if (j?.value == true) {
          addon_ids.push(j?.addon_id);
          addon_options.push(j?.id);
        }
      });
    });

    let data = {};
    data['sku'] = productSku;
    data['quantity'] = productQuantityForCart;
    data['product_variant_id'] = productVariantId;
    data['type'] = dine_In_Type;

    if (addonSet && addonSet.length) {
      // console.log(addonSetData, 'addonSetData');
      data['addon_ids'] = addon_ids;
      data['addon_options'] = addon_options;
    }
   // console.log(data, productDetailData, 'THIS IS MY PRODUCT');
    //updateState({ isLoadingC: true, isVisibleAddonModal: false });
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);

        showSuccess(strings.PRODUCT_ADDED_SUCCESS);

        updateState({ isLoadingC: false });
        navigation.goBack();
      })
      .catch((error) => errorMethodSecond(error, addonSet));
  };

  const addToCart = () => {
    {
      addonSet && addonSet.length
        ? updateState({ isVisibleAddonModal: true })
        : _finalAddToCart(addonSet);
    }
    // _finalAddToCart()
  };

  const myRef = useRef(null);

  const productIncrDecreamentForCart = (type) => {
    if (type == 2) {
      if (productQuantityForCart <= 1) {
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart - 1,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart + 1,
        });
      }
    }
  };

  const renderProduct = ({ item, index }) => {
    item.showAddToCart = true;
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
      // <ProductCard
      // onPress={() =>
      //   navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
      // }
      //   onAddtoWishlist={() => _onAddtoWishlist(item)}
      //   data={item}
      //   cardStyle={{
      //     backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      //     marginHorizontal: moderateScale(10),
      //   }}
      //   addToCart={() =>
      //     navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
      //   }
      //   bottomText={strings.VIEW_DETAIL}
      //   nameTextStyle={{
      //     ...styles.productName,
      //     color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      //   }}
      // />
    );
  };

  const setModalVisibleForAddonModal = (visible) => {
    updateState({ isVisibleAddonModal: false });
  };

  const onclickBanner = () => {
    updateState({ lightBox: true });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoadingC}>
      <Header
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={productDetailData?.translation[0]?.title}
        textStyle={{ fontSize: textScale(14) }}
        rightIcon={
          !!data?.showAddToCart
            ? false
            : imagePath.icSearchb
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      />

      <KeyboardAwareScrollView ref={myRef} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: moderateScale(16) }}>
          {state.isLoading && <ListEmptyProduct isLoading={state.isLoading} />}

          {!state.isLoading && (
            <>
              {/* //Top section slider */}

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: moderateScaleVertical(20),
                  justifyContent: 'space-between',
                }}>
                {/* <View style={{ flex: 0.2 }}><Image source={imagePath.fav} /></View> */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Banner2
                    resizeMode="contain"
                    bannerRef={bannerRef}
                    bannerData={productDetailData?.product_media}
                    sliderWidth={width}
                    itemWidth={width / 1.1}
                    pagination={false}
                    setActiveState={(index) =>
                      updateState({ slider1ActiveSlide: index })
                    }
                    imagestyle={{
                      borderRadius: 8,
                    }}
                    showLightbox={true}
                    cardViewStyle={styles.cardViewStyle}
                  // childView={
                  //   <TouchableOpacity
                  //     onPress={() => _onAddtoWishlist(productDetailData)}>
                  //     {productDetailData?.is_wishlist ? (
                  //       <View style={{ alignSelf: 'flex-end', padding: 8 }}>
                  //         {!!productDetailData?.inwishlist ? (
                  //           <Image
                  //             style={
                  //               isDarkMode
                  //                 ? { tintColor: MyDarkTheme.colors.text }
                  //                 : { tintColor: colors.white }
                  //             }
                  //             source={imagePath.whiteFilledHeart}
                  //           />
                  //         ) : (
                  //           <Image
                  //             style={
                  //               isDarkMode
                  //                 ? { tintColor: MyDarkTheme.colors.text }
                  //                 : { tintColor: colors.white }
                  //             }
                  //             source={imagePath.heart2}
                  //           />
                  //         )}
                  //       </View>
                  //     ) : null}
                  //   </TouchableOpacity>
                  // }
                  />

                  <View style={{ paddingTop: 5 }}>
                    <Pagination
                      dotsLength={productDetailData?.product_media?.length}
                      activeDotIndex={state.slider1ActiveSlide}
                      dotColor={'grey'}
                      dotStyle={[styles.dotStyle]}
                      inactiveDotColor={colors.black}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.8}
                    />
                  </View>
                </View>
              </View>

              {/* Product Name and Branc detail */}

              <View style={{ marginTop: moderateScaleVertical(10) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                            styles.productName,
                            { color: MyDarkTheme.colors.text },
                          ]
                          : styles.productName
                      }>
                      {productDetailData?.translation[0]?.title}
                    </Text>
                    <Text
                      style={{
                        ...styles.productPrice,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}>{`${currencies?.primary_currency.symbol}${(
                        Number(productPriceData?.multiplier) *
                        Number(productPriceData?.price)
                      ).toFixed(2)}`}</Text>
                  </View>
                </View>

                <View style={styles.flexView}>
                  <Text
                    style={{
                      ...commonStyles.mediumFont12,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                    }}>
                    {strings.IN}{' '}
                    {
                      productDetailData?.category?.category_detail
                        ?.translation[0]?.name
                    }
                  </Text>

                  {productDetailData?.averageRating !== null && (
                    <View
                    // style={{
                    //   borderWidth: 0.5,
                    //   alignSelf: 'flex-start',
                    //   padding: 2,
                    //   borderRadius: 2,
                    //   marginVertical: moderateScaleVertical(4),
                    //   borderColor: colors.yellowB,
                    //   backgroundColor: colors.yellowOpacity10,
                    // }}
                    >
                      {/* <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={Number(
                          productDetailData?.averageRating,
                        ).toFixed(1)}
                        fullStarColor={colors.yellowB}
                        starSize={8}
                        containerStyle={{ width: width / 9 }}
                      /> */}
                      <AirbnbRating
                        isDisabled={true}
                        defaultRating={Number(
                          productDetailData?.averageRating,
                        ).toFixed(1)}
                        showRating={false}
                        size={15} />
                    </View>
                  )}
                </View>
                {productDetailData?.vendor?.name && (<View style={styles.flexView}>
                  <Text
                    style={{
                      ...commonStyles.mediumFont12,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                    }}>
                    {strings.FROM}{' '}
                    {
                      productDetailData?.vendor?.name
                    }
                  </Text>
                </View>)
                }

                {productTotalQuantity == 0 && !!typeId && typeId !== 8 && (
                  <View style={{ justifyContent: 'center' }}>
                    <Text
                      style={
                        stylesFunc({
                          themeColors,
                          fontFamily,
                          productTotalQuantity,
                        }).productTypeAndBrandValue
                      }>
                      {productTotalQuantity && productTotalQuantity != 0
                        ? ''
                        : strings.OUT_OF_STOCK}
                    </Text>
                  </View>
                )}
              </View>

              <HorizontalLine
                lineStyle={{ marginVertical: moderateScaleVertical(16) }}
              />

              {/* Product description */}

              {plainHtml != null ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.descriptiontitle,
                              { color: MyDarkTheme.colors.text },
                            ]
                            : styles.descriptiontitle
                        }>
                        {strings.DESCRIPTION}
                      </Text>

                      <HTMLView
                        value={'<div>' + plainHtml + '</div>'}
                        stylesheet={{ div: styles.descriptionStyle }}
                      />
                    </View>
                  </View>
                  <HorizontalLine
                    lineStyle={{ marginVertical: moderateScaleVertical(14) }}
                  />
                </>
              ) : null}

              {/* // Product variants */}
              {variantSet && variantSet.length ? showAllVariants() : null}
              {/* {addonSet && addonSet.length ? showAllAddons() : null} */}

              {showErrorMessageTitle ? (
                <Text
                  style={{
                    fontSize: textScale(14),
                    color: colors.redB,
                    fontFamily: fontFamily.medium,
                    marginBottom: moderateScaleVertical(16),
                  }}>
                  {strings.NOVARIANTPRODUCTAVAILABLE}
                </Text>
              ) : null}
              {/* Add to Cart button */}
              {((!!productTotalQuantity && !!productTotalQuantity != 0) ||
                (!!typeId && typeId == 8)) &&
                (!!data?.showAddToCart ? null : showErrorMessageTitle ? null : (
                  <View
                    style={{
                      marginBottom: moderateScaleVertical(25),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.background
                          : colors.white,
                      }}>
                      <View style={{ flex: 0.25 }}>
                        <View
                          style={{
                            ...commonStyles.buttonRect,
                            ...styles.incDecBtnStyle,
                            backgroundColor: getColorCodeWithOpactiyNumber(
                              themeColors.primary_color.substr(1),
                              15,
                            ),
                            borderColor: themeColors?.primary_color,
                            height: moderateScale(38),
                          }}
                        // onPress={onPress}
                        >
                          <TouchableOpacity
                            disabled={
                              !productDetailData?.vendor?.show_slot &&
                              !!productDetailData?.vendor?.is_vendor_closed
                            }
                            onPress={() => productIncrDecreamentForCart(2)}
                            hitSlop={hitSlopProp}>
                            <Text
                              style={{
                                ...commonStyles.mediumFont14,
                                color: themeColors?.primary_color,
                                fontFamily: fontFamily.bold,
                              }}>
                              -
                            </Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              ...commonStyles.mediumFont14,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            }}>
                            {productQuantityForCart}
                          </Text>
                          <TouchableOpacity
                            disabled={
                              !productDetailData?.vendor?.show_slot &&
                              !!productDetailData?.vendor?.is_vendor_closed
                            }
                            onPress={() => productIncrDecreamentForCart(1)}
                            hitSlop={hitSlopProp}>
                            <Text
                              style={{
                                ...commonStyles.mediumFont14,
                                color: themeColors?.primary_color,
                                fontFamily: fontFamily.bold,
                              }}>
                              +
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => _onAddtoWishlist(productDetailData)}>
                          {productDetailData?.is_wishlist ? (
                            <View style={{
                              flex: 0.15,
                              alignItems: 'center',
                              flexDirection: 'row',
                              height: moderateScale(38),
                              paddingHorizontal: moderateScale(12),
                              borderColor: themeColors?.primary_color,
                              borderWidth: 1,
                              borderRadius: moderateScale(4),
                            }}>
                              {!!productDetailData?.inwishlist ? (
                                <Image
                                  style={
                                    isDarkMode
                                      ? { tintColor: themeColors?.primary_color }
                                      : { tintColor: themeColors?.primary_color }
                                  }
                                  source={imagePath.whiteFilledHeart}
                                />
                              ) : (
                                <Image
                                  style={
                                    isDarkMode
                                      ? { tintColor: MyDarkTheme.colors.text }
                                      : { tintColor: themeColors?.primary_color }
                                  }
                                  source={imagePath.heart2}
                                />
                              )}
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      {/* <View style={{ marginHorizontal: 8 }} /> */}
                      <View style={{ flex: 0.60 }}>
                        <GradientButton
                          // indicator={btnLoader}
                          disabled={
                            !productDetailData?.vendor?.show_slot &&
                            !!productDetailData?.vendor?.is_vendor_closed
                          }
                          indicatorColor={colors.white}
                          colorsArray={[
                            themeColors.primary_color,
                            themeColors.primary_color,
                          ]}
                          textStyle={{
                            fontFamily: fontFamily.medium,
                            textTransform: 'uppercase',
                          }}
                          onPress={addToCart}
                          // btnText={`${strings.ADD}  ${currencies?.primary_currency?.symbol
                          //   } ${(
                          //     Number(productPriceData?.multiplier) *
                          //     Number(productPriceData?.price)
                          //   ).toFixed(2)}`}
                          btnText={`${strings.ADD}`}
                          btnStyle={{
                            borderRadius: moderateScale(4),
                            height: moderateScale(38),
                            opacity: productDetailData?.vendor?.show_slot
                              ? 1
                              : productDetailData?.vendor?.is_vendor_closed
                                ? 0.3
                                : 1,
                          }}
                        />
                      </View>
                    </View>
                    {!productDetailData?.vendor?.show_slot &&
                      !!productDetailData?.vendor?.is_vendor_closed ? (
                      <Text
                        style={{
                          ...commonStyles.regularFont11,
                          color: colors.redB,
                        }}>
                        {strings.VENDOR_NOT_ACCEPTING_ORDERS}
                      </Text>
                    ) : null}
                  </View>
                ))}

              <AddonModal
                productdetail={productDetailData}
                isVisible={isVisibleAddonModal}
                onClose={() => setModalVisibleForAddonModal(false)}
                // onPress={(data) => alert('123')}
                addonSet={addonSet}
              // onPress={currentLocation}
              />
            </>
          )}
        </View>
        {/* related product */}

        <View style={{}}>
          {!!relatedProducts && !!relatedProducts.length && (
            <Text
              style={{
                ...styles.descriptiontitle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                marginLeft: moderateScale(16),
              }}>
              {strings.YOUMAYALSO}
            </Text>
          )}
          <FlatList
            data={(!state.isLoading && relatedProducts) || []}
            renderItem={renderProduct}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, marginVertical: moderateScaleVertical(10) }}
            contentContainerStyle={{ flexGrow: 1 }}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(8) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginLeft: moderateScale(8) }} />
            )}
          // ListEmptyComponent={<ListEmptyProduct isLoading={state.isLoading}/>}
          />
        </View>
        <View style={{ marginBottom: moderateScale(40) }} />
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
const htmlStyle = StyleSheet.create({
  h2: {
    color: '#e5e5e7', // make links coloured pink
  },
});
