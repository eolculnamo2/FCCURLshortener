var mongo = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


//middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//url to mongodb database.. locally would be something like var url = 'mongodb://localhost:27017/myproject';
var url = "mongodb://"+process.env.USER+':'+process.env.PASS+"@ds235785.mlab.com:35785/singletempo";

//data to be added to DB
app.get("/:str", function(req,res){
  
  var newData = {
  "links": req.params.str,
  "short": String(Math.floor(Math.random()*1000))
}
  var x = newData.links.slice(0,3);
  console.log(x)

  if(x ==='www'){
    console.log("New Data")
    createNew();
  }
  else if(x !== 'www'){
    console.log("Existing Data")
    retrieveUrl();
  }
  
function createNew(){
  mongo.MongoClient.connect(url, function(err,db){
    db.collection('links').insert(newData, function(err,result){
      if(err) throw err;
    res.end("https://juniper-addition.glitch.me/"+newData.short)
    });
    db.close(function (err) {
      if(err) throw err;
    });
  });
}

function retrieveUrl(){
    mongo.MongoClient.connect(url, function(err,db){
    db.collection('links').findOne({"short": req.params.str}, function(err,result){
      if(err) throw err;
      if(result){
res.writeHead(301,
  {Location: "https://"+result.links}
);
res.end();
      }
      else{
        res.send("404. This shortened link is not associated with a link.")
      }
      });
    db.close(function (err) {
      if(err) throw err;
    });
  });
}

});
 
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
