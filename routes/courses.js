const express = require('express');
const router = express.Router();

// Middleware to authenticate requests using Basic Auth.
const { authenticateUser } = require('../middleware/auth-user');

// Handler function to wrap each route. //
const asyncHandler = require ('../middleware/asyncHandler').asyncHandler;

const { Course } = require('../models');
const { User } = require('../models');

/* (GET/Read) 
** Return all courses including the User associated with each course and a 200 HTTP status code
*/
router.get('/', asyncHandler(async (req, res) => {
  try{
    const courses = await Course.findAll({
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ courses });

  } catch (error) {
    throw error;
  }
}));

/* (GET/Read) 
** Return the corresponding course including the User associated with that course and a 200 HTTP status code
*/
router.get('/:id', asyncHandler(async (req, res) => {
  try {
    const course = await Course.findOne({
      where: {id: req.params.id}, 
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if(course) {
      res.json({ course });
    } else {
      res.status(404).json({message: "No course with that id"})
    }

  } catch (error) {
    throw error;
  }
}));

/* (POST/Create) 
** Create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content
*/
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.location(`/api/courses/${course.id}`);
    res.status(201).end();
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors })
    } else {
      throw error;
    }  
  }
}));

/* (PUT/Update) 
** Update the corresponding course and return a 204 HTTP status code and no content
*/
router.put('/:id', authenticateUser, asyncHandler(async (req ,res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if(course) {
      if(req.currentUser.id === course.userId) {
        try {
          course.title = req.body.title;
          course.description = req.body.description;
          await course.save({
            fields: ['title', 'description']
          });
          res.status(204).end();
        } catch (error) {
          if(error.name === "SequelizeValidationError") { 
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
          } else {
            throw error;
          }  
        }
      } else {
        res.status(403).json({ message: "403 Forbidden" })
      }
    } else {
      res.status(404).json({message: "No course with that id"});
    }

  } catch (error) {
    throw error;
  } 
}));

/* (DELETE/Delete) 
** Delete the corresponding course and return a 204 HTTP status code and no content
*/
router.delete('/:id', authenticateUser, asyncHandler(async (req ,res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if(course) {
      if(req.currentUser.id === course.userId) {
        try {
          await course.destroy(); 
          res.status(204).end();
        } catch (error) {
          throw error;
        }
      } else {
        res.status(403).json({ message: "403 Forbidden" })
      }
    } else {
      res.status(404).json({message: "No course with that id"});
    }

  } catch (error) {
    throw error;
  }
}));

module.exports = router;