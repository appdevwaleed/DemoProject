import React, {useState} from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import stylesFun from './styles';

export default function WebPayment({navigation, route}) {
  console.log("TrackOrder - TrackOrder.js")
  const paramData = route?.params;
  const [state, setState] = useState({});
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={paramData?.paymentTitle || ''}
        headerStyle={{backgroundColor: Colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
    </WrapperContainer>
  );
}
