const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const usersDAL = require(path.join(__dirname, '.', 'DAL', 'usersDAL'));
//const usersDAL = require('./DAL/usersDAL');
var teamsRouter = require('./routes/teams');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
const jwt = require('jsonwebtoken');
const url = require('url');
const PORT = process.env.PORT || 8000;


const loginRouter = require('./routes/login');

const secrets = require('./key/secretKey');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/login', loginRouter);
app.use('/teams', teamsRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);


app.get("/message", (req, res) => {
  //res.json({ message: "Hello from server!" });
  res.send({ message: "Hello from server!" });
});

app.get("/", (req, res) => {
	//res.json({ message: "Hello from server!" });
	const data = {
		message: "Hello from server!",
		links: [
		  { label: "users", url: "http://localhost:8000/users" },
		  { label: "teams", url: "http://localhost:8000/teams" },
		  // add more links here
		],
	  };
	  res.send(data);  });



app.post("/signup/try", async (req, res) => {
	let exist = await usersDAL.checkUserName(req.body.userName);
	if(exist)
	{res.status(409).json({ message: "username already exist" });}
else{
	let userId = await usersDAL.addUser(req.body);
	//let users = await usersDAL.getAllUsers();
	let user = await usersDAL.getUserByID(userId);
		// Generate JWT token
		const payload = { userId: user.userId, user:user, password:user.password };
		const options = { expiresIn: '1h' };
		const token = jwt.sign(payload, secrets.secretKey, options);
    res.status(200).send({message: "signup successful",user:user,token: token });
	}
  });

  app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
  });

  module.exports = app;
