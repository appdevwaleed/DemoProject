import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import ProductCard from '../../Components/ProductCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {moderateScale} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import WishlistCard from '../../Components/WishlistCard';

export default function Wishlist2({navigation}) {
  console.log("Wishlist - Wishlist2.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
    isRefreshing: false,
    wishlistArray: [],
    limit: 4,
    pageNo: 1,
  });
  const {isLoading, limit, pageNo, isRefreshing, wishlistArray} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state?.auth?.userData);

  const {appData, appStyle, currencies, languages, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateState({pageNo: 1, limit: 4});
      getAllWishListData();
    });
    return unsubscribe;
  }, [navigation]);

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  useEffect(() => {
    getAllWishListData();
  }, [pageNo, isRefreshing]);

  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    updateState({isLoading: true});
    actions
      .getWishlistProducts(
        `?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
      
        let newArray =
          pageNo == 1 ? res.data.data : [...wishlistArray, ...res.data.data];
        updateState({
          isLoading: false,

          isRefreshing: false,
          wishlistArray:
            newArray && newArray.length
              ? newArray.map((i, inx) => {
                  i.product.inwishlist = {product_id: i.product_id};
                  return i;
                })
              : [],
        });
      })
      .catch(errorMethod);
  };

  /* ADD-REMOVE ITEM TO WISHLIST FUNCTION  */
  const _onAddtoWishlist = (item) => {
    updateState({isLoading: true});
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
        const updatedWishlistArray = wishlistArray.filter(
          (i) => i?.product_id !== item?.id,
        );

        updateState({wishlistArray: updatedWishlistArray, isLoading: false});
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };
  //Add product to cart
  const _addToCart = (item) => {
    moveToNewScreen(navigationStrings.PRODUCTDETAIL, item.product)();
  };
  const renderProduct = ({item, index}) => {
    return (
      <WishlistCard
        data={item.product}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item.product)}
      />
      // <ProductCard
      //   data={item.product}
      //   onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item.product)}
      //   onAddtoWishlist={() => _onAddtoWishlist(item.product)}
      //   addToCart={() => _addToCart(item)}
      // />
    );
  };

  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true, isLoading: false});
  };

  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <Header
        leftIcon={
        imagePath.icBackb
        }
        centerTitle={strings.WISHLIST}
        rightIcon={
           imagePath.icSearchb
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{...commonStyles.headerTopLine}} />
      <FlatList
        data={wishlistArray}
        renderItem={renderProduct}
        keyExtractor={(item, index) => String(index)}
        ListHeaderComponent={<View style={{height: 20}} />}
        keyboardShouldPersistTaps="always"
        // numColumns={2}
        showsVerticalScrollIndicator={false}
        // style={{ flex: 1 }}
        // contentContainerStyle={{
        //   flexGrow: 1,
        // }}
        // ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        // columnWrapperStyle={{
        //   justifyContent: 'space-between',
        //   marginHorizontal: moderateScale(14),
        // }}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
            // titleColor="#fff"
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.009}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={<ListEmptyProduct isLoading={isLoading} />}
      />
    </WrapperContainer>
  );
}
