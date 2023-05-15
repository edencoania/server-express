var createError = require('http-errors');
var express = require("express");

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var NODE_VERSION = "18.14.0"
const PORT = process.env.PORT || 8000;
const cors = require("cors");

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const url = require('url');
console.log("1")
var usersDAL = require(path.join(__dirname, '.', 'DAL', 'usersDAL'));
//const usersDAL = require('./DAL/usersDAL');
var teamsRouter = require('./routes/teams');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var loginRouter = require('./routes/login');
var secrets = require('./key/secretKey');

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
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
	console.log("2")
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