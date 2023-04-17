import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function TaxiHomeCategoryCard({
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
        // shadowOpacity: 0.5,
        width: (width - moderateScale(-5)) / 4,
        marginVertical: moderateScale(10),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: moderateScale(90),
      }}>
      {imageURI ? (
        <View
          style={{
            flex: 0.8,
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.taxiCategoryGrayColor.substr(1),
              30,
            ),
            paddingHorizontal: moderateScale(8),
            borderRadius: 10,
          }}>
          {isSVG ? (
            <View style={{height: moderateScale(50), width: moderateScale(50)}}>
              <SvgUri
                height={moderateScale(50)}
                width={moderateScale(50)}
                uri={imageURI}
              />
            </View>
          ) : (
            <FastImage
              style={{
                height: moderateScale(width / 8),
                width: moderateScale(width / 8),
                borderRadius: moderateScale(10),
              }}
              source={{
                uri: imageURI,
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          flex: 0.5,
        }}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily.regular,
            marginTop: moderateScaleVertical(8),
            fontSize: textScale(10),
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
