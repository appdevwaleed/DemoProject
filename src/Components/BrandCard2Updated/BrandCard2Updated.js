import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View, Appearance} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../../utils/helperFunctions';

export default function BrandCard2Updated({data = {}, onPress = () => {}}) {
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const colorScheme = Appearance.getColorScheme();
  let darkthemeusingDevice;

  if (colorScheme === 'dark') {
  darkthemeusingDevice =true
  }
  else{
    darkthemeusingDevice =false
  }
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const scaleInAnimated = new Animated.Value(0);
  const {appStyle, themeColors} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});


  const imageURI = data?.icon
    ? getImageUrl(data.icon.image_fit, data.icon.image_path, '400/400')
    : getImageUrl(data.image.proxy_url, data.image.image_path, '40/40');

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View style={{width:'33%', alignItems:"center", minWidth:110, }}>
        <View style={styles.imgContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          onPressIn={() => pressInAnimation(scaleInAnimated)}
          onPressOut={() => pressOutAnimation(scaleInAnimated)}
          style={{
            height: moderateScale(100),
            // width: moderateScale(100),
            width:'100%', 
            // height:'100%',
            // paddingVertical: moderateScaleVertical(30),
            borderRadius: moderateScale(20),
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            backgroundColor: colors.white
          }}>

              {/* <View style={{backgroundColor:colors.white, width:'100%', height:'100%', borderRadius:10}}>
  
              </View> */}
          {isSVG ? (
            <SvgUri
              height={'100%'}
              width={'100%'}
              uri={imageURI}
              style={
                {
                  // ...styles.imgStyle,
                  // backgroundColor: isDarkMode
                  //   ? colors.whiteOpacity15
                  //   : colors.greyColor,
                }
              }
            />
          ) : (
            <FastImage
              source={{uri: imageURI, priority: FastImage.priority.high}}
              style={{
                ...styles.imgStyle,
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
            />
          )}
        </TouchableOpacity>
        <View style={{width:"100%", height:50, alignItems:"center", justifyContent:"flex-start"}}>
          <Text
              numberOfLines={2}
              style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.normal,
                fontSize: textScale(12),
                textAlign: 'center',
                marginTop: moderateScaleVertical(10),
                marginBottom:moderateScaleVertical(5),

              }}>
              {data?.name ? data?.name : data?.translation[0]?.title}
            </Text>
        </View>
        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  imgContainer: {

    width: '95%',
    alignSelf:"center",
    alignItems:"center",
    // backgroundColor:colors.blue
    
  },
  imgStyle: {
    height:'95%',
    width:'95%',
    borderRadius: moderateScale(15),
  },
});
