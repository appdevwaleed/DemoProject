import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions, View, Button, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util'
import WrapperContainer from '../../Components/WrapperContainer';
import { useSelector } from 'react-redux';
import colors from '../../styles/colors';
import {
  loaderFive,
  loaderOne,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import Header from '../../Components/Header';
import { MyDarkTheme } from '../../styles/theme';
export default function OrderReceipt({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params;
  console.log(paramsData);
  const sharePdfBase64 = async (filePath) => {
    const shareOptions = {
      title: '',
      //url: pdfBase64,
      url: `file://${filePath}`,
      type: 'application/pdf',
      failOnCancel: true,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
      // setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('sharePdfBase64 Error =>', error);
      // setResult('error: '.concat(getErrorString(error)));
    }
  };

  const createPDF = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Cool Download Receipt Permission",
            message:
              "Cool Download Receipt Permission " +
              "so you can use it offline.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          let filePath = ReactNativeBlobUtil.fs.dirs.DownloadDir + `/${paramsData?.orderId}${paramsData?.vendorId}.pdf`;
          console.log(filePath);
          ReactNativeBlobUtil.fs.writeFile(filePath, paramsData.data, 'base64')
            .then(response => {
              console.log('Success Log: ', response);
              sharePdfBase64(filePath)
            })
            .catch(errors => {
              console.log(" Error Log: ", errors);
            })
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
    else {
      let filePath = ReactNativeBlobUtil.fs.dirs.DownloadDir + `/${paramsData?.orderId}${paramsData?.vendorId}.pdf`;
      console.log(filePath);
      ReactNativeBlobUtil.fs.writeFile(filePath, paramsData.data, 'base64')
        .then(response => {
          console.log('Success Log: ', response);
          sharePdfBase64(filePath)
        })
        .catch(errors => {
          console.log(" Error Log: ", errors);
        })
    }

  };
  const source = { uri: "data:application/pdf;base64," + paramsData.data };
  const [state, setState] = useState({
    isLoading: false
  })
  const {
    isLoading,
  } = state;
  const customRight = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={createPDF}
        >
          <Text
          style={{ color: isDarkMode
            ? MyDarkTheme.colors.text
            : colors.blackOpacity86,}}>{strings.SHARE}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          imagePath.icBackb
        }
        centerTitle={strings.ORDER_RECEIPT}
        customRight={customRight}
      />
      <View
        style={{
          height: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.borderLight,
        }}
      />
      <View style={styles.container}>
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link presse: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>
    </WrapperContainer>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});