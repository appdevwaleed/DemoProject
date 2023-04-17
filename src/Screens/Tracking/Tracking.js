import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {useSelector} from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import stylesFun from './styles';
import commonStylesFun from '../../styles/commonStyles';
export default function Tracking({navigation}) {
  console.log("Tracking - Tracking.js")
  const currentTheme = useSelector((state) => state.appTheme);
  const [state, setState] = useState({
    trackId: '',
  });
  const {trackId} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {themeColors, themeLayouts} = currentTheme;
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily});

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

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
        centerTitle={strings.TRACKING}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />

      <View style={{...commonStyles.headerTopLine}} />

      <View style={styles.topSection}>
        <View style={styles.userProfileView}>
          <Image source={imagePath.track} />
        </View>
      </View>

      <View style={styles.bottomSection}>
        {/* {basicInfoView()} */}
        <BorderTextInputWithLable
          onChangeText={_onChangeText('trackId')}
          placeholder={strings.ENTER_HERE}
          value={trackId}
          label={strings.ENTERTRACKID}
        />
        <GradientButton
          textStyle={styles.textStyle}
          onPress={moveToNewScreen(navigationStrings.TRACKDETAIL)}
          marginTop={moderateScaleVertical(20)}
          marginBottom={moderateScaleVertical(30)}
          btnText={strings.TRACK}
        />
      </View>
    </WrapperContainer>
  );
}
