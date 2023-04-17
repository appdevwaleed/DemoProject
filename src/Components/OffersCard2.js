import React from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {useDarkMode} from 'react-native-dark-mode';

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import ProgressiveImage from './ProgressiveImage';
import moment from 'moment';
import {MyDarkTheme} from '../styles/theme';

export default function OffersCard2({data = {}, onPress = () => {}}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  //console.log(data, 'dataaa');
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        marginHorizontal: moderateScale(16),
        borderRadius: 3,
        borderWidth: 1.4,
        borderColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.borderColorNew,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
      }}>
      {/* <ProgressiveImage
        source={{
          uri: getImageUrl(
            data?.image?.proxy_url,
            data?.image?.image_path,
            '600/400',
          ),
        }}
        borderRadius={0}
        height={moderateScaleVertical(169)}
        borderStyle={{borderTopLeftRadius: 4, borderTopRightRadius: 4}}
        width={'100%'}
      /> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScaleVertical(16),
        }}>
        <View
          style={{
            borderStyle: 'dashed',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: colors.redC,
            padding: moderateScale(3),
            backgroundColor: colors.redOpacity12,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(12),
              color: colors.redC,
              alignSelf: 'center',
              fontFamily: fontFamily.medium,
            }}>
            {' '}
            {`${strings.COUPON} ${data?.name}`}
          </Text>
        </View>
        <View>
          <Text
            style={{
              ...commonStyles.futuraHeavyBt,
              color: colors.redC,
              opacity: 1,
              fontSize: textScale(12),
              textTransform: 'uppercase',
              fontFamily: fontFamily.medium,
            }}>
            {' '}
            {strings.APPLYSMALL}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScaleVertical(6),
        }}>
        <Text
          numberOfLines={1}
          style={{
            ...commonStyles.futuraHeavyBt,
            fontSize: textScale(16),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {data?.title}
        </Text>
        <Text
          style={{
            marginVertical: moderateScaleVertical(16),
            fontSize: textScale(10),

            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyNew,
          }}>
          {strings.EXPIRES}
          {'  '}
          {`${moment(data?.expiry_date).format('DD MMM,YYYY')} ${moment(
            data?.expiry_date,
          ).format('LT')} `}
        </Text>
        {/* <Text
          numberOfLines={1}
          style={{
            ...commonStyles.mediumFont14,
            opacity: 0.5,
            marginTop: moderateScaleVertical(5),
          }}>
          {`${strings.COUPON} ${data?.name}`}
        </Text> */}
        {/* <View
          style={{
            flexDirection: 'row',
            marginTop: moderateScaleVertical(7),
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...commonStyles.futuraHeavyBt,
              color: themeColors.primary_color,
              opacity: 1,
            }}>
            {strings.APPLYSMALL}
          </Text>
         
        </View> */}
      </View>
    </TouchableOpacity>
  );
}
