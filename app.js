var createError = require('http-errors');
var express = require("express");
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

const envFileMap = {
    development: './local.env',
    production: './deploy.env'
};


// Load the appropriate .env file based on the current environment
const envFilePath = envFileMap[env] || './local.env';
dotenv.config({ path: envFilePath });


//const BASE_URL = 'https://express-hello-world-ok4t.onrender.com';
//const BASE_URL = 'http://localhost:8000';

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const PORT = process.env.HOST_PORT || 8000;
//const PORT =8000;
const cors = require("cors");
const fs = require("fs");

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const url = require('url');

var usersDAL = require(path.join(__dirname, '.', 'DAL', 'usersDAL.js'));
//const usersDAL = require('./DAL/usersDAL');
var teamsRouter = require('./routes/teams');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');

var loginRouter = require('./routes/login');
const { secretKey } = require('./key/secretKey');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(cors());
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
		  { label: "users", url: `${process.env.BASE_URL}/users` },
		  { label: "teams", url: `${process.env.BASE_URL}/teams` },
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
		const token = jwt.sign(payload, secretKey, options);
    res.status(200).send({message: "signup successful",user:user,token: token });
	}
  });

  app.get('/download', (req, res) => {
	const filePath = path.join(__dirname, './DATA/Edens Resume.pdf'); 

	fs.readFile(filePath, (err, data) => {
	  if (err) {
		console.error('Error reading file:', err);
		return res.status(500).end('Error reading file');
	  }
  
	  res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
	  res.setHeader('Content-Type', 'application/pdf');
	  res.send(data);
	});
  });
  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
module.exports = app;