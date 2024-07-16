const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const we = require("./Data/we.json");
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Portfolio backend is running");
  console.log("Portfolio backend is running");
});

//Testing start
app.get("/we", (req, res) => {
  console.log("We All");
  res.send(we);
});

app.get("/we/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const target_id = we.find((w) => w.id == id);
  res.send(target_id);
});
///Testing end

/**
 * MongoDb start
 */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jokwhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    /**
     * api work start
     */

    /**
     * Database and client start
     */

    const userCollection = client.db("aportfolioDB").collection("users");
    const homeServiceCollection = client
      .db("aportfolioDB")
      .collection("homeService");
    /**
     * Database and client end
     */

    // Home Service api
    app.get("/homeservice", async (req, res) => {
      const result = await homeServiceCollection.find().toArray();
      res.send(result);
    });

    //post user start
    app.post("/user", async (req, res) => {
      console.log("Come");
      const user = req.body;
      console.log("user: ", user);

      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      console.log("existing user: ", existingUser);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //post user end

    ///Get User start
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    ///Get User end

    ///Get User specific data start
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    ///Get User specific data end

    /**
     * api work end
     */

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

/**
 * MongoDb End
 */

app.listen(port, () => {
  console.log(`Portfolio backend is running on port ${port}`);
});
