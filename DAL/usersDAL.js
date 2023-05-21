const jsonfile = require('jsonfile');
const path = require('path');
const bcrypt = require('bcrypt');


function getAllUsers()
{
	return new Promise((resolve,reject)=>
	
	{const total = jsonfile.readFile('./DATA/users.json','utf8',(err,data) =>
		{
			if(err)
				{
					console.log("error");
					reject(err);
				}
			else
				{resolve(data);}});
			});
}
async function idARR()
{
	let allUsers = await getAllUsers();
	let idArr = [];
	allUsers.user.forEach(element => {
		idArr.push(element.id);
	});
	return idArr;
}
async function generateId()
{
	//let allUsers = await getAllUsers();
	let idArr = await idARR();
	let c=1;
	while(idArr.includes(c))
	{
		c++;
	}
	return c;
}
async function getUserByID(id)
{
	let allUsers = await getAllUsers();
	//console.log(allUsers.user)

	let found = await allUsers.user.find(element => element.id==id);
	//console.log(found)
	if(allUsers!==undefined)
	{ 
	//console.log("found user ID -"+id)
	//console.log(bob)
	}
	else
	{
		console.log("no such user");
	}
	return found;
}

async function getUserByUserName(username)
{
	let allUsers = await getAllUsers();
	//console.log(allUsers.user)

	let found = await allUsers.user.find(element => element.userName==username);
	//console.log(found)
	if(allUsers!==undefined)
	{ 
	//console.log("found user ID -"+id)
	//console.log(allUsers)
	}
	else
	{
		console.log("no such user");
	}
	return found;
}
async function getUserIdByUserName(username)
{
	let allUsers = await getAllUsers();
	//console.log(allUsers.user)

	let found = await allUsers.user.find(element => element.userName==username);
	//console.log(found)
	if(found!==undefined)
	{ 
	//console.log("found user ID -"+id)
	//console.log(allUsers)
	found = found.id;
	}
	else
	{
		console.log("no such user  "+ username);
	}
	return found;
}

async function addUser(user)
{
	console.log("yay");
	console.log(user);
	user.id = await generateId();
	user.friendsId = [];
	user.teams =  [];
    user.invitedEvents =  [];
    user.approvedEvents = [];
	const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds
	user.password = hashedPassword;

	let allUsers = await getAllUsers();
	allUsers.user.push(user);
	jsonfile.writeFile('./DATA/users.json',allUsers);
	console.log("added user ID - " + user.id);
	return user.id;
}

async function hashPasswordsForAllUsers() {
	try {
	  const allUsers = await getAllUsers();
  
	  for (let user of allUsers.user) {
		const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds
		user.password = hashedPassword;
	  }
  
	  await jsonfile.writeFile('./DATA/users.json', allUsers);
	  console.log('Passwords hashed successfully for all users.');
	} catch (error) {
	  console.error('Error hashing passwords:', error);
	}
  }
  
  //hashPasswordsForAllUsers();

async function testADD()
{
	let userTest = {
		"id": 1,
		"name": "ede",
		"userName": "edencoaniaaa",
		"password": "1234",
		"friendsId": [],
		"teams": [
		],
		"invitedEvents": [
		],
		"approvedEvents": []
	  }
	await addUser(userTest);
	let allUsers = await getAllUsers();
	console.log(allUsers);
}
//testADD();
async function test()
{
	let allUsers = await getAllUsers();
	console.log(allUsers)
}
//test();

async function addTeamToUser(userId,teamId)
{
	let allUsers = await getAllUsers();
	console.log("addTeamToUser");
	await allUsers.user.forEach(element => {
		if((element.id==userId)&&(!element.teams.includes(teamId)))
		{
			element.teams.push(teamId);
		}
	});
	await jsonfile.writeFile('./DATA/users.json',allUsers);
}
/*async function addFriendToUser(userId,friendId)
{
	let bob = await getAllUsers();
	await bob.user.forEach(element => {
		if((element.id===userId)&&(!element.friendsId.includes(friendId)))
		{
			element.friendsId.push(friendId);
		}
		if((element.id===friendId)&&(!element.friendsId.includes(userId)))
		{
			element.friendsId.push(userId);
		}
	})
	jsonfile.writeFile('./DATA/users.json',bob);
}*/

async function addFriendToUser(userName,friendUserName)
{
	let allUsers = await getAllUsers();
	let added = 0;
	
	let userId = await getUserIdByUserName(userName);
	let user = allUsers.user.find(user => user.id == userId);
	
	let friendId = await getUserIdByUserName(friendUserName);
	let friend = allUsers.user.find(user => user.id == friendId);
	
	if(friend!==undefined)
	{
		if(!user.friendsId.includes(friendUserName))
		{
			user.friendsId.push(friendUserName);
			added++;
		}
		if(!friend.friendsId.includes(userName))
		{
			added++;
			friend.friendsId.push(userName);
		}
	}
	else {
		console.log("friend name is not accurate");
		return "friend name is not correct";
	}
/*
	await allUsers.user.forEach(element => {
		if((element.userName===userName)&&(!element.friendsId.includes(friendUserName)))
		{
			element.friendsId.push(friendUserName);
			added++;
		}
		if((element.userName===friendUserName)&&(!element.friendsId.includes(userName)))
		{
			added++;
			element.friendsId.push(userName);
		}
	});
*/
	if(added==2)
	{
	jsonfile.writeFile('./DATA/users.json',allUsers);
	return "success";
	}if(added==1)
	{
		jsonfile.writeFile('./DATA/users.json',allUsers);
		return "one friend already existed";
	}
	else 
	{
		return "fail";
	}
}
async function testaddFriendToUser()
{
	let user = "edencoania";
	let friend = "yosii";
	addFriendToUser(user,friend);
} 
//testaddFriendToUser();


async function addEventToUser(userId,eventId)
{
	let allUsers = await getAllUsers();

	await allUsers.user.forEach(element => {
		if(element.id==userId)
		{
			if((!element.approvedEvents.includes(eventId))&&(!element.invitedEvents.includes(eventId)))
			{
				element.invitedEvents.push(eventId);
				console.log("event added succesfuly to the all team");
			}
			else{
				console.log("event already exist");
			}
		}
	});
	jsonfile.writeFile('./DATA/users.json',allUsers);
}

async function updateUser(userId, newUser) {
  try {
    const file = './DATA/users.json';
    const allUsers = await getAllUsers();

    const userIndex = allUsers.user.findIndex(user => user.id == userId);

    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    allUsers.user[userIndex] = newUser;

    await jsonfile.writeFile(file, allUsers);
    console.log(`User with ID ${userId} updated successfully.`);
  } catch (error) {
    console.error(error);
  }
}

async function approveEvent(userId, eventId) {
	try {
	  // Get the user object
	  const user = await getUserByID(userId);
  
	  // Get the index of the event in the invitedEvents array
	  const index = user.invitedEvents.indexOf(parseInt(eventId));
  
	  if (index !== -1) {
		// Remove the event from invitedEvents array
		user.invitedEvents.splice(index, 1);
  
		// Add the event to approvedEvents array
		user.approvedEvents.push(eventId);
  
		// Save the updated user object
		await updateUser(userId,user);
  
		console.log(`Event ${eventId} approved for user ${userId}`);
	  } else {
		console.log(`Event ${eventId} not found in invitedEvents array of user ${userId}`);
	  }
	} catch (error) {
	  console.error(`Error approving event ${eventId} for user ${userId}: ${error}`);
	}
  }  

async function deleteTeamfromUser(userId,teamId)
{
	let allUsers = await getAllUsers();
	let all  = [];
	await allUsers.user.forEach(element => {
		if(element.id==userId)
		{
			for(let element2 of element.teams )
			{
				if(element2!==teamId)
				{
					all.push(element2);
				}
			}
			element.teams = all;
		}
	});
	jsonfile.writeFile('./DATA/users.json',allUsers);
}
async function deleteEventfromApprovedEvents(userId,eventId)
{
	let allUsers = await getAllUsers();
	let all  = [];
	await allUsers.user.forEach(element => {
		if(element.id===userId)
		{
			for(let element2 of element.approvedEvents )
			{
				if(element2!==eventId)
				{
					all.push(element2);
				}
			}
			element.approvedEvents = all;
		}
	});
	jsonfile.writeFile('./DATA/users.json',allUsers);
}
async function deleteEventfromAllUsersApprovedEvents(eventId)
{
	let allUsers = await getAllUsers();
	
	await allUsers.user.forEach(element => {
		let all  = [];
		for(let element2 of element.approvedEvents )
			{
				if(element2!==eventId)
				{
					all.push(element2);
				}
			}
			element.approvedEvents = all;
	});
	jsonfile.writeFile('./DATA/users.json',allUsers);
}
async function deleteEventfromAllUsersInvitedEvents(eventId)
{
	let allUsers = await getAllUsers();
	
	await allUsers.user.forEach(element => {
		let all  = [];
		for(let element2 of element.invitedEvents )
			{
				if(element2!==eventId)
				{
					all.push(element2);
				}
			}
			element.invitedEvents = all;
	});
	jsonfile.writeFile('./DATA/users.json',allUsers);
}

async function checkUserName(username)
{
	if (!username) {
		return false;
	  }
	let userNameArr = await userNameARR();
	if (userNameArr[0] == undefined) {
		return false;
	  }
	for(let element of userNameArr)
	{
		if (element && element.localeCompare(username) === 0) {
			return true;
		}
	}
	return false;
}
async function userNameARR()
{
	let allUsers = await getAllUsers();
	let userNameArr = [];
	allUsers.user.forEach(element => {
		userNameArr.push(element.userName);
	});
	return userNameArr;
}


async function deleteUserById(id) {
	let allUsers = await getAllUsers();
	const filteredUsers = allUsers.user.filter(user => user.id !== id);
	if (allUsers.user.length === filteredUsers.length) {
	  console.log("User not found");
	  return;
	}

	allUsers.user = filteredUsers;
	await jsonfile.writeFile('./DATA/users.json', allUsers);
	console.log(`User with ID ${id} has been deleted`);
  }
module.exports={getUserByUserName,userNameARR,checkUserName,deleteEventfromAllUsersInvitedEvents,deleteEventfromAllUsersApprovedEvents,deleteEventfromApprovedEvents,deleteTeamfromUser,addEventToUser,addFriendToUser,addTeamToUser,getUserByID,getAllUsers,addUser,approveEvent,getUserIdByUserName,deleteUserById};
