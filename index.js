const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config(); //hide DBpass
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// connect with mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlu12w4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const blogCollection = client.db("blogWeb").collection("blogs");
    const categoryCollection = client.db("blogWeb").collection("category");

    // blogs api
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find();

      // send data to DB in array formet
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);

      // send data to DB
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });
    // category api
    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();

      //send data to DB in array formet
      const result = await cursor.toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//testing server running or not
app.get("/", (req, res) => {
  res.send("blog website's server is running");
});
app.listen(port, () => {
  console.log(`blog website's Server is running on port ${port}`);
});
