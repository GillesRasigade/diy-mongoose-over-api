// module.exports = function(router,mongoose) {
module.exports = function(api) {
  
  // Model collection initialization:
  api.log('Model Collection initialization');
  var Collection = api.mongoose.model('Collection', { test: Number });
  
  // API modeles creation:
  api.list(Collection);
};