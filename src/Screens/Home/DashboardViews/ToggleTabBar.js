import React, {useState, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import MaterialTabs from 'react-native-material-tabs';
import DeviceInfo from 'react-native-device-info';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import actions from '../../../redux/actions';
import {showError, showSuccess} from '../../../utils/helperFunctions';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import strings from '../../../constants/lang';

export default function ToggleTabBar({
  selcetedToggle,
  toggleData,
  isDineInSelected = false,
}) {
  console.log("Home - ToggleTabBar.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    selectedIndex: 0,
    tabs: [],
  });
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const [selectedTab, setSelectedTab] = useState(0);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const cartItemType = useSelector((state) => state?.cart?.cartItemType);

  const {selectedIndex, tabs} = state;
  useEffect(() => {
    addAllTabs();
    getSelectedTab();
  }, [appData]);

  useEffect(() => {
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      }
    }
  }, [dine_In_Type]);

  const getSelectedTab = () => {
    if (dine_In_Type == 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(0);
      } else {
        setSelectedTab(0);
      }
    }
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      }
    }
    if (dine_In_Type == 'takeaway') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else {
        setSelectedTab(2);
      }
    }
  };

  const addAllTabs = () => {
    const localTabsArray = [];
    userSelectedtab();
    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push(strings.DELIVERY);
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push(strings.DINE_IN);
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push(strings.TAKEAWAY);
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0
      ) {
        selcetedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
    });
  };

  useEffect(() => {
    userSelectedtab();
  }, [selectedTab]);

  const userSelectedtab = () => {
    if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 2) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 0
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 0 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 0 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    }
  };
  const dineInFunction = () => {
    Alert.alert('', `${strings.THIS_CHANGE_WILL_REMOVE_YOUR_CART}`, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {text: strings.CLEAR_CART2, onPress: () => clearCart2()},
    ]);
  };

  const clearCart2 = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };
  return (
    <>
      {tabs.length > 1 ? (
        <View
          style={{
            marginVertical: moderateScaleVertical(10),
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <MaterialTabs
            items={tabs}
            selectedIndex={selectedTab}
            onChange={
              !(
                cartItemCount?.message == null &&
                cartItemCount?.data?.item_count > 0
              )
                ? setSelectedTab
                : dineInFunction
            }
            barHeight={moderateScaleVertical(42)}
            indicatorColor={themeColors.primary_color}
            activeTextColor={themeColors.primary_color}
            barColor={
              isDarkMode ? MyDarkTheme.colors.lightDark : colors.greyColor2
            }
            inactiveTextColor={
              isDarkMode ? MyDarkTheme.colors.text : colors.textGreyF
            }
            indicatorHeight={3}
            textStyle={{fontSize: textScale(10)}}
          />
        </View>
      ) : null}
    </>
  );
}
