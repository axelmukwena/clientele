/* eslint-disable array-callback-return */

const Contact = require('../models/Contact');
const Client = require('../models/Client');

// Contacts index method: Displaying all the contacts
const contactsIndex = (req, res) => {
  // Find all, sorted ascending per attribute (surname and firstname)
  Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
    (contactsError, contacts) => {
      if (contacts) {
        // Also load clients to populate select option views
        Client.find({}).sort({ name: 'asc' }).exec(
          (clientsError, clients) => {
            if (clients) {
              // Render view, send through locals/variables
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

// Post a new contact to the database
// App will only route when response is successful
const createContact = (req, res) => {
  const {
    firstname, surname, email, clients,
  } = req.body;

  // Validate presence of required params
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
        // Validate with schema structure
        const newContact = new Contact({
          firstname, surname, email, clients,
        });

        // Finally, save new contact
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

// Unlink associated clients from a contact resource
const deleteContactsClient = (req, res) => {
  const { contactID, clientID } = req.body;
  // First, find the contact
  Contact.findById(contactID, (contactError, contact) => {
    if (contact) {
      // Then remove the client we wish to unlink, and save/update
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
