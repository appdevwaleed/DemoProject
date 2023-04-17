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
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  StatusBarHeight,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';

const Header3 = ({
  leftIcon = imagePath.back,
  location = [],
  centerTitle,
  textStyle,
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
}) => {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: StatusBarHeight,
        paddingHorizontal: moderateScale(15),
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          source={leftIcon}
          style={{
            tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}
        />
      </TouchableOpacity>
      {!!appData?.profile?.preferences?.is_hyperlocal && (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: moderateScale(15),
          }}
          onPress={() =>
            navigation.navigate(navigationStrings.LOCATION, {
              type: 'Home1',
            })
          }>
          <Image source={imagePath.redLocation} />
          <Text
            numberOfLines={1}
            style={{
              paddingLeft: 5,
              // height:20,
              lineHeight: 20,
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
              fontSize: textScale(10),
              width: '70%',
            }}>
            {location?.address}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default Header3;

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({});
  return styles;
}
