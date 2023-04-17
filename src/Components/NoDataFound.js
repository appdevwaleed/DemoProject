import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import commonStylesFunc from '../styles/commonStyles';
import {textScale} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import colors from '../styles/colors';

export default function NoDataFound({
  isLoading = false,
  containerStyle = {},
  text = strings.NODATAFOUND,
  textStyle = {},
}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  if (!isLoading) {
    const styles = stylesData();
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.containerStyle, containerStyle]}>
          <Image source={imagePath.noDataFound2} />
          <Text
            style={{
              ...styles.textStyle,
              ...textStyle,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            }}>
            {text}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return null;
}
export function stylesData(params) {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});

  const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginVertical: moderateScaleVertical(height / 4),
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
  });
  return styles;
}
