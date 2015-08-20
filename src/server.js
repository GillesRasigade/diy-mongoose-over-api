var async = require('async');
var cluster = require('cluster');
var http = require('http');
var mongoose = require('mongoose');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  console.log('Total number of CPUs available: ' + numCPUs );

  // Fork workers.
  async.map(new Array(numCPUs),function(id,callback){
    
    // Fork worker and keep pid in memory:
    cluster.fork().on('online', function(worker) {
        callback(null, this.process.pid);
    });
  
  },function(err,results){
    if ( err ) return console.error(err);
    console.log('Workers pids: ' , results);
  });
  
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

} else {
    
  // Initialize the connection to the database:
  // >> Connection with Mongoose to the database
  mongoose.connect('mongodb://localhost/test');
  var Collection = mongoose.model('Collection', { test: Number });
    
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    
    // Collection creation:
    var col = new Collection({ test: Math.random() });
    
    // Simply save:
    col.save(function(err,col){
        
        // Then find:
        Collection.find(function (err, documents) {
          if (err) return console.error(err);
          console.log(documents);
          res.writeHead(200);
          res.end("Collection size: " + documents.length + "\n");
        });
    });
    
    // console.log(mongoose);
    
  }).listen(8000);
  
}