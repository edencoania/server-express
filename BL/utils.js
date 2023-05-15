const userDAL = require('../DAL/usersDAL.JS');
const teamDAL = require('../DAL/teamsDAL.JS');

async function deleteUserandTeam(userId,teamId)
{
	
	let user = await userDAL.getUserByID(userId);
	console.log(user.userName);
	await teamDAL.deleteUserFromTeam(teamId,user.userName);
	await userDAL.deleteTeamfromUser(userId,teamId);
}


module.exports = {deleteUserandTeam};