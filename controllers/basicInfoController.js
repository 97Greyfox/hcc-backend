const BasicInfo = require('../models/basicInfoModel');


const createContactInfo = async (req, res) => {
  try {
    const { firstName, lastName, companyName, email, phoneNumber, services, message } = req.body;

   
    const newContact = new BasicInfo({
      firstName,
      lastName,
      companyName,
      email,
      phoneNumber,
      services,
      message
    });

    
    await newContact.save();

    res.status(201).json({ message: 'Contact information saved successfully', contact: newContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createContactInfo };