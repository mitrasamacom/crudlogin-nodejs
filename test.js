var async = require('async');

Category.find({}, function(err, category) {
  
  Product.findOne({ category: category._id }, function(err, productSingle) {
    
  });
});

async.waterfall([
  function(callback) {
    Category.find({}, function(err, category) {
      if (err) return next(err);
      callback(null, category)
    });
  },
  function(category, callback) {
    Product.findOne({ category: category._id }, function(err, productSingle) {
      if (err) return next(err);
      callback(null, productSingle)
    });
  },
  function(productSingle, callback) {
    Product.findById({ _id: productSingle._id }, function(err, Product) {
      if (err) return next(err);
      res.render('')
      res.redirect
    });
  },
])