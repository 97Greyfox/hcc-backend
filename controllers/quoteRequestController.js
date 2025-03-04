const quoteRequestInfo = require('../models/quoteRequestModel');


const createQuoteRequest = async (req, res) => {
  try {
    const { firstName, lastName, companyName, contactInfo, services, message, cutomerProject, Budget, dueDate, } = req.body;

   
    const newContact = new quoteRequestInfo({
      firstName,
      lastName,
      companyName,
      contactInfo,
      services,
      message,
      cutomerProject,
      Budget,
      dueDate,
    });

    
    await newContact.save();

    res.status(201).json({ message: 'Contact information saved successfully', contact: newContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createQuoteRequest };