/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

const Client = require('../models/Client');
const ClientCount = require('../models/ClientCount');
const Contact = require('../models/Contact');

// Render all clients
const clientsIndex = (req, res) => {
  Client.find({}).sort({ name: 'asc' }).exec(
    (clientsError, clients) => {
      if (clients) {
        Contact.find({}).sort({ surname: 'asc', firstname: 'asc' }).exec(
          (contactsError, contacts) => {
            if (contacts) {
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

function pad(n, length) {
  let len = length - (`${n}`).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n;
}

function handleCreation(name, code, count, contacts, res) {
  const newClient = new Client({
    name,
    code: code + count,
    contacts,
  });

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

// Post a new client to the database
const createClient = (req, res) => {
  const { name, code, contacts } = req.body;

  if (!name || !code) {
    console.log('');
    console.log('Client name is empty');
    console.log('');
    res.status(204).send();
  } else {
    // Validation
    Client.findOne({ code }).then((client) => {
      if (client) {
        console.log('');
        console.log('Client already exists!');
        console.log('');
        res.status(204).send();
      } else {
        // update count and get the count value to attach
        // to client code
        ClientCount.findOne({ name: 'counter' }, (findError, counter) => {
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

const deleteClientsContact = (req, res) => {
  const { clientID, contactID } = req.body;
  Client.findById(clientID, (clientError, client) => {
    if (client) {
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
