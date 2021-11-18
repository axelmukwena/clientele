const express = require('express');
const { clientsIndex, createClient } = require('../controllers/clientsController');
const { contactsIndex } = require('../controllers/contactsController');

const router = express.Router();

// Client routes
router.get('/', clientsIndex);
router.post('/clients/create', createClient);

// Contact routes
router.get('/contacts', contactsIndex);

module.exports = router;
