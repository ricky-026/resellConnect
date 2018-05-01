var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var localStrategy = require("passport-local");
var passportLocalMongoose =require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/resell_connect");//creates the db if doesnt exist


var app = express();

app.use(express.static('public')); //use the following code to serve images, CSS files, and JavaScript files in a directory named public:

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "My first web app",
    resave: false,
    saveUninitialized: false
}));

//need to pass in 3 options to work with passport 
//this secret is actually used to encode and decode messages

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//==========================================
// LOGIN 
//===============================================
app.get("/", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
      console.log(req.body.username);
      res.send("post");
});


//HOMEPAGE




//=================================================
//REGISTER ROUTES 
//=================================================
app.get("/register", function(req, res){
    res.render('register'); 
});

app.post("/register", function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    var firstname =req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var streetAddress = req.body.street_address;
    var province = req.body.province;
    var country = req.body.country;
    
    User.register(new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        street_address: streetAddress,
        province: province,
        country: country
    }), 
    password, 
    function(err, user){
        if (err){
            console.log(err);
            return res.render('register');
        }
        
        //run this, log the user in, takes 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        })
    });
});



//HOME
app.get("/home", function(req, res){
   res.render('home'); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("APP has started");
});

