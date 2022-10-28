const express = require('express');
const router = express.Router();

const { User } = require('../models');

/* Handler function to wrap each route. */
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

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
}));

module.exports = router;