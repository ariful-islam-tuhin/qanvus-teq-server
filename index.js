const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require("cors");
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4i3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
  try {
    await client.connect();
    //   console.log("connected to database")  
    const database = client.db('qanvus-teq');
    const userCollection = database.collection('users')


    // post API
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // get user api
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // put upsert user 
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

  }
  finally {

  }
}

run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("qanvus teq server side is running");
});

app.listen(port, () => {
  console.log(`Example decoration app listening at http://localhost:${port}`);
});