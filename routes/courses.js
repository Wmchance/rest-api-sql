const express = require('express');
const router = express.Router();

const { Course } = require('../models');
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

/* (GET/Read) 
** Return all properties and values for the currently authenticated User along with a 200 HTTP status code.
*/
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({include: User});
    res.json({
      courses,
    });
}));

/* (GET/Read) 
** Return the corresponding course including the User associated with that course and a 200 HTTP status code
*/
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {include: User});
  console.log(course);
    res.json({
      course,
    });
}));

/* (POST/Create) 
** Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content
*/
router.post('/', asyncHandler(async (req, res) => {
  try {
    await Course.create(req.body);
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
}));

/* (DELETE/Delete) 
** Delete the corresponding course and return a 204 HTTP status code and no content
*/
//TODO add try/catch
router.delete('/:id', asyncHandler(async (req ,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    await course.destroy(); //Deletes course from db
    res.status(204).end();
  } else {
    res.status(404).end();
  }
}));

module.exports = router;