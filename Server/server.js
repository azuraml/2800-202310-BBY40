import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

// Conversation history storage
let conversation = [];

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    let botResponse = '';

    // Check if it's the first interaction
    if (conversation.length === 0) {
      botResponse = "Jacob: Hi there! I'm Jacob, your personal tutor. How can I assist you today?";
    } else {
   
   
   
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${conversation.map(entry => `${entry.role}: ${entry.content}`).join('\n')}User: ${prompt}`,
      temperature: 0.5,
      max_tokens: 3000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });

    const botResponse = response.data.choices[0].text;
  }
    // Add user input and AI response to conversation history
    conversation.push({ role: 'user', content: prompt });
    conversation.push({ role: 'tutor', content: botResponse });

    // Reset conversation history after 20 interactions
    if (conversation.length >= 40) {
      conversation = [];
    }

    res.status(200).send({
      bot: botResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});


app.get('/reset', (req, res) => {
  conversation = []; // Reset conversation history
  res.status(200).send({ message: 'Conversation history has been reset.' });
});



app.listen(5000, () => console.log('Server is running on port http://localhost:5000'));
