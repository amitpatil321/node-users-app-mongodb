// Add requires
var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var handlebars = require('express-handlebars');

// Require routes
var routes = require("./routes/routes.js");
var app = express();

// Set static path
app.use(express.static(__dirname+"/public"));
app.use(session({secret: "xpm#sfr", resave : true, saveUninitialized: false}));

// Config handlebars
app.set('view engine','handlebars');
app.engine('handlebars',handlebars({defaultLayout:'layout'}));

// Configure body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

// Set routes
app.get('/',routes.home)

app.get('/login',routes.login)
app.post('/login',routes.loginSubmit)
app.get('/logout',routes.logout)


app.get('/register',routes.registerUser)
app.post('/register',routes.registerSubmit)

app.get('/add',routes.addForm)
app.get('/edit/:uid',routes.editForm)
app.post('/edit',routes.formAction)
app.get('/delete/:uid',routes.deleteUser)

// Listen server request on given port
var port = process.env.PORT || 4000;
app.listen(port,function(){
	console.log("Server started at port : "+port);
});