var mongoose = require('mongoose');
var Scheme = mongoose.Schema;

var ProductSchema = new Scheme({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  price: Number,
  image: String
});

module.exports = mongoose.model('Product', ProductSchema);