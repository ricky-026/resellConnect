var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var Item = require("./models/item")
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



var multer = require("multer");
var upload = multer({dest: "public/uploads/"});

function isLoggedIn(req, res, next){
    
    if (req.isAuthenticated()){
        return next();
    }
    
    res.redirect('/login');
}

//==========================================
// LOGIN 
//===============================================
app.get("/", function(req, res){
    res.render("login");
});

app.get("/login", function(req, res){
    res.render('login');
});

app.post("/login", passport.authenticate("local", 
{successRedirect: '/home',
 failureRedirect: '/login'
}),
function(req, res){
      console.log(req.body.username);
      res.send("post");
});

//===================================================
//LOG OUT
//================================================
app.get("/logout", function(req, res) {
    req.logout();
    res.render('login');
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
        });
    });
});



//HOME
app.get("/home", isLoggedIn, function(req, res){
    
   res.render('home', {user: req.user}); 
});


app.post("/create_post", isLoggedIn, upload.single('avatar'), function(req, res){
    var user_id = req.user._id;
    var item_name = req.body.item_name;
    var category = req.body.category;
    var price = req.body.price;
    var condition = req.body.condition;
    var description = req.body.description;
    var availability = "no";
    
    var itemD =  {
        item_name: item_name,
        category: category,
        price: price,
        condition: condition,
        description: description,
        availability: availability
    }
    
 
    return res.send(req.file);
    //var image_path = req.files.path;
    
    Item.create(
        {user_id: user_id,
        //image_path: image_path,
        item_description: itemD}, 
        function(err, item){
        if (err){
            res.send("error");
        }
    });
    res.redirect("/home");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("APP has started");
});


