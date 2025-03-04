const mongoose = require('mongoose');

const TerritorySchema = new mongoose.Schema({
  territoryName: {
    type: String,
    trim: true,
  },
  territoryState: {
    type: [String],
    required: true,
  }
});


const Territory = mongoose.model('Territory', TerritorySchema);

module.exports = {Territory};