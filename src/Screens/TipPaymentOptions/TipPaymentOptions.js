import {CardField, createToken, initStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';

export default function TipPaymentOptions({navigation, route}) {
  console.log("TipPaymentOptions - TipPaymentOptions.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, appStyle, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const data = route?.params?.data;
  const userData = useSelector((state) => state?.auth?.userData);
  // console.log(selectedPaymentMethodHandler, 'selectedPaymentMethod');

  const [state, setState] = useState({
    isLoading: false,

    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
  });
  const {
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    updateState({isLoading: true});
    getListOfPaymentMethod();
  }, []);

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/wallet',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoading: false, payementMethods: res?.data});
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false});
    showError(error?.message || error?.error);
  };

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      updateState({isLoading: true});

      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          await createToken(cardInfo)
            .then((res) => {
              if (res && res?.token && res.token?.id) {
                updateState({isLoading: false});
                actions
                  .tipAfterOrder(
                    {
                      tip_amount: data?.selectedTipAmount,
                      order_number: data?.order_number,
                    },
                    {
                      code: appData?.profile?.code,
                      currency: currencies?.primary_currency?.id,
                      language: languages?.primary_language?.id,
                    },
                  )
                  .then((res) => {
                    updateState({isLoading: false});
                    if (res && res?.status == 'Success' && res?.data) {
                      Alert.alert('', strings.PAYMENT_SUCCESS, [
                        {
                          text: strings.OK,
                          onPress: () => console.log('Cancel Pressed'),
                        },
                      ]);
                      navigation.navigate(navigationStrings.ORDER_DETAIL);
                    }
                  })
                  .catch(errorMethod);
              } else {
                updateState({isLoading: false});
              }
            })
            .catch((err) => {
              updateState({isLoading: false});
              errorMethod;
            });
        } else {
          updateState({isLoading: false});
          showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        setTimeout(() => {
          updateState({isLoading: false});
          _webPayment(selectedPaymentMethod);
        }, 1000);
      }
    } else {
      showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: data});
    }
  };

  const _renderItemPayments = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[styles.caseOnDeliveryView]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <Text
            style={
              isDarkMode
                ? [styles.caseOnDeliveryText, {color: MyDarkTheme.colors.text}]
                : styles.caseOnDeliveryText
            }>
            {item?.title_lng ? item?.title_lng : item?.title}
          </Text>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id != 1
        ) && (
          <View>
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: colors.white,
                textColor: colors.black,
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 10,
              }}
              onCardChange={(cardDetails) => {
                _onChangeStripeData(cardDetails);
              }}
              onBlur={() => {
                Keyboard.dismiss();
              }}
            />
          </View>
        )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: {
          brand: cardDetails.brand,
          complete: true,
          expiryMonth: cardDetails?.expiryMonth,
          expiryYear: cardDetails?.expiryYear,
          last4: cardDetails?.last4,
          postalCode: cardDetails?.postalCode,
        },
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod.title.toLowerCase();
    let returnUrl = `/payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `/payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;

    updateState({isLoading: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${data?.selectedTipAmount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoading: false});
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPaymentMethod?.title,
            redirectFrom: 'tip',
            tip_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
          });
        }
      })
      .catch(errorMethod);
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
           imagePath.icBackb
        }
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.backgroundGrey}
        }
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <FlatList
          data={payementMethods}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          // horizontal
          style={{marginTop: moderateScaleVertical(10)}}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItemPayments}
          ListEmptyComponent={() =>
            !isLoading && (
              <Text style={{textAlign: 'center'}}>
                {strings.NO_PAYMENT_METHOD}
              </Text>
            )
          }
        />
      </KeyboardAwareScrollView>

      <View
        style={{marginHorizontal: moderateScaleVertical(20), marginBottom: 65}}>
        <GradientButton
          textStyle={styles.textStyle}
          onPress={selectPaymentOption}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.SELECT}
        />
      </View>
    </WrapperContainer>
  );
}
