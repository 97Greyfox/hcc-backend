const {Territory} = require('../models/territoryModel')

async function addTerritory(req, res) {
  try {
    const { territoryName, territoryState } = req.body;
    const newTerritory = new Territory({
      territoryName,
      territoryState,
    });

    await newTerritory.save();

    return res.status(201).json({ message: 'territory added successfully', territory: newTerritory });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding Territory', error: error.message });
  }
  
}



  async function getAllTerritories(req, res){
    const territories = await Territory.find({}, {
      '__v':0, 
   });
   const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit; 
    const endIndex = startIndex + parseInt(limit); 
    const paginatedTerritories = territories.slice(startIndex, endIndex);
    res.json({
      territories: paginatedTerritories,
      total: territories.length, 
      page: parseInt(page),
      pages: Math.ceil(territories.length / limit), 
    });
  }

  async function getTerritory(req, res){
    const _id = req.params.id;
    const territory = await Territory.findById({_id})
    return res.send(territory);
  }

  async function getTerritoryByFilter(req, res) {
    try {
      const { territoryName, territoryState } = req.query;
      const query = {};
        Object.entries(req.query).forEach(([key, value]) => {
        if (value) {
          query[key] = { $regex: value, $options: "i" }; 
        }
      });
  
      if (Object.keys(query).length === 0) {
        return res.status(400).send("No valid query parameters provided.");
      }
      const territories = await Territory.find(query);
      return res.status(200).json(territories);
    } catch (error) {
      console.error("Error fetching territories:", error);
      return res.status(500).send("An error occurred while searching for territories.");
    }
  }
  


  const modifyTerritory = async (req, res) => {
    try {
      const _id = req.params.id;
      const { territoryState, territoryName } = req.body;
  
      if (!territoryName && !territoryState) {
        return res.status(400).json({ message: 'No data provided to update' });
      }
      let update = {};
      
        update.territoryName = territoryName;
        update.territoryState = territoryState;
      
      // if (territoryState && Array.isArray(territoryState)) {
      //   update.$push = { territoryState: { $each: territoryState } };
      // }
      const updatedTerritory = await Territory.findByIdAndUpdate(
        _id,
        update,
        { new: true, runValidators: true }
      );
      if (!updatedTerritory) {
        return res.status(404).json({ message: 'Territory not found' });
      }
      res.status(200).json({ message: 'Territory updated successfully', territory: updatedTerritory });
    } catch (error) {
      res.status(500).json({ message: 'Error updating territory', error: error.message });
    }
  };
  
  
  
  const deletedTerritory = async (req, res) => {
    try {
      const _id = req.params.id;
      const deletedTerritory = await Territory.findByIdAndDelete(_id);
      console.log (deletedTerritory);
      res.status(200).json({ message: 'Territory deleted successfully', territory: deletedTerritory });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Territory', error: error.message });
    }
  };

  module.exports = { modifyTerritory, addTerritory, getAllTerritories, deletedTerritory, getTerritory, getTerritoryByFilter };