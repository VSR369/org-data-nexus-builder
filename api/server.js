const express = require('express');
const cors = require('cors'); // Import the cors package
const countryApi = require('./countryApi');
const currencyApi = require('./currencyApi');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Use the cors middleware

// Use the country API routes
app.use('/api/countries', countryApi);

// Use the currency API routes
app.use('/api/currencies', currencyApi);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
