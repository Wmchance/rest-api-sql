const express = require('express');
const router = express.Router();

const { User } = require('../models');

// Handler function to wrap each route. //
const asyncHandler = require ('../middleware/asyncHandler').asyncHandler;

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
    res.json({
        message: 'Welcome to the REST API project!',
    });
}));

module.exports = router;