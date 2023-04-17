import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BuyProduct,
  ConfirmDetailsBuy,
  Delivery,
  Filter,
  Home,
  Location,
  OrderDetail,
  Payment,
  PaymentSuccess,
  ProductDetail,
  ProductList3,
  SendProduct,
  ShippingDetails,
  SuperMarket,
  TrackDetail,
  Tracking,
  VendorDetail3,
  Vendors3,
  SearchProductVendorItem2,
  BrandProducts2,
  ViewAllData,
  TaxiHomeScreen,
  HomeCourier
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';

import {verticalAnimation} from '../utils/utils';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      {/* <Stack.Screen
       name={ navigationStrings.HOMECOURIER }
        // name={
        //   businessType === 4
        //     ? navigationStrings.TAXIHOMESCREEN
        //     : navigationStrings.HOME
        // }
       // component={businessType === 4 ? TaxiHomeScreen : Home}
       component={ HomeCourier }
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
       name={ navigationStrings.HOME }
        // name={
        //   businessType === 4
        //     ? navigationStrings.TAXIHOMESCREEN
        //     : navigationStrings.HOME
        // }
       // component={businessType === 4 ? TaxiHomeScreen : Home}
       component={HomeCourier} //Home ContactsBook //HomeCourier
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        component={SuperMarket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={ Vendors3 }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={
          VendorDetail3    
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
            ProductList3
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
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        component={ConfirmDetailsBuy}
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
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
           component={
           SearchProductVendorItem2
        }
        options={verticalAnimation}
      />

      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        component={Filter}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={
           BrandProducts2
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT}
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        component={PaymentSuccess}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        component={ShippingDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        component={ViewAllData}
        options={{headerShown: false}}
      />
     

    </Stack.Navigator>
  );
}
