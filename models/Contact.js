const mongoose = require('mongoose');

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
      autopopulate: true,
    },
  ],
});

ContactSchema.plugin(require('mongoose-autopopulate'));

const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
