
const mongoose = require('mongoose');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const basicInfoSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
  }
  ,
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  phoneNumber: {
    type: String,
    unique: true,
    default : "",
    validate: {
      validator:  (v)=> {
        const phoneNumber = parsePhoneNumberFromString(v);
        return phoneNumber && phoneNumber.isValid();
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  services: [{
    serviceName: {
      type: String,
      required: true
    },
    requested: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  message: {
    type: String,
    default: ''
  }
});

const BasicInfo = mongoose.model('basicInfo', basicInfoSchema);

module.exports = BasicInfo;
