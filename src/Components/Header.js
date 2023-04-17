import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  StatusBarHeight,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import strings from '../constants/lang';

const Header = ({
  leftIcon = imagePath.back,
  centerTitle,
  textStyle = {},
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  customRight,
  hideRight = true,
  headerStyle,
  noLeftIcon = false,
  rightViewStyle = {},
  customLeft,
  rightIconStyle = {},
  showImageAlongwithTitle = false,
  imageAlongwithTitle = imagePath.dropDownSingle,
  imageAlongwithTitleStyle = {tintColor: colors.black},
  onPressImageAlongwithTitle,
  onPressCenterTitle,
  leftIconStyle,
  isRightText = false,
  onPressRightTxt = () => {},
}) => {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          ...headerStyle,
          ...styles.headerStyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 0.2,
            ...rightViewStyle,
          }}>
          {!noLeftIcon &&
            (customLeft ? (
              customLeft()
            ) : (
              <TouchableOpacity
                hitSlop={{
                  top: 50,
                  right: 50,
                  left: 50,
                  bottom: 50,
                }}
                activeOpacity={0.7}
                onPress={
                  !!onPressLeft
                    ? onPressLeft
                    : () => {
                        navigation.goBack();
                      }
                }>
                <Image
                  resizeMode="contain"
                  source={leftIcon}
                  style={
                    isDarkMode
                      ? {
                          transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                          ...leftIconStyle,
                          tintColor: MyDarkTheme.colors.text,
                        }
                      : {
                          transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                          ...leftIconStyle,
                        }
                  }
                />
              </TouchableOpacity>
            ))}
        </View>
        <View
          style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              onPress={onPressCenterTitle}
              numberOfLines={1}
              style={
                isDarkMode
                  ? {
                      ...styles.textStyle,
                      ...textStyle,
                      color: MyDarkTheme.colors.text,
                      // width: moderateScale(150),
                    }
                  : {
                      ...styles.textStyle,
                      ...textStyle,
                      // width: moderateScale(150),
                    }
              }>
              {centerTitle}
            </Text>
            {!!showImageAlongwithTitle && (
              <TouchableOpacity onPress={onPressImageAlongwithTitle}>
                <Image
                  style={imageAlongwithTitleStyle}
                  source={imageAlongwithTitle}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
          {isRightText ? (
            <TouchableOpacity activeOpacity={0.7} onPress={onPressRightTxt}>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: themeColors.primary_color,
                  fontSize: textScale(12),
                }}>
                {strings.CLEAR_BASKET}
              </Text>
            </TouchableOpacity>
          ) : !!rightIcon ? (
            <TouchableOpacity onPress={onPressRight}>
              <Image
                style={
                  isDarkMode
                    ? {
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                        ...leftIconStyle,
                        tintColor: MyDarkTheme.colors.text,
                      }
                    : rightIconStyle
                }
                source={rightIcon}
              />
            </TouchableOpacity>
          ) : !!customRight ? (
            customRight()
          ) : hideRight ? (
            <View style={{width: 25}} />
          ) : (
            <Image source={imagePath.cartShop} />
          )}
        </View>
      </View>
    </>
  );
};
export default Header;

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(16),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(16),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
}
