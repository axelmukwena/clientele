const mongoose = require('mongoose');

const ClientCountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
});

const ClientCount = mongoose.model('CountClients', ClientCountSchema);
module.exports = ClientCount;
