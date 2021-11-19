const mongoose = require('mongoose');

// Since MongoDB is not a relational database,
// id keys are not incremental and ordered.
// To fullfil the requirements, we create a counter,
// only one resource which we'll keep updating.
// We use this value to create a code value for client resources
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
