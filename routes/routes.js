var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;

// configure database
var db = [];
mongoclient.connect("mongodb://127.0.0.1/",function(err,dbobj){
	if(err) console.log("Cant connect to database");
	console.log("Database connection successful!");
	db = dbobj.db("users");
});

exports.home = function(req,res){
	var errmsg = [];
	var rows = [];

	db.collection("users").find().toArray(function(err, results) {
	    res.render("home.handlebars",{rows: results});
	});

	// db.collection("users",function(err,collection){
	// 	if(err) errmsg.push("Collection not found");
	// 	else{
	// 		collection.find(function(er,cursor){
	// 			if(err)
	// 				errmsg.push("failed to fetch records");
	// 			else{
	// 				cursor.each(function(cerr,doc){
	// 					rows.push(doc);						
	// 				});
	// 				res.render("home.handlebars",{rows: rows});
	// 			}
	// 		});
	// 	}
	// });
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
	      	//console.log(results.result.nModified);
	      	if(results.result.nModified){
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
}