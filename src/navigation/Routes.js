import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';

import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import { navigationRef } from './NavigationService';
import DrawerRoutes from './DrawerRoutes';
//import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import UserInterfaceStyle from 'react-native-user-interface-style';
import colors from '../styles/colors';
import TaxiAppStack from './TaxiAppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntro from '../Screens/AppIntro';
import { getItem } from '../utils/utils';
import { AllPaymentMethods } from '../Screens';
import { MyOrders}  from '../Screens'

const Stack = createStackNavigator();

export function shortCode(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{ headerShown: false }}
      />
    </>
  );
  // getItem('firstTime').then((el) => {
  //   if (el && el !== null) {
  //     return (
  //       <>
  //         <Stack.Screen
  //           name={navigationStrings.SHORT_CODE}
  //           component={ShortCode}
  //           options={{ headerShown: false }}
  //         />
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <Stack.Screen
  //           name={navigationStrings.APP_INTRO}
  //           component={AppIntro}
  //           options={{ headerShown: false }}
  //         />
  //       </>
  //     );
  //   }
  // })
}

export default function Routes() {
  const userData = useSelector((state) => state?.auth?.userData);
  const { shortCodeStatus, appStyle } = useSelector((state) => state?.initBoot);
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
    },
  };

  const theme = {
    //like this
    colors: {
      background: colors.transparent,
    },
  };

  return (

    <NavigationContainer

      theme={theme}
      // theme={scheme == 'dark' ? DarkTheme : DefaultTheme}
      ref={navigationRef}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {shortCode(Stack)}
        {AuthStack(Stack)}
        {CourierStack(Stack)}
        {TaxiAppStack(Stack)}

        {/* <Stack.Screen
            name={navigationStrings.APP_INTRO}
            component={AppIntro}
            options={{ headerShown: false, gestureEnabled: false }}
          /> */}

        {/* <Stack.Screen
          name={navigationStrings.DRAWER_ROUTES}
          component={DrawerRoutes}
          options={{ headerShown: false, gestureEnabled: false }}
        /> */}

        <Stack.Screen
          name={navigationStrings.TAB_ROUTES}
          component={TabRoutes}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name={navigationStrings.ALL_PAYMENT_METHODS}
          component={AllPaymentMethods}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
