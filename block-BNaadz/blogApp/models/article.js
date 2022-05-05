var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var slugger = require('slugger');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : {type : String, required: true},
    description : String,
    likes : {type :Number, default:0},
    comments :{type : [String], default : []},
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    slug : {type:String, unique: true},
},{timestamps : true})

articleSchema.pre('save', function (next) {
    this.slug = slugger(this.title);
    if (!this.likes) {
      this.likes = 0;
    }
    next();
  });

var Article = mongoose.model('Article',articleSchema);

module.exports = Article;