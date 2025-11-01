const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const fetchUser = require("../middleware/fetchUser")

// Route1 : Creating a new user using: POST /api/auth/signUp . No Login requried.
router.post("/signUp", [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    //If there are errors return bad request and the error
    if (!result.isEmpty()) {
        return res.status(400).send({ success, errors: result.array() });
    }
    try {
        const { name, email, password } = req.body;
        //checking if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already exists" });
        //hashing the password
        const hashedPassowrd = await bcrypt.hash(password, 10);
        //saving user in DB
        const newUser = await User.create({ name, email, password: hashedPassowrd });
        const data = {
            user: {
                id: newUser.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route2 : Authenticate a user using: POST "/api/auth/login". No login required
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    //If there are errors return bad request and the error
    if (!result.isEmpty()) {
        return res.status(400).send({ success, errors: result.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
    }
});

// Getting details of a logged in user using : GET "api/auth/getUser". Login required
router.post("/getUser", fetchUser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send(success, "Internal Server Error");

    }
})

module.exports = router;