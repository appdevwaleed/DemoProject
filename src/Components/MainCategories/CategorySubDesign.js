import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../../styles/colors';
import {moderateScale, textScale, width} from '../../styles/responsiveSize';
import {getImageUrl} from '../../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import LinearGradient from "react-native-linear-gradient";
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function CategorySubDesign({
  data = {},
  onPress = () => {},
  isLoading = false,
  itemIndex=null,
  itemDisabled=false
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '200/200',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;
  return (
    <TouchableOpacity
        disabled={itemDisabled}
      onPress={onPress}
      activeOpacity={1}
      style={[{
        // width: (width - moderateScale(16)) / 4,
        // marginVertical: moderateScale(0),
        justifyContent: 'center',
        alignItems: 'center',
        // opacity:data?.is_enabled!==1?0.3:1,
        backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.lightbrown,
        borderRadius: moderateScale(20),
        width: '100%',
        height: moderateScale(170),
        // data?.is_enabled==1&&...{}
   
      }, 
      (data?.is_enabled==1&&Platform.OS=="ios")&&{

          shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      }, 
      (data?.is_enabled==1&&Platform.OS=="android")&&{
        elevation:10
      }
      ]}>
    <View style={{width:'100%', height:"100%"}}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          // backgroundColor:"blue",
          top:0, left:0, right:0, bottom:0,
          justifyContent: "center",
          alignItems: 'center',
        }}>
        <Text
            numberOfLines={1}
            style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.bold,
                fontSize: textScale(14),
                textAlign: 'center',
                marginVertical:10,
                opacity:data?.is_enabled!==1?0.3:1,
            }}>
            {data.name}
        </Text>
        {isSVG ? (
          <SvgUri
            height={moderateScale(70)}
            width={moderateScale(70)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            style={{
              opacity:data?.is_enabled!==1?0.4:1,
              height: moderateScale(70),
              width: moderateScale(70),
              marginBottom:!data?.is_enabled?30:20,
              marginTop:!data?.is_enabled?0:10,
            //   borderRadius: moderateScale(25),
            }}
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
          />
        )}

        
        
      </View>

      
      {/* {itemDisabled&&
        <View style={{backgroundColor:colors.MAINRBGA, width:'100%', height:30, alignSelf:"flex-end", justifyContent:"center", borderBottomEndRadius: moderateScale(20),borderBottomLeftRadius:moderateScale(20)}}>
                <Text
                    numberOfLines={1}
                    style={{
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                        fontSize: textScale(10),
                        textAlign: 'center',
                        lineHeight: 22,
                        fontFamily: fontFamily.normal,
                    }}>
                    coming soon
                </Text>
        </View>
        } */}
  
    </View>
    {!data?.is_enabled&&
    <>
      <LinearGradient 
            useAngle={true}
            angleCenter={{x:0.6,y:0.4}}
            // angle= {10}
            colors={['#00396D' ,'#006DD1' ]}
            style={{
            width: 120,
            height: 70,
            // backgroundColor: "transparent",
            // borderStyle: "solid",
            // borderRightWidth: 120,
            // borderTopWidth: 70,
            // borderRightColor: "transparent",
            // borderTopLeftRadius: moderateScale(20),
            // borderTopColor: "#006DD1",
            // borderLeftWidth: 120,

            // borderBottomWidth: 70,
            // borderLeftColor: "transparent",
            // borderBottomColor: "#00396D",
            // borderTopColor: "#006DD1",
            // transform: [{ rotate: "180deg" }],
            borderBottomRightRadius: moderateScale(20),
            alignSelf:"flex-end", 
            justifyContent:"center",
            // marginTop:-70
            position:"absolute",
            bottom:0,
            backgroundColor:"blue",
            zIndex:-1000,
            
            // opacity:data?.is_enabled!==1?0.3:1,
          }}>
            <View style={{
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderRightWidth: 120,
                borderTopWidth: 70,
                borderRightColor: "transparent",
                borderTopColor: colors.lightbrown,
            }}>

            </View>
            
      </LinearGradient>
      <Text style={{position:"absolute", bottom:5, right:5, maxWidth:60, height:30, fontSize:10,left:'65%', color:Colors.white, fontFamily:fontFamily.bold,   opacity:data?.is_enabled!==1?0.5:1,}}>Coming Soon...</Text>
    </>
    }

{/* <View 
          
        style={{
          width: 0,
          height: 0,
          // backgroundColor: "transparent",
          // borderStyle: "solid",
          // borderRightWidth: 120,
          // borderTopWidth: 70,
          // borderRightColor: "transparent",
          // borderTopLeftRadius: moderateScale(20),
          // borderTopColor: "#006DD1",
          borderLeftWidth: 120,

          borderBottomWidth: 70,
          borderLeftColor: "transparent",
          borderBottomColor: "#00396D",
          borderTopColor: "#006DD1",
          // transform: [{ rotate: "180deg" }],
          borderBottomRightRadius: moderateScale(20),
          alignSelf:"flex-end", 
          justifyContent:"center",
          // marginTop:-70
          position:"absolute",
          bottom:0,
          // zIndex:-1000
          
        }}>

          <Text styles={{color:'white'}}>asdsadsad</Text>
        </View> */}


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
