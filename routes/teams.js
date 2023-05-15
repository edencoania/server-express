var express = require('express');
var router = express.Router();
const entryBL = require('../BL/usersBL');
const http = require('http');

const path = require('path');
var usersDAL = require(path.join(__dirname, '..', 'DAL', 'usersDAL'));

//const usersDAL = require('../DAL/usersDAL');
var teamsDAL = require('../DAL/teamsDAL');
var utils = require('../BL/utils');
//const myteams = require('../BL/myteams')

/* GET users listing. */
router.get('/',async function(req, res, next) {
  let teams = await teamsDAL.getAllTeams();
	//console.log(users);
	//res.json(user);
	if(teams)
	{res.status(200).send({message: "retrive teams succesfuly",teams:teams});}
	else
	{
		res.status(404).json({message:'teams not found'});
	}
});

router.post("/createTeam", async (req, res) => {
	let teamName = req.body.teamName;
	let userName = req.body.userName;
	console.log("recieve in node!")
	let teamId = await teamsDAL.addTeam(teamName,userName);
	await usersDAL.addTeamToUser(req.body.userId,teamId);
	res.status(200).send({message: "team added"});
	//console.log(users);
	//res.json(user);
	//res.send(user);
  });

router.post("/join", async (req, res) => {

	let teamPassword = req.body.teamPassword;
	let userId = req.body.userId;
	
	//console.log(users);
	//res.json(user);
	//res.send(user);
	let allTeams = await teamsDAL.getAllTeams();
	let user = await usersDAL.getUserByID(userId);
	let userName = user.userName; 
	let pass = parseInt(teamPassword);
	let teamFound = false;

	for (let i = 0; i < allTeams.team.length; i++) {
		let element = allTeams.team[i];
		if(element.password==pass)
		{
			await teamsDAL.addUserToTeam(userName,element.id);
			await usersDAL.addTeamToUser(userId,element.id);
			return res.status(200).send({ message: "team joined" });
			}
		
		if(teamFound)
		{	
			res.status(200).send({message: "team not found"});
		}
	}
});

router.delete("/deleteUser", async (req, res) => {

	let teamId = req.body.teamId;
	let userId = req.body.userId;
	await utils.deleteUserandTeam(userId,teamId);
	//teamId = parseInt(teamId);
	//userId = parseInt(userId);

	let teamFound = false;
	console.log(teamId +" fdsasdaf" + userId);

});


router.get("/:id", async (req, res) => {
    let team = await teamsDAL.getTeamByTeamId(req.params.id);
    //console.log(team);
    //res.json(user);
    if(team)
    {res.status(200).send({message: "team found",team:team});}
    else
    {
      res.status(404).json({message:'team not found'});
    }
});
  
module.exports = router;