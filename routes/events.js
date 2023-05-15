var express = require('express');
var router = express.Router();
var entryBL = require('../BL/usersBL');
const http = require('http');
console.log("6")
var usersDAL = require('../DAL/usersDAL');
var teamsDAL = require('../DAL/teamsDAL');
var eventsDAL = require('../DAL/eventsDAL');
const path = require('path');

var utils = require('../BL/utils');
//const myteams = require('../BL/myteams')

router.get("/", async (req, res) => {
	let events = await eventsDAL.getAllEvents();
	//console.log(events);
	//res.json(users);

	res.status(200).send(events);
  });

  router.post("/createEvent", async (req, res) => {
	let eventName = req.body.eventName;
	let eventTime = req.body.eventTime;
	let eventPlace = req.body.eventPlace;
	let eventInfo = req.body.eventInfo;
	let userName = req.body.userName;
	let userId = req.body.userId;
	let teamId =req.body.teamId;

	let eventNum = await eventsDAL.createEvent(eventName,eventTime,eventPlace,eventInfo,userName);
	await teamsDAL.addEventToTeam(eventNum,teamId);
	await usersDAL.addEventToUser(userId,eventNum);
	await usersDAL.approveEvent(userId,eventNum);

	//console.log(eventNum);
	await usersDAL.approveEvent(userId,eventNum);
	
	res.status(200).send({message: "event created"});
	


	//res.send(events);
  });

  
  router.post("/RSVP", async (req, res) => {

	let userName = req.body.userName;
	let userId = req.body.userId;
	let eventId = req.body.eventId;
	await usersDAL.approveEvent(userId,eventId);

	await eventsDAL.approveEvent(eventId,userName);

	//לאשר הגעה - גם בצד EVENTS וגם אצל היוזר - להעביר ממוזמן, למאושר - 
	//await teamsDAL.addEventToTeam(eventNum,teamId);
	//await usersDAL.addEventToUser(userId,eventNum);
	//console.log(eventNum);
	res.status(200).send({message: "event approved"});

	//res.send(events);
  });

  router.post("/addToCallander", async (req, res) => {
	let userName = req.body.userName;
	let userId = req.body.userId;
	let eventId = req.body.eventId;
	//TODO
	const SCOPES = ['https://www.googleapis.com/auth/calendar'];


	const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'client_secret_168746426006-gkjnolurmke0riav0q5ja39urhqt4ac2.apps.googleusercontent.com.json');
	

	const auth = new google.auth.JWT({
		keyFile: SERVICE_ACCOUNT_FILE,
		scopes: SCOPES,
	});
	const calendar = google.calendar({ version: 'v3', auth });
	const event = {
		summary: "req.body.title",
		location: "req.body.location",
		description: "req.body.description",
		start: {
		  //dateTime: new Date(req.body.date + 'T' + req.body.startTime + ':00'),
		  dateTime: new Date('2023/04/18' + 'T' + '20:00'),
		  
		  timeZone: 'Israel',
		},
		end: {
		  //dateTime: new Date(req.body.date + 'T' + req.body.endTime + ':00'),
		  dateTime: new Date('2023/04/18' + 'T' + '20:00'),
		  timeZone: 'Israel',
		},
		reminders: {
		  useDefault: true,
		},
	  };

	  calendar.events.insert(
		{
		  calendarId: 'primary',
		  resource: event,
		},
		(err, res) => {
		  if (err) {
			console.error('Error creating event:', err);
			return res.status(500).json({ error: 'Failed to create event' });
		  }
		  console.log('Event created:', res.data.htmlLink);
		  return res.status(200).json({ message: 'Event created successfully' });
		}
	  );	
	  
	  res.status(200).send({message: "event added to calender"});

	  //res.send(events);
	});


	router.post("/RSVP", async (req, res) => {

		let userName = req.body.userName;
		let userId = req.body.userId;
		let eventId = req.body.eventId;
		//TODO
		await usersDAL.approveEvent(userId,eventId);
	
		await eventsDAL.approveEvent(eventId,userName);
	
		//לאשר הגעה - גם בצד EVENTS וגם אצל היוזר - להעביר ממוזמן, למאושר - 
		//await teamsDAL.addEventToTeam(eventNum,teamId);
		//await usersDAL.addEventToUser(userId,eventNum);
		//console.log(eventNum);
		res.status(200).send({message: "event approved"});
	
		//res.send(events);
	  });


router.get("/:id", async (req, res) => {
	let event = await eventsDAL.getEventByID(req.params.id);
	//console.log(event);
	//res.json(user);
	if(event)
    {res.status(200).send({message: "event found",event:event});}
    else
    {
      res.status(404).json({message:'team not found'});
    }
  });


module.exports = router;