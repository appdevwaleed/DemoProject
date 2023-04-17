import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import ScaledImage from 'react-native-scalable-image';
import {useNavigation} from '@react-navigation/native';

export default function DashBoardHeaderFive({
  location = [],
  isLoading = false,
}) {
  console.log("Home - DashBoardHeaderFive.js")
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  if (isLoading) {
    return (
      <HeaderLoader
        rectHeightLeft={moderateScaleVertical(20)}
        heightLeft={moderateScaleVertical(20)}
        heightRight={moderateScaleVertical(20)}
        rectHeightRight={moderateScaleVertical(20)}
        isRight
        viewStyles={{marginVertical: moderateScaleVertical(10)}}
      />
    );
  }

  return (
    <>
      <View
        style={{
          ...styles.headerContainer,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.borderColorD,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
          }}>
          {!!(profileInfo && profileInfo?.logo) ? (
            <ScaledImage
              width={width / 6}
              height={moderateScaleVertical(50)}  
              resizeMode="contain"
              source={
                profileInfo && profileInfo?.logo
                  ? {
                      uri: getImageUrl(
                        profileInfo.logo.image_fit,
                        profileInfo.logo.image_path,
                        '1000/1000',
                      ),
                    }
                  : imagePath.logo
              }
            />
          ) : null}
          {!!appData?.profile?.preferences?.is_hyperlocal && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate(navigationStrings.LOCATION, {
                  type: 'Home1',
                })
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 0.85,
                marginLeft: moderateScale(8),
              }}>
              <Image
                style={styles.locationIcon}
                source={imagePath.redLocation}
                resizeMode="contain"
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.locationTxt,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {location?.address}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{marginHorizontal: moderateScale(8)}}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <Image
            style={{tintColor: themeColors.primary_color}}
            source={imagePath.search1}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
