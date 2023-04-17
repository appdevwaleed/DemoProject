import React, {useEffect, useState} from 'react';
import {Image, View,TouchableOpacity,Linking,Button,Pressable, PermissionsAndroid, ListItem, FlatList, ScrollView, Text, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import Communications from 'react-native-communications';
import navigationStrings from '../../navigation/navigationStrings';
import BorderTextArea from "../../Components/BorderTextArea";
import Contacts from 'react-native-contacts';

export default function ContactsBook({navigation, route}) {

  console.log("ContactsBook - ContactsBook.js")
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  console.log(appData.profile,"THIS IS MY CONTACT BOOK")

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const userData = useSelector((state) => state?.auth?.userData);

  const [state, setState] = useState({
    contactsList:[],
    isLoading: false,
  });

  const {isLoading, contactsList} = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const [contacts, setContacts] = useState([]);
  const [searchedContacts, setSearchedContacts] = useState([]);

  
  
    useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                })
                .then(() => {
                    loadContacts();
                })
        } 
        else {
            loadContacts();
        }
    }, []);

    const loadContacts = () => {
        let newcontacts= []
        Contacts.getAll()
          .then(contacts => {
            contacts= contacts?.map((item, index)=>{
                if(item?.phoneNumbers[0]?.number!==null&&item?.phoneNumbers[0]?.number!==undefined&&item?.phoneNumbers[0]?.number!==""){
                    newcontacts.push({
                        id:index,
                        phonenumber: item?.phoneNumbers[0]?.number,
                        name:item?.displayName
                    })
                }
            })
            contacts.sort(
              (a, b) => 
              a.name.toLowerCase() > b.name.toLowerCase(),
            );
            setContacts(newcontacts);
            setSearchedContacts(newcontacts)
            console.warn(JSON.stringify(newcontacts), 'contacts');
          })
          .catch(e => {
            console.log(e, "loadContacts")
            alert('Permission to access contacts was denied');
            // console.warn('Permission to access contacts was denied');
          });
      };

    const search = (text) => {
        console.log("text", text)
        const phoneNumberRegex = 
          /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        if (text === '' || text === null) {
          loadContacts();
        } 
        // else if (phoneNumberRegex.test(text)) {
        //   Contacts.getContactsByPhoneNumber(text).then(contacts => {
        //     // contacts.sort(
        //     //   (a, b) => 
        //     //   a.name.toLowerCase() > b.name.toLowerCase(),
        //     // );
        //     setContacts(contacts);
        //     // console.log('contacts', contacts);
        //   });
        // } 
        else {
            let filteredData = contacts.filter(x => String(x.name).includes(text)||String(x.phonenumber).includes(text));

            // let contacts = contacts.names?.includes(text);
            setSearchedContacts(filteredData)
        //   Contacts.includes(text).then(contacts => {
        //     // contacts.sort(
        //     //   (a, b) => 
        //     //   a.name.toLowerCase() > b.name.toLowerCase(), 
        //     // );
        //     setContacts(contacts);
        //     // console.log('contacts', contacts);
        //   });
        }
    };
      
    const openContact = (contact) => {
        console.log(JSON.stringify(contact));
        Contacts.openExistingContact(contact);
    };

    
    const _renderItem = ({ item, index }) => {
        return (
          <TouchableOpacity onPress={()=>{
            route?.params?.onSelect(route?.params?.type, item);
            navigation.goBack()
          }}
                style={{ width:'100%', justifyContent:"center", borderBottomColor:colors.grey2, borderBottomWidth:1, paddingVertical:10 }}>
                <Text style={{fontFamily:fontFamily.bold, fontSize:14, color:colors.black}}>{item?.name}</Text>
                <Text  style={{fontFamily:fontFamily.medium, fontSize:14, color:colors.black}}>{item?.phonenumber}</Text>
          </TouchableOpacity>
        )
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
        centerTitle={strings.CONTACTSBOOK}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />
      <TextInput
          onChangeText={search}
          placeholder="Search"
          style={{
            backgroundColor: '#f0eded',
            paddingHorizontal: 30,
            paddingVertical: Platform.OS === 'android' ? undefined : 15,
          }}
        />
      <View
              style={{
                // marginHorizontal: moderateScale(8),
                // marginTop: moderateScaleVertical(10),
                
              }}>
            <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20, width:'100%'}}>

              <FlatList

                numColumns={1}
                // columnWrapperStyle={{
                //     flex: 1,
                //     alignItems: "space-around",
                //     paddingHorizontal:20
                // }}
                showsHorizontalScrollIndicator={false}
                directionalLockEnabled={true}
                alwaysBounceVertical={false}
                data={searchedContacts}
                keyExtractor={(item) => item?.id?.toString()}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => (
                  <View style={{ }} />
                )}
              />
              </ScrollView>
            </View>
    </WrapperContainer>
  );
}
