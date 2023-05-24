require("./utils.js");

require("dotenv").config();

// const http = require('http');
// const fs = require('fs');
// const path = require('path');


const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const url = require("url");
const saltRounds = 12;
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;

const app = express();


const Joi = require("joi");

const expireTime = 1 * 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

var { database } = include("databaseConnection");

const userCollection = database.db(mongodb_database).collection("users");
const userPersonalInfoCollection = database.db(mongodb_database).collection("userPersonalInfo")
app.set("view engine", "ejs");

const navLinks = [
	{ name: "Login", link: "/login" },
	{ name: "Sign Up", link: "/signup" },
	{ name: "Study Habits", link: "/studyHabits" },
	{ name: "Profile", link: "/profile" },
];
app.use("/", (req, res, next) => {
	app.locals.navLinks = navLinks;
	app.locals.currentURL = url.parse(req.url).pathname;
	next();
});
app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
	crypto: {
		secret: mongodb_session_secret,
	},
});

app.use(
	session({
		secret: node_session_secret,
		store: mongoStore, //default is memory store
		saveUninitialized: false,
		resave: true,
	})
);

function isValidSession(req) {
	if (req.session.authenticated) {
		return true;
	}
	return false;
}

function sessionValidation(req, res, next) {
	if (isValidSession(req)) {
		next();
	} else {
		res.redirect("/login");
	}
}

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'successwebnoreply@gmail.com',
		pass: 'kxzvmzfgbjvjzlsb'
	}
});


app.get("/", (req, res) => {
	res.render("homepage");
});

app.get('/signup', (req, res) => {
	var missingUsername = req.query.missing;
	var missingEmail = req.query.missings;
	var missingPassword = req.query.missingss;
	var emailandpassword = req.query.ep;
	var emailandusername = req.query.eu;
	var usernameandpassword = req.query.up;
	var emailandusernameandpassword = req.query.eup;

	res.render("signup", { missing: missingUsername, missings: missingEmail, missingss: missingPassword, ep: emailandpassword, eu: emailandusername, up: usernameandpassword, eup: emailandusernameandpassword });
});

app.post('/submitUser', async (req, res) => {
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	if (!password && !username && !email) {
		return res.redirect("/signup?eup=1");
	}
	if (!email && !password) {
		return res.redirect("/signup?ep=1");
	}
	if (!username && !email) {
		return res.redirect("/signup?eu=1");
	}
	if (!password && !username) {
		return res.redirect("/signup?up=1");
	}
	if (!username) {
		return res.redirect("/signup?missing=1");
	}
	if (!email) {
		return res.redirect("/signup?missings=1");
	}
	if (!password) {
		return res.redirect("/signup?missingss=1");
	} else {
		const schema = Joi.object({
			username: Joi.string().alphanum().max(20).required(),
			password: Joi.string().max(20).required(),
			email: Joi.string().email().required(),
		});

		const validationResult = schema.validate({ username, password, email });
		if (validationResult.error != null) {
			console.log(validationResult.error);
			res.redirect("/signup");
			return;
		}

		var hashedPassword = await bcrypt.hash(password, saltRounds);

		await userCollection.insertOne({
			username: username,
			email: email,
			password: hashedPassword,
			studySchedule: [],
		});
		console.log("Inserted user");
		req.session.authenticated = true;
		req.session.email = email;
		req.session.username = username;
		req.session.cookie.maxAge = expireTime;
		var html = "successfully created user";
		// res.send(html);
		return res.redirect("/quiz");
	}
});

app.get("/quiz", (req, res) => {
	res.render('quiz');
});
app.get("/quiz-end", (req, res) => {
	res.render("quiz-end");
});

app.get("/members", (req, res) => {
	res.render('members');
});
app.get("/progress", (req, res) => {
	res.render('progress');
});


app.get('/login', (req, res) => {
	var missingUsername = req.query.missing;

	res.render("login", { missing: missingUsername });
});
app.post('/loggingin', async (req, res) => {
	// var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	const schema = Joi.string().max(20).required();
	const validationResult = schema.validate(email);
	if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/login");
		return;
	}

	const result = await userCollection
		.find({ email: email })
		.project({ email: 1, password: 1, username: 1, user_type: 1, _id: 1 })
		.toArray();



	console.log(result);
	if (result.length != 1) {
		console.log("user not found");
		res.redirect("/login?missing=1");
		return;
	}
	if (await bcrypt.compare(password, result[0].password)) {
		console.log("correct password");
		req.session.authenticated = true;
		req.session.email = email;
		req.session.username = result[0].username;
		req.session.cookie.maxAge = expireTime;
		req.session.user_type = result[0].user_type;

		res.redirect("/members");

	} else {
		console.log("incorrect password");
		res.redirect("/login?missing=1");
		return;
	}
});

app.get("/reset", (req, res) => {
	res.render("reset");
});

app.post("/resetUserpassword", async (req, res) => {
	var password = req.body.password;
	var email = req.body.email;

	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().max(20).required(),
	});

	const validationResult = schema.validate({ password, email });
	if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return;
	}

	var hashedPassword = await bcrypt.hash(password, saltRounds);

	await userCollection.updateOne({ email: email }, { $set: { password: hashedPassword } });

	console.log("Inserted user");
	req.session.password = password;
	console.log(password);
	console.log(hashedPassword);
	var html = "successfully created new password";
	res.send(html);


});
app.get("/resetlink", (req, res) => {
	res.render("resetemail");
});

app.post("/sendemail", async (req, res) => {

	var email = req.body.email;

	const schema = Joi.object({
		email: Joi.string().email().required(),
	});

	const validationResult = schema.validate({ email });
	if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return;
	}

	const result = await userCollection
		.find({ email: email })
		.project({ email: 1, password: 1, username: 1, _id: 1 })
		.toArray();

	var mailOptions = {
		from: 'successwebnoreply@gmail.com',
		to: result[0].email,
		subject: 'Reset Password link',
		html: '<h1>Caution Read Message Carefully</h1><p>Please do not share link with anyone.<a href="http://tivujfmelq.eu11.qoddiapp.com/reset">reset password </a></p>'
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	var html = "Please check your email";
	res.send(html);
});





app.get("/profile", sessionValidation, async (req, res) => {
	var username = req.session.username;
	const result = await userPersonalInfoCollection
		.find({ username: username })
		.project({ firstname: 1, lastname: 1, address: 1, gender: 1, dob: 1, course: 1, _id: 1 })
		.toArray();
	const result2 = await userCollection
		.find({ username: username })
		.project({ email: 1, password: 1, username: 1, _id: 1 })
		.toArray();

	res.render("profile", {
		firstname: result[0].firstname, lastname: result[0].lastname,
		address: result[0].address, gender: result[0].gender, dob: result[0].dob, course: result[0].course, email: result2[0].email
	});
});

app.get("/Registration", (req, res) => {
	res.render("Registration");
});

app.post('/addstudentinfo', async (req, res) => {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var mother = req.body.mother;
	var father = req.body.father;
	var address = req.body.address;
	var gender = req.body.inlineRadioOptions;
	var dob = req.body.birth;
	var course = req.body.course;
	var username = req.session.username;
	const schema = Joi.object({
		firstname: Joi.string(),
		lastname: Joi.string(),
		mother: Joi.string(),
		father: Joi.string(),
		address: Joi.string(),
		gender: Joi.string(),
		dob: Joi.string(),
		course: Joi.string(),
	});

	const validationResult = schema.validate({ firstname, lastname, mother, father, address, gender, dob, course });
	if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return;
	}



	await userPersonalInfoCollection.insertOne({
		firstname: firstname,
		lastname: lastname,
		mother: mother,
		father: father,
		address: address,
		gender: gender,
		dob: dob,
		course: course,
		username: username
	});
	console.log("Inserted user");

	return res.redirect("/profile")

});



// app.get("/resources", (req, res) => {
// 	fs.readFile(path.join(__dirname, 'app/campy.json'), 'utf8', (err, data) => {
//     if (err) {
//       res.writeHead(500, {'Content-Type': 'text/plain'});
//       res.end('Internal Server Error');
//       return;
//     }

//     // Parse the JSON data
//     const jsonData = JSON.parse(data);

//     // Set the response headers
//     // res.writeHead(200, {'Content-Type': 'text/html'});

//     // Create the HTML list
//     let htmlList = '<ul>';
//     jsonData.forEach((item) => {
//       htmlList += `<li><a href="${item.link}">${item.title}</a>`;
//       if (item.ed) {
//         htmlList += `<span>${item.ed}</span>`;
//       }
//       htmlList += '</li>';
//     });
//     htmlList += '</ul>';

//     // Send the HTML as the response
//     res.end(htmlList);
//   });
// })

app.get("/studyHabits", sessionValidation, async (req, res) => {
	const studySchedule = (await userCollection.find({ username: req.session.username }).project({ studySchedule: 1, _id: 1 }).toArray())[0].studySchedule;
	console.log(studySchedule);
	res.render("studyHabitsIntro", {studySchedule: studySchedule});
})
app.get("/studyHabitsQ1", sessionValidation, (req, res) => {
	res.render("studyHabitsQ1");
})
app.get("/studyHabitsQ2", sessionValidation, (req, res) => {
	res.render("studyHabitsQ2", { q: req.query.q });
})
app.get("/studyHabitsLoading", sessionValidation, (req, res) => { console.log("studyHabitsLoading")
	res.render("studyHabitsLoading", { qs: req.query.qs });
})
app.get("/studyHabitsResult", sessionValidation, (req, res) => {
	// CONFIG
	const LONGEST_TASK_DUR = 1; // in hours (any task longer than this will be broken up into chunks)
	const MORNING_TASK_DUR = 1; // in hours (total time, all chunks added up)
	const LONGEST_BREAK_DUR = 15/60; // in hours
	const FIRST_SCHOOL_TASK_TIME_OFFSET = 0.5 // in hours (how long after waking up do you want the first school task to be scheduled at the earliest?)

	// get raw data
	const qStrs = req.query.qs.split(".---.");
	let qs = [];
	for (let i = 0; i < qStrs.length; i++) {
		const qStr = qStrs[i];
		const taskStrs = qStr.split(".--.");
		let tasks = [];
		for (let i2 = 0; i2 < taskStrs.length; i2++) {
			const taskStr = taskStrs[i2];
			const taskParts = taskStr.split(".-.");
			tasks.push({ name: taskParts[0], dur: taskParts[1], time: taskParts[2] });
		}
		qs.push(tasks);
	}

	//* main code *//

	function to24HourTime(timeStr) {
		timeStr = timeStr.replace(/\s/g, "").toLowerCase();
		const sign = timeStr.substring(timeStr.length - 2, timeStr.length + 1);
		let hour;
		let min;
		if (timeStr.includes(":")) {
			const split = timeStr.split(":");
			hour = parseInt(split[0]);
			min = parseInt(split[1].substring(0, split[1].length - 1));
		} else {
			hour = parseInt(timeStr.substring(0, timeStr.length - 1));
			min = 0;
		}
		if (sign == "am") {
			return hour + min/60;
		} else {
			return hour + min/60 + 12;
		}
	}

	function to12HourTimeStr(time) {
		if (time >= 25) {
			time = time % 24;
		}
		const flooredTime = Math.floor(time);
		const hour = (flooredTime <= 12) ? flooredTime : flooredTime - 12;
		const min = (time % 1 == 0) ? 0 : Math.round((time % 1) * 60);
		const sign = (time < 12 || flooredTime == 24) ? "am" : "pm";
		if (min == 0) {
			return hour + " " + sign;
		} else {
			if (min < 10) {
				return hour + ":0" + min + " " + sign;
			} else {
				return hour + ":" + min + " " + sign;
			}
		}
	}

	function toDurStr(dur) {
		return (dur < 1) ? Math.floor(dur * 60) + " min" : ((dur == 1) ? "1 hour" : dur + " hours");
	}

	function getSoonestAvailableTime(targetTask, minAvailableTime) {
		// solve any time conflicts (without changing the task time of tasks in the given task array)
		let soonestAvailableTime = minAvailableTime;
		for (let i = 0; i < schedule.length; i++) {
			const otask = schedule[i];
			const otaskEndTime = otask.time + otask.dur;
			//(x1 <= ox2 && ox1 <= x2 && y1 <= oy2 && oy1 <= y2)
			if (soonestAvailableTime < otaskEndTime && otask.time < soonestAvailableTime + targetTask.dur) {
				soonestAvailableTime = otaskEndTime;
			}
		}
		return soonestAvailableTime;
	}

	function sortSchedule() {
		schedule.sort((a, b) => a.time - b.time);
	}

	let schedule = [];

	// group peripheral tasks
	const q2 = qs[1];
	let prpTasks = [];
	for (let i = 0; i < q2.length; i++) {
		const task = q2[i];
		const name = task.name;
		const dur = parseFloat(task.dur) / 60;
		const time = to24HourTime(task.time);
		prpTasks.push({ name, dur, time, isPrp: true });
	}
	prpTasks.sort((a, b) => a.time - b.time);

	// group school tasks
	const q1 = qs[0];
	let sclTasks = [];
	for (let i = 0; i < q1.length; i++) {
		const task = q1[i];
		const name = task.name;
		const dur = parseFloat(task.dur);

		// split up task into 1 hour chunks if more than 1 hour (breaks will be scheduled later)
		if (dur > LONGEST_TASK_DUR) {
			for (let i2 = 0; i2 < Math.floor(dur/LONGEST_TASK_DUR); i2++) {
				sclTasks.push({ name, dur: LONGEST_TASK_DUR, totalDur: dur });
			}
			if (dur % LONGEST_TASK_DUR != 0) {
				sclTasks.push({ name, dur: dur % LONGEST_TASK_DUR, totalDur: dur });
			}
		} else {
			sclTasks.push({ name, dur, totalDur: dur });
		}
	}
	sclTasks.sort((a, b) => b.totalDur - a.totalDur);

	//** create schedule **//
	
	// schedule peripheral tasks
	let smallSclTask;
	for (let i = 0; i < prpTasks.length; i++) {
		const prpTask = prpTasks[i];
		schedule.push(prpTask);
	}
	sortSchedule();

	// find the smallest school task whose total time is an 1 hour or less and make it the first school task of the day (just as warm up before moving on to likely more difficult/larger tasks)
	if (sclTasks[sclTasks.length - 1].totalDur <= MORNING_TASK_DUR) {
		smallSclTask = sclTasks.pop();
		smallSclTask.time = getSoonestAvailableTime(smallSclTask, schedule[0].time + schedule[0].dur + FIRST_SCHOOL_TASK_TIME_OFFSET);
		schedule.push(smallSclTask);

		const breakTask = { name: "Break", dur: LONGEST_BREAK_DUR };
		breakTask.time = getSoonestAvailableTime(breakTask, smallSclTask.time + smallSclTask.dur);
		schedule.push(breakTask);
		// schedule.push({ name: "Break", dur: LONGEST_BREAK_DUR, time: smallSclTask.time + smallSclTask.dur });
	}
	sortSchedule();

	// schedule other school tasks (larger tasks are scheduled earlier than smaller tasks)
	for (let i = 0; i < sclTasks.length; i++) {
		const sclTask = sclTasks[i];
		const minAvailableTime = (smallSclTask != null) ? smallSclTask.time + smallSclTask.dur : schedule[0].time + schedule[0].dur + FIRST_SCHOOL_TASK_TIME_OFFSET;
		sclTask.time = getSoonestAvailableTime(sclTask, minAvailableTime);
		schedule.push(sclTask);

		// schedule a break (if task is an hour or more a full break will be scheduled)
		const breakDur = (sclTask.dur >= LONGEST_TASK_DUR) ? LONGEST_BREAK_DUR : ((sclTask.dur >= LONGEST_TASK_DUR/2) ? Math.ceil(LONGEST_BREAK_DUR * (2/3) * 60)/60 : Math.ceil(LONGEST_BREAK_DUR * (1/3) * 60)/60);
		if (breakDur > 0) {
			const breakTask = { name: "Break", dur: breakDur };
			breakTask.time = getSoonestAvailableTime(breakTask, sclTask.time + sclTask.dur);
			schedule.push(breakTask);
		}
	}
	sortSchedule();

	console.log(schedule);

	let result = [];
	for (let i = 0; i < schedule.length; i++) {
		const task = schedule[i];
		const correctedTaskName = task.name.charAt(0).toUpperCase() + task.name.slice(1);
		const taskType = (task.isPrp) ? "peripheralTask" : ((task.time >= 24) ? "lateTask" : ((task.name == "Break") ? "breakTask" : "schoolTask"));
		result.push([to12HourTimeStr(task.time), correctedTaskName, toDurStr(task.dur), taskType]);
	}

	req.session.studySchedule = result;

	res.render("studyHabitsResult", {result});
})
app.get("/saveStudyHabitsSchedule", async (req, res) => {
	await userCollection.updateOne({ username: req.session.username}, { $set: { studySchedule: req.session.studySchedule } });
	res.redirect("/studyHabits");
})

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/signup");
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
	let quotes = [
		'"A person who has never made a mistake never tried anything new." - Albert Einstein',
		'"You may encounter many defeats, but you must not be defeated." - Maya Angelou',
		'"I have not failed. I\'ve just found 10,000 ways that won\'t work." - Thomas A. Edison',
		'"Fear regret more than failure." - Taryn Rose',
		'"If you have not failed then you have indeed failed." - Ali Farahani',
	]

	res.status(404);
	res.render("404", { quote: quotes[Math.floor(Math.random() * quotes.length)] });
});

app.listen(port, () => {
	console.log("Node application listening on port " + port);
});
