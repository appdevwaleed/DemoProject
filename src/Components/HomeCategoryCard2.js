import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function HomeCategoryCard2({
  data = {},
  onPress = () => {},
  isLoading = false,
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
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        // width: (width - moderateScale(16)) / 4,
        marginVertical: moderateScale(0),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flex: 0.8,
          backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
          borderRadius: moderateScale(30),
          width: moderateScale(60),
          height: moderateScale(60),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(50)}
            width={moderateScale(50)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            style={{
              height: moderateScale(50),
              width: moderateScale(50),
              borderRadius: moderateScale(25),
            }}
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={{flex: 0.2}}>
        <Text
          numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.regular,
            fontSize: textScale(9),
            textAlign: 'center',
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
