const express = require('express');
const multer = require('multer');
const { getAllZipCodes, addZipCode, modifyZipCode, deletedZipCode, getZipCodes, getZipByFilter } = require('../controllers/zipCodesController');

const upload = multer();

const router = express.Router();

router.get('/getzipcodes', getAllZipCodes);
router.get('/getfilteredzipcodes/', getZipByFilter);
router.get('/getallzipcodes', getZipCodes);
router.post('/addzipcode', upload.none(), addZipCode);
router.delete('/deletezipcode/:id', deletedZipCode);
router.patch('/modifyzipcode/:id',  modifyZipCode);

module.exports = router;
