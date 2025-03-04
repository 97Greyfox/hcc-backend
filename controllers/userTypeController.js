const { UserType } = require('../models/userTypeModel');
const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');


function loadUserTypes(){
  return new Promise((resolve, reject) => {fs.createReadStream(path.join(__dirname,'..','data','userTypes.csv'))
  .pipe(parse({
    comment:  '#',
    columns: true,}
  ))
  .on('data', async (data) => {
    try{
      if (data.userTypeFlag && data.userTypeCategory) {
        await UserType.updateOne({
          userTypeCategory: data.userTypeCategory,
        },{
          userTypeCategory: data.userTypeCategory,
          userTypeFlag: data.userTypeFlag,
        }   
        ,{
          upsert:true
      });
      }
     
   } catch(err){
    console.error('Error parsing row:', data, err.message);
   }
    }
  )
  .on('error', (err) => {
    console.log(err);
    reject(err);
  })
  .on('end', async () => {
    resolve({ message: 'Usertypes uploaded successfully' });
   });
  });
};

  async function getAllUserTypes(req, res){
    // const { page = 0, limit = 100 } = req.query;
    const userTypes = await UserType.find({}, {
      '__v':0, 
   });
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit; 
    const endIndex = startIndex + parseInt(limit); 
    const paginatedUsertypes = userTypes.slice(startIndex, endIndex);
    return res.json({
      userTypes: paginatedUsertypes,
      total: userTypes.length, 
      page: parseInt(page),
      pages: Math.ceil(userTypes.length / limit), 
    });
  }

  async function getUserTypesByFilter(req, res) {
    try {
      const { userTypeCategory, userTypeFlag } = req.query;
      const query = {};
        Object.entries({ userTypeCategory, userTypeFlag }).forEach(([key, value]) => {
        if (value) {
          query[key] = { $regex: value, $options: "i" }; 
        }
      });
        if (Object.keys(query).length === 0) {
        return res.status(400).send("No valid query parameters provided.");
      }
        const userTypes = await UserType.find(query);
        return res.status(200).json(userTypes);
    } catch (error) {
      console.error("Error fetching user types:", error);
      return res.status(500).send("An error occurred while searching for user types.");
    }
  }

  const addUserType = async (req, res) => {
    try {
      const { userTypeCategory, userTypeFlag, } = req.body;
      // if(!userTypeCategory||!userTypeFlag){
      //   res.send(500).json({message: "fields are missing"})
      // }
  
      const newUserType = new UserType({ userTypeCategory, userTypeFlag, });
  
      await newUserType.save();
  
      return res.status(201).json({ message: 'UserType added successfully', zipcode: newUserType });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding UserType', error: error.message });
    }
  };
  
  const modifyUserType = async (req, res) => {
    try {
      const _id = req.params.id;
      const updateData = req.body;
      console.log(updateData);
      
      const updatedUserType = await UserType.findByIdAndUpdate( _id , { $set: updateData }, {
        new: true, 
        runValidators: true, 
      });

      
  
      if (!updatedUserType) {
        return res.status(404).json({ message: 'UserType not found' });
      }
      await updatedUserType.save();

      res.status(200).json({ message: 'UserType updated successfully', usertype: updatedUserType });
    } catch (error) {
      res.status(500).json({ message: 'Error updating usertype ', error: error.message });
    }
  };
  
  
  const deletedUserType = async (req, res) => {
    try {
      const _id = req.params.id;
      const deletedUserType = await UserType.findByIdAndDelete(_id);
      console.log (deletedUserType);
      res.status(200).json({ message: 'Usertype deleted successfully', usertype: deletedUserType });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting usertype', error: error.message });
    }
  };
  

  module.exports = { getAllUserTypes, loadUserTypes, addUserType, modifyUserType, deletedUserType, getUserTypesByFilter };