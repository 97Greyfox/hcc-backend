const express = require('express');
const multer = require('multer');
const {getAllUserTypes, addUserType, modifyUserType, deletedUserType, getUserTypesByFilter} = require('../controllers/userTypeController.js');

const upload = multer();

const router = express.Router();

router.get('/getallusertypes', getAllUserTypes);
router.get('/getallusertype/', getUserTypesByFilter);
router.delete('/deleteusertype/:id', deletedUserType);
router.post('/addusertype', upload.none(), addUserType);
router.patch('/modifyusertype/:id',  modifyUserType);

module.exports = router;
