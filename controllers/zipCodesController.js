const {ZipCode} = require('../models/zipCodesModel.js')
const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');
const async = require('async');


// 

// function loadZipCodes() {
//   return new Promise((resolve, reject) => {
//     const parser = parse({
//       columns: true, 
//       trim: true     
//     });

//     fs.createReadStream(path.join(__dirname, '..', 'data', 'uszips.csv'))
//       .pipe(parser)
//       .on('data', async (row) => {
//         try {
//           const { zip, city, state_id } = row; 
//           if (zip && city && state_id) {
//             await ZipCode.updateOne(
//               { zipCode: zip }, 
//               { zipCode: zip, city, state_id }, 
//               { upsert: true } 
//             );
//           }
//         } catch (err) {
//           console.error('Error processing row:', row, err.message);
//         }
//       })
//       .on('error', (err) => {
//         console.error('Error reading CSV:', err.message);
//         reject(err);
//       })
//       .on('end', () => {
//         console.log('CSV file processing completed.');
//         resolve({ message: 'Zip codes uploaded successfully' });
//       });
//   });
// }


// function loadZipCodes() {
//   return new Promise((resolve, reject) => {
//     const parser = parse({
//       columns: true,
//       trim: true,
//     });
//     let totalRows = 0; 
//     let processedRows = 0; 
//     let failedRows = 0; 
//       const concurrency = 300; 
//       const queue = async.queue(async (row) => {
//         totalRows++;
//         const { zip, city, state_id } = row;
//         if (zip && city && state_id) {
//           try {
//             await ZipCode.updateOne(
//               { zipCode: zip },
//               { zipCode: zip, city, state_id },
//               { upsert: true }
//             );
//             processedRows++;
//           } catch (err) {
//             failedRows++;
//             console.error('Error updating row:', row, err.message);
//           }
//         }
//       }, concurrency);
    
//       const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'uszips.csv'))
//       .pipe(parser);  
//     queue.saturated = () => {
//       console.log('Queue is full. Pausing the stream...');
//       stream.pause();
//     };

//     queue.unsaturated = () => {
//       console.log('Queue has capacity. Resuming the stream...');
//       stream.resume();
//     };
//         
//     stream.on('end', () => {
//       console.log('CSV file reading completed. Waiting for remaining tasks...');
//     });
//     stream.on('error', (err) => {
//       console.error('Error reading CSV:', err.message);
//       reject(err);
//     });
//     stream.on('data', (row) => {
//       queue.push(row);
//     });
//       queue.drain(() => {
//         console.log(`Processing complete: ${processedRows} rows processed, ${failedRows} failed.`);
//         resolve({ message: 'Zip codes uploaded successfully', totalRows, processedRows, failedRows });
//       });
//   });
// }
function loadZipCodes() {
  return new Promise((resolve, reject) => {
    const parser = parse({
      columns: true,
      trim: true,
    });
    const batchSize = 1000;
    let batch = [];
    let rowsProcessed = 0;
    const stream = fs.createReadStream(path.join(__dirname, '..', 'data', 'uszips.csv'))
      .pipe(parser);
    stream.on('data', (row) => {
      const { zip, city, state_id } = row;
      if (zip && city && state_id) {
        batch.push({
          insertOne: {
            document: { zipCode: zip, city, state : state_id }
          },
        });
        if (batch.length >= batchSize) {
          stream.pause();
          ZipCode.bulkWrite(batch)
            .then((result) => {
              rowsProcessed += batch.length;
              console.log(`Processed ${batch.length} rows.`);
              batch = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('Error in bulk insert:', err.message);

              reject(err);
            });
        }
      }
    });

    stream.on('end', () => {
      if (batch.length > 0) {
        ZipCode.bulkWrite(batch)
          .then(() => {
            rowsProcessed += batch.length;
            console.log(`Processed remaining ${batch.length} rows.`);
            resolve({ message: 'Zip codes uploaded successfully', rowsProcessed });
          })
          .catch((err) => {
            console.error('Error in final bulk insert:', err.message);
            reject(err);
          });
      } else {
        resolve({ message: 'Zip codes uploaded successfully', rowsProcessed });
      }
    });

    stream.on('error', (err) => {
      console.error('Error reading CSV:', err.message);
      reject(err);
    });
  });
}



  async function getAllZipCodes(req, res){
    try {

    const { search = '', limit = 50, page = 1 } = req.query; 

    const filteredZipCodes = await ZipCode.find({
      zipCode: { $regex: `^${search}`, $options: "i" },
    })
      .limit(parseInt(limit))
      .skip((page - 1) * limit); 
    if(!filteredZipCodes){
      return res.status(500).json({ message: 'No such zipcode', error: error.message });
    }
    const startIndex = (page - 1) * limit;
    const paginatedZipCodes = filteredZipCodes.slice(
      startIndex,
      startIndex + parseInt(limit)
    );
    res.status(200).json({
      zipCodes: paginatedZipCodes,
      total: filteredZipCodes.length,
      pages: Math.ceil(filteredZipCodes.length / limit),
      currentPage: parseInt(page),
    });

    } catch (err) {
      console.error('Error fetching zip codes:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async function getZipCodes(req, res){
    
    const { page = 1, limit = 10 } = req.query;
    const zipCodes = await ZipCode.find({}, {
       '__v':0, 
    }).limit(parseInt(limit))
    .skip((page - 1) * limit); 
    
  // const startIndex = (page - 1) * limit; 
  // const endIndex = startIndex + parseInt(limit); 
  // const paginatedZipCodes = zipCodes.slice(startIndex, endIndex)

  res.json({
    zipCodes,
    total: 80652, 
    page: parseInt(page),
    pages: Math.ceil(80652 / limit), 
  });
  }

  async function getZipByFilter(req, res) {
    try {
      
      const { city, state, zip } = req.query; 
      const query = {};
      Object.entries({ city, state, zipCode: zip }).forEach(([key, value]) => {
        if (value) {
          query[key] = { $regex: value, $options: "i" }; 
        }
      });
      if (Object.keys(query).length === 0) {
        return res.status(400).send("No valid query parameters provided.");
      }
      const zipCodes = await ZipCode.find(query);
      return res.status(200).json(zipCodes);
    } catch (error) {
      console.error("Error fetching zip codes:", error);
      return res.status(500).send("An error occurred while searching for zip codes.");
    }
  }
  
  

  const addZipCode = async (req, res) => {
    try {
      const { zipCode, city, state } = req.body;
      // if(!zipCode||!city||!state){
      //   res.send(500).json({message: "fields are missing"})
      // }
  
      const newZipCode = new ZipCode({
        zipCode,
        city,
        state,
      });
  
      await newZipCode.save();
  
      return res.status(201).json({ message: 'Zipcode added successfully', zipcode: newZipCode });
    } catch (error) {
      return res.status(500).json({ message: 'Error adding zipcode', error: error.message });
    }
  };

  const modifyZipCode = async (req, res) => {
    try {
      const _id = req.params.id;
      console.log(_id);
      const updateData = req.body;
  
      
      const updatedZipCode = await ZipCode.findByIdAndUpdate( _id , { $set: updateData }, {
        new: true, 
        runValidators: true, 
      });
  
      if (!updatedZipCode) {
        return res.status(404).json({ message: 'Zipcode not found' });
      }

      await updatedZipCode.save();
  
      res.status(200).json({ message: 'Zipcode updated successfully', zipcode: updatedZipCode });
    } catch (error) {
      res.status(500).json({ message: 'Error updating zipcode ', error: error.message });
    }
  };
  
  
  const deletedZipCode = async (req, res) => {
    try {
      const _id = req.params.id;
      const deletedZipCode = await ZipCode.findByIdAndDelete(_id);
      console.log (deletedZipCode);
      res.status(200).json({ message: 'Zipcode deleted successfully', zipcode: deletedZipCode });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting zipcode', error: error.message });
    }
  };

  module.exports = { getAllZipCodes, loadZipCodes, addZipCode, modifyZipCode, deletedZipCode, getZipCodes, getZipByFilter };