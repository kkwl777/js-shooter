
var port = 8000;
var express = require('express');
var app = express();
//var app = express.Router();

app.listen(8000,()=> console.log(`PORT ${port} CONNECTED`));
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(bodyParser.json());

	var jsonParser = bodyParser.json();

	var urlencodedParser = bodyParser.urlencoded({ extended: true })


// will create the db if it does not exist
const path  = require('path');
const dbPath = path.resolve(__dirname,'database.db')

var db = new sqlite3.Database(dbPath,(err)=>{
	if (err) {
		console.error(err.message);
	}	
	console.log('Connected to the database.');
});
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS user (name varchar(24) UNIQUE,email TEXT DEFAULT NULL, password varchar(18))");
	db.run("INSERT INTO user (name,email,password) VALUES (\"Kevin\",\"123231\",\"xyz\")");




});



	app.get('/api/user',(req,res)=> {
		let sql = 'SELECT * FROM user'
		db.all(sql, [], (err, rows) => {
			var result = {};
			result["users"] = [];
			  if (err) {
					result["error"] = err.message;
			  } else {
				rows.forEach((row) => {
					result["users"].push(row);
				//	res.send(row);
					console.log(row);
					
				});
			}
			
			res.json(result);
		});
	});



app.get('/api/user/:name/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var name = '\"'+ (req.query.name) +'\"';
	var password = '\"'+ (req.query.password) +'\"';

	console.log(name);
	let sql = ('SELECT name, email FROM user WHERE name =' + name + 'AND password ='+ password + 'LIMIT 1 ;')	
	console.log(sql);
	db.all(sql,(err, row) => {
		console.log(sql);
		var result = {};
		result["user"] = [];


  		if (err) {
			// Should set res.status!!
    			result["error"] = err.message;
  		} else {



					result["user"] = row
					if (result["user"] == ""){
						result["user"] = 'Invalid Username/Password';
					}
			}
		
			res.json(result);
			console.log(result);
	
	});
});

;

 app.post('/posts',(req, res)=>{
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	console.log(req.body);
	


    // validate, return 400 if invalid 
  //   if(error){
    //        res.status(400).send(result.error.details[0])
      //  }

	//let sql = 'INSERT INTO user(name, email,password) VALUES ' + req.name + ',' ;

 //   pokemon.push(p);
 //   res.send(p);
})

app.post('/api/user', urlencodedParser,(req,res)=>{
//	let sql = ('INSERT INTO user(name, email, password) VALUES (?,?,?) ') 
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	var theReq = req.body;
	var name = theReq.name; 
	var password = req.body.password;
	var email = req.body.email;

	console.log(name);
	console.log(password);
	console.log('ewfnwibweifbweuifbibewiufewuib');

	let sql = ('INSERT INTO user(name,email,password) VALUES ' + '(\"' + name + '\",\"' + email + '\",\"' + password +'\") ;') 
	console.log(sql);
 	db.all(sql,(err, row) => {
		console.log(sql);
		var result = {};
		result["user"] = [];

  		if (err) {
			// Should set res.status!!
    			result["error"] = err.message;
  		} else {

					result["user"] = row
				//	res.send(row);
			//		console.log(result)
			//		console.log(row);
			}

			res.json(result);
			console.log(result);

 
	
	
	});
	
}),'json';





app.delete('/api/user/:name/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var name = '\"'+ (req.body.name) +'\"';
	var password = '\"'+ (req.body.password) +'\"';

	console.log(name);
	let sql = ('DELETE FROM user WHERE name =' + name + 'AND password ='+ password + ';')	
	console.log(sql);
	db.all(sql,(err, row) => {
		console.log(sql);
		var result = {};
		result["user"] = [];



  		if (err) {
			// Should set res.status!!
    			result["error"] = err.message;
  		} else {



					result["user"] = "Deleted"
		
			}
			res.json(result);
			console.log(result);
	
	});
});

app.put('/api/user/:name/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var name = '\"'+ (req.body.name) +'\"';
	var password = '\"'+ (req.body.password) +'\"';
	var newpassword = '\"'+ (req.body.newpassword) +'\"';

	
	let sql = ('UPDATE user SET password =' + newpassword + 'WHERE name =' + name + 'AND password ='+ password + ';')	
	console.log(sql);
	db.all(sql,(err, row) => {
		console.log(sql);
		var result = {};
		result["user"] = [];



  		if (err) {
			// Should set res.status!!
    			result["error"] = err.message;
  		} else {



					result["user"] = row
				
			}
			res.json(result);
			console.log(result);
	
	});
});

	app.listen(3000);
