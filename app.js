require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption");
const md5 = require("md5")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
// console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
    .then(() => {
        res.render("secrets");
      })
     .catch((err) => {
          res.status(500).send("Internal server error");
     })
});

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username})
    .then((user) => {
        if(user.password === password){
            res.render("secrets");
        }
    })
    .catch((err) => {
        res.status(500).send("Internal server error");
    })
    
});
    

app.listen(3000, function() {
  console.log("Server started on port 3000");
});