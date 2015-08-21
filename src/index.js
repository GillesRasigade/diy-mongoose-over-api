/*
 * Main application file.
 */

var assert = require('assert');
assert.equal( process.argv.length , 3 , 'Please add config.json path to the start command.' );


var async = require('async');
var cluster = require('cluster');
var fs = require('fs');
var numCPUs = require('os').cpus().length;




// Load application configuration:
var config = JSON.parse(fs.readFileSync( process.argv[2]  , 'utf8')  );
var server = require('./lib/server.js');

// Master process only:
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
  
  // Server initialization:
  server.create( config );
  
}