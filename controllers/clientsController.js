/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

// Importing mainly models schemas
const Client = require('../models/Client');
const ClientCount = require('../models/ClientCount');
const Contact = require('../models/Contact');

// Clients index method: Displaying all the clients
const clientsIndex = (req, res) => {
  // Find all, sorted ascending per attribute (name)
  Client.find({}).sort({ name: 'asc' }).exec(
    (clientsError, clients) => {
      if (clients) {
        // Render view, send through locals/variables
        res.render('clients/index', { title: 'Clientele | Clients', clients });
      } else {
        console.log(clientsError);
      }
    },
  );
};

// Contacts index method: Populating select contacts
const populateContacts = (req, res) => {
  // Find all, sorted ascending per attribute (surname and firstname)
  Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
    (contactsError, contacts) => {
      if (contacts) {
        // Render view, send through locals/variables
        res.json({ success: true, contacts });
      } else {
        console.log(contactsError);
      }
    },
  );
};

// Formating hundredth digit. E.g 34 => 034, 6 => 006
function alphaNumeric(n, length, alphaCode) {
  let len = length - (`${n}`).length;
  const numeric = (len > 0 ? new Array(++len).join('0') : '') + n;
  return alphaCode + numeric;
}

// Creating client document in Mongo
function handleCreation(name, code, contacts, res) {
  // Validate with schema
  const newClient = new Client({
    name,
    code,
    contacts,
  });

  // Save new resource
  newClient.save((error, client) => {
    if (error) {
      res.json({ success: false, class: 'danger', message: error });
    } else {
      res.json({
        success: true, class: 'success', message: `${client.code} created!`, client,
      });
    }
  });
}

// Main create client method
// App will only route when response is successful
const createClient = (req, res) => {
  const { name, contacts } = req.body;
  const alphaCode = req.body.code;

  // Validate the presence of key params
  if (!name || !alphaCode) {
    // Respond with json. Please see ajax requests in public/scripts/clients
    res.json({ success: false, class: 'danger', message: 'Client name or code is empty!' });
  } else {
    // Update count value
    // Attach the count value to code => AAB001
    ClientCount.findOne({ name: 'counter' }, (findError, counter) => {
      // If client counter already exists, just update
      if (counter) {
        counter.count += 1;
        // get formated count
        const code = alphaNumeric(counter.count, 3, alphaCode);
        // Check if item with `code` value already exists
        Client.findOne({ code }).then((client) => {
          console.log(code);
          if (client) {
            // Respond with json. Please see ajax requests in public/scripts/clients
            res.json({ success: false, class: 'danger', message: `Code ${code} already exists!` });
          } else {
            // Save updated counter, create client
            counter.save()
              .then(() => {
                handleCreation(name, code, contacts, res);
              })
              .catch((savedError) => {
                res.json({ success: false, class: 'danger', message: savedError });
              });
          }
        });
      } else {
        // If no client counter, create one
        const newCount = new ClientCount({
          name: 'counter',
          count: 1,
        });

        newCount.save((newCountError, newCounter) => {
          if (newCounter) {
            // Create Client with updated count
            // By default counter == 0, hence now 1
            // get formated count
            const code = alphaNumeric(newCounter.count, 3, alphaCode);
            handleCreation(name, code, contacts, res);
          } else {
            res.json({ success: false, class: 'danger', message: newCountError });
          }
        });
      }
    });
  }
};

// Unlink associated contacts from a client resource
const unlinkClientsContact = (req, res) => {
  const { clientID, contactID } = req.body;
  // First, find the Client
  Client.findById(clientID, (clientError, client) => {
    if (client) {
      // Then remove the contact we wish to unlink, and save/update
      client.contacts.pull(contactID);
      client.save()
        .then(() => {
          // Respond with json. Please see ajax requests in public/scripts/contacts
          res.json({ success: true, class: 'success', message: 'Client\'s contact removed!' });
        })
        .catch((savedError) => {
          res.json({ success: false, class: 'danger', message: savedError });
        });
    } else {
      res.json({ success: false, class: 'danger', message: clientError });
    }
  });
};

// Get one contact
const getOneClient = (req, res) => {
  const { id } = req.body;
  // Find contact
  Client.findById(id, (clientError, client) => {
    if (client) {
      // Also load clients to populate select option views
      res.json({ success: true, client });
    } else {
      console.log(clientError);
    }
  });
};

module.exports = {
  clientsIndex,
  createClient,
  unlinkClientsContact,
  populateContacts,
  getOneClient,
};
