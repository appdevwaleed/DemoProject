import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  Addaddress,
  ChooseCarTypeAndTimeTaxi,
  HomeScreenTaxi,
  Offers,
  PaymentOptions,
  PickupTaxiOrderDetail,
  PinAddressOnMap,
  RateOrder,
} from '../Screens';

import VerifyAccountSecond from '../Screens/VerifyAccountSecond/VerifyAccount';
import navigationStrings from './navigationStrings';
import DeliveryOrderSuccess from '../Screens/DeliveryOrderSuccess/DeliveryOrderSuccess';
import ContactsBook from '../Screens/ContactsBook/ContactsBook'
// ChooseCarTypeAndTimeTaxi;

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENTAXI}
        component={HomeScreenTaxi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PINADDRESSONMAP}
        component={PinAddressOnMap}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PAYMENT_OPTIONS}
        component={PaymentOptions}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.CHOOSECARTYPEANDTIMETAXI}
        component={ChooseCarTypeAndTimeTaxi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.OFFERS2}
        component={Offers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPTAXIORDERDETAILS}
        component={PickupTaxiOrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={DeliveryOrderSuccess}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name={navigationStrings.CONTACTSBOOK}
        component={ContactsBook}
        options={{headerShown: false}}
      />
    </>
  );
}
