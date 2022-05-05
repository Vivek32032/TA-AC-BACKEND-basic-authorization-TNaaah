var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var { NotExtended } = require('http-errors');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    likes: { types: Number, default: 0 },
    tags: String,
    category: { type: String },
    // comments: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

var Product = mongoose.model('Product', productSchema);

module.exports = Product;