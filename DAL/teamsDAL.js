const jsonfile = require('jsonfile');
const path = require('path');
var usersDAL = require(path.join(__dirname, 'usersDAL'));
var eventsDAL = require(path.join(__dirname, 'eventsDAL'));
//const usersDAL = require( './usersDAL');
//const eventsDAL = require( './eventsDAL');

/*
		"id":id,
		"name":name,
		"password" : pass,
		"members":[memberName],
		"events":[]*/
		

function getAllTeams()
{
	//console.log("try tyr")
	return new Promise((resolve,reject)=>
	{const all = jsonfile.readFile('./DATA/teams.json','utf8',(err,data) =>
		{
			if(err)
				{
					console.log("error");
					reject(err);
				}
			else
				{resolve(data)}});
			})
}

function generatePassword()
{
	let min = 1000;
	let max = 9999;
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
	//let bob = rand(1000-9999)
}

async function idARR()
{
	let allTeams = await getAllTeams();
	let idArr = []
	allTeams.team.forEach(element => {
		idArr.push(element.id);
	});
	return idArr;
}
async function generateId()
{
	let allIds = await idARR();
	let generatedId = 1;
	while(allIds.includes(generatedId))
	{
		generatedId++;
	}
	return generatedId;
}
async function getTeamsByUserName(userName)
{
	let allTeams = await getAllTeams()
	let teamsByUserName = []
	allTeams.team.forEach(element => {
		if(element.members.includes(userName))
		{
			teamsByUserName.push(element);
		}	
	})
	return  teamsByUserName;
}
async function getTeamByTeamId(teamId)
{
	let allTeams = await getAllTeams();
	let team;
	allTeams.team.forEach(element =>
		{
			if(element.id==teamId)
			{
				team = element;
			}
		});
	return  team;
}

async function testgetTeamByTeamId()
{
	let Team = await getTeamByTeamId(2);
	console.log(Team);
}
//testgetTeamByTeamId()

async function testgetTeamsById()
{
	let Team = await getTeamByTeamId(2);
	console.log(Team);
	
}
//testgetTeamsById();

async function addTeam(name,memberName)
{
	let pass = await generatePassword();
	let id = await generateId();
	let team = {
		"id":id,
		"name":name,
		"password" : pass,
		"members":[memberName],
		"events":[]
	}
	console.log(team);
	let allTeams = await getAllTeams();
	allTeams.team.push(team);
	await jsonfile.writeFile('./DATA/teams.json',allTeams);
	return id;
}
//addTeam("soccer",5)

async function addUserToTeam(userName,teamId)
{
	let allTeams = await getAllTeams();
	for(let team of allTeams.team)		
	{
			if((team.id===parseInt(teamId))&&(!team.members.includes(userName)))
			{
				team.members.push(userName);
				for (let eventId of team.events) {
					let id = await usersDAL.getUserIdByUserName(userName);
					await usersDAL.addEventToUser(id,eventId);
					await eventsDAL.addUserToEvent(userName,eventId);
				}
			}
		};
	await jsonfile.writeFile('./DATA/teams.json',allTeams);
}

async function addEventToTeam(eventId,teamId)
{
	let allTeams = await getAllTeams();
	//console.log("here1");
	allTeams.team.forEach(async(element) =>
		{
			if((element.id===parseInt(teamId))&&(!element.events.includes(eventId)))
			{
				element.events.push(eventId);
				for (let userName of element.members)
				{
					let id = await usersDAL.getUserIdByUserName(userName);
					await usersDAL.addEventToUser(id,eventId);
					await eventsDAL.addUserToEvent(userName,eventId);
				}	
			}
		});
	await jsonfile.writeFile('./DATA/teams.json',allTeams);
}
//getAllEvents()

async function deleteUserFromTeam(teamId,userName)
{
	let allTeams = await getAllTeams();
	let all  = [];
	await allTeams.team.forEach(element => {
		if(element.id===teamId)
		{
			for(let element2 of element.members )
			{
				if(element2!==userName)
				{
					all.push(element2);
				}
			}
			element.members = all;
		}
	});
	await jsonfile.writeFile('./DATA/teams.json',allTeams);
}


async function deleteTeamById(id) {
	let allTeams = await getAllTeams();
	const filteredTeams = allTeams.team.filter(team => team.id !== id);
	if (allTeams.team.length === filteredTeams.length) {
	  console.log("Team not found");
	  return;
	}
	allTeams.team = filteredTeams;
	await jsonfile.writeFile('./DATA/teams.json', allTeams);
	console.log(`User with ID ${id} has been deleted`);
  }

async function testdeleteUserFromTeam()
{
	await deleteUserFromTeam(3,4)
}
//testdeleteUserFromTeam()
module.exports = {deleteTeamById,addEventToTeam,deleteUserFromTeam,getAllTeams,addUserToTeam,addTeam,getTeamsByUserName,getTeamByTeamId}