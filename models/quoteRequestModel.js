
const mongoose = require('mongoose');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const quoteRequest = new mongoose.Schema({
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
  contactInfo : {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      },
    },
    phoneNumber: {
      type: String,
      default : "",
      validate: {
        validator:  (v) => {
          const phoneNumber = parsePhoneNumberFromString(v);
          return phoneNumber && phoneNumber.isValid();
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  }
  ,
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
  },
  customerProject : {
    type: String,
    default:""
  },
  Budget: {
    type: Number,
  },
  dueDate: {
    type: Date,
    required: true,
  }
});

const quoteRequestInfo = mongoose.model('quoteRequest', quoteRequest);

module.exports = quoteRequestInfo;
