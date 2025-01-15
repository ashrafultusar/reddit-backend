const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const uri =
  "mongodb+srv://phreddit:SoUHgFB2dk7nk57b@cluster0.z8fz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = "mongodb://127.0.0.1:27017";

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
    const db = client.db("phreddit");
    const users = db.collection("users");

    // app.post("/signIn", async (req, res) => {
    //   const { name, email, password } = req.body;

    //   try {
    //     const existingUser = await users.findOne({ email });
    //     if (existingUser) {
    //       return res.status(400).send({ error: "Email already in use" });
    //     }

    //     const salt = bcrypt.genSaltSync(10);
    //     const hashedPass = bcrypt.hashSync(password, salt);

    //     const user = {
    //       name,
    //       password: hashedPass,
    //       email,
    //     };

    //     const result = await users.insertOne(user);
    //     res.status(201).send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ error: "Internal Server Error" });
    //   }
    // });

    // // Login
    // app.post("/login", async (req, res) => {
    //   try {
    //     const user = await users.findOne({ name: req.body.name });
    //     if (!user) {
    //       return res.status(400).send("User not found");
    //     }

    //     const passwordCheck = await bcrypt.compare(
    //       req.body.password,
    //       user.password
    //     );
    //     if (passwordCheck) {
    //       return res
    //         .status(200)
    //         .json({ message: "Login successful", name: user.name });
    //     } else {
    //       return res.status(400).send("Wrong details");
    //     }
    //   } catch (err) {
    //     console.error(err);
    //     return res.status(500).send("An error occurred on the server");
    //   }
    // });


    app.post("/signIn", async (req, res) => {
      const { name, email, password } = req.body;
    
      try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);
    
        const user = {
          name,
          password: hashedPass,
          email,
        };
    
        const result = await users.insertOne(user);
        res.status(201).json({ message: "Account created successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
    
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;
    
        // Check if user exists by email
        const user = await users.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
    
        // Validate password
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
          return res.status(400).json({ message: "Invalid password" });
        }
    
        // Send success response
        res.status(200).json({ message: "Login successful", name: user.name });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred on the server" });
      }
    });
    





    app.get("/users", async (req, res) => {
      const user = await users.find().toArray();
      res.send(user);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
