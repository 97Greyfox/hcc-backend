const {Client} = require('../models/clientModel'); 
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const momentObj = require("moment");
const mongoose = require("mongoose");
const { use } = require('../routes/clientRoutes');

dotenv.config();
const s3 = new aws.S3({
  accessKeyId: `${process.env.ACCESS_KEY_AWS}`,
  secretAccessKey: `${process.env.SECRET_KEY_AWS}`,
  region: `${process.env.AWS_BUCKET_REGION}`,
  Bucket: `${process.env.AWS_BUCKET_NAME}`,
});


const addClient = async (req, res) => {
  try {
    const {clientName, address1, address2, city, state, zipCode, websiteAddress, email, phone, fax, primaryContact, status} = req.body; 
    
    const newClient = new Client({clientName, address1, address2, city, state, zipCode, websiteAddress, email, phone, fax, primaryContact, status});

    await newClient.save();
    res.status(201).json({ message: 'Client added successfully', Client: newClient });
  } catch (error) {
    res.status(400).json({ message: 'Error adding client', error: error.message });
  }
};


const editClient = async (req, res) => {
  try {
    const _id  = req.params.id; 
    const updatedData = req.body; 

    const updatedClient = await Client.findByIdAndUpdate(_id, updatedData, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
  } catch (error) {
    res.status(400).json({ message: 'Error updating client', error: error.message });
  }
};


const deleteClient = async (req, res) => {
  try {
    const _id  = req.params.id;  

    const deletedClient = await Client.findByIdAndDelete(_id);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully', client: deletedClient });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting client', error: error.message });
  }
};

async function getAllClients(req, res){
  const users = await Client.find({});
  return res.send(users);
}

async function getAllClientContacts(req, res) {
  try {
    const users = await Client.find({}, {
      email: 1,
      primaryContact: 1,
      fax: 1,
      phone: 1,
      clientName: 1,
      _id: 0, 
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving client contacts', error: error.message });
  }
}


async function getCLientById(req, res){
  try {
    const {id}  = req.params; 
  const client = await Client.findOne({_id : id});
  console.log(client);
  return res.status(200).json(client);
  } catch (error) {
    console.log(error);
  }
  
}

async function getClientByclientName(req, res){
  const {clientName, status} = req.query;
  let client;
    if (clientName) {
      client = await Client.find({clientName});
    }else if(status){
      client = await Client.find({status});
    }else{
      return res.send('incorrect query');
    }
    return res.send(client);
}

async function getClientByFilter(req, res) {
  try {
    const { zipCode, phone, email, Name, city, state } = req.query;
    const query = {};
    Object.entries({ zipCode, phone, email, clientName:Name, city, state }).forEach(([key, value]) => {
      if (value) {
          query[key] = { $regex: value, $options: "i" };
      }
    });

    if (Object.keys(query).length === 0) {
      return res.status(400).send("No valid query parameters provided.");
    }
    const clients = await Client.find(query, { __v: 0 });
    return res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).send("An error occurred while searching for clients.");
  }
}

const deleteAwsObj = async (obj) => {
  console.log("here in deleAWs", obj);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `${process.env.AWS_BUCKET_NAME}`,
      Key: obj.filename,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log("@@@@@!!!!!", err), reject(err);
      }
      return resolve(data);
    });
  });
};

const delFileByName = async (req, res, next) =>{
  try {
    const {clientId, attachmentId, fileId} = req.params;
    const {file} = req.body;
  if(!file){
    return res.status(500).send("File is required.");
  }
  const fileObj = {id:file, filename:file}
  await deleteAwsObj(fileObj);
  await Client.updateOne(
    { _id: clientId, "attachments._id": attachmentId }, 
    {
      $pull: {
        "attachments.$.files": { _id: fileId }, 
      },
    }
  );
  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  
}


// const uploadToS3 = (file) => {
//   console.log("here in uploadS3", file);

//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: `akhanhcc`,
//       Key: `${momentObj().format("hh:mm:ss")}-${file.originalname}`,
//       Body: file.buffer,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.log("@@!!!!!!@#!#!@#!@#@#@!#!@# file", err), reject(err);
//       }
//       const dataObj = {
//         fileUrl: data.Location,
//         filename: data.Key,
//       };
//       return resolve(dataObj);
//     });
//   });
// };

const uploadToS3 = (file) => {
  console.log("Uploading to S3:", file);

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `akhanhcc`,
      Key: `${momentObj().format("HH-mm-ss")}-${file.originalname}`, 
      Body: file.buffer,
      ContentType: file.mimetype, 
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("S3 Upload Error:", err);
        return reject(err);
      }

      const dataObj = {
        fileUrl: data.Location,
        filename: data.Key,
        contentType: file.mimetype, 
      };
      return resolve(dataObj);
    });
  });
};


const arrReturn = (item, arr) => {
  arr.push(item);
};

async function addFiles(req, res, next) {
  const { date, user, note, attachmentCategories } = req.body;
  const { clientId } = req.params;
  const files = req.files;
  var arr = [];
  try {
    let i = 0;
    while (i < files.length) {
      await uploadToS3(files[i])
        .then((res) => {
          arrReturn(res, arr);
        })
        .catch((err) => console.log(err));
      i++;
    }
    await Client.updateOne(
      { _id: clientId },
      {
        $push: {
          attachments: {
            date: date,
            user: user,
            note: note,
            attachmentCategories: attachmentCategories,
            files: arr,
          },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Added successfully", error: false });
};


async function delFiles(req, res, next){
  const { clientId, attachmentId } = req.params;
  const { oldFiles } = req.body;
  try {
    oldFiles.forEach((item) => {
      deleteAwsObj(item);
    });



  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the task", error: true });
    return next(error);

  }
  try {
    await Client.updateOne(
      { _id: clientId },
      {
        $pull: {
          attachments: { _id: attachmentId },
        },
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

async function delFile(req, res, next){
  const { clientId, attachmentId, fileId } = req.params;
  const  {oldFiles}  = req.body;
  try {
    oldFiles.forEach((item) => {
      if(item._id == fileId){
        deleteAwsObj(item);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Could not find the task", error: true });
    return next(error);  
  }
  try {
    await Client.updateOne(
      { _id: clientId }, 
      {
        $pull: {
          attachments: { _id: attachmentId } 
        }
      }
    );
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Deleted successfully", error: false });
};

async function getAllClientFiles(req, res) {

  const {id} = req.params;
  
  try {
    const client = await Client.findOne({ _id : id  });
    console.log(client);
    const files = client.attachments;
  


    return res.send(files);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving client files', error: error.message });
  }

}


async function getObjectUrl(req, res) {
  const {id, fileId, attachmentId} = req.params;

  const file = await Client.findOne(
    { _id: id}, 
  );
  let key;
  for (let i=0; i<file.attachments.length; i++){
    if(file.attachments[i]._id == attachmentId){
      for(let j = 0; j< file.attachments[i].files.length; j++){
        if(file.attachments[i].files[j]._id == fileId){
          key = file.attachments[i].files[j].filename;
        }
      }
    }
    
  }

  try {
  console.log("here in getObjectUrl", key);
  let preSignedUrl;
  const params = {
    Bucket: `akhanhcc`,
    Key: key,
  };
  preSignedUrl = await s3.getSignedUrl('getObject', params );
    
  
  console.log(preSignedUrl);
  res.send(preSignedUrl);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving client file', error: error.message });
  }

}

async function getObjectS3(key) {
  console.log("here in getObjectS3", key);
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: `akhanhcc`,
      Key: key,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        console.log("@@!!!!!!@#!#!@#!@#@#@!#!@# file", err), reject(err);
      }
      console.log(data, resolve(data));
      return data.Body;
    });
  });
}

async function getFile(req, res) {
  const {id, fileId, attachmentId} = req.params;
  const { date, user, note, attachmentCategories } = req.body;

  try {
    const file = await Client.findOne(
      { _id: id}, 
    );
    let key;
    for (let i=0; i<file.attachments.length; i++){
      if(file.attachments[i]._id == attachmentId){
        for(let j = 0; j< file.attachments[i].files.length; j++){
          if(file.attachments[i].files[j]._id == fileId){
            key = file.attachments[i].files[j].filename;
          }
        }
      }
      
    }
    const result = await getObjectS3(key);
    return res.send(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving client files', error: error.message });
  }
  
}

async function editFile(req, res, next) {
  const { date, user, note, attachmentCategories } = req.body;
  console.log(req.body);
  const { clientId, attachmentId, fileId } = req.params;

  console.log(clientId, " ",attachmentId, " ", date, " ", user, " ", note, " ", attachmentCategories);
  
  
  
  const files = req.files;
  var arr = [];
  try {
    if(files.length>0){
      const file = await Client.findOne(
        { _id: clientId}, 
      );
      let key;
      for (let i=0; i<file.attachments.length; i++){
        if(file.attachments[i]._id == attachmentId){
          for(let j = 0; j< file.attachments[i].files.length; j++){
            if(file.attachments[i].files[j]._id == fileId){
              key = file.attachments[i].files[j];
            }
          }
        }
      }
    
      deleteAwsObj(key);
      let i = 0;
      while (i < files.length) {
        await uploadToS3(files[i])
          .then((res) => {
            arrReturn(res, arr);
          })
          .catch((err) => console.log(err));
        i++;
      }
    }
    
    const result = await Client.updateOne(
      {
        _id: clientId,
        "attachments._id": attachmentId 
      },
      {
        $set: {
          "attachments.$.date": date,
          "attachments.$.user": user,
          "attachments.$.note": note,
          "attachments.$.attachmentCategories": attachmentCategories,
        }
      }
    );
    if(files.length>0){
      await Client.updateOne(
        { _id: clientId,
          "attachments._id": attachmentId,
         },
        {
          $set: {
            "attachments.$.files": arr 
          },
        }
      );
    }
    
    console.log(result);
  
  } catch (error) {
    res.json({ message: "Could not find the task", error: true });
    return next(error);
  }
  res.status(201).json({ message: "Edited successfully", error: false });
}



module.exports = {
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

};
