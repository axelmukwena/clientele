const express = require('express');
const { clientsIndex, createClient, deleteClientsContact } = require('../controllers/clientsController');
const { contactsIndex, createContact, deleteContactsClient } = require('../controllers/contactsController');

const router = express.Router();

// Client routes
router.get('/', clientsIndex);
router.post('/clients/create', createClient);
router.post('/clients/unlink', deleteClientsContact);

// Contact routes
router.get('/contacts', contactsIndex);
router.post('/contacts/create', createContact);
router.post('/contacts/unlink', deleteContactsClient);

module.exports = router;
