import {stringify} from 'querystring';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useSelector} from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import strings from '../../constants/lang';
import stylesFun from '../CourierService/ChooseCarTypeAndTime/styles';
import Modal from 'react-native-modal';

export default function PaymentProcessingModal({
  isModalVisible = false,
  //   navigation = {navigation},
  updateModalState,
}) {
  console.log("CourierService - PaymentProcessingModal.js")
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    isLoading: false,
  });
  const {isLoading} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        updateModalState();
      }, 2000);
    }
  }, [isModalVisible]);

  return (
    <Modal
      transparent={true}
      isVisible={isModalVisible}
      animationType={'slide'}
      style={styles.modalContainer}
      onLayout={(event) => {
        // updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <View style={{flex: 1}}>
        <View style={{flex:0.5,justifyContent: 'flex-end', alignItems: 'center'}}>
          <Image source={imagePath.cabLarge}/>
        </View>
        <View style={{flex:0.5,justifyContent: 'flex-end', alignItems: 'center',marginBottom:20}}>
          <Text style={[styles.bottomAcceptanceText,{fontSize:moderateScale(14)}]}>
            {strings.PROCESSINGPAYMENT}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
