const express = require('express');
const router = express.Router();

const { Course } = require('../models');

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

/* (GET/Read) 
** Return all properties and values for the currently authenticated User along with a 200 HTTP status code.
*/
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
    res.json({
      courses,
    });
}));

/* (GET/Read) 
** Return the corresponding course including the User associated with that course and a 200 HTTP status code
*/
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  console.log(course);
    res.json({
      course,
    });
}));


module.exports = router;