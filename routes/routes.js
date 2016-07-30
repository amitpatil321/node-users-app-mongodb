var bcrypt = require('bcryptjs');
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;
var SALT = 10;
// configure database
var db = []; 
//mongoclient.connect("mongodb://127.0.0.1/",function(err,dbobj){
mongoclient.connect("mongodb://amit:amit@ds031915.mlab.com:31915/amitmongodb",function(err,dbobj){
	if(err) console.log("Cant connect to database");
	console.log("Database connection successful!");
	db = dbobj;
});

// Home page
exports.home = function(req,res){
	var errmsg = [];
	var rows = [];
	// req.session.destroy();
	// Check if user is logged in?
	if(req.session.sessuser == undefined){
		res.redirect("/login");
	}else{	
		db.collection("users").find().toArray(function(err, results) {
			//if(err) console.log(err);
			//console.log(req.session.sessuser);
		    res.render("home.handlebars",{rows: results, user: req.session.sessuser, success : req.session.success});
		    // Remove message in session
		    delete req.session.success;
		});
	}
}

// Show login screen
exports.login = function(req,res){
	// If user already logged in then go to home page
	if(req.session.sessuser){
		res.redirect("/");
	}else{
		res.render("login.handlebars",{success:req.session.success});
		delete req.session.success;
	}
}

// Logout user
exports.logout = function(req,res){
	// destroy user session
	req.session.destroy();
	res.redirect("/login");
}

// Validate user login details
exports.loginSubmit = function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var errMsg = "";
	//console.log(username+"=="+password);
	db.collection('loginUsers').findOne({'username':username}, function(err,user){
		//if(err) console.log(user);

		// if user does not exists then show error and exit
		if(user == null){
			errMsg = "Invalid username or password";
			res.render("login.handlebars",{'errMsg': errMsg});
		}
		else{
			bcrypt.compare(password, user.password, function(error, matched) {
				if(err)
					errMsg = "Unexpected error";
				else{
					if(!matched)
						errMsg = "Invalid username or password";
					else{
						req.session.sessuser = user.name;
					}
				}
				if(errMsg){
					console.log("failed");
					res.render("login.handlebars",{'errMsg': errMsg});
				}
				else{
					console.log("success");
					req.session.success = "Welcome "+user.name;
					res.redirect("/");					
				}
			});
		}
	});
}

// Show register form
exports.registerUser = function(req,res){
	res.render("register.handlebars");
}

// Save user to database
exports.registerSubmit = function(req,res){
	// Generate bcrypt hash key
	var name	 = req.body.name;
	var username = req.body.username;
	var password = req.body.password;

	bcrypt.genSalt(SALT, function(err, salt) {
	        if (err) return next(err);
	        // hash the password using our new salt
	        bcrypt.hash(password, salt, function(err, hash) {
	            if (err) return next(err);
	            // override the cleartext password with the hashed one
	            password = hash;
	            //console.log("Hash : "+password);

	            // Now insert record in db
				db.collection('loginUsers').insert(
					{
						"name"     : name, 
						"username" : username, 
						"password" : password
					},function(err,response){
						if(err)
							console.log(err); 
						if(response){
							req.session.success = "Registration Successful, Please login to continue";
							res.redirect("/login");
						}
				});	

	        });
	});

}

exports.editForm = function(req,res){
	var ObjectID = require('mongodb').ObjectID;
	db.collection('users').findOne({_id:ObjectID(req.params.uid)},{}, function(err, result) {
	    res.render("editUser.handlebars",{user: result});
	});	
}
 
exports.addForm = function(req,res){
	res.render("editUser.handlebars",{user: []});
}

exports.formAction = function(req,res){
	// If user's id is set then update user
	var ObjectID = require('mongodb').ObjectID;
	if(req.body.uid){
		db.collection('users').updateOne(
	      { _id : ObjectID(req.body.uid) },
	      {
	        $set: { "name": req.body.name, "email": req.body.email, "city" : req.body.city },
	      }, function(err, results) {
	      	//console.log(results.result);
	      	if(results.result.ok){
	      		req.session.success = "User details updated successfully!";
	      		res.redirect("/");
	      	}
	    });
	}else{
		// Id not set ? Then insert user as new user
		db.collection('users').insert(
			{
				"name" : req.body.name, 
				"email": req.body.email, 
				"city" : req.body.city
			},function(err,response){
				if(err)
					console.log(err); 
				if(response){
					req.session.success = "User added successfully!";
					console.log("User inserted");
					res.redirect("/");
				}
		});
	}
}

exports.deleteUser = function(req,res){
	var ObjectID = require('mongodb').ObjectID;
	db.collection("users").remove( { _id: ObjectID(req.params.uid)}, function(err,result){
		res.redirect("/");
	});
	req.session.success = "User deleted successfully!";
}