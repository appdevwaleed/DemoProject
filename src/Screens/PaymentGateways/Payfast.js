import queryString from 'query-string';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {WebView} from 'react-native-webview';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {height, moderateScaleVertical} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';

export default function Payfast({navigation, route}) {
  console.log("PaymentGateways - Payfast.js")
  let paramsData = route?.params;

  const {themeToggle, themeColor, appStyle, appData, currencies, languages} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    webData: '',
    isLoading: true,
  });

  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {webData, isLoading} = state;

  useEffect(() => {
    apiHit();
  }, []);

  const apiHit = async () => {
    let queryData = `/${paramsData?.selectedPayment?.title?.toLowerCase()}?amount=${
      paramsData?.total_payable_amount
    }&payment_option_id=${
      paramsData?.payment_option_id
    }&action=cart&order_number=${paramsData?.orderDetail?.order_number}`;

    try {
      const res = await actions.openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );

      updateState({webData: res?.data});
    } catch (error) {
      updateState({isLoading: false});
      showError(error.message || error);
    }
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const onNavigationStateChange = (props) => {
    const {url} = props;
    const URL = queryString.parseUrl(url);
    const queryParams = URL.query;
    const nonQueryURL = URL.url;

    setTimeout(() => {
      if (queryParams.status == 200) {
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: queryParams.order,
            id: paramsData?.orderDetail?.id,
          },
        })();
      } else if (queryParams.status == 0) {
        moveToNewScreen(navigationStrings.CART, {
          queryURL: url.replace(`${nonQueryURL}?`, ''),
        })();
      }
    }, 200);
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.transparent}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      {webData !== '' && (
        <WebView
          showsVerticalScrollIndicator={false}
          source={{
            uri: webData?.redirectUrl,
            method: 'POST',
            body: queryString.stringify(webData?.formData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          }}
          onNavigationStateChange={onNavigationStateChange}
          onLoad={() => updateState({isLoading: false})}
        />
      )}
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
