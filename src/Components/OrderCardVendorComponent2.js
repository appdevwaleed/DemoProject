import moment from 'moment';
import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { dummyUser } from '../constants/constants';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../utils/helperFunctions';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../styles/theme';
import { color } from 'react-native-reanimated';

export default function OrderCardVendorComponent2({
  data = {},
  titlestyle,
  selectedTab,
  onPress,
  navigation,
  onPressRateOrder,
  updateOrderStatus,
  onPressReturnOrder,
  etaTime = null,
  cardStyle,
}) {

  //console.log(data,'This is my data for item')
  let cardWidth = width - 21.5;

  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  //  console.log(object);
  let returnDays=appData?.profile?.preferences?.max_return_days
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const businessType = appStyle?.homePageLayout;
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const imageUrl =
    data && data.vendor
      ? getImageUrl(
        data.vendor.logo.image_fit,
        data.vendor.logo.image_path,
        '200/200',
      )
      : dummyUser;
  const fontFamily = appStyle?.fontSizeData;
  //console.log(appData, 'MY RE V')
  const styles = stylesFunc({ fontFamily, themeColors });
  //console.log(data);
  const isOrderReturnable = (delivereddate) => {
    let date_1 = new Date();
    let date_2 = new Date(delivereddate);
    const days = (date_1, date_2) => {
      let difference = date_1.getTime() - date_2.getTime();
      let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
      return TotalDays;
    }
    let noOfDays= days(date_1, date_2)
    if(returnDays>=noOfDays) return true;
    return false;
  }
 
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        ...styles.cardStyle,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
        ...cardStyle,
      }}>
      {data?.order_status?.current_status?.title !== strings.DELIVERED &&
        data?.order_status?.current_status?.title !== strings.REJECTED &&
        data?.order_status?.current_status?.title === strings.ACCEPTED &&
        (!!etaTime || !!data?.scheduled_date_time) && (
          <View
            style={{
              ...styles.ariveView,
              backgroundColor: themeColors?.primary_color,
            }}>
            <Text
              style={{
                ...styles.ariveTextStyle,
                color: colors.white,
              }}>
              {strings.YOUR_ORDER_WILL_ARRIVE_BY}{' '}
              {data?.scheduled_date_time ? data?.scheduled_date_time : etaTime}
            </Text>
          </View>
        )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderateScale(15),
              flex: 1,
            }}>
            <Image
              source={{ uri: imageUrl }}
              style={{
                height: moderateScale(35),
                width: moderateScale(35),
                borderRadius: moderateScale(40 / 2),
              }}
            />

            <Text
              numberOfLines={2}
              style={
                isDarkMode
                  ? [styles.userName, { color: MyDarkTheme.colors.text }]
                  : styles.userName
              }>
              {data?.vendor?.name || ''}
            </Text>
          </View>

          <View>
            <View style={{ width: moderateScale(130) }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.orderLableStyle, { color: MyDarkTheme.colors.text }]
                    : styles.orderLableStyle
                }>
                {`${strings.ORDER_ID}: #${data?.order_number}`}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.orderLableStyle,
                      {
                        color: MyDarkTheme.colors.text,
                        marginVertical: moderateScaleVertical(5),
                      },
                    ]
                    : [
                      styles.orderLableStyle,
                      {
                        marginVertical: moderateScaleVertical(5),
                        color: colors.black,
                      },
                    ]
                }>{`${moment(data?.date_time).format('DD MMM, YYYY')} ${moment(
                  data?.date_time,
                ).format('LT')} `}</Text>
            </View>
          </View>
        </View>

        {/* <View
          style={{flex: 0.3, alignItems: 'center', padding: moderateScale(10)}}>
          <Text
            style={
              isDarkMode
                ? [styles.userName, {color: MyDarkTheme.colors.text}]
                : [styles.userName]
            }>{`${currencies?.primary_currency?.symbol}${
            // Number(i?.pvariant?.multiplier) *
            Number(data?.payable_amount).toFixed(2)
          }`}</Text>
        </View> */}
      </View>
      <View
        style={[
          styles.borderStyle,
          { marginHorizontal: moderateScale(10) },
        ]}></View>
      <View
        style={{
          borderColor: colors.borderColorB,
          padding: moderateScale(10),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.semiBold,
            fontSize: textScale(14),
            marginVertical: moderateScaleVertical(10),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {`${strings.TOTAL_ITEMS}: ${data?.product_details?.length}`}
        </Text>
        {/* <ScrollView bounces={true}>
          {data?.product_details.map((i, inx) => {
            return (
              <View key={inx}>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(10),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={
                        isDarkMode
                          ? [
                            styles.orderLableStyle,
                            { color: MyDarkTheme.colors.text },
                          ]
                          : styles.orderLableStyle
                      }>
                      {i?.title || ''}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={
                        isDarkMode
                          ? [
                            styles.qtyViewStyle,
                            {
                              color: MyDarkTheme.colors.text,
                              fontSize: textScale(10),
                            },
                          ]
                          : [styles.qtyViewStyle, { fontSize: textScale(10) }]
                      }>
                      {`x ${i?.qty || ''}`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView> */}

        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={imagePath.iconPayments}
              style={{ tintColor: colors.textGreyB }}
            />
            <Text
              style={
                isDarkMode
                  ? [
                    styles.lableOrders,
                    {
                      paddingLeft: moderateScale(5),
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                  : [styles.lableOrders, { paddingLeft: moderateScale(5) }]
              }>
              {`${strings.PAYMENT} : `}
              <Text style={styles.valueOrders}>
                {data?.payment_option_title}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: themeColors.primary_color,
                marginHorizontal: moderateScale(10),
              }}>{`${currencies?.primary_currency?.symbol}${
                // Number(i?.pvariant?.multiplier) *
                Number(data?.order_detail?.payable_amount).toFixed(2)
                }`}</Text>
          </View>
        </View>

        <View style={[styles.borderStyle, { marginHorizontal: -15 }]}></View>

        {selectedTab && selectedTab == strings.PAST_ORDERS ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: moderateScale(15),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text
                  style={[
                    styles.orderStatusStyle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>

            {selectedTab && selectedTab == strings.PAST_ORDERS  && data?.order_status?.current_status?.title !== strings.REJECTED && isOrderReturnable(data?.order_status?.current_status?.updated_date) ? (
              <TouchableOpacity
                // onPress={onPressRateOrder}
                onPress={onPressReturnOrder}
                // style={{flex:0.6}}
                style={styles.bottomSecondHalf}>
                {businessType === 4 ? null : (
                  <View style={styles.orderAcceptAndReadyStyleSecond}>
                    <Text style={styles.orderStatusStyleSecond}>
                      {strings.RETURNORDER}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 0.6 }} />
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: moderateScale(15),
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text
                  style={[
                    styles.orderStatusStyle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>
            {selectedTab &&
              data?.dispatch_traking_url &&
              data?.product_details[0]?.category_type !=
              staticStrings.PICKUPANDDELIEVRY &&
              (selectedTab == strings.ACTIVE_ORDERS ||
                selectedTab == strings.SCHEDULED_ORDERS) ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.WEBVIEWSCREEN, {
                    title: strings.TRACKDETAIL,
                    url: data?.dispatch_traking_url,
                  })
                }
                style={{
                  borderRadius: 10,
                  backgroundColor: themeColors.primary_color,
                  justifyContent: 'center',
                }}>
                <View style={styles.trackStatusView}>
                  <Text style={styles.trackOrderTextStyle}>
                    {strings.TRACK_ORDER}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {selectedTab &&
              (selectedTab != strings.ACTIVE_ORDERS ||
                selectedTab != strings.SCHEDULED_ORDERS) ? null : (
              <View style={styles.bottomSecondHalf}>
                {data?.order_status?.current_status?.id == 1 ? (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(data, 8)}
                      style={styles.orderReject}>
                      <Text style={styles.orderStatusStyleSecond}>
                        {strings.REJECT}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ width: moderateScale(10) }} />
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(data, 7)}
                      style={styles.orderAccept}>
                      <Text style={styles.orderStatusStyleSecond}>
                        {strings.ACCEPT}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : data?.order_status?.upcoming_status ? (
                  <TouchableOpacity
                    onPress={() =>
                      updateOrderStatus(
                        data,
                        data?.order_status?.upcoming_status?.id,
                      )
                    }
                    style={styles.orderAcceptAndReadyStyleSecond}>
                    <Text style={styles.orderStatusStyleSecond}>
                      {data?.order_status?.upcoming_status?.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
export function stylesFunc({ fontFamily, themeColors }) {
  const commonStyles = commonStylesFunc({ fontFamily });

  let cardWidth = width - 21.5;

  const styles = StyleSheet.create({
    cardStyle: {
      width: cardWidth,
      // ...commonStyles.shadowStyle,
      marginHorizontal: 2,
      justifyContent: 'center',
      padding: moderateScaleVertical(5),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderColorB,
      borderRadius: moderateScale(6),
    },
    lableOrders: {
      // ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
      lineHeight: moderateScaleVertical(19),
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    valueOrders: {
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
      // opacity: 0.6,

      lineHeight: moderateScaleVertical(16),
    },
    orderAddEditViews: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    rateOrder: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },

    //vendor app order listing styles.
    orderLableStyle: {
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      opacity: 0.6,
    },
    userName: {
      marginHorizontal: moderateScale(14),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    qtyViewStyle: {
      marginHorizontal: moderateScale(15),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.6,
    },
    borderStyle: {
      borderWidth: 0.3,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: colors.lightGreyBgColor,
    },
    orderStatusStyle: {
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(12),
    },
    trackOrderTextStyle: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    orderStatusStyleSecond: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    orderAcceptAndReadyStyle: {
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    orderAcceptAndReadyStyleSecond: {
      flex: 0.6,
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    orderAccept: {
      backgroundColor: colors.green,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    orderReject: {
      backgroundColor: colors.redColor,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    imageCardStyle: {
      height: width / 6,
      width: width / 6,
      borderRadius: width / 12,
      marginRight: moderateScale(5),
    },
    circularQuantityView: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.primary_color,
      position: 'absolute',
      right: -2,
      top: -2,
      height: 25,
      width: 25,
      borderRadius: 25 / 2,
    },
    qunatityText: {
      color: colors.white,
      fontSize: textScale(10),
      fontFamily: fontFamily.medium,
    },
    scrollableContainer: {
      flexDirection: 'row',
      // marginBottom: moderateScaleVertical(10),
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: moderateScale(10),
    },
    currentStatusView: {
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    trackStatusView: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    bottomFirstHalf: {
      flex: 0.4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      // flexWrap:'wrap'
    },
    bottomSecondHalf: {
      flex: 0.6,
      alignItems: 'flex-end',
      justifyContent: 'center',
      // backgroundColor: 'black',
      // flexWrap:'wrap'
    },
    ariveTextStyle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
    },
    ariveView: {
      padding: moderateScale(6),
      borderTopRightRadius: moderateScale(6),
      borderTopLeftRadius: moderateScale(6),
    },
  });
  return styles;
}
