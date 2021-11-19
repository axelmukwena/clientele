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
        // Also load up all contacts to populate select options later in views
        Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
          (contactsError, contacts) => {
            if (contacts) {
              // Render view, send through locals/variables
              res.render('clients/index', { title: 'Clientele | Clients', clients, contacts });
            } else {
              console.log(contactsError);
            }
          },
        );
      } else {
        console.log(clientsError);
      }
    },
  );
};

// Formating hundredth digit. E.g 34 => 034, 6 => 006
function pad(n, length) {
  let len = length - (`${n}`).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n;
}

// Creating client document in Mongo
function handleCreation(name, code, count, contacts, res) {
  // Validate with schema
  const newClient = new Client({
    name,
    code: code + count,
    contacts,
  });

  // Save new resource
  newClient.save((error, data) => {
    if (error) {
      console.log(error);
      res.status(204).send();
    } else {
      console.log('');
      console.log(data);
      console.log('');
      res.redirect('/');
    }
  });
}

// Main create client method
// App will only route when response is successful
const createClient = (req, res) => {
  const { name, code, contacts } = req.body;

  // Validate the presence of key params
  if (!name || !code) {
    console.log('');
    console.log('Client name is empty');
    console.log('');
    res.status(204).send();
  } else {
    // Check if item with `code` value already exists
    Client.findOne({ code }).then((client) => {
      if (client) {
        console.log('');
        console.log('Client already exists!');
        console.log('');
        res.status(204).send();
      } else {
        // Update count value
        // Attach the count value to code => AAB001
        ClientCount.findOne({ name: 'counter' }, (findError, counter) => {
          // If client counter already exists, just update
          if (counter) {
            counter.count += 1;
            counter.save()
              .then((savedCounter) => {
                console.log(savedCounter);
                let { count } = savedCounter;

                // Create Client with updated count
                count = pad(count, 3);
                handleCreation(name, code, count, contacts, res);
              })
              .catch((savedError) => {
                console.log(savedError);
                res.status(204).send();
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
                const count = pad(1, 3);
                handleCreation(name, code, count, contacts, res);
                console.log('');
                console.log(newCounter);
                console.log('');
              } else {
                console.log(newCountError);
                res.status(204).send();
              }
            });
          }
        });
      }
    });
  }
};

// Unlink associated contacts from a client resource
const deleteClientsContact = (req, res) => {
  const { clientID, contactID } = req.body;
  // First, find the Client
  Client.findById(clientID, (clientError, client) => {
    if (client) {
      // Then remove the contact we wish to unlink, and save/update
      client.contacts.pull(contactID);
      client.save()
        .then(() => {
          res.redirect('/');
        })
        .catch((savedError) => {
          console.log(savedError);
          res.status(204).send();
        });
    } else {
      console.log(clientError);
      res.status(204).send();
    }
  });
};

module.exports = {
  clientsIndex,
  createClient,
  deleteClientsContact,
};
