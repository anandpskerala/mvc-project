const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname,  'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}));

app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use("/", userRoutes); 
app.use("/adminpanel", adminRoutes);



mongoose.connect(process.env.DB_URI).then(() => {
  console.log("[DATABASE] Connected to the cluster");
  app.listen(PORT, () => {
    console.log("[SERVER] Listening to port "+ PORT);
  });
}).catch((err) => {
  console.log("[SYSTEM] Failed to start the process\nError: " + err);
  process.exit(1);
})