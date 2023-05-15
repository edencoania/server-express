const userDAL = require('../DAL/usersDAL.JS');

async function Login(userName,password)
{
	console.log(userName + " userBL.js " +password);
	let allUsers = await userDAL.getAllUsers();
	let ok = false;
	allUsers.user.forEach(element => {
		let a = element.password.localeCompare(password);
		
		let c = element.userName.localeCompare(userName);
		if ((c===0)&&(a===0))
		{
			ok = element.id;
		}
	});
	return ok;
}

module.exports = {Login};