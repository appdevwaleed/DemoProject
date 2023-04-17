import {useFocusEffect} from '@react-navigation/native';
import {debounce} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import HTMLView from 'react-native-htmlview';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';

export default function Wallet({navigation}) {
  console.log("Wallet - Wallet.js")
  const [state, setState] = useState({
    pageNo: 1,
    limit: 12,
    wallet_amount: 0,
    walletHistory: [],
    isRefreshing: false,
  });
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors} = useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state.auth.userData);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily, themeColors});
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  const {pageNo, walletHistory, limit, wallet_amount, isRefreshing} = state;
  //console.log(JSON.stringify(appData))

  useFocusEffect(
    React.useCallback(() => {
      getWalletData();
    }, [isRefreshing]),
  );

  useEffect(() => {
    getWalletData();
  }, [pageNo, isRefreshing]);

  const getWalletData = () => {
    actions
      .walletHistory(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
   
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          wallet_amount: res?.data?.wallet_amount,
          walletHistory:
            pageNo == 1
              ? res.data.transactions.data
              : [...walletHistory, ...res.data.transactions.data],
        });
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(10),
          }}>
          <View style={styles.addedMoneyTimeCon}>
            <Text
              style={
                isDarkMode
                  ? [styles.addedMoneyMonth, {color: MyDarkTheme.colors.text}]
                  : styles.addedMoneyMonth
              }>
              {moment(item.created_at).format('ll')}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.addedMoneyMonth, {color: MyDarkTheme.colors.text}]
                  : styles.addedMoneyTime
              }>
              {moment(item.created_at).format('LT')}
            </Text>
          </View>
          <View
            style={[styles.addMoneyListDesc, {backgroundColor: 'transparent'}]}>
            <HTMLView
              stylesheet={isDarkMode ? htmlStyle : null}
              value={`<p>${item?.meta}</p>`}
            />
            {/* <Text numberOfLines={2} style={styles.addedText}>
              {item.description}
            </Text> */}
             <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.addedMoneyValue, {color: MyDarkTheme.colors.text}]
                  : styles.addedMoneyValue
              }>
              {item.type == 'deposit' ? '+AED' : '-AED'}{' '}
              {currencyNumberFormatter(item.amount)}
            </Text>
          </View>
          {/* <View style={styles.addedMoneyValueCon}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.addedMoneyValue, {color: MyDarkTheme.colors.text}]
                  : styles.addedMoneyValue
              }>
              {item.type == 'deposit' ? '+AED' : '-AED'}{' '}
              {currencyNumberFormatter(item.amount)}
            </Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };
  const goToAddMoney = () => {
    moveToNewScreen(navigationStrings.ADD_MONEY, {})();
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}>
      <Header
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={strings.WALLET}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />

      {/* <Header
        leftIcon={imagePath.back}
        centerTitle={strings.WALLET}
        // rightIcon={imagePath.cartShop}
        headerStyle={{backgroundColor: Colors.white}}
      /> */}
      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={
          isDarkMode
            ? [
                styles.availableBalanceCon,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.availableBalanceCon
        }>
        <View style={styles.balanceCon}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.availableBalanceText,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.availableBalanceText
              }>
              {strings.AVAILABLE_BALANCE}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.availableBalanceValue,
                      {color: MyDarkTheme.colors.text},
                    ]
                  : styles.availableBalanceValue
              }>
              {'AED'} {currencyNumberFormatter(wallet_amount)}
            </Text>
          </View>
        </View>
        {/* <View style={styles.addMoneyCon}>
          <TouchableOpacity onPress={goToAddMoney} style={styles.addMoneybtn}>
            <Text style={styles.addMoneyText}>{strings.ADD_MONEY}</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      <View
        style={
          isDarkMode
            ? [
                styles.transactionHistoryCon,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.transactionHistoryCon
        }>
        <Text
          style={
            isDarkMode
              ? [
                  styles.transactionHistoryText,
                  {color: MyDarkTheme.colors.text},
                ]
              : styles.transactionHistoryText
          }>
          {strings.TRANSACTION_HISTORY}
        </Text>
      </View>
      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          flex: 1,
          paddingBottom:
            appStyle?.tabBarLayout == 3
              ? moderateScaleVertical(80)
              : moderateScaleVertical(5),
        }}>
        <FlatList
          data={walletHistory}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{height: 4}} />}
          ItemSeparatorComponent={(walletHistory, index) =>
            index == walletHistory.length ? null : (
              <View style={styles.cartItemLine}></View>
            )
          }
          keyExtractor={(item, index) => String(index)}
          // ListEmptyComponent={<ListEmptyOffers isLoading={true} />}
          // ListFooterComponent={() => <View style={{height: 10}} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          onEndReached={onEndReachedDelayed}
          onEndReachedThreshold={0.5}
          renderItem={_renderItem}
        />
      </View>
    </WrapperContainer>
  );
}
const htmlStyle = StyleSheet.create({
  p: {
    fontWeight: '300',
    color: '#e5e5e7', // make links coloured pink
  },
});
