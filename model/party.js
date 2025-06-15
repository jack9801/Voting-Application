const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  colorTheme: { type: String }, // hex or color name
  startTime: { type: Date },
  endTime: { type: Date }
});

 // export the model
const Party = mongoose.model('Party', partySchema);
module.exports = Party;