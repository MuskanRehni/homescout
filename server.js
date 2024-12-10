const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const servicemodel = require("./models/servicemodel");
const Razorpay = require("razorpay");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Initialize express app
const app = express();

app.use(cors());
app.use(cookieParser());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontendrev")));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
connectDB();

// Razorpay API setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes

// Razorpay Payment Route
app.post("/create-order", async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        receipt: "receipt#1",
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route to serve login page
app.get("/login", (req, res) => {
    if (req.cookies.token) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/verified", (req, res) => {
    if (req.cookies.token) {
        res.status(200).send({ message: true });
    } else {
        res.status(400).send({ message: false });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: "Invalid email or password" });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                error: "User not found, please sign up first.",
            });
        }

        // Compare password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Ensure this is set in your .env file
            { expiresIn: "1h" }
        );

        // Set token as cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            secure: false, // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour
        });

        // If login is successful, redirect to dashboard
        res.status(200).send({ message: "User Login Successfull" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to serve signup page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "SignUp.html"));
});

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files
const serviceRoutes = require("./routes/servicesroutes"); // Import service routes
app.use("/api/services", serviceRoutes); // Use service routes under the "/api/services" path

const feedbackRoutes = require("./routes/feedbackroutes");
app.use("/api/feedback", feedbackRoutes);

app.use("/api/realestate", require("./routes/realEstateRoutes"));

app.get("/maidservice", (req, res) => {
    res.sendFile(path.join(__dirname, "frontendrev", "first.html"));
});
// Signup route
app.post("/signup", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorString = errors
            .array()
            .map((error) => error.msg)
            .join(", ");
        return res.status(400).json({ errors: errorString });
    }

    const { name, phone, email, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).send({ message: "User Registered Successfully" });
    } catch (err) {
        // Duplicate email error
        if (err.message.includes("duplicate")) {
            res.status(500).send({ error: "Email Already Exists" });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
});

// Route to serve frontpage.html as the landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontendrev", "frontpage.html"));
});

app.get("/addServices", (req, res) => {
    res.sendFile(path.join(__dirname, "frontendrev", "crud.html"));
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).redirect("/");
});

// Start the server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
