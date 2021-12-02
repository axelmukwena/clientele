// Module Imports
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
// Configurations
dotenv.config();
mongoose.Promise = global.Promise;

// Mongo DB connection and initialization
const database = process.env.MONGOLAB_URI_AFTER;
mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('Error:', err));

// Static Files
app.use(express.static('public'));

// Set Templating Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Parsing incoming requests
app.use(express.urlencoded({ extended: true }));
app.set('layout', 'partials/layout');
app.use(express.json());

// Initialize Routes
app.use('/', require('./routes/routes'));

// Listen on Port 2021, Eureka!
const PORT = process.env.PORT || 2021;
app.listen(
  PORT,
  console.log('Listening on:', PORT),
  console.log(`Local: http://localhost:${PORT}`),
);
