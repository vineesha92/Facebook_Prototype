var ejs= require('ejs');
var mysql = require('mysql');

	var pool = mysql.createPool({
	    host     		: 'localhost',
	    user    	 	: 'root',
	    password 		: 'root',
	    database		: 'facebook',
	    port	 		: 3306,
	    connectionLimit : 1000
	});
	
exports.insertData = function(sqlQuery, callback){
	
	console.log("\nSQL Query::"+sqlQuery);	
	pool.getConnection(function(err,con){
		con.query(sqlQuery, function(err, result){
			if(err){
				console.log("err"+err);
				callback(err,null);
			}
			else{
				console.log("result: %j",result);
				con.release();
				callback(null, result);
			}
		}); 
	});
	console.log("\nConnection closed..");
};  

exports.fetchData = function(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,con){
	con.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows[0]);
			con.release();
			callback(err, rows);
		}
	});
});
	console.log("\nConnection closed..");
};	

exports.deleteData = function(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,con){
	con.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else {	
			// return err or result
			console.log("DB Results:"+rows);
			con.release();
			callback(err, rows);
		}
	});
});
	console.log("\nConnection closed..");
};

exports.updateData = function(sqlQuery, callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	pool.getConnection(function(err,con){
	con.query(sqlQuery, function(err, result){
		if(err){
			callback(err,null);
		}
		else{
			con.release();
			callback(null, result);
		}
	});
});
	console.log("\nConnection closed..");
};  