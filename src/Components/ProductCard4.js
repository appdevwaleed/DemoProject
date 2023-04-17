import React from 'react';
import {Animated, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {transparentProductImage} from '../constants/constants';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function ProductCard4({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const {themeColors, themeLayouts} = currentTheme;
  const commonStyles = commonStylesFunc({fontFamily});
  const cardWidthNew = cardWidth ? cardWidth : width * 0.5 - 21.5;
  const url1 = data?.media[0]?.image?.path.proxy_url;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = getImageUrl(url1, url2, '500/500');
  const productPrice =
    data?.variant[0]?.price *
    (data?.variant[0]?.multiplier ? data?.variant[0]?.multiplier : 1);
  const scaleInAnimated = new Animated.Value(0);
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: moderateScale(16),
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <FastImage
            source={{
              uri: url1 && url2 ? getImage : '',
              priority: FastImage.priority.high,
            }}
            style={{
              height: moderateScale(73),
              width: moderateScale(72),
              borderRadius: 10,
              // marginHorizontal: ,
              alignSelf: 'center',
            }}
            resizeMode="cover"
          />
          <View
            style={{
              // height: 30,
              marginHorizontal: moderateScale(16),
              marginTop: moderateScale(6),
              width: width - moderateScale(180),
            }}>
            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.futuraBtHeavyFont16,
                textAlign: 'left',
                // marginTop: moderateScaleVertical(10),
                color: isDarkMode ? MyDarkTheme.colors.text : '#2A2E36',
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
              }}>
              {data?.translation[0]?.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.futuraBtHeavyFont14,

                // marginTop: 3,
                color: isDarkMode ? MyDarkTheme.colors.text : '#8B8B8B',
                textAlign: 'left',
                marginTop: moderateScale(8),
                fontSize: textScale(13),
                fontFamily: fontFamily.medium,
              }}>
              {`${currencies?.primary_currency?.symbol}${(
                Number(data?.variant[0]?.multiplier) *
                Number(data?.variant[0]?.price)
              ).toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
      {/* <View
        style={{
          height: moderateScale(30),
          width: moderateScale(30),
          borderRadius: moderateScale(15),
          backgroundColor: '#E8E8E8',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={imagePath.add}
          style={{
            tintColor: colors.white,
          }}
        />
      </View> */}
    </TouchableOpacity>
  );
}
