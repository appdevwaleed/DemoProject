import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import StepIndicators from '../../Components/StepIndicator';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import stylesFun from './styles';
import commonStylesFun from '../../styles/commonStyles';

export default function TrackiDetail({navigation}) {
  console.log("TrackDetail - TrackDetail.js")
  const [state, setState] = useState({
    labels: [
      'Order\nSubmitted',
      'Start\nShipping',
      'On the\nWay',
      'Will be\nDelivered',
    ],
  });

  const {labels} = state;
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily, themeColors});

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header
        centerTitle={strings.TRACKDETAIL}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />

      <View style={{...commonStyles.headerTopLine}} />

      <View style={styles.topSection}>
        <View style={styles.userProfileView}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(20),
            }}>
            <Text style={styles.userEmail}>{strings.TRACKINGID}</Text>
            <Text style={styles.userName}>{'CVA4500238'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        {/* {basicInfoView()} */}
        <StepIndicators labels={labels} themeColor={themeColors} />
      </View>

      <View style={styles.viewDetailBottomView}>
        <TouchableOpacity
          onPress={moveToNewScreen(navigationStrings.ORDER_DETAIL)}>
          <Text style={styles.viewDetail}>{strings.VIEW_ORDER_DETAIL}</Text>
        </TouchableOpacity>
      </View>
    </WrapperContainer>
  );
}
