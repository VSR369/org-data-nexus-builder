const express = require('express');
const cors = require('cors'); // Import the cors package
const countryApi = require('./countryApi');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Use the cors middleware

// Use the country API routes
app.use('/api', countryApi);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
