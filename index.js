const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const contactInfoRouter = require('./routes/basicInfoRouter.js');
const quoteRequestRouter = require('./routes/quoteRequestRouter.js');
const {loadZipCodes} = require('./controllers/zipCodesController.js');
const {loadUserTypes} = require('./controllers/userTypeController.js');
const userRouter = require('./routes/userRoutes.js');
const productRouter = require('./routes/productsRoutes.js');
const clientRouter = require('./routes/clientRoutes.js');
const usertypeRouter = require('./routes/userTypesRouter.js');
const zipcodesRouter = require('./routes/zipCodesRouter.js');
const territoryRouter = require('./routes/territoryRoutes.js');
require('dotenv').config();
mongo_url = process.env.MONGO_URI;
// const compression = require('compression');




const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
// app.use(bodyParser());
// app.use(compression());

mongoose.connect(mongo_url, {maxPoolSize: 2000}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Connection error:', err);
});
async function dataLoad(){
  try {
    await loadZipCodes();
  } catch (error) {
    console.log(error);
  }
 
}

// dataLoad();

app.post('/', async (req, res) => {res.status(200).send('Hello');})
app.use('/api/contactInfo', contactInfoRouter);
app.use('/api/quote', quoteRequestRouter);
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/api/products', productRouter);
app.use('/api/picklist/usertypes', usertypeRouter);
app.use('/api/picklist/zipcodes', zipcodesRouter);
app.use('/api/picklist/territory', territoryRouter);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
server.timeout = 1200000;