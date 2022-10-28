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

/* GET/Read 
** route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
*/
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAndCountAll();
    res.json({
        message: 'Check GET',
        'Number of users': users.count,
        'Users info': users.row,
    });
}));

module.exports = router;