require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

//connect to mongoose database 
const mongoose = require("mongoose");

//connect to the mongoDB database using environment variable
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() =>{
  console.log("MongoDB connection successful")
});

const PORT = 8080;

const app = express();
//enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
