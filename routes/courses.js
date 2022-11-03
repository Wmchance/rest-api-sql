const express = require('express');
const router = express.Router();

// Middleware to authenticate requests using Basic Auth.
const { authenticateUser } = require('../middleware/auth-user');

const { Course } = require('../models');
const { User } = require('../models');

/* Handler function to wrap each route. */
//TODO move to middleware?
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
//TODO limit user info shown (First & last name only?)
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({include: User});
    res.json({
      courses,
    });
}));

/* (GET/Read) 
** Return the corresponding course including the User associated with that course and a 200 HTTP status code
*/
//TODO limit user info shown (First & last name only?)
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
//TODO Add Sequelize validation
//TODO Add additional validation criteria
//TODO try/catch?
//TODO use req.currentUser to process request? Should users only be able to create/assign courses for themselves?
//TODO is userId a required value?
//TODO one of the above two must be true
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  if(req.body.title && req.body.description) {  
    try {
      const course = await Course.create(req.body);
      res.location(`/api/courses/${course.id}`);
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
    res.status(400).json({ message: "Please include a 'title' & 'description'" })
  }
}));

/* (PUT/Update) 
** Update the corresponding course and return a 204 HTTP status code and no content
*/
//TODO add try/catch?
router.put('/:id', authenticateUser, asyncHandler(async (req ,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if(req.body.title && req.body.description) {
      if(req.currentUser.id === course.userId) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ message: "403 Forbidden" })
      }
    } else {
      res.status(400).json({ message: "Please include a 'title' & 'description'" })
    }
  } else {
    res.status(404).end();
  }
}));

/* (DELETE/Delete) 
** Delete the corresponding course and return a 204 HTTP status code and no content
*/
//TODO add try/catch
router.delete('/:id', authenticateUser, asyncHandler(async (req ,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if(req.currentUser.id === course.userId) {
      await course.destroy(); //Deletes course from db
      res.status(204).end();
    } else {
      res.status(403).json({ message: "403 Forbidden" })
    }
  } else {
    res.status(404).end();
  }
}));

module.exports = router;