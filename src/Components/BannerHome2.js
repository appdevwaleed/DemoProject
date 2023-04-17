import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import colors from '../styles/colors';
import { moderateScale, width } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';

const BannerHome2 = ({
  imagestyle = {},
  bannerData = [],
  bannerRef,
  sliderWidth = width - 20,
  itemWidth = width - 20,
  resizeMode = 'cover',
  setActiveState = () => { },
  onPress = () => { },
  childView = null,
  carouselViewStyle = {},
  isDarkMode = false
}) => {

  const setSnapState = (index) => {
    setActiveState(index);
  };

  const bannerDataImages = ({ item, index }) => {
    const imageUrl = item?.image?.path
      ? getImageUrl(
        item.image.path.image_fit,
        item.image.path.image_path,
        '900/700',
      )
      : getImageUrl(item.image.image_fit, item.image.image_path, '900/700');

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.imageStyle, imagestyle]}
        onPress={() => onPress(item)}>
        <FastImage
          source={{ uri: imageUrl }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyColor,
          }}
        >
          {childView}
        </FastImage>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        height: width * 0.4,
        borderRadius: moderateScale(25),
        ...carouselViewStyle,
      }}>
      <Carousel
        ref={bannerRef}
        data={bannerData}
        renderItem={bannerDataImages}
        autoplay={true}
        loop={true}
        autoplayInterval={3000}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={(index) => setSnapState(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: moderateScale(15),
    overflow: 'hidden',
    marginRight: moderateScale(10),
  },
});

export default BannerHome2;
