var express = require('express');
var User = require('../models/user');
var Product = require('../models/product');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session.isAdmin);
  if (req.session.isAdmin === 'true' && req.session.userId) {
    User.find({ }, (err, users) => {
      if(err) return next(err);
      Product.find({}, (err, products) => {
      if(err) return next(err);
      return res.render('adminHomePage', { users, products });
      })
    }) 
  } else if (req.session.isAdmin === 'false' && req.session.userId) {
    let error = req.flash('error')[0];
    return res.render('userHomePage', { error });
  } else {
    req.flash('error', 'you must login first');
    return res.redirect('/users/login');
  }
});

module.exports = router;