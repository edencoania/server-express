const userdal = require('../dal/usersdal.js');
const teamdal = require('../dal/teamsdal.js');

async function deleteUserandTeam(userId,teamId)
{
	
	let user = await userdal.getUserByID(userId);
	console.log(user.userName);
	await teamdal.deleteUserFromTeam(teamId,user.userName);
	await userdal.deleteTeamfromUser(userId,teamId);
}


module.exports = {deleteUserandTeam};