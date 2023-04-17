import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import colors from '../styles/colors';
import AccountStack from './AccountStack';
import BrandStack from './BrandStack';
import CartStack from './CartStack';
import CelebrityStack from './CelebrityStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';
import {Image, Text, StyleSheet} from 'react-native';
import {moderateScale, textScale} from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import CustomDrawerContent from '../Components/CustomDrawerContent';
import {View} from 'react-native-animatable';
import TabRoutes from './TabRoutes';
import TaxiTabRoutes from './TaxiTabRoutes';

const Drawer = createDrawerNavigator();
export default function DrawerRoutes(props) {
  console.log("navigation - DrawerRouter.js")
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const appMainData = useSelector((state) => state?.home?.appMainData);

 
  const {shortCodeStatus, appStyle, appData} = useSelector(
    (state) => state?.initBoot,
  );
 
  const businessType = appStyle?.homePageLayout;  

  const allCategory = appMainData?.categories;
 // const checkForCeleb = appData?.profile?.preferences?.celebrity_check;

  // const checkForCeleb =
  //   allCategory &&
  //   allCategory.find((x) => x?.redirect_to == staticStrings.CELEBRITY);
  // const checkForBrand =
  //   allCategory &&
  //   allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

  // var celebTab = null;
  // var brandTab = null;
  var gestureEnabled = false;
  var swipeEnabled = false;
  // if (checkForCeleb) {
  //   celebTab = (
  //     <Drawer.Screen
  //       component={CelebrityStack}
  //       name={navigationStrings.CELEBRITY}
  //       options={{
  //         gestureEnabled: gestureEnabled,
  //         swipeEnabled: swipeEnabled,
  //         drawerLabel: strings.CELEBRITY,
  //         drawerIcon: ({focused}) => (
  //           <Image
  //             source={focused ? imagePath.tabDActive : imagePath.tabDInActive}
  //           />
  //         ),
  //       }}
  //     />
  //   );
  // }

  // if (checkForBrand) {
  //   brandTab = (
  //     <Drawer.Screen
  //       component={BrandStack}
  //       name={navigationStrings.BRANDS}
  //       options={{
  //         gestureEnabled: gestureEnabled,
  //         swipeEnabled: swipeEnabled,
  //         drawerLabel: strings.BRANDS,
  //         drawerIcon: ({focused}) => (
  //           <Image
  //             source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
  //           />
  //         ),
  //       }}
  //     />
  //   );
  // }

  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}} 
      drawerPosition={'left'}
      backBehavior={'initialRoute'}
      drawerType={'front'}
      overlayColor={'rgba(0,0,0,0.6)'}
      // hideStatusBar={true}
      drawerStyle={{width: '75%', backgroundColor: colors.blueHeaderColor}}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {/* <Drawer.Screen
        component={TabRoutes}
        name={navigationStrings.HOMESTACK}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.HOME,
          drawerIcon: ({focused}) => (
            <Image
              source={focused ? imagePath.tabAActive : imagePath.tabAInActive}
            />
          ),
        }}
      /> */}

      <Drawer.Screen
      //  component={businessType === 4 ? TaxiTabRoutes : TabRoutes}
        component={TabRoutes}
        name={
            navigationStrings.TAB_ROUTES
        }
        // name={
        //   businessType === 4
        //     ? navigationStrings.TAXITABROUTES
        //     : navigationStrings.TAB_ROUTES
        // }
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.HOME,
          drawerIcon: ({focused}) => (
            <Image
              source={focused ? imagePath.tabAActive : imagePath.tabAInActive}
            />
          ),
        }}
      />
      <Drawer.Screen
        component={CartStack}
        name={navigationStrings.CART}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.BASKET,
          drawerIcon: ({focused}) => (
            <View style={{alignItems: 'center'}}>
              {cartItemCount?.data?.item_count ? (
                <View style={[styles.cartItemCountView]}>
                  <Text style={styles.cartItemCountNumber}>
                    {cartItemCount?.data?.item_count}
                  </Text>
                </View>
              ) : null}
              <Image
                source={focused ? imagePath.cartActive : imagePath.cartInActive}
              />
            </View>
          ),
        }}
      />
      {/* {brandTab}
      {celebTab} */}
      {/* <Drawer.Screen
        component={BrandStack}
        name={navigationStrings.BRANDS}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.BRANDS,
          drawerIcon: ({focused}) => (
            <Image
              source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
            />
          ),
        }}
      />
        <Drawer.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.CELEBRITY,
          drawerIcon: ({focused}) => (
            <Image
              source={focused ? imagePath.tabDActive : imagePath.tabDInActive}
            />
          ),
        }}
      /> */}
      <Drawer.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.ACCOUNTS,
          drawerIcon: ({focused}) => (
            <Image
              source={focused ? imagePath.tabEActive : imagePath.tabEInActive}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  cartItemCountView: {
    position: 'absolute',
    zIndex: 100,
    top: -5,
    right: -5,
    backgroundColor: colors.cartItemPrice,
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCountNumber: {
    fontFamily: fontFamily.futuraBtHeavy,
    color: colors.white,
    fontSize: textScale(8),
  },
});
