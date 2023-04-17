import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {useSelector} from 'react-redux';
import CustomTopTabView from '../Components/CustomTopTabView';
import strings from '../constants/lang';
import {Home, Wallet, HomeCourier} from '../Screens';
import CelebrityStack from './CelebrityStack';
import navigationStrings from './navigationStrings';

const Tab = createMaterialTopTabNavigator();

export default function TopTabRoutes() {
  const {themeColors} = useSelector((state) => state?.initBoot);
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      swipeEnabled={false}
      tabBar={(props) => <CustomTopTabView {...props} />}
      initialRouteName={navigationStrings.HOME}>
      <Tab.Screen
        name={navigationStrings.WALLET}
        component={Wallet}
        options={{
          tabBarLabel: strings.WALLET,
        }}
      />

      <Tab.Screen
        name={navigationStrings.HOME}
        component={HomeCourier}
        options={{
          tabBarLabel: strings.HOME,
        }}
      />
      <Tab.Screen
        name={navigationStrings.CELEBRITY}
        component={CelebrityStack}
        options={{
          tabBarLabel: strings.CELEBRITY,
        }}
      />
    </Tab.Navigator>
  );
}
