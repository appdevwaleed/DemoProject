import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import colors from '../styles/colors';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

export default function SearchBar2({
  navigation,
  placeHolderTxt = strings.SEARCH_HERE,
}) {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.mainContainer,
        backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
      }}
      onPress={() =>
        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
      }>
      <View style={{flex: 1}}>
        <Text style={styles.placeHolderTxt}>{placeHolderTxt}</Text>
      </View>
      <Image source={imagePath.search1} />
    </TouchableOpacity>
  );
}

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      backgroundColor: colors.grey2,
      borderRadius: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginHorizontal: moderateScale(15),
      marginVertical: moderateScale(13),
      paddingVertical: moderateScaleVertical(15),
    },
    placeHolderTxt: {
      fontFamily: fontFamily.regular,
      color: colors.textGreyB,
      textAlign: 'left',
    },
  });
  return styles;
}
