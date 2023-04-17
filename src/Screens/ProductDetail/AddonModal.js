import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl} from '../../utils/helperFunctions';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../navigation/navigationStrings';
import stylesFunc from './styles';
import HTMLView from 'react-native-htmlview';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function AddonModal({
  productdetail = {},
  addonSet = [],
  isVisible = false,
  onClose,
  onPress,
  resizeMode = 'cover',
  imagestyle = {},
}) {
  console.log("ProductDetail - AddonModal.js")
  const navigation = useNavigation();

  const [state, setState] = useState({
    addonSetData: addonSet,
    viewHeight: 0,
    maxLimitAddon: 0,
  });
  const {addonSetData, viewHeight, maxLimitAddon} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

  let productImage = productdetail?.product_media[0];

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    let find = addonSetData.find((x) => x?.addon_id == i?.addon_id);

    updateState({
      addonSetData: addonSetData.map((vi, vnx) => {
        if (vi.addon_id == i.addon_id) {
          return {
            ...vi,
            setoptions: newArray.map((j, jnx) => {
              if (vi?.max_select > 1) {
                let incrementedValue = 0;
                newArray.forEach((e) => {
                  if (e.value) {
                    incrementedValue = incrementedValue + 1;
                  }
                });
                if (incrementedValue == vi?.max_select && !j.value) {
                  return {
                    ...j,
                  };
                } else {
                  if (j?.id == i?.id) {
                    return {
                      ...j,
                      value: i?.value ? false : true,
                    };
                  }

                  return {
                    ...j,
                  };
                }
              } else {
                if (j.id == i.id) {
                  return {
                    ...j,
                    value: i?.value ? false : true,
                  };
                }

                return {
                  ...j,
                  value: false,
                };
              }
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };

  let plainHtml = productdetail?.translation[0]?.body_html || null;
  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                selectSpecificOptionsForAddions(setoptions, i, inx);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',

                marginBottom: moderateScaleVertical(10),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {i?.title
                    ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                    : ''}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {`${currencies?.primary_currency?.symbol}${(
                    Number(i?.multiplier) * Number(i?.price)
                  ).toFixed(2)}`}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    source={i?.value ? imagePath.check : imagePath.unCheck}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const showAllAddons = () => {
    let variantSetData = cloneDeep(addonSetData);
    return (
      <>
        <View
          style={{
            marginVertical: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                  <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Text
                  style={[
                    styles.variantLable,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    },
                  ]}>{`Choice of ${i?.title}`}</Text>
                  <Text
                  style={[
                    styles.chooseOption,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyF,
                    },
                  ]}>
                 Maximum: {i.max_select}
                </Text>
                  </View>
                {/* <Text
                  style={[
                    styles.chooseOption,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyF,
                    },
                  ]}>
                  {strings.PLS_SELECT_ONE}
                </Text> */}
                {i?.setoptions ? checkBoxButtonViewAddons(i) : null}
                <View
                  style={{
                    ...commonStyles.headerTopLine,
                    marginVertical: moderateScaleVertical(10),
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const addToCart = () => {
    onClose();
    navigation.navigate(navigationStrings.PRODUCTDETAIL, {
      data: {
        addonSetData: addonSetData,
        randomValue: Math.random(),
      },
    });
  };

  return (
    <Modal
      transparent={true}
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onLayout={(event) => {
        updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image source={imagePath.crossC} />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={[
          styles.modalMainViewContainer,
          {
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          },
        ]}>
        <View
          style={[
            styles.modalMainViewContainer,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            },
          ]}>
          <Image
            source={{
              uri: getImageUrl(
                productImage?.image?.path?.proxy_url,
                productImage?.image?.path?.image_path,
                '500/500',
              ),
            }}
            style={[styles.cardView, imagestyle]}
            resizeMode={resizeMode}
          />
          <View style={styles.mainView}>
            <View>
              <Text
                numberOfLines={1}
                style={[
                  styles.productName,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {productdetail?.translation[0]?.title}
              </Text>
            </View>

            {plainHtml ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <HTMLView
                  value={
                    plainHtml.startsWith('<p>')
                      ? plainHtml
                      : '<p>' + plainHtml + '</p>'
                  }
                  stylesheet={{p: styles.descriptionStyle}}
                />
              </View>
            ) : null}

            <View
              style={{
                ...commonStyles.headerTopLine,
                marginVertical: moderateScaleVertical(10),
              }}
            />

            {/* ********Addon set View*******  */}
            {addonSetData && addonSetData.length ? showAllAddons() : null}
          </View>
        </View>

        <View style={{height: moderateScaleVertical(100)}} />
      </ScrollView>
      <View
        style={[styles.bottomAddToCartView, {top: viewHeight - height / 10}]}>
        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={styles.textStyle}
          onPress={addToCart}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.ADDTOCART}
        />
      </View>
    </Modal>
  );
}
