const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
require("dotenv").config();
const port = process.env.PORT || process.env.LOCAL_PORT;
const app = express();

//connect to data base
connectDB();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayout);
app.use(cookieParser());

// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: "false",
//     saveUnitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URL,
//     }),
//   })
// );
app.use(express.static("public"));

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
