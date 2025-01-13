// const express = require("express");
// const cors = require("cors");
// const app = express();
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// // middleware
// app.use(cors);
// app.use(express.json());

// const uri =
//   "mongodb+srv://phreddit:SoUHgFB2dk7nk57b@cluster0.z8fz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const PORT = 8000;

// app.get("/", (req, res) => [res.send("Hello world")]);

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

    app.post("/users", async (req, res) => {
      const { name, email, password } = await req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = await bcrypt.hashSync(password, salt);

      const user = await {
        name,
        password: hashedPass,
        email,
      };

      const result = await users.insertOne(user);
      res.send(result);
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

// app.listen(PORT, () => {
//   console.log(`App running on ${PORT}`);
// });

// app.use(express.urlencoded({ extended: false }));

// const tempelatePath=path.json(__dirname,"../frontend/src/Component")
// const publicPath=path.json(__dirname,"../public")

// app.set('view engine', 'hbs')
// app.set("views", tempelatePath)
// app.set(express.static(publicPath))

// app.get('/', (req, res) => {
//     res.render('login')
// })

// app.get('/', (req, res) => {
//     res.render('signup')
// })

// app.listen(8000, () => {
//     console.log('port is connected 8000');
// })
