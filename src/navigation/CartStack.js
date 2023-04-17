import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  AllPaymentMethods,
  Cart,
  Cart2,
  Cart3,
  Mobbex,
  Offers,
  OrderDetail,
  Payfast,
  Paylink,
  ProductDetail,
  ProductList3,
  VerifyAccount,
  WebPayment,
  Wishlist2,
  Yoco,
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import { shortCodes } from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const { appData, appStyle } = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator  screenOptions={{headerShown: false}} >
      <Stack.Screen
        name={navigationStrings.CART}
        component={Cart3}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name={navigationStrings.ALL_PAYMENT_METHODS}
        component={AllPaymentMethods}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={Wishlist2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          ProductList3
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          ProductDetail
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.MOBBEX}
        component={Mobbex}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.YOCO}
        component={Yoco}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYLINK}
        component={Paylink}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
