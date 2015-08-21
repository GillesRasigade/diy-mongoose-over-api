var mongoose = require('mongoose');
var http = require('http');
var router = require('node-simple-router')({
  serve_static: true,
  static_route: __dirname + "/../../docs"
});

var st = require('node-static');
var file = new st.Server('./docs');

// Initialize the connection to the database:
// >> Connection with Mongoose to the database
mongoose.connect('mongodb://localhost/test');

// Create the abstract API instance:
var api = require('./api')(router,mongoose);

// Add the collection routes:
require('./collection')(api);

/**
 * Server child creation function.
 * @param    {Object}  Server configuration object.
 * @return   {Object}  Returns a new instance of http.Server.
 */
exports.create = function( config ) {
  
  // Workers can share any TCP connection
  // In this case its a HTTP server
  return http.createServer(router).listen(8000);
};