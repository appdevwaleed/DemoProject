import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import {cloneDeep} from 'lodash';

import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {appIds, shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import strings from '../../constants/lang';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';

import {cameraHandler} from '../../utils/commonFunction';
import ToggleSwitch from 'toggle-switch-react-native';
import DocumentPicker from 'react-native-document-picker';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import {getBundleId} from 'react-native-device-info';

export default function WebLinks({navigation, route}) {
  console.log("WebLinks - WebLinks")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );


  const paramData = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
    callingCode: userData?.dial_code
      ? userData?.dial_code
      : appData?.profile?.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : '91',
    cca2: userData?.cca2
      ? userData?.cca2
      : appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : 'IN',
    phoneNumber: '',
    fullname: '',
    email: '',
    title: '',
    password: '',
    confirm_password: '',
    description: '',
    vendor_name: '',
    address: '',
    website: '',
    imageArray: [],
    imageArrayBanner: [],
    isDineIn: false,
    isTakeaway: false,
    isDelivery: false,
    sfcLicense: [],
    fssaiLicense: [],
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data

  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  const {isLoading, htmlContent} = state;

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    updateState({isLoading: true});
    getCmsPageDetail();
  }, []);

  // //Get list of all payment method
  const getCmsPageDetail = () => {
    let data = {};
    data['page_id'] = paramData && paramData?.id;

    actions
      .getCmsPageDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
     
        updateState({isLoadingB: false, isLoading: false, isRefreshing: false});
        if (res && res?.data?.description) {
          updateState({htmlContent: res?.data?.description});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  /***********Remove Image from logo */
  const _removeImageFromList = (selectdImage) => {

    if (selectdImage?.id) {
   
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        imageArray: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

  /// remove banner

  const _removeBannerFromList = (selectdImage) => {

    if (selectdImage?.id) {
   
      let copyArrayImages = cloneDeep(imageArrayBanner);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        imageArrayBanner: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArrayBanner);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArrayBanner: copyArrayImages,
      });
    }
  };
  /// remove fssaiLicence

  const _removeFssaiLicence = (selectdImage) => {
 
    if (selectdImage?.id) {
   
      let copyArrayImages = cloneDeep(fssaiLicense);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        fssaiLicense: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(fssaiLicense);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        fssaiLicense: copyArrayImages,
      });
    }
  };

  /// remove sfcLicence

  const _removeSfcLicence = (selectdImage) => {
   
    if (selectdImage?.id) {
    
      let copyArrayImages = cloneDeep(sfcLicense);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        sfcLicense: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(sfcLicense);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        sfcLicense: copyArrayImages,
      });
    }
  };

  // upload Banner function
  const uploadFile = async () => {

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });
   
      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };
    
      updateState({imageArrayBanner: [...imageArrayBanner, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  // upload logo function
  const uploadLogo = async () => {

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });
    
      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };

      updateState({imageArray: [...imageArray, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  // upload FSSAI License function
  const fssaiuploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });

      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };
   
      updateState({fssaiLicense: [...fssaiLicense, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  // upload SFC License function
  const sfcuploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });
  
      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };
   
      updateState({sfcLicense: [...sfcLicense, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  const {
    cca2,
    phoneNumber,
    imageArray,
    isDineIn,
    isDelivery,
    isTakeaway,
    imageArrayBanner,
    fssaiLicense,
    sfcLicense,
  } = state;
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
             imagePath.icBackb
        }
        centerTitle={(paramData && paramData?.title) || ''}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: Colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {/* {!!(paramData && paramData?.url) && (
              <WebView source={{uri: paramData?.url}} />
            )} */}
            {htmlContent && (
              <HTMLView
                stylesheet={isDarkMode ? htmlStyle : null}
                value={`<p>${htmlContent}</p>`}
              />
            )}
          </View>
          {paramData?.slug === 'vendor-registration' && (
            <View
              style={{
                marginTop: moderateScaleVertical(30),
                marginHorizontal: moderateScale(24),
              }}>
              <View style={{marginBottom: moderateScaleVertical(12)}}>
                <Text style={styles.detailStyle}>
                  {strings.PERSONAL_DETAILS}
                </Text>
              </View>
              <BorderTextInput
                placeholder={strings.YOUR_NAME}
                onChangeText={_onChangeText('fullname')}
                containerStyle={styles.containerStyle}
              />

              <BorderTextInput
                placeholder={strings.YOUR_EMAIL}
                onChangeText={_onChangeText('email')}
                containerStyle={styles.containerStyle}
              />
              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={(phoneNumber) =>
                  updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
                }
                cca2={cca2}
                phoneNumber={phoneNumber}
                callingCode={state.callingCode}
                placeholder={strings.YOUR_PHONE_NUMBER}
                keyboardType={'phone-pad'}
                containerStyle={styles.containerStyle}
              />

              <BorderTextInput
                placeholder={strings.ENTER_TITLE}
                label={'Title'}
                onChangeText={_onChangeText('title')}
                containerStyle={styles.containerStyle}
              />

              <BorderTextInput
                secureTextEntry={true}
                placeholder={strings.ENTER_PASSWORD}
                onChangeText={_onChangeText('password')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                secureTextEntry={true}
                placeholder={strings.CONFIRM_PASSWORD}
                onChangeText={_onChangeText('confirm_password')}
                containerStyle={styles.containerStyle}
              />
              <View style={{marginTop: moderateScaleVertical(10)}}>
                <Text style={styles.detailStyle}>{strings.STORE_DETAILS}</Text>
              </View>

              <View style={{marginVertical: moderateScaleVertical(20)}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>{strings.UPLOAD_LOGO}</Text>
                    {imageArray && imageArray.length ? (
                      imageArray.map((i, inx) => {
                        return (
                          <ImageBackground
                            source={{
                              uri: i.uri,
                            }}
                            style={styles.imageOrderStyle}
                            imageStyle={styles.imageOrderStyle}>
                            <View style={styles.viewOverImage}>
                              <View style={styles.crossIconStyle}>
                                <TouchableOpacity
                                  onPress={() => _removeImageFromList(i)}>
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    ) : (
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={uploadLogo}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>
                      {strings.UPLOAD_BANNER}
                    </Text>
                    {imageArrayBanner && imageArrayBanner.length ? (
                      imageArrayBanner.map((i, inx) => {
                        return (
                          <ImageBackground
                            source={{
                              uri: i.uri,
                            }}
                            style={styles.imageOrderStyle}
                            imageStyle={styles.imageStyle}>
                            <View style={styles.viewOverImage}>
                              <View style={styles.crossIconStyle}>
                                <TouchableOpacity
                                  onPress={() => _removeBannerFromList(i)}>
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    ) : (
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={uploadFile}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <BorderTextInput
                placeholder={strings.VENDOR_NAME}
                onChangeText={_onChangeText('vendor_name')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                placeholder={strings.DESCRIPTION}
                onChangeText={_onChangeText('description')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                placeholder={strings.ADDRESS}
                onChangeText={_onChangeText('address')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                placeholder={strings.WEBSITE}
                onChangeText={_onChangeText('website')}
                containerStyle={styles.containerStyle}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  marginHorizontal: moderateScale(10),
                  marginVertical: moderateScaleVertical(16),
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.DINE_IN}
                  </Text>
                  <ToggleSwitch
                    isOn={isDineIn}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isDineIn: !isDineIn})}
                  />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.TAKEAWAY}
                  </Text>
                  <ToggleSwitch
                    isOn={isTakeaway}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isTakeaway: !isTakeaway})}
                  />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.DELIVERY}
                  </Text>
                  <ToggleSwitch
                    isOn={isDelivery}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isDelivery: !isDelivery})}
                  />
                </View>
              </View>
              <View style={{marginVertical: moderateScaleVertical(20)}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>
                      {getBundleId() === appIds.codiner
                        ? strings.LABEL1
                        : strings.FSSAI_LICENSE}
                    </Text>
                    {fssaiLicense && fssaiLicense.length ? (
                      fssaiLicense.map((i, inx) => {
                        return (
                          <ImageBackground
                            source={{
                              uri: i.uri,
                            }}
                            style={styles.imageOrderStyle}
                            imageStyle={styles.imageOrderStyle}>
                            <View style={styles.viewOverImage}>
                              <View style={styles.crossIconStyle}>
                                <TouchableOpacity
                                  onPress={() => _removeFssaiLicence(i)}>
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    ) : (
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={fssaiuploadFile}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>
                      {getBundleId() === appIds.codiner
                        ? strings.LABEL2
                        : strings.SFC_LICENSE}
                    </Text>
                    {sfcLicense && sfcLicense.length ? (
                      sfcLicense.map((i, inx) => {
                        return (
                          <ImageBackground
                            source={{
                              uri: i.uri,
                            }}
                            style={styles.imageOrderStyle}
                            imageStyle={styles.imageStyle}>
                            <View style={styles.viewOverImage}>
                              <View style={styles.crossIconStyle}>
                                <TouchableOpacity
                                  onPress={() => _removeSfcLicence(i)}>
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    ) : (
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={sfcuploadFile}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <GradientButton
                marginTop={moderateScaleVertical(10)}
                btnText={strings.SUBMIT}
              />
              <View
                style={{
                  height: moderateScaleVertical(24),
                  marginBottom: moderateScaleVertical(44),
                }}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}

const htmlStyle = StyleSheet.create({
  p: {
    fontWeight: '300',
    color: '#e5e5e7', // make links coloured pink
  },
});
