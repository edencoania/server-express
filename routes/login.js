var express = require('express');
var router = express.Router();
const entryBL = require('../BL/usersBL');
const http = require('http');
const usersDAL = require('../DAL/usersDAL.JS');
const jwt = require('jsonwebtoken');
const secrets = require('../key/secretKey');


//const myteams = require('../BL/myteams')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"login":"aaaa"});
});


router.post('/try',async function(req, res, next) {
  console.log(req.body.userName + " login.js -node router " +req.body.password);  
  let id = await entryBL.Login(req.body.userName,req.body.password);
  console.log(" login.js -node router - return ID " +id);
    if(id)
    {
      let user = await usersDAL.getUserByID(id);
    
      const payload = { userId: id, user:user, password:user.password };
      const options = { expiresIn: '1h' };
      const token = jwt.sign(payload, secrets.secretKey, options);
      res.status(200).send({message: "Login successful",user:user,token:token});
     
      //res.status(200).send({"message": "Login successful",id:id});
    }
    else
    {
      res.status(401).json({ "message": 'Invalid username or password' });
    }
  }
);


module.exports = router;