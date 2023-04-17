import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
  RefreshControl,
  I18nManager,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { cameraHandler } from '../../utils/commonFunction';
import { getImageUrl, showError } from '../../utils/helperFunctions';
// import OrderCardComponent from './OrderCardComponent';
import stylesFunc from './styles';
import FastImage from 'react-native-fast-image';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../styles/theme';
import { RadioButton } from 'react-native-paper';

export default function ReturnOrder({ navigation, route }) {
  console.log("ReturnOrder - ReturnOrder.js")
  console.log(route?.params?.selected_refund_amount, "ReturnOrder - ReturnOrder.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const ratingData = route?.params?.item?.product_rating;
  const selectProductForRetrun = route?.params?.selectProductForRetrun;
  const selectedOrderForReturn = route?.params?.selectedOrderForReturn;
  const reasons = route?.params?.reasons;
  const selected_refund_amount= route?.params?.selected_refund_amount
  console.log(selectedOrderForReturn?.payment_option_id, 'MY ORDER UD');
  let totalReturnAmount = selectProductForRetrun.filter(item => item.checked === true && item.product_return === null).reduce((a,b)=>{},0)

  const [state, setState] = useState({
    isLoading: false,
    rating: 0,
    returnText: '',
    imageArray: [],
    remove_image_ids: [],
    isRefreshing: false,
    returnReasons: reasons ? reasons : [],
    selectedReason: null,
    returnAccount: 1
  });
  const {
    isLoading,
    rating,
    imageArray,
    returnText,
    remove_image_ids,
    isRefreshing,
    returnReasons,
    selectedReason,
    returnAccount,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const currentTheme = useSelector((state) => state.initBoot);
  const { appData, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const { themeColors, themeLayouts } = currentTheme;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });

  const onStarRatingPress = (rating) => {
    updateState({ rating: rating });
  };
  let max_cod_amount=appData?.profile?.preferences?.max_cod_amount  || 0
  useEffect(() => {
    console.log(remove_image_ids, 'remove_image_ids');
  }, [remove_image_ids]);

  /***********Remove Image from rating */
  const _removeImageFromList = (selectdImage) => {
    if (selectdImage?.ids) {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.ids !== selectdImage?.ids,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      !!userData?.auth_token
        ? imageArray.length == 5
          ? showError(strings.MAXIMUM_PHOTO_SELECTION_LIMIT_REACHED)
          : actionSheet.current.show()
        : null;
    }
  };

  // this funtion use for camera handle
  const cameraHandle = (index) => {
    // console.log(index,'camr')
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          updateState({ isLoading: true });
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              image_id: Math.random(),
              name: res?.filename || 'photo',
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            let formdata = new FormData();
            // console.log(file)
            formdata.append('images[]', file);
            // console.log(JSON.stringify(formdata));
            actions
              .uploadReturnOrderImage(formdata, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                // 'Content-Type': 'multipart/form-data',
              })
              .then((res) => {
                if (res && res.status == 'Success') {
                  updateState({ isLoading: false });
                  updateState({
                    imageArray: imageArray.length
                      ? [...imageArray, ...res?.data]
                      : res?.data,
                  });
                } else {
                  updateState({ isLoading: false });
                  showError(res?.message);
                }
              })
              .catch(errorMethod);
          } else {
            updateState({ isLoading: false });
          }
        })
        .catch((err) => { });
    }
  };

  const _submitYourReturnOrder = () => {
    // updateState({isLoading: true});
    //  console.log('From submit',selectProductForRetrun);
    let formdata = new FormData();
    // selectProductForRetrun.forEach((item) => formdata.append("order_vendor_product_id[]", item))
    formdata.append('order_vendor_product_id', JSON.stringify(selectProductForRetrun));
    formdata.append('coments', returnText);
    formdata.append(
      'reason',
      selectedReason ? selectedReason.value : returnReasons[0].label,
    );
    formdata.append('refund_account', returnAccount);

    if (imageArray.length) {
      imageArray.forEach((element) => {
        formdata.append('add_files[]', element?.name);
      });
    }
    // console.log('my form data',formdata)
    updateState({ isLoading: true });
    actions
      .submitReturnOrder(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // 'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        // console.log(res);
        updateState({ isLoading: false });
        navigation.goBack();
      })
      .catch(errorMethod);
  };

  useEffect(() => {
    // updateState({isLoading: true});
    // getReviewRatings();
  }, []);

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
  };

  useEffect(() => {
    // getReviewRatings();
  }, [isRefreshing]);

  //Pull to refresh
  const handleRefresh = () => {
    updateState({
      // isRefreshing: true,
    });
  };

  const updateReason = (item) => {
    updateState({ selectedReason: item });
  };

  const uploadImage = () => { };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={strings.RETURNORDER}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <ScrollView
      // refreshing={isRefreshing}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={isRefreshing}
      //     onRefresh={handleRefresh}
      //     tintColor={themeColors.primary_color}
      //   />
      // }
      >
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(20),
          }}>
          {/* star View */}
          <View style={[styles.starViewStyle]}>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ,
              }}>
              {'Here You Are For Return Product !'}
            </Text>
          </View>
          {selectProductForRetrun.filter(item => item.checked === true && item.product_return === null).map((returnItem) => {
            return (<View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: moderateScaleVertical(20),
                marginTop: moderateScaleVertical(10),
              }}>
              <View style={styles.cartItemImage}>
                <FastImage
                  source={
                    returnItem?.image != '' &&
                      returnItem?.image != null
                      ? {
                        uri: getImageUrl(
                          returnItem?.image?.proxy_url,
                          returnItem?.image?.image_path,
                          '300/300',
                        ),
                        priority: FastImage.priority.high,
                      }
                      : imagePath.patternOne
                  }
                  style={styles.imageStyle}
                />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.priceItemLabel2,
                    {
                      opacity: 0.8,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    },
                  ]}>
                  {returnItem?.product_name}
                </Text>
                {returnItem?.quantity && (
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGrey,
                      }}>
                      {strings.QTY}
                    </Text>
                    <Text style={styles.cartItemWeight}>
                      {returnItem?.quantity}
                    </Text>
                  </View>
                )}
              </View>
            </View>)
          })}


          {/* Upload image */}
          <View style={{ marginTop: moderateScaleVertical(10) }}>
            <Text
              style={{
                ...styles.uploadImage,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyD,
              }}>
              {strings.UPLOAD_IMAGE}
            </Text>
            <View
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  marginRight: 5,
                  marginBottom: moderateScaleVertical(10),
                }}>
                <TouchableOpacity
                  onPress={showActionSheet}
                  style={[styles.viewOverImage2, { borderStyle: 'dashed' }]}>
                  <Image
                    source={imagePath.icCamIcon}
                    style={{ tintColor: colors.themeColor }}
                  />
                </TouchableOpacity>
              </View>

              {imageArray && imageArray.length
                ? imageArray.map((i, inx) => {
                  return (
                    <ImageBackground
                      key={inx}
                      source={{
                        uri: i.img_path,
                      }}
                      style={styles.imageOrderStyle}
                      imageStyle={styles.imageOrderStyle}>
                      <View style={styles.viewOverImage}>
                        <View
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                          }}>
                          <TouchableOpacity
                            onPress={() => _removeImageFromList(i)}>
                            <Image source={imagePath.icRemoveIcon} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </ImageBackground>
                  );
                })
                : null}
            </View>

            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyJ,
                }}>
                {strings.RETURNREASONS}
              </Text>
            </View>

            <DropDownPicker
              items={returnReasons}
              defaultValue={returnReasons[0].label || returnReasons[0].name}
              containerStyle={{ height: 40, marginTop: moderateScaleVertical(5) }}
              style={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : '#fafafa',
                zIndex: 5000,
                // marginHorizontal: moderateScale(20),
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              }}
              itemStyle={{
                justifyContent: 'flex-start',
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              }}
              labelStyle={isDarkMode && { color: MyDarkTheme.colors.text }}
              zIndex={5000}
              dropDownStyle={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : '#fafafa',
                height: 150,
                width: width - moderateScale(40),
                alignSelf: 'center',
              }}
              onChangeItem={(item) => updateReason(item)}
            />

            {/* Message Container    */}
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text
                style={{
                  ...styles.uploadImage,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyD,
                }}>
                {strings.COMMENTSOPTIONAL}
              </Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={{
                    ...styles.textInputStyle,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                  }}
                  multiline={true}
                  value={returnText}
                  onChangeText={(text) => updateState({ returnText: text })}
                  placeholderTextColor={
                    isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ
                  }
                />
              </View>
            </View>
            {selectedOrderForReturn?.payment_option_id === 4 && 
            max_cod_amount !== 0  && selected_refund_amount < max_cod_amount &&
         //   Number(cartData?.total_payable_amount).toFixed(2) < max_cod_amount && 
            <View style={[styles.starViewStyle]}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ,
                }}>
                {strings.CHOOSE_YOUR_REFUND_MODE}
              </Text>
            </View>}
            {selectedOrderForReturn?.payment_option_id === 4 &&   max_cod_amount !== 0  && 
            selected_refund_amount < max_cod_amount ?
              <View>
                <RadioButton.Item
                  value={1}
                  label={strings.WALLET}
                  status={returnAccount === 1 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    //  setChecked(1)
                    updateState({ returnAccount: 1 })
                  }}
                />
                <RadioButton.Item
                  value={2}
                  label={strings.CARD}
                  status={returnAccount === 2 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    // setChecked(2)
                    updateState({ returnAccount: 2 })
                  }}
                />
              </View> : null}
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                onPress={_submitYourReturnOrder}
                btnText={strings.SUBMIT}
              />
            </View>
            <View style={{ marginTop: moderateScaleVertical(100) }}></View>
          </View>
        </View>
        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => cameraHandle(index)}
        />
      </ScrollView>
    </WrapperContainer>
  );
}
