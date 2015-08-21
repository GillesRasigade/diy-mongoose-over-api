
module.exports = function(router,mongoose) {
  
  this.router = router;
  this.mongoose = mongoose;
  var _self = this;
  
  /**
   * API Log:
   */
  this.log = function () {
    
    // Object to array conversion for arguments:
    var args = Array.prototype.slice.call(arguments);
    
    // Unshift necessary logs information:
    args.unshift(' >> ');
    args.unshift( '' + (new Date()).toUTCString() );
    
    // Apply the log function:
    console.log.apply( null , args );
  };
  
  /**
   * List the objects
   */
  this.list = function( Document ) {
    this.log(Document.modelName);
    router.get("/api/"+Document.modelName.toLowerCase()+"s", function(req, res) {
      
      // Then find:
      Document.find(function (err, documents ) {
        if (err) return console.error(err);
        _self.log('Answering collections: ' + documents.length );
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(documents));
      });
    
    });
  };
  
  return this;
};