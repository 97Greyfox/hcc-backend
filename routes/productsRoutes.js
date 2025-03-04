const express = require('express');
const {ensureAuthenticated} = require('../middleware/auth.js');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res)=>{
  console.log('logged In user', req.user);
  res.send([
    {
      name:"TV",
      price:200000
    },
    {
      name:"hardware",
      price:3400
    }
  ])
});
module.exports = router;
