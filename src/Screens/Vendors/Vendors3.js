import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, RefreshControl, View} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import Header3 from '../../Components/Header3';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar2 from '../../Components/SearchBar2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {showError} from '../../utils/helperFunctions';
import ListEmptyVendors from './ListEmptyVendors';

export default function Vendors3({route, navigation}) {
  console.log("Vendors - Vendors3.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
  });
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state.initBoot);

  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  // alert(dine_In_Type);
  const location = useSelector((state) => state?.home?.location);

  const {isLoading, pageNo, isRefreshing, limit} = state;
  const {data} = route.params;
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id}?limit=${limit}&page=${pageNo}&type=${dine_In_Type}`,
        {},
        {
          code: appData.profile.code,
          latitude: location?.latitude.toString() || '',
          longitude: location?.longitude.toString() || '',
        },
      )
      .then((res) => {
      
        updateState({isLoading: false, isRefreshing: false});
        const vendorData = {
          category: res.data.category,
          listData:
            pageNo == 1
              ? res.data.listData.data
              : [...categoryData?.listData, ...res.data.listData.data],
        };
        actions.saveVendorListingAndCategoryInfo(vendorData);
      })
      .catch(errorMethod);
  }, [pageNo, isRefreshing]);

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  //************Check the redirecton screen********/
  const _checkRedirectScreen = (item) => {

    {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            categoryData: data,
            
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item.id,
            vendor: true,
            name: item.name,
            category_slug: data?.slug,
          })();
    }
  };

  const _renderItem = ({item, index}) => {
    return (
      <View style={{marginHorizontal: moderateScale(15)}}>
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </View>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width - moderateScale(32),
    offset: (width - moderateScale(32)) * index,
    index,
  });

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <Header3
        leftIcon={imagePath.icBackb}
        centerTitle={data?.name}
        rightIcon={imagePath.search}
        location={location}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
      {isLoading ? (
        <SearchLoader viewStyles={{marginVertical: moderateScale(17)}} />
      ) : (
        <SearchBar2 navigation={navigation} />
      )}
      {/* <Image
          style={
            isDarkMode
              && {tintColor: MyDarkTheme.colors.text}
              
          }
          source={imagePath.filter1}
        /> */}
      {/* </View> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={(!isLoading && categoryData?.listData) || []}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
            // titleColor="#fff"
          />
        }
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={state.isLoading} />
            </View>
          )
        }
        ListFooterComponent={() => <View style={{height: 100}} />}
      />
    </WrapperContainer>

    //<VendorsDesign1 />
  );
}
