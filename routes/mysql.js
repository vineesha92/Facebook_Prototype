var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'facebook',
	    port	 : 3306
	});
	return connection;
}

exports.insertData = function(sqlQuery, callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var con = getConnection();
	con.query(sqlQuery, function(err, result){
		if(err){
			console.log("err"+err);
			callback(err,null);
		}
		else{
			console.log("result: %j",result);
			callback(null, result);
		}
	});
	console.log("\nConnection closed..");
	con.end();
};  

exports.fetchData = function(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows[0]);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};	


exports.deleteData = function(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else {	
			// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

exports.updateData = function(sqlQuery, callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var con = getConnection();
	con.query(sqlQuery, function(err, result){
		if(err){
			callback(err,null);
		}
		else{
			callback(null, result);
		}
	});
	console.log("\nConnection closed..");
	con.end();
};  