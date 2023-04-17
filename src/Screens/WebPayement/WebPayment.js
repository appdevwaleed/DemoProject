import React, {useState} from 'react';
import {Alert} from 'react-native';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import stylesFun from './styles';

export default function WebPayment({navigation, route}) {
  console.log("WebPayment - WebPayment")
  const paramData = route?.params;

  const [state, setState] = useState({});
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={
           imagePath.icBackb 
        }
        centerTitle={paramData?.paymentTitle || ''}
        headerStyle={{backgroundColor: Colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      <WebView
        source={{uri: paramData?.paymentUrl}}
        onNavigationStateChange={(navState) => {
     
          if (
            navState.canGoBack &&
            navState.url.includes('payment/checkoutSuccess')
          ) {
            if (paramData?.redirectFrom == 'cart') {
              navigation.navigate(navigationStrings.CART, {
                redirectFrom: 'cart',
                transactionId: navState.url.substring(
                  navState.url.lastIndexOf('/') + 1,
                ),
                selectedAddressData: paramData?.selectedAddressData,
                selectedPayment: paramData?.selectedPayment,
              });
            }

            if (paramData?.redirectFrom == 'tip') {
              actions
                .tipAfterOrder(
                  {
                    tip_amount: paramData?.selectedTipAmount,
                    order_number: paramData?.order_number,
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
                        text: strings.CANCEL,
                        onPress: () => console.log('Cancel Pressed'),
                      },
                    ]);
                  }
                })
                .catch(errorMethod);
              navigation.navigate(navigationStrings.ORDER_DETAIL);
            } else {
              setTimeout(() => {
                alert(strings.PAYMENT_SUCCESS);
                navigation.navigate(navigationStrings.WALLET);
              }, 2000);
            }
          }
        }}
      />
    </WrapperContainer>
  );
}
