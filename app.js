var   express             = require("express"),
      app                 = express(),
      bodyParser          = require("body-parser"),
      mongoose            = require("mongoose"),
      passport            = require("passport"),
      LocalStrategy       = require("passport-local"),
      methodOverride      = require("method-override"),
      Campground          = require("./models/campground"),
      Comment             = require("./models/comment"),
      User                = require("./models/user"),
      seedDB              = require("./seeds")
      
     
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/auth")


   
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
 //seedDB(); //seed the database

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Once again rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    next();
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Yelpcamp server has started");
});



