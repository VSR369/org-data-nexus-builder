const express = require('express');
const { connectToDatabase } = require('./db');
const { successResponse, errorResponse } = require('./responseHandler');
const { ObjectId } = require('mongodb');

const router = express.Router();

connectToDatabase().then(async database => {
  let currencies;
  const collections = await database.listCollections({ name: 'currency' }).toArray();
  if (collections.length === 0) {
    currencies = await database.createCollection('currency');
    console.log('Currencies collection created');
  } else {
    currencies = database.collection('currency');
  }

  // Get all currencies
  router.get('/', async (req, res) => {
    try {
      const allCurrencies = await currencies.aggregate([
        {
          $lookup: {
            from: 'countries', // The collection to join
            localField: 'country_id', // Field from the currencies collection
            foreignField: '_id', // Field from the country collection
            as: 'countryData' // The name of the array field to add to the document
          }
        },
        {$unwind: '$countryData'}
      ]).toArray();
      successResponse(res, allCurrencies);
    } catch (error) {
      console.log(error)
      errorResponse(res, 'Failed to fetch currencies');
    }
  });

  // Add a new currency
  router.post('/', async (req, res) => {
    try {
      const newCurrency = req.body;
      newCurrency.country_id = new ObjectId(newCurrency.country_id);
      const result = await currencies.insertOne(newCurrency);
      successResponse(res, [result]);
    } catch (error) {
      errorResponse(res, 'Failed to add currency');
    }
  });

  // Update an existing currency
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { id: _, ...updatedCurrency } = req.body;
      updatedCurrency.country_id = new ObjectId(updatedCurrency.country_id);
      console.log("Update currency data", updatedCurrency, id);
      console.log("Converted ObjectId for update:", new ObjectId(id));

      const result = await currencies.updateOne({ _id: new ObjectId(id) }, { $set: updatedCurrency });
      successResponse(res, [result]);
    } catch (error) {
      console.log(error)
      errorResponse(res, 'Failed to update currency');
    }
  });

  // Delete a currency
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await currencies.deleteOne({ _id: new ObjectId(id) });
      successResponse(res, [result]);
    } catch (error) {
      errorResponse(res, 'Failed to delete currency');
    }
  });

}).catch(error => console.error('Failed to connect to database', error));

module.exports = router;
