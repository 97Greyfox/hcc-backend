const Joi = require('joi');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { Schema } = require('mongoose');
// const multer = require('multer');
// const upload = multer();

const signupValidation = (req, res, next)=>{
  const signupSchema = Joi.object({
    role: Joi.string().trim().allow(''),
    title: Joi.string().trim().allow(''),
    
    firstName: Joi.string().trim().required().messages({
      'any.required': 'First name is required.',
      'string.empty': 'First name cannot be empty.',
    }),
    secondName: Joi.string().trim().allow(''),
    address1: Joi.string().trim().required().messages({
      'any.required': 'Address1 is required.',
      'string.empty': 'Address1 cannot be empty.',
    }),
    address2: Joi.string().trim().allow(''),
    zipCode: Joi.string()
      .pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .required()
      .messages({
        'any.required': 'Zip code is required.',
        'string.pattern.base': 'Zip code must be in the format XXXXX or XXXXX-XXXX.',
      }),
    city: Joi.string().trim(),
    state: Joi.string().trim(),
    phone: Joi.string().trim().allow('').messages({
      'string.empty': 'phone cannot be empty.',
    }),
    cell: Joi.string().trim(),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'any.required': 'Email is required.',
        'string.email': 'Email must be a valid email address.',
      }),
    username: Joi.string()
      .trim()
      .required()
      .messages({
        'any.required': 'Username is required.',
        'string.empty': 'Username cannot be empty.',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'any.required': 'Password is required.',
        'string.min': 'Password must be at least 8 characters long.',
      }),
    avatar: Joi.string().trim().allow(''),
  }).options({ abortEarly: false });

  const {error} = signupSchema.validate(req.body);
  if(error){
    return res.status(400).json({message: 'bad request', error});
  }
  next(); 
}

const loginValidation = (req, res, next)=>{
  const loginSchema = Joi.object({
    username: Joi.string()
      .trim()
      .messages({
        'any.required': 'Username is required.',
        'string.empty': 'Username cannot be empty.',
      }),
    
    password: Joi.string()
    .min(8)
    .required()
    .messages({
      'any.required': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
    }),
  });

  const {error} = loginSchema.validate(req.body);
  if(error){
    return res.status(400).json({message: 'bad request', error});
  }
  next();

}

module.exports ={ 
  loginValidation,
  signupValidation,
}