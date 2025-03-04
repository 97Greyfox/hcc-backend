const express = require('express');

const {createContactInfo} = require('../controllers/basicInfoController');

const contactInfoRouter = express.Router();

contactInfoRouter.post('/', createContactInfo);


module.exports = contactInfoRouter;