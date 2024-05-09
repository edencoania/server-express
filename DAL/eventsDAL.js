const jsonfile = require('jsonfile');

/*
"event":[{
		"id":12,
		"name":""
		"time":"",
		"place":"",
		"info":"",
		"members":[],
	}
	]}
*/
function getAllEvents()
{
	return new Promise((resolve,reject)=>
	
	{const total = jsonfile.readFile('./DATA/events.json','utf8',(err,data) =>
		{
			if(err)
				{
					console.log("error");
					reject(err);
				}
			else
				{resolve(data)}});
			});
}

async function idARR()
{
	let allEvents = await getAllEvents();
	let idArr = [];
	allEvents.event.forEach(element => {
		idArr.push(element.id);
	});
	return idArr;
}

async function generateId()
{
	let idArr = await idARR();
	let counter=1;
	while(idArr.includes(counter))
	{
		counter++;
	}
	return counter;
}

async function addEvent(event)
{
	let allEvents = await getAllEvents();
	allEvents.event.push(event);
	jsonfile.writeFile('./DATA/events.json',allEvents);
	console.log("create event ID - " + event.id);
	return "succes";
}

async function createEvent(name,time,place,info,userName)
{
	let id = await generateId();
	let event = {"id":id,
	"name":name,
	"time":time,
	"place":place,
	"info":info,
	"members":[{"username":userName,"status":"approved"}]
	};
	await addEvent(event);
	return id;
}

async function updateEvent(eventId, newEvent) {
	try {
	  const events = await getAllEvents(); 
	  const index = events.event.findIndex(event => event.id == parseInt(eventId)); // Find the index of the event with the specified ID
  
	  if (index === -1) { // If the event doesn't exist, throw an error
		throw new Error(`Event with ID ${eventId} not found`);
	  }
  
	  events.event[index] = newEvent; // Replace the existing event with the new event object
	  await jsonfile.writeFile('./DATA/events.json', events); // Write the updated events array back to the JSON file
  
	  return newEvent; // Return the new event object
	} catch (error) {
	  console.error(error);
	  throw new Error('Error updating event');
	}
  }

async function approveEvent(eventId, username) {
	let event = await getEventByID(eventId); // Assuming there is a function to get an event by ID
	if (!event) {
	  throw new Error(`Event with ID ${eventId} not found`);
	}
	
	let member = event.members.find(m => m.username === username);
	if (!member) {
	  throw new Error(`User ${username} is not a member of event ${eventId}`);
	}
	
	member.status = "approved";
	await updateEvent(eventId,event); // Assuming there is a function to update an existing event
  }
//if not found - return 404
async function deleteEventByID(id)
{
	let allEvents = await getAllEvents();
	let dod = {"event":[]};
	allEvents.event.forEach(element =>
		{
			if(element.id!==id)
			{
				dod.event.push(element);
			}
		});
	jsonfile.writeFile('./DATA/events.json',dod);
	if(allEvents.event.length===dod.event.length)
	{
		console.log("event not found");
		return 404;
	}
	else
	{
		console.log("deleted event ID - " + id);
	}
}

async function getEventByID(id)
{
	let allEvents = await getAllEvents();
	//console.log(allEvents)

	let event = await allEvents.event.find(element => element.id==id);
	//console.log(found)
	if(event!==undefined)
	{ console.log("found event ID -"+id);
	//console.log(allEvents)
	}
	else
	{
		console.log("no such event");
	}
	return event;
}

//----------------user
async function addUserToEvent(userName,eventId)
{
	let allEvents = await getAllEvents();
	//console.log("here2")
	
	allEvents.event.forEach(element => {
		const existingMember = element.members.find(member => member.username === userName);

		if((element.id===eventId)&&(!element.members.includes(userName))&&(!existingMember))
		{
			element.members.push({"username":userName,"status":"invited"});
		}
	});
	await jsonfile.writeFile('./DATA/events.json',allEvents);
}

async function deleteUserfromEvent(userName,eventId)
{
	let allEvents = await getAllEvents();
	await allEvents.event.forEach(element => {
		let all  = []
		if(element.id===eventId)
		{
			for(let element2 of element.members )
			{
				if(element2!==userName)
				{
					all.push(element2)
				}
			}
			element.members = all
		}
	});
	jsonfile.writeFile('./DATA/events.json',allEvents);
}

module.exports = {approveEvent,getAllEvents,createEvent,deleteUserfromEvent,addUserToEvent,getEventByID,deleteEventByID,addEvent};
