import { config } from "dotenv";
import { MongoClient } from "mongodb";

config(); // Load environment variables from .env file

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;


const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/?retryWrites=true`;

const client = new MongoClient(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

export { client };

