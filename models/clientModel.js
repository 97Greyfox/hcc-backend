const mongoose = require("mongoose");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const { string } = require("joi");

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    address1: {
      type: String,
      trim: true,
      default: "",
    },
    address2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    zipCode: {
      type: String,
      // required: true,
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[0-9]{5}(?:-[0-9]{4})?$/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid zip code!`,
      // },
    },
    websiteAddress: {
      type: String,
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/[\w-]*)*\/?$/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid URL!`,
      // },
    },
    email: {
      type: String,
      // required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v); //
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      // required: true,
      trim: true,
      // validate: {
      //   validator: function (v) {
      //     const phoneNumber = parsePhoneNumberFromString(v);
      //     return phoneNumber && phoneNumber.isValid();
      //   },
      //   message: (props) => `${props.value} is not a valid phone number!`,
      // },
    },
    fax: {
      type: String,
      trim: true,
      default: "",
    },
    primaryContact: {
      type: String,
      // required: true,
      trim: true,
    },
    status :{
      type: String,
      trim: true,
      default : "lead",
    },
    attachments: [
      {
        files: [
          {
            fileUrl: { type: String },
            filename: { type: String },
            contentType: { type: String },
          },
        ],
        date: { type: String },
        user: { type: String },
        note: { type: String },
        attachmentCategories: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = { Client };
