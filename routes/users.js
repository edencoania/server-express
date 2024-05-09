var express = require('express');
var router = express.Router();
const entryBL = require('../BL/usersBL');
const http = require('http');

const path = require('path');
console.log("10")
const usersDAL = require(path.join(__dirname, '..', 'DAL', 'usersDAL'));

//const usersDAL = require('../DAL/usersDAL.js');
const teamsDAL = require('../DAL/teamsDAL');
const utils = require('../BL/utils');
const secretKey = require('../key/secretKey');
const jwt = require('jsonwebtoken');

//const myteams = require('../BL/myteams')

router.get("/", async (req, res) => {
	let users = await usersDAL.getAllUsers();
	//console.log(users);
	//res.json(users);

	res.send(users);
  });

router.post("/addFriend",async (req,res) =>{
	let userId= req.body.userId;
	let friendUserName= req.body.friendUserName;	
	let userName= req.body.userName;

	//console.log(userName + " --- server recive post line 40 --- "+ friendUserName);
	let addTry = await usersDAL.addFriendToUser(userName,friendUserName);
	if(addTry=="success")
	{
		res.status(200).send({ message: "friend added" });
	}
	else if(addTry=="friend name is not correct")
	{
		res.status(400).send({ message: addTry });
	}
	else if (addTry=="fail"){
		res.status(400).send({ message: "username or friend username not added" });
	} else
	{	
		//not supposed to happen at all - dont touch the data manually
		res.status(400).send({ message: "one friend already existed" });
	}

});


router.get("/:id", async (req, res) => {
	try {
	  let user = await usersDAL.getUserByID(req.params.id);
  
	  const authHeader = req.headers.authorization;
	  const token = authHeader.split(' ')[1];
	  
	  try {
		let decodedToken = jwt.verify(token, secretKey.secretKey);
		res.send(user);
	  } catch (err) {
		console.log('Invalid token:', err);
		res.status(401).send('Invalid token');
	  }
	} catch (err) {
	  console.log('Error getting user:', err);
	  res.status(500).send('Error getting user');
	}
  });
  
module.exports = router;