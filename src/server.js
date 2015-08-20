var async = require('async');
var cluster = require('cluster');
var http = require('http');
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
    
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    
    // Connection with Mongoose to the database:
    
    
    
    res.writeHead(200);
    res.end("hello world\n");
    
  }).listen(8000);
  
}