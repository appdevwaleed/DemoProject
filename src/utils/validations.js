import validator from 'is_js';
import strings from '../constants/lang';
import {parsePhoneNumber, isValidPhoneNumber} from 'libphonenumber-js';
const checkEmpty = (val, key) => {
  if (validator.empty(val.trim())) {
    return `${strings.PLEASE_ENTER} ${key}`;
  } else {
    return '';
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `${strings.PLEASE_ENTER_VALID} ${key}`;
  } else {
    return '';
  }
};

export default function (data) {
  let error = '';
  const {
    username,
    email,
    name,
    password,
    phoneNumber,
    newPassword,
    confirmPassword,
    message,
    otp,
    address,
    street,
    city,
    pincode,
    states,
    country,
    callingCode,
  } = data;
  console.log(message, 'message');
  if (username !== undefined) {
    let emptyValidationText = checkEmpty(username, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(username, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (name !== undefined) {
    let emptyValidationText = checkEmpty(name, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (address !== undefined) {
    let emptyValidationText = checkEmpty(address, strings.ENTER_NEW_ADDRESS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (street !== undefined) {
    let emptyValidationText = checkEmpty(street, strings.ENTER_STREET);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (city !== undefined) {
    console.log(city, 'city>>>>>>>>>>>');
    let emptyValidationText = checkEmpty(city, strings.CITY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (states !== undefined) {
    let emptyValidationText = checkEmpty(states, strings.STATE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (country !== undefined) {
    let emptyValidationText = checkEmpty(country, strings.COUNTRY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (pincode !== undefined) {
    let emptyValidationText = checkEmpty(pincode, strings.PINCODE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if (lastName !== undefined) {
  // 	let emptyValidationText = checkEmpty(lastName, 'last name');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		let minLengthValidation = checkMinLength(lastName, 3, 'Last name');
  // 		if (minLengthValidation !== '') {
  // 			return minLengthValidation;
  // 		}
  // 	}
  // // }

  // if (date !== undefined) {
  // 	let emptyValidationText = checkEmpty(date, 'date');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		if (validator.date(date)) {
  // 			ToastAndroid.showWithGravityAndOffset(`please Valid ${date}`,
  //   ToastAndroid.LONG,
  //   ToastAndroid.TOP,
  //   0,
  //   100
  //   )
  // 			return 'Please enter valid email';
  // 		}
  // 	}
  // }

  if (email !== undefined) {
    if (email === 'emptyValid') {
      return;
    }
    let emptyValidationText = checkEmpty(email, strings.EMAIL);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      if (!validator.email(email)) {
        return strings.PLEASE_ENTER_VALID_EMAIL;
      }
    }
  }

  if (phoneNumber !== undefined) {
    if (phoneNumber === 'emptyValid') {
      return;
    }
    // let emptyValidationText = checkEmpty(phoneNumber, strings.PHONE_NUMBER);
    // if (emptyValidationText !== '') {
    //   return emptyValidationText;
    // }
    if (!/^[0][1-9]$|^[1-9]\d{4,14}$/.test(phoneNumber)) {
      return strings.PLEASE_ENTER_VALID_PHONE_NUMBER;
    }

    // let isTrue = isValidPhoneNumber(`+${callingCode}${phoneNumber}`);

    if (phoneNumber == '') {
      return strings.PLEASE_ENTER_YOUR_PHONE_NUMBER;
    }
    // if (isTrue) {
    // } else {
    //   return strings.PHONE_NUMBER_NOT_VALID;
    // }
  }

  if (otp !== undefined) {
    let emptyValidationText = checkEmpty(otp, strings.OTP);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if(emailMobile!==undefined){
  // 	let emptyValidationText = checkEmpty(emailMobile, 'Email or mobile');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	}
  // 	if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(emailMobile)) {
  // 		if (!validator.email(emailMobile)) {
  // 			return 'Please enter valid email or mobile';
  // 		}
  // 	}
  // }

  if (password !== undefined) {
    let emptyValidationText = checkEmpty(password, strings.PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(password, 8, strings.PASSWORD);
      if (minLengthValidation !== '') {
        if (password != undefined) {
          return strings.PASSWORD_REQUIRE_EIGHT_CHARACTRES;
        }
        return strings.INVALID_PASSWORD;
      }
    }
  }

  if (newPassword !== undefined) {
    let emptyValidationText = checkEmpty(newPassword, strings.PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(
        newPassword,
        8,
        strings.PASSWORD,
      );
      if (minLengthValidation !== '') {
        if (newPassword != undefined) {
          return strings.NEW_PASSWORD_REQUIRE_EIGHT_CHARACTRES;
        }
        return strings.NEW_INCORRECT_PASSWORD;
      }
    }
  }

  if (confirmPassword !== undefined) {
    let emptyValidationText = checkEmpty(
      confirmPassword,
      strings.CONFIRM_PASSWORD,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (confirmPassword != newPassword) {
      return strings.PASSWORD_NOT_MATCH;
    }
  }

  if (message !== undefined) {
    let emptyValidationText = checkEmpty(message, strings.MESSAGE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(message, 6, strings.MESSAGE);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }
}
