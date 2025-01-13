const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// const path = require("path");

// middleware
app.use(cors);
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/phreddit")
  .then(() => console.log("connect mongodb"))
  .catch((error) => console.error("failed to connect mongobd", error));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});


















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
