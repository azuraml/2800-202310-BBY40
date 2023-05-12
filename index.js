require("./utils.js");

require("dotenv").config();
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
  { name: "Registration", link: "/registration" },
  { name: "Create Account", link: "/signup" },
  { name: "Login", link: "/login" },
  { name: "Profile", link: "/profile" },
  { name: "logout", link: "/logout" },
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

app.get('/signup', (req,res) => {
	var missingUsername = req.query.missing;
	var missingEmail = req.query.missings;
	var missingPassword = req.query.missingss;
	var emailandpassword = req.query.ep;
	var emailandusername = req.query.eu;
	var usernameandpassword = req.query.up;
	var emailandusernameandpassword = req.query.eup;
	
	  res.render("signup",{missing: missingUsername, missings: missingEmail, missingss: missingPassword, ep: emailandpassword, eu: emailandusername, up: usernameandpassword, eup:emailandusernameandpassword });
	});

app.post('/submitUser', async (req,res) => {
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
	  });
	  console.log("Inserted user");
	  req.session.authenticated = true;
	  req.session.username = username;
	  req.session.cookie.maxAge = expireTime;
	  var html = "successfully created user";
	 // res.send(html);
	 return res.redirect("/quiz");
	}
});

app.get("*", (req, res) => {
	let quotes = [
	  '"A person who has never made a mistake never tried anything new." - Albert Einstein',
	  '"You may encounter many defeats, but you must not be defeated." - Maya Angelou',
	  '"I have not failed. I\'ve just found 10,000 ways that won\'t work." - Thomas A. Edison',
	  '"Fear regret more than failure." - Taryn Rose',
	  '"If you have not failed then you have indeed failed." - Ali Farahani',
	]
	
	res.status(404);
	res.render("404", {quote: quotes[Math.floor(Math.random() * quotes.length)]});
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
  

app.get('/login', (req,res) => {
	var missingUsername = req.query.missing;
	
	  res.render("login", {missing: missingUsername});
});
app.post('/loggingin', async (req,res) => {
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
	  .project({ email: 1, password: 1, username:1, user_type: 1, _id: 1 })
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
  
	  const validationResult = schema.validate({password, email});
	  if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return; 
	  }
  
	  var hashedPassword = await bcrypt.hash(password, saltRounds);
  
	  await userCollection.updateOne({ email: email }, {$set:{password: hashedPassword}});
  
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
  
	  const validationResult = schema.validate({email});
	  if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return; 
	  }
  
	  const result = await userCollection
	  .find({ email: email })
	  .project({ email: 1, password: 1, username:1, _id: 1 })
	  .toArray();
  
	  var mailOptions = {
		from: 'successwebnoreply@gmail.com',
		to: result[0].email,
		subject: 'Reset Password link',
		html: '<h1>Caution Read Message Carefully</h1><p>Please do not share link with anyone.<a href="http://tivujfmelq.eu11.qoddiapp.com/reset">reset password </a></p>'
	  };
	  
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });
	 
	  var html = "Please check your email";
	  res.send(html);
	 
	
  });





  app.get("/profile",sessionValidation,async (req, res) => {
	var username = req.session.username;
	const result = await userPersonalInfoCollection
	.find({username: username })
	.project({ firstname: 1, lastname: 1, address:1, gender: 1, dob:1, course: 1, _id: 1 })
	.toArray();

	res.render("profile",{firstname: result[0].firstname, lastname: result[0].lastname,
	address: result[0].address,  gender: result[0].gender, dob: result[0].dob, course: result[0].course  });
  });
  
  app.get("/Registration", (req, res) => {
	res.render("Registration");
  });
  
  app.post('/addstudentinfo', async (req,res) => {
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
  
	  const validationResult = schema.validate({ firstname, lastname, mother,father, address,gender,dob,course });
	  if (validationResult.error != null) {
		console.log(validationResult.error);
		res.redirect("/signup");
		return; 
	  }


  
	  await userPersonalInfoCollection.insertOne({
		firstname: firstname,
		lastname: lastname,
		mother:mother,
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
  



  app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/signup");
  });

  app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
  res.status(404);
  res.render("404");
});

app.listen(port, () => {
  console.log("Node application listening on port " + port);
});
