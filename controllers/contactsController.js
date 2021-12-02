/* eslint-disable array-callback-return */

const Contact = require('../models/Contact');
const Client = require('../models/Client');

// Contacts index method: Displaying all the contacts
const contactsIndex = (req, res) => {
  // Find all, sorted ascending per attribute (surname and firstname)
  Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
    (contactsError, contacts) => {
      if (contacts) {
        // Render view, send through locals/variables
        res.render('contacts/index', { title: 'Clientele | Contacts', contacts });
      } else {
        console.log(contactsError);
      }
    },
  );
};

// Clients index method: Populating select client
const populateClients = (req, res) => {
  // Find all, sorted ascending per attribute (surname and firstname)
  Client.find({}).sort({ name: 'asc' }).exec(
    (clientsError, clients) => {
      if (clients) {
        // Render view, send through locals/variables
        res.json({ success: true, clients });
      } else {
        console.log(clientsError);
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
    res.json({ success: false, class: 'danger', message: 'Firstname, surname or email is empty!' });
  } else {
    // Validation, check by email if document already exits
    Contact.findOne({ email }).then((contactExist) => {
      if (contactExist) {
        // Respond with json. Please see ajax requests in public/scripts/contacts
        res.json({ success: false, class: 'danger', message: `${email} already exists!` });
      } else {
        // Validate with schema structure
        const newContact = new Contact({
          firstname, surname, email, clients,
        });

        // Finally, save new contact
        newContact.save((error, contact) => {
          if (error) {
            // Respond with json. Please see ajax requests in public/scripts/contacts
            res.json({ success: false, class: 'danger', message: error });
          } else {
            // Respond with json. Please see ajax requests in public/scripts/contacts
            res.json({
              success: true, class: 'success', message: `${contact.firstname} created!`, contact,
            });
          }
        });
      }
    });
  }
};

// Unlink associated clients from a contact resource
const unlinkContactsClient = (req, res) => {
  const { contactID, clientID } = req.body;
  // First, find the contact
  Contact.findById(contactID, (contactError, contact) => {
    if (contact) {
      // Then remove the client we wish to unlink, and save/update
      contact.clients.pull(clientID);
      contact.save()
        .then(() => {
          // Respond with json. Please see ajax requests in public/scripts/contacts
          res.json({ success: true, class: 'success', message: 'Contact\'s client removed!' });
        })
        .catch((savedError) => {
          // Respond with json. Please see ajax requests in public/scripts/contacts
          res.json({ success: false, class: 'danger', message: savedError });
        });
    } else {
      // Respond with json. Please see ajax requests in public/scripts/contacts
      res.json({ success: false, class: 'danger', message: contactError });
    }
  });
};

// Get one contact
const getOneContact = (req, res) => {
  const { id } = req.body;
  // Find contact
  Contact.findById(id, (contactError, contact) => {
    if (contact) {
      // Also load clients to populate select option views
      res.json({ success: true, contact });
    } else {
      console.log(contactError);
    }
  });
};

module.exports = {
  contactsIndex,
  createContact,
  unlinkContactsClient,
  getOneContact,
  populateClients,
};
