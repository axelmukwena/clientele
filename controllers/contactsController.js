/* eslint-disable array-callback-return */

const Contact = require('../models/Contact');
const Client = require('../models/Client');

const contactsIndex = (req, res) => {
  Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
    (contactsError, contacts) => {
      if (contacts) {
        Client.find({}).sort({ name: 'asc' }).exec(
          (clientsError, clients) => {
            if (clients) {
              res.render('contacts/index', { title: 'Clientele | Contacts', contacts, clients });
            } else {
              console.log(clientsError);
            }
          },
        );
      } else {
        console.log(contactsError);
      }
    },
  );
};

// Post a new client to the database
const createContact = (req, res) => {
  const {
    firstname, surname, email, clients,
  } = req.body;

  if (!firstname || !surname || !email) {
    console.log('');
    console.log('Firstname, surname and/or email are/is empty');
    console.log('');
    res.status(204).send();
  } else {
    // Validation, check by email if document already exits
    Contact.findOne({ email }).then((contact) => {
      if (contact) {
        console.log('');
        console.log('Contact already exists!');
        console.log('');
        res.status(204).send();
      } else {
        // Create contact
        const newContact = new Contact({
          firstname, surname, email, clients,
        });

        newContact.save((error, data) => {
          if (error) {
            console.log(error);
            res.status(204).send();
          } else {
            console.log('');
            console.log(data);
            console.log('');
            res.redirect('/contacts');
          }
        });
      }
    });
  }
};

const deleteContactsClient = (req, res) => {
  const { contactID, clientID } = req.body;
  Contact.findById(contactID, (contactError, contact) => {
    if (contact) {
      contact.clients.pull(clientID);
      contact.save()
        .then(() => {
          res.redirect('/contacts');
        })
        .catch((savedError) => {
          console.log(savedError);
          res.status(204).send();
        });
    } else {
      console.log(contactError);
      res.status(204).send();
    }
  });
};

module.exports = {
  contactsIndex,
  createContact,
  deleteContactsClient,
};
