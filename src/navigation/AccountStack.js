import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  Account3,
  AddMoney,
  BrandProducts2,
  BuyProduct,
  CMSLinks,
  ContactUs,
  Delivery,
  MyOrders,
  MyProfile3,
  Notifications,
  OrderDetail,
  PickupOrderDetail,
  ProductDetail,
  ProductList,
  RateOrder,
  ReturnOrder,
  SearchProductVendorItem2,
  SendProduct,
  SendRefferal,
  Settings,
  TipPaymentOptions,
  TrackDetail,
  Tracking,
  Wallet,
  WebLinks,
  WebPayment,
  WebviewScreen,
  Wishlist2,
  ChatBot,
  OrderReceipt,
  Home,
  HomeCourier
} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function ({navigation}) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        component={
            Account3 }
        name={navigationStrings.ACCOUNTS}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={
          MyProfile3
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.MY_ORDERS}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name={navigationStrings.ORDER_DETAIL2}
        component={OrderDetail2}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notifications}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ABOUT_US}
        component={AboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CONTACT_US}
        component={ContactUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SETTIGS}
        component={Settings}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER}
        component={PrinterConnection}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={navigationStrings.WALLET}
        component={Wallet}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name={navigationStrings.ADD_MONEY}
        component={AddMoney}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={ Wishlist2 }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          ProductDetail
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.TRACKING}
        component={Tracking}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
         SearchProductVendorItem2
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts2}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
        options={{headerShown: false}}
      />
       {/* commented for checking  Vendors2 and  Vendors  */}
      {/* <Stack.Screen
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{headerShown: false}}
      /> */}

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={ ProductList }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SENDREFFERAL}
        component={SendRefferal}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.CMSLINKS}
        component={CMSLinks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.TRACKORDER}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{headerShown: false, tabBarVisible: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBVIEWSCREEN}
        // component={WebviewScreen}
        component={
          WebviewScreen
          // appStyle?.homePageLayout === 3 ? StaticTrackOrder :
        }
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={
           Subscriptions2
          // Subscriptions
        }
        options={{headerShown: false}}
      /> */}
      {/* <Stack.Screen
        name={navigationStrings.LOYALTY}
        component={ Loyalty2 }
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={navigationStrings.RETURNORDER}
        component={ReturnOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TIP_PAYMENT_OPTIONS}
        component={TipPaymentOptions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_BOT}
        component={ChatBot}
        options={{headerShown: false}}
      />
         <Stack.Screen
        name={navigationStrings.ORDER_RECEIPT}
        component={OrderReceipt}
        options={{ headerShown: false }}
      />
         <Stack.Screen
       name={ navigationStrings.HOME }
        // name={
        //   businessType === 4
        //     ? navigationStrings.TAXIHOMESCREEN
        //     : navigationStrings.HOME
        // }
       // component={businessType === 4 ? TaxiHomeScreen : Home}
       component={ HomeCourier }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
