const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
      autopopulate: true,
    },
  ],
});

ClientSchema.plugin(require('mongoose-autopopulate'));

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
