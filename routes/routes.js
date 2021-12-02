const express = require('express');
const {
  clientsIndex, createClient, unlinkClientsContact, getOneClient, populateContacts,
} = require('../controllers/clientsController');
const {
  contactsIndex, createContact, unlinkContactsClient, getOneContact, populateClients,
} = require('../controllers/contactsController');

const router = express.Router();

// Client routes
router.get('/', clientsIndex);
router.post('/clients/create', createClient);
router.post('/clients/unlink', unlinkClientsContact);
router.post('/client', getOneClient);
router.get('/populate/contacts', populateContacts);

// Contact routes
router.get('/contacts', contactsIndex);
router.post('/contacts/create', createContact);
router.post('/contacts/unlink', unlinkContactsClient);
router.post('/contact', getOneContact);
router.get('/populate/clients', populateClients);

module.exports = router;
