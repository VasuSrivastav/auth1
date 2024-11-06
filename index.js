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
  // port: process.env.PORT,
  port: 21471,
  database: process.env.DATABASE,
  ssl: {
      rejectUnauthorized: true,
      // ca: fs.readFileSync('./ca.pem').toString(),
      ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUNVAnddfYoJxhvdYviiwY4xrKObMwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMzNhOTc5NDEtYmNiMi00YWYyLTkyZmEtMGFkY2U5MWVm
YzQ5IFByb2plY3QgQ0EwHhcNMjQxMTA0MjAxMDQxWhcNMzQxMTAyMjAxMDQxWjA6
MTgwNgYDVQQDDC8zM2E5Nzk0MS1iY2IyLTRhZjItOTJmYS0wYWRjZTkxZWZjNDkg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALD8Mo/m
IXCTUQXaHCG1E7NK+aXxq+ThTDFLvKtnpFYzVsCCjSf0dhZlVF4beM8vJJR1u4cf
6Qysru3UTOZVmgOMHW1kz6ZR3R3vX9pV6yR20NR11Nk9jy2YYMt3aMkvw92NU/kn
R4P8RAGug0yv7OQSq4kkBYetZZuM8zj1/1ozwLCIU2kk32JelT4Q72sFtb95oq7C
2oKIfJPWkqRyY/Ip+4xOrQfy5G2Twjjd6fHh5xprP77lFa62GfiA8O/F5axYcMry
i76uFSrxMfCLA9ZsQ33YTyLqQG6KqGfYujkru7lf3zNY8K7TLVnM1AXMikbThGTF
L618ecf+sW652UWyTnGkjDSTp916oY99m/TC5C6wu6JRDF8uWuuFxxAZxL+G/P4n
2KdmuI6+alueZ1MuKPJ40UW60G8i/MZQqnRmxhRIpsRilTN1xL097K46iZUu/XsW
5x9PqPDjr3IWe6unKDwkPggxHJ2drfr1SYJ0cJ+jPGvqiTw7DPMBUP7I1QIDAQAB
oz8wPTAdBgNVHQ4EFgQUwGYEPto9xQciIraugbc8zYSGodgwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAKtw6PqoJ5tulqhB
GBLX62PCArztuNBgQ4dD0DjuxZUrvaRRboA9S3/NAsqVqKShRLNXjv9aIz90Lck3
wEgqXSMzv/4b+z8pCXieE5FJjjNWPs3QHhf3MJ49keQuky8Hj/Xsjgcqzw6rJV7o
JACLl1R3t+Q/a67eEwZKzh3ytHBmRe195zm+El5+Gz7IeR8DkPacEDv7yhVq9VsV
Q1OlvaJssk19AFxQ4BIdAF47I5nRxc2kB+MYjIX28k62RSgeoe7l4zJZEftRFZhB
/EtZR3Ffruk936biBjv4HCsSFO7Jt/bXXK55b0DmS4sCxC9DVau8FockdCxhu07T
jahk3t0lQO1D8i0x4p4IJPEYHcOuYrm0Kjs5UsaXT19gl/hwQWT5HtMnHERG62Fw
3jJ5/rhHbjQiZAYmMTvxER33YyVBokaKYNOs3A4IfraS9lNCxMy4r2umtqShHtFq
m5bY1wpNQFHiuxmK7jdBkjuRM73O7NkfKzzEMb6vztM8O7t0EQ==
-----END CERTIFICATE-----
`,
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
