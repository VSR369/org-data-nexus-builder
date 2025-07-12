const express = require('express');
const { connectToDatabase } = require('./db');
const { successResponse, errorResponse } = require('./responseHandler');
const { ObjectId } = require('mongodb');

const router = express.Router();

connectToDatabase().then(async database => {
  let countries;
  const collections = await database.listCollections({ name: 'countries' }).toArray();
  if (collections.length === 0) {
    countries = await database.createCollection('countries');
    console.log('Countries collection created');
  } else {
    countries = database.collection('countries');
  }

  // Get all countries
  router.get('/', async (req, res) => {
    try {
      const allCountries = await countries.find({}).toArray();
      successResponse(res, allCountries);
    } catch (error) {
      errorResponse(res, 'Failed to fetch countries');
    }
  });

  // Add a new country
  router.post('/', async (req, res) => {
    try {
      const newCountry = req.body;
      const result = await countries.insertOne(newCountry);
      successResponse(res, [result]);
    } catch (error) {
      errorResponse(res, 'Failed to add country');
    }
  });

  // Update an existing country
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { id: _, ...updatedCountry } = req.body;
      console.log("Update country data", updatedCountry, id);
      console.log("Converted ObjectId for update:", new ObjectId(id));

      const result = await countries.updateOne({ _id: new ObjectId(id) }, { $set: updatedCountry });
      successResponse(res, [result]);
    } catch (error) {
      console.log(error)
      errorResponse(res, 'Failed to update country');
    }
  });

  // Delete a country
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await countries.deleteOne({ _id: new ObjectId(id) });
      successResponse(res, [result]);
    } catch (error) {
      errorResponse(res, 'Failed to delete country');
    }
  });

}).catch(error => console.error('Failed to connect to database', error));

module.exports = router;
