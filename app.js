'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Route file paths
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const booksRouter = require('./routes/books');

// import the instance of sequelize that was instantiated in models/index.js
const { sequelize } = require('./models/index'); 

// Test connection to DB & sync models or throw error
(async () => {
  try {
    //asynchronously connect to the database and log out a message indicating that a connection has/hasn’t been established
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    //sync all models with the database
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Paths and routes to use together
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
// app.use('/books', booksRouter);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
