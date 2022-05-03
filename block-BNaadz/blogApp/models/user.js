var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var { NotExtended } = require('http-errors');

var Schema = mongoose.Schema;


var userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    fullName: String
});

userSchema.pre('save', function(next) {
    this.fullName = this.firstName + " " + this.lastName;
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if (err) return next(err);
            this.password = hashed;
            return next();
        });
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
};

var User = mongoose.model('User', userSchema);


module.exports = User;