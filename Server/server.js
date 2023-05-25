import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import bodyParser from'body-parser';
import MongoDBSessionStore from 'connect-mongodb-session';
dotenv.config();

/* secret information section */
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

/* END secret section */

import { client } from "./databaseConnection.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();

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

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false })); // Add this line before express.json()

app.use(express.json());

// Conversation history storage

app.use(bodyParser.json());
const collection = client.db(mongodb_database).collection('conversation');


app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

/*
app.post('/login', (req, res) => {
  const username = req.body.username;
  req.session.sessionData = { username: username }; // Store the username in the session as JSON string
  res.status(200).send({ message: 'Logged in successfully.' });
  console.log(username, req.session.sessionData.username); // Access the username from the session data
});
*/


app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  });
});
app.post('/', async (req, res) => {
  try {
    let botResponse = '';
    const username = req.body.username;

    const prompt =  + req.body.prompt `refer to the users name in following responses you give based on the first prompt by the user` ;
    console.log('Name of user:', username);

    // Retrieve the conversation history for the specific user
    const conversationHistory = await collection
      .find()
      .toArray();

    // Check if conversation history exists for the user
    if (conversationHistory.length === 0) {
      // Set initial response if no conversation exists
      botResponse = `Hi ${username}, I am your personal tutor named Jacob. I can help you create a learning plan.`;
    } else {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: conversationHistory
          .map(entry => `${entry.role}: ${entry.content}`)
          .join('\n') + '\nuser: ' + prompt,
        temperature: 0.5,
        max_tokens: 3000,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
      });

      botResponse = response.data.choices[0].text;
    }

    // Insert user input and AI response into the MongoDB collection
    const userEntry = { role: 'user', content: prompt, username: username };
    const tutorEntry = { role: 'tutor', content: botResponse, username: username };
    await collection.insertOne(userEntry);
    await collection.insertOne(tutorEntry);

    // Reset conversation history after 20 interactions
    const count = await collection.countDocuments({  });
    if (count >= 40) {
      await collection.deleteMany({ });
    }

    res.status(200).send({
      bot: { response: botResponse.trim() },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});




app.get('/reset', async (req, res) => {
  await collection.deleteMany({}); // Reset conversation history in MongoDB
  res.status(200).send({ message: 'Conversation history has been reset.' });
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));