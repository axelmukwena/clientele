const mongoose = require('mongoose');

// Autopopulate is simply a serializer.
// It allows getting full resources of referenced IDs, in this case contacts
const ContactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      autopopulate: { options: { sort: { name: 'asc' } } },
    },
  ],
});

ContactSchema.plugin(require('mongoose-autopopulate'));

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
