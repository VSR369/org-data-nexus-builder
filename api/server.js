const express = require('express');
const cors = require('cors'); // Import the cors package
const countryApi = require('./countryApi');
const currencyApi = require('./currencyApi');
const entityTypesApi = require('./entityTypeApi');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Use the cors middleware

// Use the country API routes
app.use('/api/countries', countryApi);

// Use the currency API routes
app.use('/api/currencies', currencyApi);

// use the entity type API routes
app.use('/api/entityTypes', entityTypesApi);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
