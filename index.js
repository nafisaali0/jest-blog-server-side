const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const commentCollection = client.db("blogWeb").collection("comments");
    const wishListCollection = client.db("blogWeb").collection("wishlist");

    //--- blogs api start---

    // show all blog in server from db
    app.get("/blogs", async (req, res) => {
      // show data from DB in array formet
      const result = await blogCollection.find().toArray();
      res.send(result);
    });
    //read or get specific blog by category
    app.get("/blogs/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      // data come from mongo
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    });
    //read or get specific blog by id
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      // data come from mongo
      const result = await blogCollection.findOne(query);
      res.send(result);
    });
    // create new blog
    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;

      // send data to DB
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });
    // update blog info by client response
    app.put("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBlogInfo = req.body;
      const updatedBlog = {
        $set: {
          title: updatedBlogInfo.title,
          short_description: updatedBlogInfo.short_description,
          long_description: updatedBlogInfo.long_description,
          details_image: updatedBlogInfo.details_image,
          date: updatedBlogInfo.date,
          time: updatedBlogInfo.time,
          category: updatedBlogInfo.category,
          owner_name: updatedBlogInfo.owner_name,
          owner_image: updatedBlogInfo.owner_image,
          owner_Email: updatedBlogInfo.owner_Email,
        },
      };
      const result = await blogCollection.updateOne(
        filter,
        updatedBlog,
        options
      );
      res.send(result);
    });

    //---- blog api end---

    //---category api start---

    //show all category in server from DB
    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();

      //show all data to DB in array formet
      const result = await cursor.toArray();
      res.send(result);
    });

    //---comments api end---

    //create comment from user and load in DB
    app.post("/comments", async (req, res) => {
      const newComments = req.body;

      // send data to DB
      const result = await commentCollection.insertOne(newComments);
      res.send(result);
    });
    //show all comments in server from DB
    app.get("/comments", async (req, res) => {
      let query = {};
      //set query for show comments for fixed blog id
      if (req.query?.blog_id) {
        query = { blog_id: req.query.blog_id };
      }
      //send data to DB in array formet
      const result = await commentCollection.find(query).toArray();
      res.send(result);
    });
    //read or get specific comments blogs by id
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await commentCollection.findOne(query);
      res.send(result);
    });
    // delete comment
    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    });

    //---comments api finish---

    //---wishlist api start---

    // add blog in wishlist DB
    app.post("/wishlist", async (req, res) => {
      const newBlog = req.body;
      // console.log(newBlog);
      // send data to DB
      const result = await wishListCollection.insertOne(newBlog);
      res.send(result);
    });
    //read or get specific wishlist's blogs by id
    app.get("/wishlist", async (req, res) => {
      let query = {};
      // condition for show blogs based on current user wishlist
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await wishListCollection.find(query).toArray();
      res.send(result);
    });
    //read or get specific wishlist;s blog by id
    app.get("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await wishListCollection.findOne(query);
      res.send(result);
    });
    // delete wishlist blogs by specific id
    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      // send data to DB
      const result = await wishListCollection.deleteOne(query);
      res.send(result);
    });

    //---wishlist api finish---
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
