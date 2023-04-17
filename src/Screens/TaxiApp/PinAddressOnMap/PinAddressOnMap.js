import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import stylesFun from './styles';
import {useSelector} from 'react-redux';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeightSecond,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import AutoUpLabelTxtInput from '../../../Components/AutoUpLabelTxtInput';
import {BlurView} from '@react-native-community/blur';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import navigationStrings from '../../../navigation/navigationStrings';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import Geolocation from 'react-native-geolocation-service';
import {chekLocationPermission} from '../../../utils/permissions';
import {getCurrentLocation, showError} from '../../../utils/helperFunctions';
import BottomViewModal from '../../../Components/BottomViewModal';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import GradientButton from '../../../Components/GradientButton';
import GeoFencing from 'react-native-geo-fencing';
import { getLocationData } from '../../../utils/helperFunctions';
import  { polygon }  from '../../../utils/deliveryAreaCoordinates';


export default function HomeScreenTaxi({navigation, route}) {
  console.log("TaxiApp - PinAddressOnMap.js")
  console.log('MYROUTEPARAMS',route)
  const mapRef = React.createRef();
  const paramData = route?.params;
  if( paramData.data === 'drop' &&  paramData?.dropOffLocationLatLng){
     initLat=  parseFloat(paramData?.dropOffLocationLatLng?.latitude);
     initLon= parseFloat(paramData?.dropOffLocationLatLng?.longitude);

  }else if(paramData.data === 'pickup' && paramData?.pickUpLocationLatLng){
    initLat=  parseFloat(paramData?.pickUpLocationLatLng?.latitude);
    initLon= parseFloat(paramData?.pickUpLocationLatLng?.longitude);
  }else{
    initLat= parseFloat(24.45434959254795);
    initLon=parseFloat(54.37699077687046);
  }

 console.log(initLat,initLon,'MY DATA DATA')
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    region: {
      latitude: initLat,
      longitude: initLon,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: initLon,
      longitude: initLon,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    locationListData: [
      {id: 1, location: 'ISBT,Sector43'},
      {id: 1, location: 'Shukna Lake'},
      {id: 1, location: 'Green View Tower'},
      {id: 1, location: 'Sector 28'},
    ],
    userCurrentLongitude: null,
    userCurrentLatitude: null,
    isVisible: false,
    task_type_id: null,
    task_type_id1: null,
    formattedAddress1: null,
    formattedAddress2: null,
    pickuplocationlat: null,
    pickuplocationlong: null,
    pickuplocationshortname: null,
    droplocationshortname: null,
    pickup_post_code: null,
    drop_post_code: null,
  });

  const {
    isLoading,
    addressLabel,

    formattedAddress,
    region,
    coordinate,
    locationListData,
    userCurrentLongitude,
    userCurrentLatitude,
    isVisible,
    task_type_id,
    task_type_id1,
    details,
  } = state;

  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const businessType = appStyle?.homePageLayout;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
   // mapRef.current.setMapBoundaries({latitude: 24.45434959254795, longitude: 54.37699077687046},{latitude: 24.45434959254795, longitude: 54.37699077687046})
   console.log(region, 'MY REGION MY REGION')
  
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        console.log(JSON.stringify(json),'MYSTRINGFYMY')
        updateState({
          formattedAddress: json.results[0].formatted_address,
        });
        let detail = {};
        detail = {
          formatted_address: json.results[0].formatted_address,
          geometry: {
            location: {
              lat: region.latitude,
              lng: region.longitude,
            },
          },
          address_components: json.results[0].address_components,
        };
        updateState({
          details: detail,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  const _getAddress = async (lat,lng) => {
    let res = await Geocoder.from({
      latitude: lat,
      longitude: lng,
    })
        console.log(JSON.stringify(res),'DATA FROM GETADDRESS')
        let detail = {};
        detail = {
          address_components: res.results[0].address_components,
        };
        return detail;
  }  
const checkLatLong =()=> {
  // console.log(polygon)
  // const polygon = [
  //   { lat: 24.457669521298318, lng: 54.26290926593139 },
  //   { lat: 24.611333169504864, lng: 54.47714266436889 },
  //   { lat: 24.43016515520426,  lng: 54.77926668780639 },
  //   { lat: 24.19488369470612, lng: 54.57052645343139 },
  //   { lat: 24.288798299661273, lng: 54.33157381671264 },
  //   { lat: 24.457669521298318, lng: 54.26290926593139 } // last point has to be same as first point
  // ];
  let point = {
    lat: details?.geometry?.location?.lat || region.latitude,
    lng: details?.geometry?.location?.lng || region.longitude,
  };
 console.log(point,'MYPOINT')
      GeoFencing.containsLocation(point, polygon)
        .then(() => {
          console.log('point is  within polygon');
          _modeToNextScreen()
          //_getAddress(point.lat,point.lng)
          // getLocationData(point.lat,point.lng)
          // .then((data)=>{
          //   console.log(JSON.stringify(data),'MY DATA AFTER ALL')
          //   _modeToNextScreen()
          // }).catch((err)=>{
          //   console.log('point is  within polygon  but  location address  error',err)
          //   updateState({region:  {
          //     latitude: initLat,
          //     longitude: initLon,
          //     latitudeDelta: 0.015,
          //     longitudeDelta: 0.0121,
          //   }});
          //})
        })
        .catch((err) => {
          showError(strings.NO_DELIVERY_SERVICE_AVAILABLE)
          console.log('point is NOT within polygon',err)
          updateState({region:  {
            latitude: initLat,
            longitude: initLon,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }});
          //_getAddressBasedOnCoordinates(region);
        })
    // animate(region);
}
  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                  //getting the Longitude from the location json
                  const currentLongitude = JSON.stringify(
                    position.coords.longitude,
                  );

                  //getting the Latitude from the location json
                  const currentLatitude = JSON.stringify(
                    position.coords.latitude,
                  );
                  updateState({
                    userCurrentLongitude: currentLongitude,
                    userCurrentLatitude: currentLatitude,
                  });
                },
                (error) => alert(error.message),
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 1000,
                },
              );
            })
            .catch((err) => {});
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  //Animating the marker
  const animate = (region) => {
    const {coordinate} = state;
    const newCoordinate = {
      ...region,
    };
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current._component.animateMarkerToCoordinate(
          newCoordinate,
          500,
        );
      }
      updateState({region: new AnimatedRegion(region)});
      _getAddressBasedOnCoordinates(region);
    } else {
      coordinate.timing(newCoordinate).start();
      updateState({region: new AnimatedRegion(region)});
      _getAddressBasedOnCoordinates(region);
    }
  };

  //On Dragging the marker
  const _onDragEnd = (e) => {

    updateState({
      coordinate: new AnimatedRegion({
        ...e.nativeEvent.coordinate,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }),
      region: {
        ...region,
        ...e.nativeEvent.coordinate,
      },
    });
    _getAddressBasedOnCoordinates({
      ...e.nativeEvent.coordinate,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

const _modeToNextScreen = () => {
    console.log(paramData,'pickuplocationAllData')
    console.log(details,'pickuplocationAllData')
    const pickuplocationAllData = [
      {
        longitude: details?.geometry?.location?.lng,
        latitude: details?.geometry?.location?.lat,
        address: details?.formatted_address,
        task_type_id: paramData?.data === 'drop' ? 2 : 1,
      },
    ];
    console.log(pickuplocationAllData,'pickuplocationAllData')
    navigation.navigate(navigationStrings.ADDADDRESS, {
      data: {pickuplocationAllData, id: paramData?.data?.id},
    });
    //   }
  };

  const markerRef = useRef();

  const currentLocationOnMap = () => {
    mapRef.current.animateToRegion({
      latitude: userCurrentLatitude,
      longitude: userCurrentLongitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };
 
  return (
    <>
      <MapView
        ref={mapRef}
      //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        initialRegion={region}
        //maxZoomLevel={8}
      //  customMapStyle={mapStyleGrey}
        // pointerEvents={'none'}
        // onPress={()=>{
        //   mapRef.current.setMapBoundaries({latitude: 24.45434959254795, longitude: 54.37699077687046},{latitude: 25.1288, longitude: 56.3265})
        // }}
        onRegionChangeComplete={_onRegionChange}>
        {/* <Marker
            ref={markerRef}
            // pointerEvents={'none'}
            coordinate={coordinate}
            image={imagePath.mapPin2}
            // onDrag={(e) => _onDrag(e)}
            // onDragEnd={(e) => _onDragEnd(e)}
            // onPress={(e) => console.log('onPress', e)}
            // draggable
          /> */}
      </MapView>
      <View style={[styles.backbutton, {marginHorizontal: moderateScale(15)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScaleVertical(15),
              borderRadius: 15,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.greyColor,
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrow}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* {businessType === 4 ? null : (
        <View style={styles.userAccountImageStyle}>
          <Image source={imagePath.taxiUserAccount} />
        </View>
      )} */}

      <View
        style={{
          position: 'absolute',
          top: height / 2 - StatusBarHeightSecond,
          right: width / 2,
          left: width / 2,
          bottom: height / 2,
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: height / 2,
        }}>
        <Image source={imagePath.mapPin2} />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: width - 40,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            marginBottom: 40,
            textAlign: 'center',
            color: colors.black,
            fontFamily: fontFamily.medium,
          }}>
          {strings.PLACE_PIN_ON_MAP}
        </Text>
        <GradientButton btnText={'Done'} onPress={() => checkLatLong()} />
      </View>
    </>
  );
}
