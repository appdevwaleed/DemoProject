import React from 'react';
import {Text, View, SafeAreaView, Image} from 'react-native';
import CardLoader from '../../Components/Loaders/CardLoader';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';

import stylesFun from './styles';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  scale,
  width,
} from '../../styles/responsiveSize';
import strings from '../../constants/lang';
import colors from '../../styles/colors';

export default function ListEmptyOffers({isLoading = false}) {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  if (isLoading) {
    return (
      <CardLoader
        cardWidth={width - moderateScale(32)}
        height={moderateScaleVertical(209)}
        listSize={5}
        containerStyle={{marginLeft: moderateScale(16)}}
      />
    );
  }
  return (
    <SafeAreaView>
      <View style={styles.containerStyle}>
        <Image source={imagePath.noOffers} style={{marginTop: height / 4 - 30}} />
        <Text style={{ marginTop: scale(20), color: colors.textGreyOpcaity7, fontFamily: styles.textStyle.fontFamily }}>{strings.NOOFFERS_FOUND}</Text>
      </View>
    </SafeAreaView>
  );
}
