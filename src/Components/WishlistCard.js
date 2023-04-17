//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import {getImageUrl} from '../utils/helperFunctions';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import imagePath from '../constants/imagePath';
import commonStyles from '../styles/commonStyles';
import {MyDarkTheme} from '../styles/theme';
import strings from '../constants/lang';

const WishlistCard = ({data, onPress}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const url1 = data?.media[0]?.image?.path.proxy_url;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = getImageUrl(url1, url2, '500/500');

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? colors.whiteOpacity15
          : colors.blackOpacity05,
      }}
      onPress={onPress}
      activeOpacity={0.8}>
      <FastImage
        source={{
          uri: getImage,
          priority: FastImage.priority.high,
        }}
        style={{
          height: 80,
          width: 80,
          borderRadius: 10,
          // marginHorizontal: ,
          alignSelf: 'center',
        }}
        resizeMode="cover"
      />
      <View style={{flex: 1, marginLeft: moderateScale(8)}}>
        <Text
          numberOfLines={1}
          style={{
            ...styles.nameText,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {data?.translation[0]?.title}
        </Text>
        <Text
          style={{
            ...styles.inTextStyle,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity43,
          }}>
          {strings.IN}{' '}
          {!!data?.category?.category_detail?.translation &&
            data?.category?.category_detail?.translation[0]?.name}
        </Text>
        <View style={{}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...styles.nameText,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
                fontSize: textScale(11),
              }}>{`${currencies?.primary_currency?.symbol}${(
              Number(data?.variant[0]?.multiplier) *
              Number(data?.variant[0]?.price)
            ).toFixed(2)}`}</Text>
            {data?.averageRating && (
              <View style={styles.ratingView}>
                <Text style={styles.ratingTxt}>
                  {Number(data?.averageRating).toFixed(1)}
                </Text>
                <FastImage
                  style={{
                    marginLeft: 2,
                    width: 9,
                    height: 9,
                  }}
                  source={{
                    uri: Image.resolveAssetSource(imagePath.icStar3).uri,
                  }}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(6),
    padding: moderateScale(8),
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: moderateScale(4),
    paddingVertical: moderateScale(2),
    paddingHorizontal: moderateScale(4),
  },
  ratingTxt: {
    color: colors.white,
    fontSize: textScale(9),
    fontFamily: fontFamily.medium,
    textAlign: 'left',
  },
  nameText: {
    color: colors.white,
    fontSize: textScale(13),
    fontFamily: fontFamily.medium,
    textAlign: 'left',
  },
  commTextStyle: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontFamily.medium,
    textAlign: 'left',
  },
  inTextStyle: {
    fontFamily: fontFamily.regular,
    fontSize: textScale(9),
    textAlign: 'left',
  },
});

//make this component available to the app
export default WishlistCard;
