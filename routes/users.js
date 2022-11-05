const express = require('express');
const router = express.Router();

// Middleware to authenticate requests using Basic Auth.
const { authenticateUser } = require('../middleware/auth-user');

// Handler function to wrap each route. //
const asyncHandler = require ('../middleware/asyncHandler').asyncHandler;

const { User } = require('../models');

/* (GET/Read) 
** Return all properties and values for the currently authenticated User along with a 200 HTTP status code.
*/
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({
      where: {id: req.currentUser.id},
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.json({user});
  } catch (error) {
    throw error; 
  }
  
}));

/* (POST/Create) 
** Create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
*/
router.post('/', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.location('/');
    res.status(201).end();
  } catch (error) {
    if(error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") { 
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors })
    } else {
      throw error;
    }  
  }
}));

module.exports = router;