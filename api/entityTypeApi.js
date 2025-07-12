const express = require('express');
const { connectToDatabase } = require('./db');
const { successResponse, errorResponse } = require('./responseHandler');
const { ObjectId } = require('mongodb');

const router = express.Router();

connectToDatabase().then(async database => {
  let entityType;
  const collections = await database.listCollections({ name: 'entityType' }).toArray();
  if (collections.length === 0) {
    entityType = await database.createCollection('entityType');
    entityType.createIndex(
        { name: 1 },
        { unique: true }
      );
    console.log('Entity type collection created');
  } else {
    entityType = database.collection('entityType');
  }

  // Get all entity types
  router.get('/', async (req, res) => {
    try {
      const allEntityTypes = await entityType.find({}).toArray();
      successResponse(res, allEntityTypes);
    } catch (error) {
      errorResponse(res, 'Failed to fetch entity types');
    }
  });

  // Add a new entity type
  router.post('/', async (req, res) => {
    try {
      const newEntityType = req.body;
      const result = await entityType.insertOne(newEntityType);
      successResponse(res, [result]);
    } catch (error) {
        if (error.code === 11000) {
        // Duplicate key error
            errorResponse(res, 'Duplicate entity type detected');
        } else {
        console.log(error);
            errorResponse(res, 'Failed to add entity type');
        }
    }
  });

  // Update an existing entity type
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { id: _, ...updatedEntityType } = req.body;
      console.log("Update entity type data", updatedEntityType, id);
      console.log("Converted ObjectId for update:", new ObjectId(id));

      const result = await entityType.updateOne({ _id: new ObjectId(id) }, { $set: updatedEntityType });
      successResponse(res, [result]);
    } catch (error) {
      console.log(error)
      errorResponse(res, 'Failed to update entity type');
    }
  });

  // Delete a entity type
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await entityType.deleteOne({ _id: new ObjectId(id) });
      successResponse(res, [result]);
    } catch (error) {
      errorResponse(res, 'Failed to delete entity type');
    }
  });

}).catch(error => console.error('Failed to connect to database', error));

module.exports = router;
