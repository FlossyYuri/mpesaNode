const cors = require('cors');
const express = require('express');
module.exports = (app) => {
  // app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
};
