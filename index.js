import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const config = { 

  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync('./ca.pem').toString(),
  },
};
const db = new pg.Client(config);

db.connect();

const app = express();
// app.set('view engine', 'ejs');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// delete table in db
async function deleteTable() {
  try {
    await db.query("DROP TABLE IF EXISTS usersss");
    console.log("Table deleted");
  }
  catch (err) {
    console.error(err);
  }
}
// create table in db
async function createTable() {
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS userss (
        id SERIAL PRIMARY KEY,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(50) NOT NULL
      )`
    );
    // await db.query(
    //   "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(100))"
    // );
    // const result = await db.query("CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(100))");
    // console.log(result);
    console.log("Table created");
  }
  catch (err) {
    console.error(err);
  }
}
// insert user in db
async function insertUser(email, password) {
  try {
    const result = await db.query(
      "INSERT INTO userss (email, password) VALUES ($1, $2)",
      [email, password]
    );
    console.log(
      `User ${email} with password ${password} inserted into db`
    )
    console.log(result);
  }
  catch (err) {
    console.error(err);
    console.log("User not inserted into db");
  }
}
// get all users from db
async function getAllUsers() {
  try {
    const result = await db.query("SELECT * FROM userss");
    console.log(result.rows);
  }
  catch (err) {
    console.error(err);
  }
}
await getAllUsers();

// deleteTable entry
async function deleteTableEntry(id) {
  try {
    await db.query("DELETE FROM userss WHERE id = $1", [id]);
    console.log("Entryy deleted");
  }
  catch (err) {
    console.error(err);
  }
}
// deleteTableEntry(1)
// deleteTableEntry(3)
// deleteTableEntry(5)
// deleteTableEntry(6)


app.get("/", async (req, res) => {
  // await deleteTable(); // one time table deletion
  // await createTable(); // one time table creation
  // await insertUser("test1@mail.com", "test1@1234"); // one time user insertion for manual testing
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  // console.log(email, password);
  try {
    const checkResult = await db.query("SELECT * FROM userss WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      // res.send("Email already exists. Try logging in.");
      res.render("extra.ejs",{errmessage:"Email already exists. Try logging in."});
    } else {
      const result = await db.query(
        "INSERT INTO userss (email, password) VALUES ($1, $2) ;",
        [email, password]
      );
      console.log(result.rows);
      // res.render("secrets.ejs");
      // res.send("Registered now logging in.");
      res.render("extra.ejs",{errmessage:"Registered, now logging in."});
    }
  } catch (err) {
    console.log(err);
    
  // res.redirect("/");
  res.render("extra.ejs",{errmessage:"error Occur retry."});

  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM userss WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        // res.send("Incorrect Password");
        res.render("extra.ejs",{errmessage:"Incorrect Password"});
      }
    } else {
      // res.send("User not found");
      res.render("extra.ejs",{errmessage:"User not found"});
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
    res.render("extra.ejs",{errmessage:"error Occur retry."});
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
