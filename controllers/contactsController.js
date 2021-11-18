/* eslint-disable array-callback-return */

const Contact = require('../models/Contact');
const Client = require('../models/Client');

const contactsIndex = (req, res) => {
  Contact.find((contactsError, contacts) => {
    if (contacts) {
      Client.find((clientsError, clients) => {
        if (clients) {
          res.render('contacts/index', { title: 'Clientele | Contacts', contacts, clients });
        } else {
          console.log(clientsError);
        }
      });
    } else {
      console.log(contactsError);
    }
  });
};

module.exports = {
  contactsIndex,
};
