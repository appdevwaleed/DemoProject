import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View, Appearance} from 'react-native';
//import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

export default function BrandCard2({data = {}, onPress = () => {}}) {
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const colorScheme = Appearance.getColorScheme();
  let darkthemeusingDevice;
  if (colorScheme === 'dark') {
  // Use dark color scheme
  darkthemeusingDevice =true
  }else{
    darkthemeusingDevice =false
  }
  //const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const scaleInAnimated = new Animated.Value(0);
  const {appStyle, themeColors} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  // console.log("svg data",data)

  const imageURI = data?.icon
    ? getImageUrl(data.icon.image_fit, data.icon.image_path, '400/400')
    : getImageUrl(data.image.proxy_url, data.image.image_path, '40/40');

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View style={styles.imgContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          height: moderateScale(80),
          // paddingVertical: moderateScaleVertical(30),
          borderRadius: moderateScale(10),
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red'
        }}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(80)}
            width={moderateScale(96)}
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

      <Text
        style={{
          color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
          fontFamily: fontFamily.regular,
          fontSize: textScale(10),
          textAlign: 'center',
          marginTop: moderateScaleVertical(2),
        }}>
        {data?.name ? data?.name : data?.translation[0]?.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    // flex: 1,
    marginRight: '3%',
    width: '31%',
  },
  imgStyle: {
    height: moderateScale(80),
    width: '100%',
    borderRadius: moderateScale(10),
  },
});
