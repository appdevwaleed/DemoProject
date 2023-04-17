import React, {useRef} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated
} from 'react-native';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../../Components/TransparentButtonWithTxtAndIcon';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import ListEmptyCar from './ListEmptyCar';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import AnimatedListItem from "../../../Components/AnimatedListItem"

export default function SelectCarModalView({
  isLoading = false,
  availableCarList = [],
  onPressPickUpNow,
  onPressPickUplater,
  onPressAvailableCar,
  selectedCarOption = null,
  availableVendors,
  selectedVendorOption = null,
  _select,
  onPressAvailableVendor,
}) {
  console.log("TaxiApp - SelectCarModalView.js")
  const viewRef2 = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
 

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);

  //Render all Available amounts
  const _renderItem = (item, index) => {
    return (
      <TouchableOpacity
      style={[
        {
            marginVertical:10,
            borderRadius:15,
            marginBottom:20,
            marginHorizontal:20,
            backgroundColor:
            selectedCarOption?.id == item?.id
              ? colors.focusBackGround
              : colors.white,
          }, 
          (Platform.OS=="ios")&&
          {
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }, 
          (Platform.OS=="android")&&{
            elevation:10
          }
        ]
      }
      activeOpacity={1}
        onPress={() => onPressAvailableCar(item)}>
        <View
          style={{
        
            // paddingVertical: moderateScaleVertical(20),
            // paddingHorizontal: moderateScale(10),

            // marginBottom: moderateScaleVertical(20),

            opacity: selectedCarOption?.id == item?.id ? 1 : 1,
            // backgroundColor:
            //   selectedCarOption?.id == item?.id
            //     ? colors.lightGreyBg
            //     : colors.whiteOpacity77,
          }}>
          <View style={{flexDirection: 'row', alignSelf:"center", alignItems:"center", paddingVertical:10}}>
            <View style={{height: 55, width:55, justifyContent:"center", alignItems:"center", borderRadius:15, marginHorizontal:10, backgroundColor:"#E7F2F9"}}>
              <View>
                <Image
                  resizeMode={'contain'}
                  style={{height: 40, width: 40}}
                  source={{
                    uri: getImageUrl(
                      item?.media[0]?.image?.path?.proxy_url,
                      item?.media[0]?.image?.path?.image_path,
                      '150/150',
                    ),
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flex:1,
                // flex: 0.7,
                flexDirection: 'row',
                // justifyContent: 'center',
                // alignItems: 'center',
                marginLeft: 5,
              }}>
              <View style={{flex: 0.5}}>
                  <Text
                    numberOfLines={1}
                    style={
                      selectedCarOption?.id == item?.id
                        ? [
                            styles.carType,
                            {
                              color: colors.white,
                              fontFamily: fontFamily.bold,
                              fontSize: textScale(18),
                            },
                          ]
                        : [
                            styles.carType,
                            {
                              color: colors.blackC,
                              fontFamily: fontFamily.bold,
                              fontSize: textScale(18),
                            },
                          ]
                    }>
                    {item?.translation[0]?.title}
                  </Text>
                  {/* <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                  <Image
                      resizeMode={'stretch'}
                      style={{height: 15, width: 15}}
                      source={selectedCarOption?.id == item?.id?imagePath.areaWhite:imagePath.areaBlack}
                    />
                    <Text
                      numberOfLines={2}
                      style={
                        selectedCarOption?.id == item?.id
                          ? [
                              styles.carType,
                              {
                                color: colors.white,
                                fontFamily: fontFamily.medium,
                                fontSize: textScale(10),
                                marginLeft:5
                              },
                            ]
                          : [
                              styles.carType,
                              {
                                color: colors.blackC,
                                fontFamily: fontFamily.medium,
                                fontSize: textScale(10),
                                marginLeft:5
                              },
                            ]
                      }>{item?.dimensions}
                    </Text>
                  </View> */}
              </View>
              <View
                style={{
                  flex: 0.5,
                  alignItems: 'flex-end',
                  marginRight:20,
                  justifyContent:"center"
                }}>
                  <Text
                    numberOfLines={2}
                    style={
                      selectedCarOption?.id == item?.id
                        ? [
                            styles.priceStyle,
                            {
                              color: colors.white,
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                            },
                          ]
                        : [
                            styles.priceStyle,
                            {
                              color: isDarkMode
                                ? colors.white
                                : colors.blackC,
                              fontFamily: fontFamily.bold,
                              fontSize: textScale(12),
                            },
                          ]

                      // isDarkMode
                      //   ? [styles.priceStyle, {color: MyDarkTheme.colors.text}]
                      //   : styles.priceStyle
                    }>
                    {`${currencies?.primary_currency?.symbol} ${Number(
                      item.tags_price,
                    ).toFixed(2)}`}
                  </Text>
                  {/* <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"center", marginTop:5}}>
                    <Image
                      resizeMode={'stretch'}
                      style={{height: 15, width: 15}}
                      source={selectedCarOption?.id == item?.id?imagePath.timeOutlineWhite:imagePath.timeOutlineBlack}
                    />
                    <Text
                      numberOfLines={1}
                      style={
                        selectedCarOption?.id == item?.id
                          ? [
                              styles.priceStyle,
                              {
                                color: colors.white,
                                fontFamily: fontFamily.medium,
                                fontSize: textScale(10),
                                marginLeft:5,
                              },
                            ]
                          : [
                              styles.priceStyle,
                              {
                                color: isDarkMode
                                  ? colors.white
                                  : colors.blackC,
                                fontFamily: fontFamily.medium,
                                fontSize: textScale(10),
                                marginLeft:5
                              },
                            ]
                      }>
                      {item?.sla}
                    </Text>

                  </View> */}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const _renderSelectedItem= (item, index)=>{
    return (
      <TouchableOpacity   onPress={() => onPressAvailableCar(item)} style={[
        {
            // marginVertical:10,
            borderRadius:15,
            marginBottom:20,
            marginHorizontal:20,
            borderRadius:15,
            backgroundColor:"#E7F2F9",
          }, 
          (Platform.OS=="ios")&&
          {
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }, 
          (Platform.OS=="android")&&{
            elevation:10
          }
        ]}>
        {/* <AnimatedListItem height={130} duration={100} style={{height:130}}> */}
    
          
            <View
              style={{
                opacity: 1,
                padding:10,
                alignContent:"space-between",
                
              }}>
              <View style={{flexDirection:"row",  alignItems:"center"}}>
                <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center", marginRight:15}}>
                 
                  <Image
                    resizeMode={'contain'}
                    style={[{height: 130, width: 120, borderRadius:15, marginTop:-5}, 
                      
                    ]}
                    source={{
                      uri: getImageUrl(
                        item?.media[0]?.image?.path?.proxy_url,
                        item?.media[0]?.image?.path?.image_path,
                        '150/150',
                      ),
                    }}
                  />
                </View>
                <View style={{flex:1,  marginRight:5,}}>

                  <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:-11}}>

                    <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(18),
                                  },
                                ]
                          }>
                          {item?.translation[0]?.title}
                    </Text>
                    <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(14),  
                                  },
                                ]}>
                          {`${currencies?.primary_currency?.symbol} ${Number(
                            item.tags_price,
                          ).toFixed(2)}`}
                    </Text>

                  </View>
                  <View style={{justifyContent:"flex-end", marginTop:4}}>
                  <View style={{ flexDirection:"row", alignItems:"center",  marginRight:10}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 13, width: 13}}
                          source={imagePath.cubeBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.dimensions}
                      </Text> 
                      {/* H 20cm * W 20cm * L 20cm */}
                  </View>
                  <View style={{ flexDirection:"row", marginTop:5, marginRight:10,alignItems:"center",}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 11, width: 11, }}
                          source={imagePath.bucketBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.weight_description}
                      </Text>
                      {/* 1 - 5 kgs */}
                  </View>
                  <View style={{ flexDirection:"row", marginTop:5, marginRight:10,alignItems:"center",}}>
                      <View style={{ width:23, height:23, borderRadius:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.white, alignSelf:"center"}}>
                        <Image
                          resizeMode={'contain'}
                          style={{height: 13, width: 13, }}
                          source={imagePath.clockBlueIcon}
                          />
                      </View>
                      <Text
                          numberOfLines={1}
                          style={[
                                  styles.carType,
                                  {
                                    color: colors.blackC,
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(8),  
                                    marginLeft:5
                                  },
                                ]}>
                          {item?.sla}
                      </Text>
                      {/* 24 - 48 hrs */}
                  </View>
                </View>
                </View>
                
              </View> 
            </View>


        {/* </AnimatedListItem> */}
      </TouchableOpacity>
    );
  }
  const _listEmptyComponent = () => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              // height: height / 4,
              marginVertical: moderateScaleVertical(20),
            }}>
            {[1, 2, 3, 4].map((i, inx) => {
              return (
                <View key={inx}>
                  <ListEmptyCar isLoading={isLoading} />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              height: height / 3.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.noCarsAvailable}>{'Sorry Service not available'}</Text>
          </View>
        )}
      </>
    );
  };

  const checkIfSelected=({item, index})=>{
    if(selectedCarOption?.id == item?.id){
      
      return _renderSelectedItem(item, index)
    }
    else{
      return _renderItem(item, index)
    }
  }

  return (
    <View
      style={
        isDarkMode
          ? [
              styles.bottomView,
              {backgroundColor: MyDarkTheme.colors.background},
            ]
          : [
              styles.bottomView,
              {
                borderTopLeftRadius: moderateScale(0),
                borderTopRightRadius: moderateScale(0),
                height: height / 1.7,
                borderTopStartRadius:25,
                borderTopEndRadius:25
              },
            ]
      }>
      <View style={{width:"100%", height:"100%"}}>
        <View
          style={
      
            availableCarList.length 
              ? {padding: moderateScale(0)}
              : {padding: moderateScale(20)}
          }
          >
          {/* <Text style={styles.addressMainTitle}>{addressLabel}</Text> */}

          <View
            style={{
              width: moderateScale(40),
              height: moderateScaleVertical(2),
              backgroundColor: colors.textGreyJ,
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}></View>

          {/* <Text
            style={
              isDarkMode
                ? [styles.chooseSuitable, {color: MyDarkTheme.colors.text}]
                : styles.chooseSuitable
            }>
            {strings.CHOSSESUITABLECAR}
          </Text> */}
          
            <View style={{ flexDirection:"row", justifyContent:"space-between",marginHorizontal:40}}>
              {availableVendors.length > 1 ? (
                <>
                  {availableVendors.map((i, inx) => {
                    return (
                      <View style={{flex:0.47, alignItems:"center", justifyContent:"center"}}> 
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => onPressAvailableVendor(i)}
                          style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                            width:'80%',
                            // borderRadius:15,
                            borderColor:colors.focusBackGround,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor:
                            //   selectedVendorOption?.id == i?.id
                            //     ? colors.focusBackGround
                            //     : 'transparent',
                            //     borderWidth:1,
                            borderBottomWidth:
                              selectedVendorOption?.id == i?.id ? 3 : 0,
                          }}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.carType2,
                              {
                                color:
                                  selectedVendorOption?.id == i?.id
                                    ?colors.blackC
                                    : colors.blackC,
                                fontSize: textScale(13),
                                fontFamily: fontFamily.bold,
                              },
                            ]}>
                            {i.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </>
              ) : null}
            </View>
            
            <ScrollView style={{ height:height/1.7-120}} contentContainerStyle={{flex:1,  marginTop:20,}}>
              <FlatList
                data={availableCarList}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={{
                  // height:height/2-150,
                  marginVertical: isLoading
                    ? moderateScaleVertical(10)
                    : availableVendors.length == 1
                    ? moderateScaleVertical(10)
                    : moderateScaleVertical(10),
                  // height: isLoading
                  //   ? height / 2
                  //   : availableVendors.length == 1
                  //   ? height / 2
                  //   : height / 2,
                  // marginTop: moderateScaleVertical(10),
                }}

                keyExtractor={(item, index) => String(index)}
                renderItem={checkIfSelected}
                ListEmptyComponent={_listEmptyComponent}
              />
            </ScrollView>


         
          
        </View>
        {availableCarList.length ? (
              <View style={{width:'100%', position:'absolute',bottom:0}}>
              <View
                style={{
                  
                  // alignSelf:"flex-end",
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // marginHorizontal: 20,
                  marginHorizontal:20,
                  marginVertical:Platform.OS=="ios"? 20:10
                  // opacity:selectedCarOption?.variant[0]?.price > 0?1:0.5,
                  
                }}>
                <GradientButton
                  // endcolor={{x: 0.0, y: 0.25}}
                  // startcolor={{x: 0.0, y: 0.0}}
                  colorsArray={[
                    selectedCarOption?.variant[0]?.price > 0?colors.focusBackGround:colors.lightGreyBgColor,
                    selectedCarOption?.variant[0]?.price > 0?colors.focusBackGround:colors.lightGreyBgColor,
                  ]}
                  textStyle={{textTransform: 'none', fontSize: textScale(14)}}
                  onPress={
                    selectedCarOption?.variant[0]?.price > 0
                      ?  onPressPickUpNow
                      : () => {}
                  }
                  btnText={
                    selectedCarOption?.variant[0]?.price > 0
                      ? strings.BOOK_NOW
                      : strings.SELECT_SHIPMENT_TYPE
                  }
                  containerStyle={{flex: 1}}
                  disabled={selectedCarOption?.variant[0]?.price > 0?false:true}
                />
                {/* <TouchableOpacity
                  style={{
                    flex: 0.14,
                    borderRadius: moderateScaleVertical(15),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: themeColors.primary_color,
                    marginLeft:10
                  }}
                  onPress={onPressPickUplater}>
                  <Image
                    source={imagePath.calendarA}
                    style={{
                      tintColor: themeColors.primary_color,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity> */}
              </View>
              </View>
        ) : null}
      </View>
    


    </View>
  );
}
