const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
  userTypeCategory: {
    type: String,
    required: true,
    trim: true,
  },
  userTypeFlag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, { timestamps: true });

const UserType = mongoose.model('UserType', userTypeSchema);
module.exports = { UserType };