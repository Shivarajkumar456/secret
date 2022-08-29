require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption")
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://0.0.0.0:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res)=>{
    res.render("register");
})

app.get("/login", (req,res)=> {
    res.render("login");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRound, function(err, hash) {
        const newUser = User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err)=>{
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });        
    });

});

app.post("/login", (req, res)=> {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err, found)=>{
        if(err){
            console.log(err);
        }else {
            if(found){
                bcrypt.compare(password, found.password,(err,result)=>{
                    if(result === true){
                        res.render("secrets");
                    }
                });
                
        }
        }
    });
});



app.listen(3000, ()=>{
    console.log("Server started on local host 3000");
})
