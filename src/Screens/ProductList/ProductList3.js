import { cloneDeep, debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  //Vibration,
  View,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import SectionList from 'react-native-tabs-section-list';
import { useSelector } from 'react-redux';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import NoDataFound from '../../Components/NoDataFound';
import ProductCard3 from '../../Components/ProductCard3';
import RoundImg from '../../Components/RoundImg';
import SearchBar from '../../Components/SearchBar';
import VariantAddons from '../../Components/VariantAddons';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { checkEvenOdd, getImageUrl, showError, showSuccess } from '../../utils/helperFunctions';
import { removeItem } from '../../utils/utils';
import stylesFunc from './styles';

// const ONE_SECOND_IN_MS = 50;
// const PATTERN = [
//   1 * ONE_SECOND_IN_MS,
//   2 * ONE_SECOND_IN_MS,
//   3 * ONE_SECOND_IN_MS,
// ];

export default function Products({ route, navigation }) {
  console.log("ProductList - ProductList3.js")
  const { data } = route.params;
 // console.log("ProductList - ProductList3.js",data)
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const isDarkMode = theme;
  const [state, setState] = useState({
    isVisibleModal: false,
    isOffline: false,
    isLoading: true,
    isLoadingB: false,
    pageNo: 1,
    limit: 12,
    isRefreshing: false,
    selectedSbCategoryID: -1,
    productListId: data,
    productListData: [],
    categoryInfo: null,
    click: false,
    filterData: [],
    brandData: [],
    allFilters: [],
    isVisibleModal: false,
    updateQtyLoader: false,
    showShimmer: true,
    typeId: null,
    selectedSection: null,
    sortFilters: [
      {
        id: -2,
        label: strings.SORT_BY,
        value: [
          {
            id: 1,
            label: strings.LOW_TO_HIGH,
            labelValue: 'low_to_high',
            parent: strings.SORT_BY,
          },
          {
            id: 2,
            label: strings.HIGH_TO_LOW,
            labelValue: 'high_to_low',
            parent: strings.SORT_BY,
          },
          {
            id: 3,
            label: strings.POPULARITY,
            labelValue: 'popularity',
            parent: strings.SORT_BY,
          },
          {
            id: 4,
            label: strings.MOST_PURCHASED,
            labelValue: 'most_purcahsed',
            parent: strings.SORT_BY,
          },
        ],
      },
    ],
    sleectdBrands: [],
    selectedVariants: [],
    selectedOptions: [],
    slectedSortBy: [],
    minimumPrice: 0,
    maximumPrice: 50000,
    checkForMinimumPriceChange: false,
    checkForMaximumPriceChange: false,
    showFilterSlectedIcon: false,
    isLoadingC: false,
    selectedCategory: null,
    AnimatedHeaderValue: false,
    selectedCartItem: null,
    cartId: null,
    isSearch: false,
    searchInput: '',
    btnLoader: false,
    selectedItemID: -1,
    selectedItemIndx: null,
    vendorCategories: null,
    vendorCategorySelectedIndx: 0,
    vendorCategoryItms: null,
    sectionListData: [],
  });

  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector((state) => state?.initBoot);
  const {
    selectedCategory,
    isLoadingC,
    isLoading,
    isOffline,
    pageNo,
    limit,
    isRefreshing,
    selectedSbCategoryID,
    productListId,
    categoryInfo,
    productListData,
    isLoadingB,
    filterData,
    brandData,
    allFilters,
    sortFilters,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    slectedSortBy,
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    showFilterSlectedIcon,
    AnimatedHeaderValue,
    selectedCartItem,
    isVisibleModal,
    updateQtyLoader,
    cartId,
    showShimmer,
    isSearch,
    searchInput,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    vendorCategories,
    vendorCategorySelectedIndx,
    vendorCategoryItms,
    typeId,
    sectionListData,
    selectedSection,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  const styles = stylesFunc({ themeColors, fontFamily, isDarkMode, MyDarkTheme });

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector((state) => state?.auth?.userData);
  //app Main Data
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateState({ pageNo: 1 });
      getAllListItems();
      if (isLoadingC) {
        getAllProducts(true);
      }
    });
    return unsubscribe;
  }, [navigation, languages, currencies]);

  // useEffect(() => {
  //   updateState({ pageNo: 1 });
  //   getAllListItems();
  // }, [languages, currencies]);

  // useEffect(() => {
  //   getAllListItems();
  // }, [pageNo, isRefreshing]);

  const getAllListItems = () => {
    let filterExist =
      sleectdBrands.length ||
      selectedVariants.length ||
      selectedOptions.length ||
      slectedSortBy.length ||
      minimumPrice != 0 ||
      maximumPrice != 50000 ||
      checkForMaximumPriceChange ||
      checkForMinimumPriceChange;
    {
      filterExist
        ? updateState({ showFilterSlectedIcon: true })
        : updateState({ showFilterSlectedIcon: false });
    }

    if (data?.vendor) {
      {
        filterExist
          ? getAllProductsVendorFilter()
          : data?.vendorData
            ? getAllProductsByVendorCategory()
            : getAllProductsByVendor();
      }
    } else {
      {
        filterExist ? getAllProductsCategoryFilter() : getAllProducts();
      }
    }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    console.log("data?.categoryInfo?.slug", data?.categoryInfo?.slug);
    // alert("21312")
    actions
      .getProductByVendorCategoryId(
        `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?limit=${limit}&page=${pageNo}&categoryId=${data?.categoryInfo?.slug}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {

        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res?.data?.vendor,
          filterData: res?.data?.filterData,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res?.data?.products?.data],
        });
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];

    if (allBrands.length) {
      brandDatas = [
        {
          id: -1,
          label: strings.BRANDS,
          value: allBrands.map((i, inx) => {
            return {
              id: i?.translation[0]?.brand_id,
              label: i?.translation[0]?.title,
              parent: strings.BRANDS,
            };
          }),
        },
      ];

      // updateState({allFilters: [...allFilters,...brandDatas]});
    }

    // Price filter
    if (filterData.length) {
      filterDataNew = filterData.map((i, inx) => {
        return {
          id: i.variant_type_id,
          label: i.title,
          value: i.options.map((j, jnx) => {
            return {
              id: j.id,
              parent: i.title,
              label: j.title,
              variant_type_id: i.variant_type_id,
            };
          }),
        };
      });
      // updateState({allFilters: [...allFilters,...filterDataNew]});
    }

    updateState({
      allFilters: [...brandDatas, ...sortFilters, ...filterDataNew],
    });
  };

  const getProductBasedOnFilter = (
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    slectedSortBy,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    allSelectdFilters,
  ) => {
    updateState({
      minimumPrice: minimumPrice,
      maximumPrice: maximumPrice,
      checkForMinimumPriceChange: checkForMinimumPriceChange,
      checkForMaximumPriceChange: checkForMaximumPriceChange,
      allFilters: allSelectdFilters,
      sleectdBrands: sleectdBrands,
      selectedVariants: selectedVariants,
      selectedOptions: selectedOptions,
      slectedSortBy: slectedSortBy,
    });
  };

  /**********Get all list items by category filters */
  const getAllProductsVendorFilter = () => {
    console.log("data?.categoryInfo?.slug 6", data?.categoryInfo?.slug);
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getProductByVendorFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}&categoryId=${data?.categoryInfo?.slug}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isRefreshing: false,
          productListData:
            pageNo == 1
              ? res.data.data
              : [...productListData, ...res.data.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  /**********Get all list items category filters */
  const getAllProductsCategoryFilter = () => {
    console.log("data?.categoryInfo?.slug 1", data?.categoryInfo?.slug);
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getProductByCategoryFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isRefreshing: false,
          productListData:
            pageNo == 1
              ? res.data.data
              : [...productListData, ...res.data.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = () => {
    console.log("data?.categoryInfo?.slug 2", data?.categoryInfo?.slug);
    actions
      .getProductByVendorId(
        `/${productListId?.id}?limit=${limit}&page=${pageNo}&categoryId=${data?.categoryInfo?.slug}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          latitude: appMainData?.reqData?.latitude,
          longitude: appMainData?.reqData?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
          updateState({
            isLoading: false,
            isRefreshing: false,
            categoryInfo: res.data.vendor,
            filterData: res.data.filterData,
            productListData: res?.data?.vendor?.is_show_products_with_category
              ? res?.data?.categories[0]?.products
              : pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
            vendorCategories: res?.data?.categories,
            // vendorCategoryItms: res?.data?.categories[0]?.products,
          });
        
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
  };

  /**********Get all list items by category id */
  const getAllProducts = () => {
    console.log("data?.categoryInfo?.slug 3", data?.categoryInfo?.slug);
    actions
      .getProductByCategoryId(
        `/${productListId?.id}?categoryId=${data?.categoryInfo?.slug}&limit=${limit}&page=${pageNo}&product_list=${data?.rootProducts ? true : false
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        updateState({
          categoryInfo: categoryInfo ? categoryInfo : res.data.category,
          filterData: res?.data?.filterData,
          productListData:
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
          isLoadingC: false,
          isRefreshing: false,
        });
        {
          pageNo == 1 &&
            res?.data?.listData?.data.length == 0 &&
            res?.data?.category &&
            res?.data?.category?.childs.length
            ? updateState({
              selectedCategory: res.data.category.childs[0],
              productListId: res.data.category.childs[0],
              pageNo: 1,
              limit: 12,
              isLoadingC: true,
            })
            : null;
        }
        setTimeout(() => {
          updateState({ isLoading: false });
        }, 1500);
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
    // }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item) => {
   // Vibration.vibrate(PATTERN);
    if (!!userData?.auth_token) {
      updateState({ isLoadingB: true });
      actions
        .updateProductWishListData(
          `/${item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          showSuccess(res.message);
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
      updateState({ isLoadingB: false });
    }
  };

  /*******Upadte products in wishlist>*********/
  const updateProductList = (item) => {
    let newArray = cloneDeep(productListData);
    newArray = newArray.map((i, inx) => {
      if (i.id == item.id) {
        if (item.inwishlist) {
          i.inwishlist = null;
          return { ...i, inwishlist: null };
        } else {
          return { ...i, inwishlist: { product_id: i.id } };
        }
      } else {
        return i;
      }
    });
    updateState({
      productListData: newArray,
      isLoadingB: false,
      updateQtyLoader: false,
      selectedItemID: -1,
    });
  };

  const errorMethod = (error) => {
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
      isLoading: false,
    });
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    updateState({ pageNo: pageNo + 1 });
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const checkSingleVendor = async (id,vendorId) => {
  //  let vendorData = { vendor_id: categoryInfo?.id };
  let vendorData = { vendor_id: vendorId };
    updateState({ selectedItemID: id });
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
         // reject(error);
          updateState({ selectedItemID: -1 });
          errorMethod(error)
        });
    });
  };

  const clearCartAndAddProduct = async (item, section = null) => {
    updateState({ updateQtyLoader: true });
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
        addSingleItem(item, section);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const addSingleItem = async (item, section = null) => {
   // console.log('addSingleItem called');
    if (categoryInfo?.is_vendor_closed && !categoryInfo?.show_slot) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS)
      return;
    }
   // Vibration.vibrate(PATTERN)
    let getTypeId = !!item?.category && item?.category.category_detail?.type_id;
    updateState({ selectedItemID: item?.id, btnLoader: true });
    let isSingleVendor = await checkSingleVendor(item.id,item.vendor_id);
    if (
      isSingleVendor.isSingleVendorEnabled !== 0 &&
      isSingleVendor.otherVendorExists !== 0
    ) {
      updateState({
        updateQtyLoader: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => { },
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => clearCartAndAddProduct(item, section),
        },
      ]);
      return;
    }

    // return;

    if (item?.add_on?.length !== 0 || item?.variantSet?.length !== 0) {
      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedSection: section,
        selectedItemID: -1,
        btnLoader: false,
      });
      return;
    }
    if (item?.add_on?.length === 0 && item?.mode_of_service === 'schedule') {
      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedSection: section,
        selectedItemID: -1,
        btnLoader: false,
      });
      return;
    }

    let data = {};
    data['sku'] = item.sku;
    data['quantity'] = 1;
    data['product_variant_id'] = item?.variant[0]?.id;
    data['type'] = dine_In_Type;
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        updateState({ cartId: res.data.id });
        // showSuccess('Product successfully added');
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == item?.id) {
              x['qty'] = 1;
              x['cart_product_id'] = res.data.cart_product_id;
              return x;
            }
            return x;
          });
          section['data'] = updatedSection;
          updateState({
            sectionListData: sectionListData.map((f, fnx) => {
              if (f?.id == section?.id) {
                return section;
              }
              return f;
            }),
          });
        } else {
          let updateArray = productListData.map((val, i) => {
            if (val.id == item.id) {
              return {
                ...val,
                qty: 1,
                cart_product_id: res.data.cart_product_id,
                isRemove: false,
              };
            }
            return val;
          });
          updateState({
            productListData: updateArray,
          });
        }
        updateState({
          selectedCartItem: item,
          updateQtyLoader: false,
          selectedSection: section,
          selectedItemID: -1,
          btnLoader: false,
        });
      })
      .catch((error) => errorMethodSecond(error));
  };

  const addDeleteCartItems = (item, section = null, index, type) => {
    if (categoryInfo?.is_vendor_closed && !categoryInfo?.show_slot) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS)
      return;
    }
   // Vibration.vibrate(PATTERN)
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    //!!data?.variant[0]?.check_if_in_cart_app && data?.variant[0]?.check_if_in_cart_app.length > 0 || !!data?.qty ?

    let isExistqty = itemToUpdate?.qty
      ? itemToUpdate?.qty
      : !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
      itemToUpdate.variant[0]?.check_if_in_cart_app[0].quantity;
    let isExistproductId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
        itemToUpdate.variant[0]?.check_if_in_cart_app.length
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].id
        : itemToUpdate?.cart_product_id;
    let isExistCartId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
        itemToUpdate.variant[0]?.check_if_in_cart_app.length
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].cart_id
        : cartId;

    // return;
    if (type == 1) {
      quanitity = Number(isExistqty) + 1;
    } else {
      quanitity = Number(isExistqty) - 1;
    }
    if (quanitity) {
      updateState({
        selectedItemID: itemToUpdate.id,
        btnLoader: true,
        selectedItemIndx: index,
      });
      let data = {};
      data['cart_id'] = isExistCartId;
      data['quantity'] = quanitity;
      data['cart_product_id'] = isExistproductId;
      data['type'] = dineInType;
      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
          if (!!section) {
            let updatedSection = section.data.map((x, xnx) => {
              if (x?.id == item?.id) {
                return {
                  ...x,
                  qty: quanitity,
                  cart_product_id: isExistproductId,
                  isRemove: false,
                };
              }
              return x;
            });
            section['data'] = updatedSection;
            updateState({
              sectionListData: sectionListData.map((f, fnx) => {
                if (f?.id == section?.id) {
                  return section;
                }
                return f;
              }),
              selectedItemID: -1,
            });
          } else {
            let updateArray = productListData.map((val, i) => {
              if (val.id == item.id) {
                return {
                  ...val,
                  qty: quanitity,
                  cart_product_id: isExistproductId,
                  isRemove: false,
                };
              }
              return val;
            });
            updateState({
              productListData: updateArray,
              selectedItemID: -1,
            });
          }
        })
        .catch(errorMethod);
    } else {
      updateState({ selectedItemID: itemToUpdate?.id, btnLoader: false });
     // removeItem('selectedTable');
      removeProductFromCart(itemToUpdate, section);
    }
  };
  //decrementing/removeing products from cart
  const removeProductFromCart = (itemToUpdate, section = null) => {
    let data = {};
    let isExistproductId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
        itemToUpdate.variant[0]?.check_if_in_cart_app.length > 0
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].id
        : itemToUpdate?.cart_product_id;
    let isExistCartId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
        itemToUpdate.variant[0]?.check_if_in_cart_app.length > 0
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].cart_id
        : cartId;

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;
    updateState({ btnLoader: true });
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == itemToUpdate?.id) {
              return {
                ...x,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                variant: itemToUpdate?.variant.map((val, i) => {
                  return { ...val, check_if_in_cart_app: [] };
                }),
              };
            }
            return x;
          });
          section['data'] = updatedSection;
          updateState({
            sectionListData: sectionListData.map((f, fnx) => {
              if (f?.id == section?.id) {
                return section;
              }
              return f;
            }),
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        } else {
          let updateArray = productListData.map((val, i) => {
            if (val.id == itemToUpdate.id) {
              return {
                ...val,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                variant: itemToUpdate?.variant.map((val, i) => {
                  return { ...val, check_if_in_cart_app: [] };
                }),
              };
            }
            return val;
          });
          updateState({
            productListData: updateArray,
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethodSecond = (error, addonSet = []) => {
    console.log(error.message.alert, 'Error>>>>>');
    updateState({ updateQtyLoader: false });
    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: 'Clear Cart', onPress: () => clearCart(addonSet) },
      ]);
    } else {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  const clearCart = async (addonSet = []) => {
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
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };
console.log('categoryInfo',categoryInfo)
  const renderProduct = ({ item, index }) => {
    return (
      <ProductCard3
        data={item}
        index={index}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => addSingleItem(item, null, index)}
        onIncrement={() => addDeleteCartItems(item, null, index, 1)}
        onDecrement={() => addDeleteCartItems(item, null, index, 2)}
        selectedItemID={selectedItemID}
        btnLoader={btnLoader}
        selectedItemIndx={selectedItemIndx}
        categoryInfo={categoryInfo}
      />
    );
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    if (!!selectedSection) {
      let updatedSection = selectedSection.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return x;
      });
      selectedSection['data'] = updatedSection;
      updateState({
        sectionListData: sectionListData.map((f, fnx) => {
          if (f?.id == selectedSection?.id) {
            return selectedSection;
          }
          return f;
        }),
        cartId: cartID,
      });
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return val;
      });
      updateState({
        cartId: cartID,
        productListData: updateArray,
      });
    }
  };

  useEffect(() => {
    if (isLoadingC) {
      getAllProducts(true);
    }
  }, [isLoadingC]);


  const onPressChildCards = (item) => {

    updateState({
      selectedCategory: item,
      // productListData: [],
      productListId: item,
      pageNo: 1,
      limit: 12,
      isLoadingC: true,
    });

    // navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  const listHeaderComponent2 = () => {
    return (
      <View>
        {!!categoryInfo?.categoriesList ? <View style={{ ...styles.header2 }}>
          <StatusBar
            translucent
            barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
          />
          <View style={{ height: '80%' }}>
            <ImageBackground
              source={{
                uri: getImageUrl(
                  // data?.item?.banner.image_fit ||
                  categoryInfo?.banner?.image_fit ||
                  categoryInfo?.image?.image_fit,
                  // data?.item?.banner.image_path ||
                  categoryInfo?.banner?.image_path ||
                  categoryInfo?.image?.image_path,
                  '400/400',
                ),
              }}
              style={{
                ...styles.imageBackgroundHdr,
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
              resizeMode="cover">
              <LinearGradient
                style={styles.linearGradientHdr}
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)']}>
                <View style={styles.hdrCompHeader}>
                  <TouchableOpacity
                    hitSlop={styles.hitSlopProp}
                    onPress={() => navigation.goBack()}
                    style={{ flex: 0.2 }}>
                    <Image
                      source={imagePath.icBackb}
                      style={{
                        marginLeft: moderateScale(10),
                        tintColor: colors.white,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                    />
                  </TouchableOpacity>
                  <FastImage
                    source={{
                      uri: getImageUrl(
                        categoryInfo?.banner?.image_fit ||
                        categoryInfo?.image?.image_fit,
                        categoryInfo?.banner?.image_path ||
                        categoryInfo?.image?.image_path,
                        '400/400',
                      ),
                      priority: FastImage.priority.low,
                    }}
                    style={styles.hdrCompRoundImg}
                  />

                  <View style={styles.rightViewOfShareSearch}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={moveToNewScreen(
                        navigationStrings.SEARCHPRODUCTOVENDOR,
                        {
                          type: data?.vendor
                            ? staticStrings.VENDOR
                            : staticStrings.CATEGORY,
                          id: data?.vendor ? data?.id : productListId?.id,
                        },
                      )}>
                      <Image
                        style={{
                          tintColor: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                        source={
                          !!data?.showAddToCart ? false : imagePath.icSearchb
                        }
                      />
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: moderateScale(8) }} />
                    <TouchableOpacity
                      onPress={onShare}
                      hitSlop={hitSlopProp}
                      activeOpacity={0.8}>
                      <Image
                        style={{
                          tintColor: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                        source={imagePath.icShareb}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
              <View
                style={{
                  ...styles.hdrAbsoluteView,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                }}>
                <View style={styles.hdrNameRatingView}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.hdrTitleTxt,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {data?.name || categoryInfo?.name || ''}
                  </Text>
                  {!!categoryInfo &&
                    !!categoryInfo?.product_avg_average_rating && (
                      <View style={styles.hdrRatingTxtView}>
                        <Text style={styles.ratingTxt}>
                          {Number(
                            categoryInfo?.product_avg_average_rating,
                          ).toFixed(1)}
                        </Text>
                        <Image
                          style={styles.starImg}
                          source={imagePath.star}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                </View>
                {!!categoryInfo && !!categoryInfo?.categoriesList && (
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginRight: moderateScale(40),
                        marginVertical: moderateScale(1),
                        marginLeft: 0,
                      }}>
                      {categoryInfo?.categoriesList || ''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.milesTxt,
                        marginLeft: 0,
                        fontSize: textScale(8),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginVertical: moderateScaleVertical(4)
                      }}>{desc}</Text>
                  </View>

                )}
                {!!categoryInfo && !!categoryInfo?.lineOfSightDistance && (
                  <View
                    style={{
                      ...styles.hdrNameRatingView,
                      marginTop: moderateScaleVertical(5),
                    }}>
                    <View style={styles.milesView}>
                      <Image
                        source={imagePath.location2}
                        style={styles.locTimeIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          ...styles.milesTxt,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {categoryInfo.lineOfSightDistance}
                      </Text>
                      {!!categoryInfo.lineOfSightDistance &&
                        !!categoryInfo.timeofLineOfSightDistance && (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                              source={imagePath.icTime2}
                              style={{
                                ...styles.locTimeIcon,
                                marginLeft: moderateScale(4)
                              }}
                              resizeMode="contain"
                            />
                            <Text style={{
                              ...styles.milesTxt,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            }}>
                              {checkEvenOdd(categoryInfo.timeofLineOfSightDistance)}-{checkEvenOdd(categoryInfo.timeofLineOfSightDistance + 5)}
                              {' mins'}
                            </Text>
                          </View>
                        )}
                    </View>
                    <Text
                      style={{
                        ...commonStyles.mediumFont14Normal,
                        fontSize: textScale(12),
                        textAlign: 'left',
                        marginRight: moderateScale(5),
                        color: categoryInfo?.show_slot
                          ? colors.green
                          : categoryInfo?.is_vendor_closed
                            ? colors.redB
                            : colors.green,
                      }}>
                      {categoryInfo?.show_slot
                        ? strings.OPEN
                        : categoryInfo?.is_vendor_closed
                          ? strings.CLOSE
                          : strings.OPEN}
                    </Text>
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
        </View>
          :
          <Animatable.View
            // key={AnimatedHeaderValue}
            // duration={10}
            animation={'fadeIn'}
            style={{
              ...styles.headerStyle,
              marginBottom: moderateScale(12)
              // height: 52
            }}>
            <View

              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View

                style={{ marginLeft: moderateScale(8), flex: 0.7 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RoundImg
                    img={getImageUrl(uri1, uri2, '400/400')}
                    size={30}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                  />
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: fontFamily.medium,

                      }}>
                      {name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isSearch ? (
              <Animatable.View
              // animation="fadeIn"
              >
                <SearchBar
                  containerStyle={{
                    marginHorizontal: moderateScale(18),
                    borderRadius: 8,
                    width: width / 1.15,
                    backgroundColor: isDarkMode
                      ? colors.whiteOpacity15
                      : colors.greyColor,
                    height: moderateScaleVertical(37),
                  }}
                  searchValue={searchInput}
                  placeholder={strings.SEARCH_ITEM}
                  // onChangeText={(value) => onChangeText(value)}
                  showRightIcon
                  rightIconPress={() =>
                    updateState({
                      searchInput: '',
                      isSearch: false,
                      isLoading: false,
                    })
                  }
                />
              </Animatable.View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => updateState({isSearch: true})}
                  onPress={moveToNewScreen(
                    navigationStrings.SEARCHPRODUCTOVENDOR,
                    {
                      type: data?.vendor
                        ? staticStrings.VENDOR
                        : staticStrings.CATEGORY,
                      id: data?.vendor ? data?.id : productListId?.id,
                    },
                  )}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View style={{ marginHorizontal: moderateScale(8) }} />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animatable.View>
        }

        {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
          <View style={{ marginHorizontal: moderateScale(20) }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                // marginHorizontal: moderateScale(0),
                marginTop: moderateScaleVertical(5),
              }}>
              {/* <View><Image source={imagePath.}/></View> */}
              {categoryInfo.childs.map((item, inx) => {
                return (
                  <View key={inx}>
                    <TouchableOpacity
                      style={{
                        padding: moderateScale(10),
                        // backgroundColor: colors.lightGreyBg,
                        marginRight: moderateScale(10),
                        borderRadius: moderateScale(12),
                        backgroundColor:
                          selectedCategory && selectedCategory?.id == item?.id
                            ? themeColors.primary_color
                            : colors.lightGreyBg,
                      }}
                      onPress={() => onPressChildCards(item)}
                    >
                      <Text
                        style={{
                          color:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? colors.white
                              : colors.black,
                          opacity:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? 1
                              : 0.61,
                          fontSize: textScale(12),
                          fontFamily: fontFamily.medium,
                        }}>
                        {item?.translation[0]?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const _onVendorCategory = (itm, indx) => {
    updateState({
      vendorCategorySelectedIndx: indx,
      productListData: itm?.products,
      // AnimatedHeaderValue: true
    });
  };

  const _renderVendorCategories = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        // onPress={() => _onVendorCategory(item, index)}
        style={{
          paddingHorizontal: 5,
          paddingVertical: 7,
          backgroundColor:
            vendorCategorySelectedIndx === index
              ? themeColors.primary_color
              : colors.transparent,
          borderRadius: 10,
          borderColor:
            vendorCategorySelectedIndx !== index
              ? themeColors.primary_color
              : colors.transparent,
          borderWidth: 0.7,
        }}>
        <Text
          style={{
            fontFamily: fontFamily.medium,
            color:
              vendorCategorySelectedIndx === index
                ? colors.white
                : isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
          }}>
          {item?.category?.translation[0]?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <SafeAreaView>
          <HeaderLoader
            widthLeft={20}
            rectWidthLeft={20}
            widthRight={20}
            rectWidthRight={20}
            heightLeft={20}
            rectHeightLeft={20}
            heightRight={20}
            rectHeightRight={20}
            rx={5}
            ry={5}
            viewStyles={{ marginTop: moderateScale(10) }}
          />
          {!!categoryInfo?.categoriesList ? <View>
            <View
              style={{
                marginVertical: moderateScaleVertical(12),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CircularProfileLoader isDesc={false} />
            </View>
            <HeaderLoader
              viewStyles={{
                marginHorizontal: moderateScale(20),
                marginBottom: moderateScale(10),
              }}
              widthLeft={width - moderateScale(40)}
              rectWidthLeft={width - moderateScale(40)}
              heightLeft={moderateScaleVertical(80)}
              rectHeightLeft={moderateScaleVertical(80)}
              isRight={false}
              rx={8}
              ry={8}
            />
          </View> : <View style={{ marginBottom: moderateScaleVertical(16) }} />}
          <View style={{ marginHorizontal: moderateScale(16) }}>
            <ProductListLoader />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
          </View>
          {!data?.isVerndorList && (
            <View style={{ marginHorizontal: moderateScale(16) }}>
              <ProductListLoader />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
              <ProductListLoader />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

  const onShare = async () => {
    let convertJson = JSON.stringify(data);
    let shareLink = `${categoryInfo.share_link + `?data=${convertJson}`}`;
    try {
      const result = await Share.share({
        url: shareLink,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderSectionTab = (props) => {
    const { title, isActive } = props;
    if (!AnimatedHeaderValue) {
      return <View style={{ width: 40 }} />;
    }
    return (
      <Animatable.View
        animation={'fadeIn'}
        style={{
          marginTop: moderateScaleVertical(4),
          marginLeft: moderateScale(12),
          marginBottom: moderateScaleVertical(16),
          padding: 4,
          borderBottomWidth: 3,
          borderColor: isActive
            ? themeColors.primary_color
            : colors.transparent,
        }}>
        <Text
          style={{
            fontFamily: fontFamily.medium,
            color: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.black,
          }}>
          {title}
        </Text>
      </Animatable.View>
    );
  };

  const renderSectionHeader = ({ section }) => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(16),
          marginVertical: moderateScaleVertical(8),
        }}>
        <Text
          style={{
            ...styles.hdrTitleTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {section?.title}
        </Text>
      </View>
    );
  };
  const renderSectionItem = ({ item, index, section }) => {
    return (
      <View>
        <ProductCard3
          data={item}
          index={index}
          onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
          onAddtoWishlist={() => _onAddtoWishlist(item)}
          addToCart={() => addSingleItem(item, section, index)}
          onIncrement={() => addDeleteCartItems(item, section, index, 1)}
          onDecrement={() => addDeleteCartItems(item, section, index, 2)}
          selectedItemID={selectedItemID}
          btnLoader={btnLoader}
          selectedItemIndx={selectedItemIndx}
        />
      </View>
    );
  };

  const onScroll = ({ nativeEvent }) => {
    if (
      productListData &&
      productListData.length &&
      productListData.length < 6
    ) {
      return;
    }

    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 8); // your cell height
    if (index > moderateScale(36)) {
      if (!AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: true });
      }
      return;
    }
    if (index < moderateScale(36)) {
      if (AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: false });
        return;
      }
      return;
    }
  };

  let uri1 = categoryInfo?.banner?.image_fit || categoryInfo?.icon?.image_fit;
  let uri2 = categoryInfo?.banner?.image_path || categoryInfo?.icon?.image_path;

  // let uri1 = data?.categoryInfo?.image?.image_fit || data?.categoryInfo?.icon?.image_fit;
  // let uri2 = data?.categoryInfo?.image?.image_path || data?.categoryInfo?.icon?.image_path;
  let name =
    data?.name ||
    data?.categoryInfo?.name ||
    (!!categoryInfo?.translation && categoryInfo?.translation[0]?.name);
  let desc =
    categoryInfo?.desc ||
    (!!categoryInfo?.translation &&
      categoryInfo?.translation[0]?.meta_description);

  var itemHeights = [];
  const getItemLayout = (data, index) => {
    const length = itemHeights[index];
    const offset = itemHeights.slice(0, index).reduce((a, c) => a + c, 0);
    return { length, offset, index };
  };
  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        flex: 1,
        // paddingVertical: moderateScale(16),
      }}>
      <View style={{ flex: 1 }}>
        {/* {!data.isVendorList && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: moderateScale(15),
              marginTop: Platform.OS === 'ios' ? StatusBarHeight : 15,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                  fontSize: moderateScale(14),
                  fontFamily: fontFamily.bold,
                  marginLeft: moderateScale(15),
                }}>
                {name}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => updateState({ isSearch: true })}
                onPress={moveToNewScreen(
                  navigationStrings.SEARCHPRODUCTOVENDOR,
                  {
                    type: data?.vendor
                      ? staticStrings.VENDOR
                      : staticStrings.CATEGORY,
                    id: data?.vendor ? data?.id : productListId?.id,
                  },
                )}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    marginRight: moderateScale(15),
                  }}
                  source={imagePath.icSearchb}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                hitSlop={hitSlopProp}
                activeOpacity={0.8}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icShareb}
                />
              </TouchableOpacity>
            </View>
          </View>
        )} */}

        {((AnimatedHeaderValue && productListData.length > 6) ||
          (!!sectionListData?.length && AnimatedHeaderValue)) && (
            <Animatable.View
              // key={AnimatedHeaderValue}
              // duration={10}
              animation={'fadeIn'}
              style={{
                ...styles.headerStyle,
                marginBottom: moderateScale(12)
                // height: 52
              }}>
              <View

                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.goBack()}
                  hitSlop={styles.hitSlopProp}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={imagePath.icBackb}
                  />
                </TouchableOpacity>

                <View

                  style={{ marginLeft: moderateScale(8), flex: 0.7 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RoundImg
                      img={getImageUrl(uri1, uri2, '400/400')}
                      size={30}
                      isDarkMode={isDarkMode}
                      MyDarkTheme={MyDarkTheme}
                    />
                    <View style={{ marginLeft: moderateScale(8) }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          fontSize: moderateScale(14),
                          fontFamily: fontFamily.medium,

                        }}>
                        {name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{

                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity43,
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.regular,
                          marginTop: moderateScaleVertical(2),
                        }}>
                        {categoryInfo?.categoriesList || ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {isSearch ? (
                <Animatable.View
                // animation="fadeIn"
                >
                  <SearchBar
                    containerStyle={{
                      marginHorizontal: moderateScale(18),
                      borderRadius: 8,
                      width: width / 1.15,
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.greyColor,
                      height: moderateScaleVertical(37),
                    }}
                    searchValue={searchInput}
                    placeholder={strings.SEARCH_ITEM}
                    // onChangeText={(value) => onChangeText(value)}
                    showRightIcon
                    rightIconPress={() =>
                      updateState({
                        searchInput: '',
                        isSearch: false,
                        isLoading: false,
                      })
                    }
                  />
                </Animatable.View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() => updateState({isSearch: true})}
                    onPress={moveToNewScreen(
                      navigationStrings.SEARCHPRODUCTOVENDOR,
                      {
                        type: data?.vendor
                          ? staticStrings.VENDOR
                          : staticStrings.CATEGORY,
                        id: data?.vendor ? data?.id : productListId?.id,
                      },
                    )}>
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                      source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                    />
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: moderateScale(8) }} />
                  <TouchableOpacity
                    onPress={onShare}
                    hitSlop={hitSlopProp}
                    activeOpacity={0.8}>
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                      source={imagePath.icShareb}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </Animatable.View>
          )}
        {/* <View style={{height: moderateScale(10)}} /> */}
      
          <FlatList
            onScroll={onScroll}
            disableScrollViewPanResponder
            showsVerticalScrollIndicator={false}
            data={productListData}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent2()}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              flexGrow: 1,
            }}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            refreshing={isRefreshing}
            // initialNumToRender={12}
            // maxToRenderPerBatch={10}
            // windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            onEndReached={
              !categoryInfo?.is_show_products_with_category &&
              onEndReachedDelayed
            }
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <View style={{ height: moderateScale(60) }} />
            )}
            ListEmptyComponent={
              <NoDataFound isLoading={state.isLoading} containerStyle={{}} />
            }
          />
        

        {/* <View style={{ height: moderateScale(height * 0.070) }} /> */}
      </View>

      {!!typeId && typeId == 8 ? (
        <View>
          {isVisibleModal && (
            <HomeServiceVariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={isVisibleModal}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({ isVisibleModal: false, showShimmer: true })
              }
              showShimmer={showShimmer}
              shimmerClose={(val) => updateState({ showShimmer: val })}
              updateCartItems={updateCartItems}
            // modeOfService={selectedCartItem?.mode_of_service}
            />
          )}
        </View>
      ) : (
        <View>
          {isVisibleModal && (
            <VariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={isVisibleModal}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({ isVisibleModal: false, showShimmer: true })
              }
              showShimmer={showShimmer}
              shimmerClose={(val) => updateState({ showShimmer: val })}
              updateCartItems={updateCartItems}
            />
          )}
        </View>
      )}

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle="Loading"
        containerColor={colors.white}
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={updateQtyLoader}
      />
    </View>
  );
}
