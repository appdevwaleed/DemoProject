import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
//import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import BlurImages from './BlurImages';
import HtmlViewComp from './HtmlViewComp';

export default function ProductCard3({
  data = {},
  onPress = () => { },
  addToCart = () => { },
  index,
  onIncrement,
  onDecrement,
  selectedItemID,
  Servicetype,
  isVisibleModal,
  selectedItemIndx,
  btnLoader,
  categoryInfo = '',
}) {
  // data['qty'] = 1
  const [state, setState] = useState({
    selectedIndex: -1,
    selectedIndexForCartIcon: -1,
  });
  const { selectedIndex, selectedIndexForCartIcon } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({ themeColors, fontFamily });

  const { themeLayouts } = currentTheme;
  const commonStyles = commonStylesFunc({ fontFamily });

  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = (quality) => getImageUrl(url1, url2, quality);

  const scaleInAnimated = new Animated.Value(0);

  const changePosition = () => {
    let i = selectedIndex == -1 ? index : -1;
    updateState({ selectedIndex: i });
  };

  const changePositionForCartIcon = () => {
    let i = selectedIndexForCartIcon == -1 ? index : -1;
    updateState({ selectedIndexForCartIcon: i });
  };

  let htmlText = data?.translation[0]?.body_html || null;

  let typeId = data?.category?.category_detail?.type_id;

  return (
    <Animatable.View
      // animation={index > 8 ? '' : 'fadeInUp'}
      // delay={index > 8 ? 1 * 100 : index * 10}
      pointerEvents={btnLoader ? 'none' : 'auto'}>
      <TouchableOpacity
        // disabled
        activeOpacity={0.6}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          borderRadius: 10,
          flexDirection: selectedIndex == index ? 'column' : 'row',
          justifyContent: 'space-between',
          marginVertical: moderateScaleVertical(10),
          paddingHorizontal: 16,
        }}>
        <Animatable.View
          key={selectedIndex}
          animation={selectedIndex == index ? 'slideInLeft' : 'slideInRight'}
          duration={100}>
          <TouchableOpacity
            disabled
            onPress={changePosition}
            activeOpacity={1}
            style={{
              ...commonStyles.shadowStyle,
              margin: 2,
              borderRadius: moderateScale(15),
              height: moderateScale(100),
              width: moderateScale(100),
            }}>
            <FastImage
              style={{
                ...styles.imgStyle,
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
              source={{ uri: getImage('800/400') }}
            />
          </TouchableOpacity>
        </Animatable.View>

        <View
          style={{
            marginLeft: moderateScale(10),
            overflow: 'hidden',
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 1,
            // alignItems: 'center',
          }}>
          <Animatable.View
            key={selectedIndex}
            style={{
              flex: 1,
              marginTop: selectedIndex == index ? moderateScaleVertical(8) : 0,
            }}
          // animation={selectedIndex == index ? 'fadeInDown' : 'fadeInLeft'}
          >
            {/* Title View */}
            <View>
              <Text
                // numberOfLines={1}
                style={{
                  ...commonStyles.futuraBtHeavyFont14,
                  width: moderateScaleVertical(220),
                  // fontFamily: 'Eina02-SemiBold',
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                  width: width / 2.5,
                  // flex:1
                }}>
                {data?.translation[0]?.title}
              </Text>
              {!!data?.category?.category_detail?.translation && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.inTextStyle,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity40,
                  }}>
                  {strings.IN}
                  {` ${data?.category?.category_detail?.translation[0]?.name}`}
                </Text>
              )}
               {!!data?.vendor_name && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.inTextStyle,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity40,
                  }}>
                  {strings.FROM}
                  {` ${data?.vendor_name}`}
                </Text>
              )}
            </View>

            {/* rating View */}
            {!!data?.averageRating && (
              <View
                style={{
                  borderWidth: 0.5,
                  alignSelf: 'flex-start',
                  padding: 2,
                  borderRadius: 2,
                  marginVertical: moderateScaleVertical(4),
                  borderColor: colors.yellowB,
                  backgroundColor: colors.yellowOpacity10,
                }}>
                {/* <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={Number(data?.averageRating).toFixed(1)}
                  fullStarColor={colors.yellowB}
                  starSize={8}
                  containerStyle={{ width: width / 9 }}
                /> */}
              </View>
            )}

            {/* Price view */}
            <View
              style={{
                paddingTop: moderateScale(5),
                paddingBottom: moderateScale(5),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                }}>
                {`${currencies?.primary_currency?.symbol}${(
                  Number(
                    data?.variant[0]?.multiplier || data?.variant_multiplier,
                  ) * Number(data?.variant[0]?.price)
                ).toFixed(2)}`}
              </Text>
            </View>
            <View style={{ width: width / 2 }}>
              {!!htmlText && (
                <HtmlViewComp
                  plainHtml={htmlText}
                  nodeComponentProps={{
                    numberOfLines: 2,
                  }}
                />
              )}
            </View>
          </Animatable.View>

          {!!data?.variant[0]?.quantity || (!!typeId && typeId == 8) ? (
            <View
              style={{
                marginTop:
                  selectedIndex == index ? moderateScaleVertical(8) : 0,
                alignItems: 'center',
              }}>
              {(!!data?.variant[0]?.check_if_in_cart_app &&
                data?.variant[0]?.check_if_in_cart_app.length > 0) ||
                !!data?.qty ? (
                <View
                  style={{
                    ...styles.addBtnStyle,
                    paddingVertical: 0,
                    backgroundColor: themeColors.primary_color,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: moderateScale(8),
                    paddingHorizontal: moderateScale(8),
                  }}>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    onPress={onDecrement}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: moderateScale(16),
                        color: colors.white,
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <View>
                    {selectedItemIndx === index &&
                      selectedItemID == data?.id &&
                      btnLoader ? (
                      <UIActivityIndicator
                        size={moderateScale(18)}
                        color={colors.white}
                      />
                    ) : (
                      <Text
                        style={{
                          fontFamily: fontFamily.bold,
                          fontSize: moderateScale(16),
                          color: colors.white,
                        }}>
                        {data?.qty ||
                          data?.variant[0]?.check_if_in_cart_app[0]?.quantity}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}
                    onPress={onIncrement}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: moderateScale(20),
                        color: colors.white,
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    onPress={addToCart}
                    style={{
                      ...styles.addBtnStyle,
                    }}>
                    {selectedItemID == data?.id ? (
                      <UIActivityIndicator
                        size={moderateScale(18)}
                        color={themeColors.primary_color}
                      />
                    ) : (
                      <View>
                        <Text style={styles.addStyleText}>{strings.ADD}</Text>
                      </View>
                    )}

                    {/* <Image source={imagePath.greyRoundPlus} /> */}
                  </TouchableOpacity>
                </>
              )}
              {(!!data?.add_on && data?.add_on.length !== 0) ||
                (!!data?.variantSet && data?.variantSet.length !== 0) ? (
                <Text
                  style={{
                    ...styles.customTextStyle,
                    textTransform: 'lowercase',
                    color: colors.blackOpacity40,
                  }}>
                  {strings.CUSTOMISABLE}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

function styleData({ themeColors, fontFamily }) {
  const styles = StyleSheet.create({
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    customTextStyle: {
      fontSize: textScale(8),
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
      color: colors.yellowC,
    },
    addStyleText: {
      fontSize: textScale(10),
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
    },
    addBtnStyle: {
      borderWidth: StyleSheet.hairlineWidth,
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      borderColor: themeColors.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
      width: 79,
      height: 35,
      // flexDirection:"row"
      // width: moderateScale(80),
    },
    inTextStyle: {
      width: moderateScaleVertical(220),
      fontFamily: fontFamily.regular,
      fontSize: textScale(9),
      width: width / 3,
      textAlign: 'left',
      marginTop: moderateScaleVertical(6),
      marginBottom: moderateScaleVertical(4),
    },
    imgStyle: {
      height: moderateScale(100),
      width: moderateScale(100),
      borderRadius: moderateScale(15),
    },
  });
  return styles;
}
