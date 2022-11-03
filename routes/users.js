const express = require('express');
const router = express.Router();

// Middleware to authenticate requests using Basic Auth.
const { authenticateUser } = require('../middleware/auth-user');

const { User } = require('../models');

/* Handler function to wrap each route. */
//TODO Move to middleware?
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* (GET/Read) 
** Return all properties and values for the currently authenticated User along with a 200 HTTP status code.
*/
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.currentUser.id);

  res.json({
    user,
  });

}));

/* (POST/Create) 
** Create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
*/
router.post('/', asyncHandler(async (req, res) => {
  if(req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
    try {
      await User.create(req.body);
      res.location('/');
      res.status(201).end();
    } catch (error) {
      if(error.name === "SequelizeValidationError") { 
        res.json({ 
          "message": 'Sequelize error'
        })
      } else {
        throw error;
      }  
    }
  } else {
    res.status(400).json({message: 'Please enter all personal information'})
  }
}));

module.exports = router;