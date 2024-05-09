console.log("3");
const userDAL = require('../DAL/usersDAL');
const bcrypt = require('bcrypt');

async function Login(userName, password) {
	console.log(userName + " userBL.js " + password);
	let allUsers = await userDAL.getAllUsers();
	let ok = false;
	let length = allUsers.user.length;
	for (let i = 0; i < allUsers.user.length; i++) {
	  const element = allUsers.user[i];
	  const passwordMatch = await bcrypt.compare(password, element.password);
  
	  if (passwordMatch && element.userName === userName) {
		ok = element.id;
		break;
	  }
	}
	return ok;
  }
  

module.exports = {Login};