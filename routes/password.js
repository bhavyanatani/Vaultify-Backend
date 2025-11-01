const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');
const Password = require('../models/Password')
const fetchUser = require("../middleware/fetchUser")
const secretKey = process.env.CRYPTO_SECRET
const zxcvbn = require('zxcvbn')

//Adding a password. Login required.
router.post("/addPassword", fetchUser, [
    body('title', 'Title is required').isLength({ min: 1 }).exists(),
    body('username', 'Username is required').isLength({ min: 1 }).exists(),
    body('password', 'Password is required').isLength({ min: 1  }).exists()
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    //If there are errors return bad request and the error
    if (!result.isEmpty()) {
        return res.status(400).send({ success, errors: result.array() });
    }
    try {
        const { title, username, password } = req.body;
        const userId = req.user.id;
        const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
        const newPassword = await Password.create({
            userId: userId,
            title,
            username,
            password: encryptedPassword
        });
        success = true;
        res.status(201).json({ success, message: 'Password added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success, message: 'Internal Server Error' });
    }
})

// Get all passwords of logged-in user
router.get('/getPasswords', fetchUser, async (req, res) => {
    try {
        const{search,q}=req.query;
        const searchTerm = q || search; // Support both `q` and `search`
        const filter = {};
        if (searchTerm) {
            filter.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
            ];
        }
        const passwords = await Password.find({ userId: req.user.id, ...filter });  

        // Decrypt passwords before sending
        const decryptedPasswords = passwords.map(p => {
            const bytes = CryptoJS.AES.decrypt(p.password, secretKey);
            const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

            return {
                id: p._id,
                title: p.title,
                username: p.username,
                password: originalPassword,
                createdAt: p.createdAt
            };
        });

        res.json(decryptedPasswords);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
//uodating an existing password
router.put("/updatePassword/:id", fetchUser, async (req, res) => {
    try {
        const { title, username, password } = req.body;
        const newPassword = {};

        if (title) newPassword.title = title;
        if (username) newPassword.username = username;
        if (password) {
            const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
            newPassword.password = encryptedPassword;
        }

        // Find the password to be updated
        let pswrd = await Password.findById(req.params.id);
        if (!pswrd) {
            return res.status(404).json({ message: "Password not found" });
        }

        // Check if the user owns this password
        if (pswrd.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not Allowed" });
        }

        // Update the password
        pswrd = await Password.findByIdAndUpdate(req.params.id, { $set: newPassword }, { new: true });
        res.json({ "Success": "Password updated successfully", pswrd });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//deleting an existing password
router.delete("/deletePassword/:id",fetchUser,async(req,res)=>{
    try {
        let pswrd = await Password.findById(req.params.id);
        if(!pswrd){
            return res.status(404).json({message:"Password not found"});
        }
        // Check if the user owns this password
        if (pswrd.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not Allowed" });
        }
        pswrd = await Password.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Password has been deleted", pswrd});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/checkstrength/:id', fetchUser, async (req, res) => {
    try {
        const passwordId = req.params.id;
        const pswrd = await Password.findById(passwordId);

        if (!pswrd) {
            return res.status(404).json({ message: "Password not found" });
        }

        if (pswrd.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not Allowed" });
        }

        // Decrypt stored password
        const bytes = CryptoJS.AES.decrypt(pswrd.password, secretKey);
        const passwordToCheck = bytes.toString(CryptoJS.enc.Utf8);

        // Analyze strength
        const result = zxcvbn(passwordToCheck);
        const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong"][result.score];

        res.json({
            passwordId,
            score: result.score,
            strength: strengthLabel,
            suggestions: result.feedback.suggestions,
            warning: result.feedback.warning,
            crack_time: result.crack_times_display.offline_slow_hashing_1e4_per_second
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;