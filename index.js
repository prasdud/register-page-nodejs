const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");



const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static frontend files

// Credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "admin",       // user = admin
    password: "Admin123#",       // PASSWD = Admin123#
    database: "register_details"  //DB NAME = register_details
});

db.connect(err => {
    if (err) throw err;
    console.log("connected to MySQL database");
});


// fields endpoint
app.get("/fields", (req, res) => {
    const sql = `SHOW COLUMNS FROM users`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching fields");
        }

        // Extract field names, excluding 'id', 'email', 'password', 'created_at'
        // const fieldNames = results
        //     .map(row => row.Field)
        //     .filter(field => !["id", "email", "password", "created_at"].includes(field));

        // this makes it so that email and password are no longer hardcoded and generated dynamically as per DB schema
        
        const fieldNames = results
        .map(row => row.Field)
        .filter(field => !["id", "created_at"].includes(field));

        res.json(fieldNames);
    });
});



// addfield Endpoint
app.post("/admin/addField", (req, res) => {
    const { fieldName } = req.body;
    console.log("Received field name:", fieldName);

    const sql = `ALTER TABLE users ADD COLUMN ?? VARCHAR(255) NULL`;
    db.query(sql, [fieldName], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error adding field");
        }
        console.log("Field added:", fieldName);
        res.send("Field added succesfully");
    });
});


// register endpoint
app.post("/register", async (req, res) => {
    try {
        const { email, password, ...customFields } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }

        let columns = ["email", "password"];
        let values = [email, password];

        // Add dynamically created fields
        for (const [key, value] of Object.entries(customFields)) {
            columns.push(`\`${key}\``); // to handle spaces in column name in table ex:"social security number" instead of "social_security_number"
            values.push(value || null); // Store empty values as NULL
        }

        // Build the SQL query dynamically
        const query = `INSERT INTO users (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

        await db.query(query, values);

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

// rename field endpoint
app.post("/admin/rename-field", (req, res) => {
    const { oldName, newName } = req.body;
    const sql = `ALTER TABLE users CHANGE \`${oldName}\` \`${newName}\` VARCHAR(255)`;

    db.query(sql, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error renaming field");
        }
        res.send("Field renamed successfully");
    });
});


// delete field endpoint
app.post("/admin/delete-field", (req, res) => {
    const { fieldName } = req.body;
    const sql = `ALTER TABLE users DROP COLUMN \`${fieldName}\``;

    db.query(sql, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting field");
        }
        res.send("Field deleted successfully");
    });
});





// MAIN
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/register_page_client.html`);
});
