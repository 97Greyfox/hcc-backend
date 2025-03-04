const express = require('express');
const multer = require('multer');
const { modifyTerritory, addTerritory, getAllTerritories, deletedTerritory, getTerritory, getTerritoryByFilter } = require('../controllers/territoryController');

const upload = multer();

const router = express.Router();

router.get('/getterritory/:id', getTerritory);
router.get('/getterritory/', getTerritoryByFilter);
router.get('/getallterritory', getAllTerritories);
router.post('/addterritory', addTerritory);
router.delete('/deleteterritory/:id', deletedTerritory);
router.patch('/modifyterritory/:id',  modifyTerritory);

module.exports = router;