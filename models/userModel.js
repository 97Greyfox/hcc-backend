const mongoose = require("mongoose");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { UserType } = require("./userTypeModel.js");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    trim: true,
    default: '',
  },
  title: {
    type: String,
    trim: true,
    default: '',
  },
  
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  secondName: {
    type: String,
    trim: true,
    default: '',
  },
  
  address1: {
    type: String,
    required: true,
    trim: true,
  },
  address2: {
    type: String,
    trim: true,
    default: '',
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
    //   },
    //   message: props => `${props.value} is not a valid zip code!`,
    // },
  },
  city: {
    type: String,
    // required: true,
    trim: true,
  },
  state: {
    type: String,
    //required: true,
    trim: true,
  },
  phone: {
    type: String,
    //unique: true,
    default : "",
    // validate: {
    //   validator:  (v)=> {
    //     const phoneNumber = parsePhoneNumberFromString(v);
    //     return phoneNumber && phoneNumber.isValid();
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // }
  },
  cell: {
    type: String,
    //unique: true,
    default : "",
    // validate: {
    //   validator:  (v)=> {
    //     const phoneNumber = parsePhoneNumberFromString(v);
    //     return phoneNumber && phoneNumber.isValid();
    //   },
    //   message: props => `${props.value} is not a valid phone number!`
    // }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  avatar: {
    type: String, 
    trim: true,
    default: '', 
  },
  },
{ timestamps: true },  
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
