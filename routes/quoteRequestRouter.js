const express = require('express');

const {createQuoteRequest} = require('../controllers/quoteRequestController');

const quoteRequestRouter = express.Router();

quoteRequestRouter.post('/', createQuoteRequest);


module.exports = quoteRequestRouter;