import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import store from '../../redux/store';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';
import { showError } from '../../utils/helperFunctions';
import { getItem } from '../../utils/utils';
import styles from './styles';

export default function ShortCode({ route, navigation }) {
  console.log("ShortCode - ShortCode.js")
  const shortCodeParam = route?.params?.shortCodeParam;
  // alert(shortCodeParam)
  const [state, setState] = useState({
    email: '',
    password: '',
    shortCode: null,
    isShortcodePrefilled: true,
    isBtnDisabled: true,
    isLoading: false,
    changeInShortCode: false,
  });
  const { dispatch } = store;

  const {
    shortCode,
    changeInShortCode,
    isBtnDisabled,
    isLoading,
    isShortcodePrefilled,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem('saveShortCode');
    //  console.log(getBundleId(),'THIS IS getBundleId()',saveShortCode,'THIS IS shortCode')
      getBundleId() === appIds.runrun && updateState({
        shortCode: shortCodes.runrun,
        isShortcodePrefilled: true,
      });
      // switch (getBundleId()) {
      //   case appIds.royoorder:
      //     // if (shortCodeParam) {
      //     //   updateState({shortCode: '', isShortcodePrefilled: false});
      //     // } else {
      //     //   updateState({shortCode: '245bae', isShortcodePrefilled: true});
      //     // }

      //     if (saveShortCode && !shortCodeParam) {
      //       updateState({
      //         shortCode: saveShortCode,
      //         isShortcodePrefilled: true,
      //       });
      //     } else {
      //       state;
      //       //updateState({shortCode: 'd0a898', isShortcodePrefilled: true});
      //       if (shortCodeParam) {
      //         updateState({ shortCode: '', isShortcodePrefilled: false });
      //       } else {
      //         updateState({ shortCode: 'bf8608', isShortcodePrefilled: true });
      //       }
      //     }
      //     break;
      //   case appIds.runrun:
      //     updateState({
      //       shortCode: shortCodes.runrun,
      //       isShortcodePrefilled: true,
      //     });
      //     break;
      // }
    })();
  }, []);

  useEffect(() => {
    if (shortCode && isShortcodePrefilled) {
      checkScreen();
    }
  }, [shortCode, isShortcodePrefilled]);

  const checkScreen = () => {
    initApiHit();

    updateState({ isShortcodePrefilled: true });
  };

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  //i did added in this fun signup page replace with tabroutes
  const _onSubmitShortCode = () => {
    updateState({ isLoading: true });
    setTimeout(() => {
      initApiHit();
    }, 1000);
  };

  const initApiHit = () => {
    let header = {};
    if (languages?.primary_language?.id) {
      header = {
        code: shortCode,
        language: languages?.primary_language?.id,
      };
    } else {
      header = {
        code: shortCode,
      };
    }

    actions
      .initApp({}, header, false, null, null, true)
      .then((res) => {
        updateState({ changeInShortCode: false }); 
        // if (getBundleId() == appIds.royoorder) {
        //   actions.saveShortCode(shortCode);
        // }
        navigation.push(navigationStrings.TAB_ROUTES);
       // homeData(res.data);
      })
      .catch((error) => {
        console.log("error", error);
        updateState({
          isLoading: false,
          changeInShortCode: false,
          shortCode: '',
        });
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };

  //get home data

  //Home data

  // const navigateToNextScreen = (res) => {
  //   getItem('firstTime').then((el) => {
  //     if (!el && res.dynamic_tutorial && res.dynamic_tutorial.length > 0) {
  //       navigation.push(navigationStrings.APP_INTRO, {
  //         images: res.dynamic_tutorial,
  //       });
  //     } else {
  //       navigation.push(navigationStrings.DRAWER_ROUTES);
  //     }
  //   });
  // };

  const homeData = (res) => {
    actions
      .homeData(
        {},
        {
          code: res?.profile?.code,
          currency: res?.currencies?.find((x) => x.is_primary).currency_id,
          language: res?.languages?.find((x) => x.is_primary).language_id,
        },
      )
      .then(() => {
        updateState({ isLoading: false });
        navigateToNextScreen(res);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        navigateToNextScreen(res);
      });
  };

  const onOtpInput = (code) => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
      });
      //
    })();
  };

  useEffect(() => {
    (async () => {
      if (changeInShortCode) {
        const saveShortCode = await getItem('saveShortCode');
        if (saveShortCode && shortCode != saveShortCode) {
          actions.userLogout();
          actions.cartItemQty({});
          actions.saveAddress(null);
          actions.saveAllUserAddress([]);
        }
        initApiHit();
      }
    })();
  }, [changeInShortCode]);

  // useEffect(() => {
  //   if (shortCode?.length === 6) {
  //     updateState({ isBtnDisabled: false });
  //   } else {
  //     updateState({ isBtnDisabled: true });
  //   }
  // }, [shortCode, isLoading]);

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      {isShortcodePrefilled ? (
        <View style={{ flex: 1 }}></View>
      ) : (
        <View
          style={{
            paddingHorizontal: moderateScale(24),
            flex: 1,
            marginTop: width / 3,
          }}>
          <Image style={{ alignSelf: 'center' }} source={imagePath.logo} />
          <View style={{ height: moderateScaleVertical(50) }} />
          <Text style={styles.enterShortCode}>{strings.ENTER_SHORT_CODE}</Text>
          <View style={{ height: 10 }} />
          <Text style={styles.enterShortCode2}>
            {strings.ENTERSHORTCODEBELOW}
          </Text>

          <View style={{ height: 10 }} />

          {/* <CodeInput
            // ref="codeInputRef2"
            secureTextEntry
            activeColor={colors.blueBackGroudB}
            inactiveColor={colors.blueBackGroudB}
            autoFocus={false}
            inputPosition="center"
            size={moderateScale(40)}
            keyboardType={'default'}
            codeLength={6}
            borderType={'underline'}
            onFulfill={(code) => onOtpInput(code)}
            containerStyle={{margin: 10}}
            codeInputStyle={{
              borderBottomWidth: 1,
              color: colors.blueBackGroudB,
            }}
          /> */}

          <SmoothPinCodeInput
            containerStyle={{ alignSelf: 'center' }}
            password
            mask={
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 25,
                  backgroundColor: 'blue',
                }}></View>
            }
            cellSize={width / 10}
            codeLength={6}
            cellSpacing={10}
            editable={true}
            cellStyle={{
              borderBottomWidth: 1,
              borderColor: 'gray',
            }}
            cellStyleFocused={{
              borderColor: 'black',
            }}
            textStyle={{
              fontSize: 24,
              color: colors.textBlue,
            }}
            textStyleFocused={{
              color: colors.textBlue,
            }}
            // autoCapitalize={'none'}
            inputProps={{
              autoCapitalize: 'none',
            }}
            value={shortCode}
            autoFocus={false}
            keyboardType={'default'}
            onTextChange={(shortCode) => updateState({ shortCode })}
            onFulfill={(code) => onOtpInput(code)}
          />

          <View style={{ height: 20 }} />

          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <ButtonWithLoader
              // isLoading={isLoading}
              color={colors.black}
              disabled={isBtnDisabled}
              btnStyle={{
                ...styles.guestBtn,
                ...{
                  backgroundColor: isBtnDisabled
                    ? colors.blueBackGroudB
                    : colors.blueBackGroudB,
                },
              }}
              btnTextStyle={{ color: colors.textBlue }}
              onPress={_onSubmitShortCode}
              btnText={strings.SUBMIT}
              btnTextStyle={{
                color: isBtnDisabled ? colors.white : colors.white,
              }}
            />
          </View>

          <View style={{ height: 20 }} />
        </View>
        // </KeyboardAwareScrollView>
      )}

      {/* </ScrollView> */}
    </WrapperContainer>
  );
}
