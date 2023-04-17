import React, { useEffect, useState } from 'react';
import { FlatList, View, SafeAreaView, ImageBackground, StyleSheet, StatusBar, I18nManager, TouchableOpacity, Image, Text, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import VendorDetailLoader from '../../Components/Loaders/VendorDetailLoader';
import ThreeColumnCard from '../../Components/ThreeColumnCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import LinearGradient from "react-native-linear-gradient";

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { showError, getImageUrl, checkEvenOdd } from '../../utils/helperFunctions';
import ListEmptyVendors from '../Vendors/ListEmptyVendors';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../styles/theme';
import strings from '../../constants/lang';
import BrandCard2Updated from '../../Components/BrandCard2Updated/BrandCard2Updated';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import { trim } from 'lodash';
import NoDataFound from '../../Components/NoDataFound';
import FastImage from 'react-native-fast-image';


export default function VendorDetail3({ navigation, route }) {
  console.log("VendorDetail - VendorDetail3.js")
  let vendorParams = route?.params?.data;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  // alert("312")
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id || vendorParams.id,
    vendordName: vendorParams.name || '',
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const { vendorId, vendorData, isLoading, limit, pageNo, vendordName } = state;

  useEffect(() => {
    if (
      vendorParams &&
      vendorParams?.item &&
      vendorParams?.item?.redirect_to == staticStrings.SUBCATEGORY
    ) {
      getSubCategoryDetailData();
    } else {
      getVendorDetailData();
    }
  }, [vendorId]);

  const convertLocalDateToUTCDate = (date, toUTC) => {
    date = new Date(date);
    //Local time converted to UTC
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    return date;
  };

  useEffect(() => {
    convertLocalDateToUTCDate('2021-09-28T00:00', true);
  }, []);

  const { appData, appStyle, currencies, languages } = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen = (item) => {
    // return;
    navigation.navigate(navigationStrings.PRODUCT_LIST, {
      data: {
        id: item.id,
        rootProducts: vendorParams?.rootProducts,
        vendor: vendorParams?.rootProducts ? true : false,
        vendorData: vendorParams?.item,
        categoryInfo: item,
        name: item.name,
        isVendorList: false,
        category_slug: item?.slug,
    }
    })
}
// (screenName, data = {}) =>
//   () => {
//     navigation.navigate(screenName, { data });
//   };

/***********GET SUBCATEGORY  DETAIL DATA******** */

const getSubCategoryDetailData = () => {
  console.log("vendorParamsss",  route);
  //&categoryId=${vendorParams?.}
  actions
    .getProductByCategoryId(
      `/${vendorId}?limit=${limit}&page=${pageNo}&categoryId=${vendorParams?.item?.slug}`,
      {},
      {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      },
    )
    .then((res) => {
      updateState({ isLoading: false });
      if (res && res.data) {
        updateState({ vendorData: res.data.listData });
      }
    })
    .catch(errorMethod);
};
/*********** */

/*********GET VENDOR DETAIL********* */
const getVendorDetailData = () => {
  console.log("vendorParamsss",  vendorParams);
  let data = {};
    data['vendor_id'] = vendorId;
    if(vendorParams?.categoryData!==null&&vendorParams?.categoryData!==undefined){
      data['category_id'] = vendorParams?.categoryData?.id;
    }
    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        
      })
      .then((res) => {
        updateState({ isLoading: false });
        if (res && res.data) {
          console.log( res.data,'THIS IS VENDORDATA')
          let newArray = res.data;
          // if (vendorParams?.rootProducts) {
          //   // console.log(
          //   //   newArray.filter((x) => x?.id != vendorParams?.categoryData?.id),
          //   //   'newArray>>>>',
          //   // );
          //   newArray= newArray.filter((x) => x?.id != vendorParams?.categoryData?.id)
          // }
          updateState({ vendorData: newArray });
        }
      })
      .catch(errorMethod);

};

/********* */

const errorMethod = (error) => {
  updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
  showError(error?.message || error?.error);
};



const _renderItem = ({ item, index }) => {
  console.log(item, 'MY EACH ITEM')
  return (
    <BrandCard2Updated
      onPress={() => moveToNewScreen(item)}
      // onPress={() => navigation.navigate(navigationStrings.PRODUCT_LIST)}
      data={item}
      withTextBG
      cardIndex={index}
    />
  );
};

if (isLoading) {
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <CategoryLoader2
        viewStyles={{ marginTop: moderateScale(50) }}
        isFourthItem={false}
        widthTop={(width - moderateScale(50)) / 3}
        rectWidthTop={(width - moderateScale(50)) / 3}
        heightTop={moderateScaleVertical(90)}
        rectHeightTop={moderateScaleVertical(90)}
        isSubCategory
      />
      <CategoryLoader2
        viewStyles={{ marginTop: moderateScale(25) }}
        isFourthItem={false}
        widthTop={(width - moderateScale(50)) / 3}
        rectWidthTop={(width - moderateScale(50)) / 3}
        heightTop={moderateScaleVertical(90)}
        rectHeightTop={moderateScaleVertical(90)}
        isSubCategory
      />
      <CategoryLoader2
        viewStyles={{ marginTop: moderateScale(25) }}
        isFourthItem={false}
        widthTop={(width - moderateScale(50)) / 3}
        rectWidthTop={(width - moderateScale(50)) / 3}
        heightTop={moderateScaleVertical(90)}
        rectHeightTop={moderateScaleVertical(90)}
        isSubCategory
      />
      <CategoryLoader2
        viewStyles={{ marginTop: moderateScale(25) }}
        isFourthItem={false}
        widthTop={(width - moderateScale(50)) / 3}
        rectWidthTop={(width - moderateScale(50)) / 3}
        heightTop={moderateScaleVertical(90)}
        rectHeightTop={moderateScaleVertical(90)}
        isSubCategory
      />
      <CategoryLoader2
        viewStyles={{ marginTop: moderateScale(25) }}
        isFourthItem={false}
        widthTop={(width - moderateScale(50)) / 3}
        rectWidthTop={(width - moderateScale(50)) / 3}
        heightTop={moderateScaleVertical(90)}
        rectHeightTop={moderateScaleVertical(90)}
        isSubCategory
      />
    </WrapperContainer>
  );
}

const imageUrl = getImageUrl(
  vendorParams?.item?.banner?.proxy_url || vendorParams?.item?.image.proxy_url,
  vendorParams?.item?.banner?.image_path || vendorParams?.item?.image.image_path,
  '800/400',
);

return (
  
  <View
    style={{
      flex: 1,
      backgroundColor: isDarkMode
        ? MyDarkTheme.colors.background
        : colors.backgroundGrey,
    }}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={'light-content'}
        hidden={Platform.os=="ios"?true:false}
        />
    <>
    
      <ImageBackground
        source={{uri: imageUrl, priority: FastImage.priority.high }}
				style={{width:"100%", height:Platform.os=="ios"?200:230}}
        resizeMode= 'stretch'
			>
        <LinearGradient
          colors={[
            'rgba(60,60,60, 0)',
            'rgba(60,60,60, 1)',
          ]}
          style={{width:"100%", height:'100%', justifyContent:"space-between" }}>
            <TouchableOpacity
                
                activeOpacity={1}
                onPress={()=>navigation.goBack()}>
                <Image
                  resizeMode="stretch"
                  source={imagePath.backIconWhite}
                
                  style={{marginTop:50, marginLeft:20, width:20, height:20}
                  }
                />
            </TouchableOpacity>

            <View style={{flexDirection:"row", justifyContent:"space-between", marginLeft:20, marginBottom:10 }}>
              <View style={{flex:0.7}}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                  <Text
                    style={{
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(18),
                      textAlign: 'center',
                      // marginTop: moderateScaleVertical(2),
                    }}>
                    {vendorParams?.item?.name ? vendorParams?.item?.name : ''}
                  </Text>
                  {vendorParams?.item?.product_avg_average_rating && (
                    <View style={{  
                      
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent:"center",
                      backgroundColor: colors.green,
                      borderRadius: moderateScale(4),
                      // paddingVertical: moderateScale(1),
                      paddingHorizontal: moderateScale(4),
                      marginLeft:10,
                      height:20
                    }}>
                      <Text
                        style={{
                          ...{
                            color: colors.yellowC,
                            fontSize: textScale(11),
                            fontFamily: fontFamily.medium,
                            textAlign: 'left',
                          },
                          color: colors.white,
                          fontSize: textScale(9),
                        }}>
                        {Number(vendorParams?.item?.product_avg_average_rating).toFixed(1)}
                      </Text>
                      <Image
                        style={{
                          tintColor: colors.white,
                          marginLeft: 2,
                          width: 9,
                          height: 9,
                        }}
                        source={imagePath.star}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                </View>
                
                <Text
                  style={{
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                    // textAlign: 'center',
                    marginTop: moderateScaleVertical(2),
                  }}>
                  {vendorParams?.item?.desc ? vendorParams?.item?.desc : ''}
                </Text>
                
              </View>
              <View style={{alignItems:"flex-end", marginRight:10, flex:0.3, justifyContent:"flex-end"}}>
                <Text
                  style={{
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(12),
                    // textAlign: 'center',
                    marginTop: moderateScaleVertical(2),
                  }}>
                    {checkEvenOdd(vendorParams?.item?.timeofLineOfSightDistance)}-{checkEvenOdd(vendorParams?.item?.timeofLineOfSightDistance + 5)} {' mins'}
                </Text>
              </View>
            </View>
        </LinearGradient>
      </ImageBackground> 
      

    
      <View style={{ marginHorizontal: moderateScale(8), backgroundColor:colors?.backgroundGrey, marginTop:20 }}>
        <FlatList
          contentContainerStyle={{ marginLeft:'5%', marginRight:"4%"}}
          columnWrapperStyle={{alignSelf:"flex-start"}}
          data={vendorData || []}
          numColumns={3}
          // ListHeaderComponent={<View style={{ height: 10 }} />}
          // columnWrapperStyle={{justifyContent: 'space-between'}}
          ItemSeparatorComponent={() => <View style={{ height: moderateScale(4) }} />}
          renderItem={_renderItem}
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
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    </>
  </View>
   

  // <WrapperContainer
  //   statusBarColor={colors.backgroundGrey}
  //   bgColor={
  //     isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
  //   }>
  //   {/* <Header centerTitle={vendorParams?.item?.name} hideRight={false} /> */}

  //   <Header
  //     leftIcon={
  //       imagePath.icBackb 
  //     }
  //     centerTitle={vendorParams?.item?.name || vendordName}
  //     textStyle={{ fontSize: textScale(13) }}
  //     rightIcon={
  //       imagePath.icSearchb
  //     }
  //     onPressRight={() =>
  //       navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
  //     }
  //   />
  //   {/* <View style={{width:"100%", height: moderateScale(150), alignSelf:"center",  backgroundColor:"blue"}}></View> */}
    

  // </WrapperContainer>
);
}
