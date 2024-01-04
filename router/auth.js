const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send(`Hellow karn from router`)
});

/*
// Using Promises
router.post('/register', (req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error:"plz fill the field properly"});
    }

    User.findOne({email: email})
        .then((userExist) => {
            if(userExist){
                return res.status(422).json({error : "Email already Exist"});
            }
        
        
            const user = new User({name, email, phone, work, password, cpassword});

            user.save().then(() => {
                res.status(201).json({message: "User registered successfully"});
            }).catch((err) => res.status(500). json({error: "Failed to registered"}));
        }).catch(err => {console.log(err);});
});
*/

// Using async - await
router.post('/register', async(req, res) => {
    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error:"plz fill the field properly"});
    }

    try{
        const userExist = await User.findOne({email: email})

        if(userExist){
            return res.status(422).json({error : "Email already Exist"});
        }else if(password != cpassword){
            return res.status(422).json({error : "Password are not matched"});
        }else{
            const user = new User({name, email, phone, work, password, cpassword});
            // yaha pe wo password hashing hoga fir save hoga
            await user.save();

            res.status(201).json({message: "User registered successfully"});
        }

    } catch(err){ 
        console.log(err);
    }

});

// Login Route
router.post('/signin', async (req, res) => {
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({error:"plz Filled the data"});
        }

        const userLogin = await User.findOne({ email: email });


        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if(!isMatch){
                res.status(400).json({ message: "Invalid Credientials" });
            }else{
                res.json({ message: "User signin successfully" });
            }
        }else{
            res.status(400).json({ message: "Invalid Credientials" });
        }
        //console.log(userLogin);
        

    } catch (err) {
        console.log(err);
    }
});

// about us ka page

router.get('/about', authenticate, (req, res) => {
    console.log(`Hello my About`);
    res.send(req.rootUser);
});

// get user data for contact us and home page
router.get('/getdata', authenticate, (req, res) => {
    console.log(`Hello my Contact us`);
    res.send(req.rootUser);
})

//  contact us page 
router.post('/contact', authenticate, async (req, res) => {
    try{
        const {name, email, phone, message} = req.body;

        if(!name || !email ||!phone || !message){
            console.log("Error in contact us form");
            return res.json({error: "Plz filled the contact form"});
        }

        const userContact = await User.findOne({_id: req.userID});

        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone, message);
            await userContact.save();
            res.status(201).json({message: "User contact successfully"});
        }

    } catch(error){
        console.log(error);
    }
});

// Logout us ka page

router.get('/logout', (req, res) => {
    console.log(`Hello my Logout page`);
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send("User Logout");
});

module.exports = router;