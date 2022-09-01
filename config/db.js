const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    const database = client.db('dentical');
    const collection = database.collection('dentists');

    // Query for a movie that has the title 'Back to the Future'
    const dentists = await collection.count();

    console.log(dentists);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};

module.exports = connectDB;
