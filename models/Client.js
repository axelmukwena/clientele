const mongoose = require('mongoose');

// Autopopulate is simply a serializer.
// It allows getting full resources of referenced IDs, in this case contacts
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
      autopopulate: { options: { sort: { surname: 'asc', firstname: 'asc' } } },
    },
  ],
});

ClientSchema.plugin(require('mongoose-autopopulate'));

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
