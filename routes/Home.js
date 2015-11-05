var ejs = require("ejs");
var mysql = require('./mysql');
//var mysql = require('./mysqlpool');

exports.logIn= function(req,res) {
	if(req.session.username){
		res.render("HomePage");
	}
	res.render("SignIn");  
};

exports.afterSignUp =function (req,res){
	
	console.log("Second Page!!!");
	console.log(req.body);
	
	var fname = req.param("fname");
	var lname = req.param("lname");
	var email = req.param("email");
	var password = req.param("password");
	
	//insert user details in db
	var putUser = "INSERT INTO users(FIRSTNAME, LASTNAME, EMAIL, PASSWORD) VALUES ('"+ fname +"','"+ 
	lname +"','"+ email +"','"+ password +"');"
	mysql.insertData(putUser, function(err, result){
		if(err){
			
			res.send(err);
		}
		else {
			console.log("Query is:"+putUser);
			res.send(result);
			//res.render("SignIn");
		}
	});
};

exports.afterSignIn =function(req,res)
{
	// check user already exists
	var getUser="select * from users where email='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'";
	console.log("Query is:"+getUser);
		
	var uname = req.param("inputUsername");
	var pass = req.param("inputPassword");
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0 && results[0].email=== uname && results[0].password=== pass){
				console.log("valid Login");
				console.log(JSON.stringify(results));
				
				req.session.user =results[0]; 
				
				console.log("printing session_username");
				console.log(req.session.user.userid);
				
				// render on success
			        if (!err) {			        	
			            res.send(results);	
			        	console.log("if no err");			           			            
			        }
			    // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			}
			else {    
				console.log("Invalid Login");
			        // render on success
			        if (!err) {			                     
						res.render("SignIn");
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			}
		}  
	},getUser);
};

exports.afterPostClick = function(req,res){
	
	console.log("Inside afterPostClick in Home.js !!!");
	
	var status = req.param("status");
	
	//insert status details in db
	var putPost = "INSERT INTO posts(STATUS, USERID) VALUES ('"+ status +"','"+ req.session.user.userid +"');";
	mysql.insertData(putPost, function(err, result){
		if(err){
			res.send(err);
		}
		else {
			console.log("Query is:"+putPost);
			res.send(result);
		}
	});
};

exports.afterGetPosts = function(req,res){
	
	console.log("Inside afterGetPosts in Home.js !!!");
		
	//get posts from db
	var getPost = "select p.status, u.firstname from users u join posts p on u.userid=p.userid where u.userid = "+req.session.user.userid+" or u.userid in (SELECT friendid FROM friends f WHERE  f.userid = "+req.session.user.userid+" and f.friendstatus =0) or u.userid in (SELECT userid FROM friends f WHERE  f.friendid = "+req.session.user.userid+" and f.friendstatus =0) order by postid desc ;"
	console.log("Query is:"+getPost);
	mysql.fetchData(function(err, result){
		if(err){
			res.send(err);
		}
		else {
			
			res.send(result);
		}
	},getPost);
};

exports.afterGetMyPosts = function(req,res){
	
	console.log("Inside afterGetMyPosts in Home.js !!!");
		
	//get posts from db

	var getMyPost = "select p.status, u.firstname from users u join posts p on u.userid=p.userid where u.userid = "+req.session.user.userid+" order by postid desc ;";
	console.log("Query is:"+getMyPost);
	mysql.fetchData(function(err, result){
		if(err){
			res.send(err);
		}
		else {
			
			res.send(result);
		}
	},getMyPost);
};

exports.afterGetMyFriends = function(req,res){
	
	console.log("Inside afterGetMyFriends in Home.js !!!");
	var getFriends = "SELECT userid, firstname, lastname FROM users WHERE userid <> "+req.session.user.userid+" and userid IN (SELECT friendid FROM friends f  WHERE f.userid="+req.session.user.userid+" and f.friendstatus=0) or  userid in	(select userid from friends f where f.friendid = "+req.session.user.userid+" and f.friendstatus =0 );";
	console.log("Query is:"+getFriends);

	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getFriends);
};

exports.unfriend = function(req,res){
	
	console.log("Inside unfriend in Home.js !!!");
	var friendid = req.body.userid;
	
	var unfriend = "DELETE FROM friends WHERE (userid="+req.session.user.userid+" AND friendid = '"+friendid+"') or (userid='"+friendid+"' AND friendid = '"+req.session.user.userid+"');";
	console.log("Query is:"+unfriend);
	
	//insert status details in db
	mysql.deleteData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},unfriend);
};

exports.afterGetAllFriends = function(req,res){
	
	console.log("Inside afterGetAllFriends in Home.js !!!");
	
	var getAllFriends =" SELECT userid, firstname, lastname FROM users WHERE userid <> "+req.session.user.userid+" and userid not IN (SELECT friendid FROM friends f  WHERE f.userid="+req.session.user.userid+" and f.friendstatus=0) AND  userid not in	(select userid from friends f where f.friendid = "+req.session.user.userid+" and f.friendstatus =0 );";
	console.log("Query is:"+getAllFriends);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getAllFriends);
};

exports.getFriendRequests = function(req,res){
	
	console.log("Inside getFriendRequests in Home.js !!!");
	
	var getFriendrequests = "SELECT u.userid, u.firstname, u.lastname FROM users u JOIN friends f ON u.userid= f.userid WHERE f.friendstatus = 1 and (f.userid="+req.session.user.userid+" or f.friendid="+req.session.user.userid+");";
	console.log("Query is:"+getFriendrequests);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getFriendrequests);
};

exports.afterAddFriendClick = function(req,res){
	
	console.log("Inside afterAddFriendClick in Home.js !!!");

	var friendid = req.body.userid;
	console.log("req.body: %j",req.body);
	console.log("printing session.user.userid");
	console.log(req.session.user.userid);

	//insert status details in db
	var addfriend = "INSERT INTO friends(userid, friendid, friendstatus ) VALUES ('"+req.session.user.userid+"','"+friendid+"',1);";
	mysql.insertData(addfriend, function(err, result){
		if(err){
			console.log("inside addfriend");
			res.send(err);
		}
		else {
			console.log("Query is:"+addfriend);
			res.send(result);
		}
	});
};

exports.afterAcceptFriendRequest = function(req,res){
	
	console.log("Inside afterAcceptFriendRequest in Home.js !!!");

	var friendid = req.body.userid;
	var acceptfriend = "UPDATE friends SET friendstatus =0 WHERE friendid ='"+req.session.user.userid+"' and userid= '"+friendid+"';";
	mysql.updateData(acceptfriend, function(err, result){
		if(err){
			console.log("err is "+err);
			res.send(err);
		}
		else {
			console.log("Query is:"+acceptfriend);
			res.send(result);
		}
	});
};

exports.afterSearchUsers = function(req,res){
	
	console.log("Inside afterSearchUsers in Home.js !!!");
	var name = req.body.user;
	
	var getUserProfile = "select firstname, lastname, userid from users where firstname like '"+name+"%' or lastname like '"+name+"%';";
	console.log("Query is:"+getUserProfile);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getUserProfile);
};

exports.afterGetUserProfile = function(req,res){
	
	console.log("Inside afterGetUserProfile in Home.js !!!");
	var id = req.body.id;
	//console.log("Printing body.id "+req.body.id);
		
	var getUserProfile = "select u.firstname, u.lastname, u.email, ud.description, ud.education, ud.workexperience, ud.lifeevents, ud.contact, ud.music, ud.movies, ud.tvshows, ud.sports, ud.books from users u join userdescription ud on u.userid = ud.userid where u.userid = "+id+";";
	console.log("inside inside inside");
	console.log("Query is:"+getUserProfile);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getUserProfile);		
};

exports.afterCreateGroupClick = function(req,res){
	
	console.log("Inside afterCreateGroupClick in Home.js !!!");
	
	var groupname = req.param("groupname");
	var gdescription = req.param("gdescription");

	//insert status details in db
	var putGroup = "INSERT INTO groups(GROUPNAME, GROUPDESCRIPTION, CREATERID ) VALUES ('"+ groupname +"','"+ gdescription +"','"+ req.session.user.userid +"');";
	
	mysql.insertData(putGroup, function(err, result){
		if(err){
			res.send(err);
		}
		else {
			console.log("Query is:"+putGroup);
			//res.send(result);
			console.log("result is "+result);
			groupid = result.insertId;
			console.log("groupid" +groupid);
			var putGroup = "INSERT INTO groupusers(groupid, userid ) VALUES ('"+ groupid +"','"+ req.session.user.userid +"');";
			mysql.insertData(putGroup, function(err, results){
				if(err){
					res.send(err);
				}
				else {
					console.log("Query is:"+putGroup);
					res.send(results);
				}
			});
		}
	});
};

exports.afterJoinGroup = function(req,res){
	
	console.log("Inside afterJoinGroupClick in Home.js !!!");

	var groupid = req.body.groupid;
		
	//insert status details in db
	var joinGroup = "INSERT INTO groupusers(userid, groupid ) VALUES ('"+req.session.user.userid+"','"+groupid+"');";
	mysql.insertData(joinGroup, function(err, result){
		if(err){
			res.send(err);
		}
		else {
			console.log("Query is:"+joinGroup);
			res.send(result);
		}
	});
};

exports.afterGetGroups = function(req,res){
	
	console.log("Inside afterGetGroups in Home.js !!!");
	
	var getGroups = "SELECT g.groupid, g.groupname FROM groups g JOIN groupusers gu ON gu.groupid= g.groupid WHERE gu.userid = '"+req.session.user.userid+"';";
	console.log("Query is:"+getGroups);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getGroups);
};

exports.afterGetOtherGroups = function(req,res){
	
	console.log("Inside afterGetOtherGroups in Home.js !!!");
	
	var getAllGroups = "select g.groupname, g.groupid from groups g join groupusers gu on g.groupid=gu.groupid where g.groupid not in (select groupid from groupusers where userid = "+req.session.user.userid+");";
	console.log("Query is:"+getAllGroups);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getAllGroups);
};

exports.afterGetAllGroups = function(req,res){
	
	console.log("Inside afterGetAllGroups in Home.js !!!");
	
	var getAllGroups = "select * from groups;";
	console.log("Query is:"+getAllGroups);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},getAllGroups);
};

exports.afterViewGroup = function(req,res){
	
	console.log("Inside afterViewGroup in Home.js !!!");
	var groupid = req.body.groupid;
	
	var viewGroup = "select g.groupname, g.groupid, g.groupdescription, g.createrid,  u.firstname as member, us.firstname as creater from groupusers gu right join groups g on g.groupid = gu.groupid join users u on u.userid=gu.userid join users us on us.userid = g.createrid where g.groupid="+groupid+";";
	console.log("Query is:"+viewGroup);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},viewGroup);
};

exports.afterExitGroupClick = function(req,res){
	
	console.log("Inside afterExitGroupClick in Home.js !!!");
	
	var groupid = req.body.groupid;
	console.log("req.body is");
	console.log(req.body);

	var exitFromGroup = "DELETE FROM groupusers WHERE groupid='"+groupid+"' AND userid='"+req.session.user.userid+"';";
	console.log("Query is:"+exitFromGroup);
		
	//insert status details in db
	mysql.deleteData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results);
		}
	},exitFromGroup);
};

exports.afterDeleteGroupClick = function(req,res){
	
	console.log("Inside afterDeleteGroupClick in Home.js !!!");
	var groupid = req.body.groupid;
	var deleteEntryInGroupusers = "DELETE FROM groupusers WHERE groupid='"+groupid+"' and userid='"+req.session.user.userid+"';";
	console.log("Query is:"+deleteEntryInGroupusers);
		
	//insert status details in db
	mysql.deleteData(function(err,results){
		if(err){
			console.log("err is"+ err);
			res.send(err);
		}
		else {
			var deleteGroups = "DELETE FROM groups WHERE groupid='"+groupid+"' and createrid='"+req.session.user.userid+"';";
			console.log("Query is:"+deleteGroups);
			
			//insert status details in db
			mysql.deleteData(function(err,results){
				console.log("inside delete data");
				if(err){		
					res.send(err);
				}
				else {
					res.send(results);
				}
			},deleteGroups);
		}
	},deleteEntryInGroupusers);
};

exports.afterSubmitAboutMe = function(req,res){
	
	console.log("Inside afterSubmitAboutMe in Home.js !!!");
	
	var description = req.body.desc;
	var workEx = req.body.workex;
	var education = req.body.edu;
	var contactInfo = req.body.contact;
	var lifeEvents = req.body.lifeevents;
	var music = req.body.music;
	var sports = req.body.sports;
	var tvshows = req.body.tvshows;
	var movies = req.body.movies;
	var books = req.body.books;
	
	console.log("Inside afterGetAboutMe in Home.js !!!");
	
	var getAbout = "SELECT * from userdescription WHERE userid = "+req.session.user.userid+";";
	console.log("Query is:"+getAbout);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			console.log("err is : "+err);
		}
		else {
			if(results.length>=1){
				
				//insert About details in db
				var putAbout = "UPDATE userdescription SET DESCRIPTION ='"+ description +"', WORKEXPERIENCE = '"+ workEx +"',EDUCATION= '"+ education +"', CONTACT = '"+ contactInfo +"', LIFEEVENTS = '"+ lifeEvents +"', MUSIC = '"+ music +"', SPORTS = '"+ sports +"', TVSHOWS = '"+ tvshows +"', BOOKS = '"+ books +"', MOVIES = '"+ movies +"' WHERE USERID ='"+ req.session.user.userid +"';";
				mysql.updateData(putAbout, function(err, result){
					if(err){
						res.send(err);
					}
					else {
						console.log("Query is:"+putAbout);
						res.send(result);
					}
				});
			}
			else{
				
				//insert About details in db
				var putAbout = "INSERT INTO userdescription(DESCRIPTION, WORKEXPERIENCE, EDUCATION, CONTACT, LIFEEVENTS, USERID, MOVIES, BOOKS, TVSHOWS, MUSIC, SPORTS ) VALUES ('"+ description +"','"+ workEx +"','"+ education +"','"+ contactInfo +"','"+ lifeEvents +"','"+ req.session.user.userid +"','"+ movies +"','"+ books +"','"+ tvshows +"','"+ music +"','"+ sports +"');";
				mysql.insertData(putAbout, function(err, result){
					if(err){
						res.send(err);
					}
					else {
						console.log("Query is:"+putAbout);
						res.send(result);
					}
				});
		}
		}
	},getAbout);	
};

exports.afterGetAboutMe = function(req,res){
	
	console.log("Inside afterGetAboutMe in Home.js !!!");
	
	var getAbout = "SELECT * from userdescription WHERE userid = "+req.session.user.userid+";";
	console.log("Query is:"+getAbout);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results[0]);
		}
	},getAbout);
};

exports.afterGetMe = function(req,res){
	
	console.log("Inside afterGetMe in Home.js !!!");
	
	var getMe = "SELECT * from users WHERE userid = "+req.session.user.userid+";";
	console.log("Query is:"+getMe);
	
	//insert status details in db
	mysql.fetchData(function(err,results){
		if(err){
			res.send(err);
		}
		else {
			res.send(results[0]);
		}
	},getMe);
};

exports.afterLogout = function(req,res)   //logout function
{  
	req.session.destroy();   //destroy session 
	res.render("SignIn"); 
};

exports.getHomePage = function(req,res){
	console.log("just in homepage");
	if(req.session.user){
		console.log("printing req.session.user");
		console.log(req.session.user);
	res.render('HomePage');
	}
	else{
		console.log("inside else of homepage");
		res.render("SignIn");
	}
}

exports.getCreateGroupPage = function(req,res){
	if(req.session.user){
	res.render('Groups');	
	}
	else{
		res.render("SignIn");
	}
}

exports.getFriends = function(req,res){
	if(req.session.user){
	res.render('Friends');	
	}
	else{
		res.render("SignIn");
	}
}

exports.getAboutPage = function(req,res){
	if(req.session.user){
		res.render('About');	
	}
	else{
		res.render("SignIn");
	}
}

exports.getProfilesPage = function(req,res){
	if(req.session.user){
		res.render('Profiles');	
	}
	else{
		res.render("SignIn");
	}
}