var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var localStrategy = require("passport-local");
var passportLocalMongoose =require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/resell_connect");

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "My first web app",
    resave: false,
    saveUninitialized: false
}));