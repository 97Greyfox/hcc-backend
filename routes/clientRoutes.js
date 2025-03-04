const express = require('express'); 
const { uploads } = require("../confg/avatarMulterConfg.js");
const { 
  addClient,
  editClient,
  deleteClient,
  getAllClients,
  getCLientById,
  getAllClientContacts,
  getClientByFilter,
  addFiles,
  delFiles,
  delFile,
  getAllClientFiles,
  getFile,
  getObjectUrl,
  editFile,
  delFileByName,
  } = require('../controllers/clientsControllers.js');


const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(bodyParser.json({ limit: "250MB" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "250MB" }));
app.use(cors());

const router = express.Router();
const uploadFiles = 
  multer({
    limits: {
      fieldSize: 8 * 1024 * 1024,
      fileSize: 8 * 1024 * 1024,
    },
  }).array("files", 12);

router.get('/allclients', getAllClients);
router.get('/allclientscontacts', getAllClientContacts);
router.get('/client/:id', getCLientById);
router.get('/client/', getClientByFilter);
router.put('/edit/:id', uploads, editClient);
router.post('/add', uploads, addClient);
router.delete('/delete/:id', deleteClient);
router.patch("/addFiles/:clientId", uploadFiles, addFiles);
router.patch("/delFiles/:clientId&&:attachmentId", delFiles);
router.patch("/delFile/:clientId&&:attachmentId&&:fileId", delFile);
router.get('/allclientfiles/:id', getAllClientFiles);
router.get("/getFile/:id&&:attachmentId&&:fileId", getFile);
router.get("/getFileUrl/:id&&:attachmentId&&:fileId", getObjectUrl);
router.patch("/editFile/:clientId&&:attachmentId&&:fileId", uploadFiles ,editFile);
router.patch("/delFileByName/:clientId&&:attachmentId&&:fileId", delFileByName);



// router.get('/client/:clientName', getClientByclientName);

// router.get('/client/:email', getClientByEmail);



module.exports = router;