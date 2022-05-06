var express = require('express');
var User = require('../models/user');
var Product = require('../models/product');
var router = express.Router();

/* GET list . */
router.get('/product/list', function (req, res, next) {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    Product.find({}, (err, products) => {
      res.render('clientProductList', { products });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//get details

router.get('/product/:id/details', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let productId = req.params.id;

    Product.findById(productId, (err, product) => {
      if (err) return next(err);
      res.render('clientProductDetails', { product });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//like handler

router.get('/product/:id/like', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let productId = req.params.id;

    Product.findByIdAndUpdate(productId, { $inc: { likes: 1 } }, (err, updated) => {
      if (err) return next(err);
      console.log(updated.likes);
      res.redirect('/client/product/' + productId + '/details');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.get('/product/:id/dislike', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let productId = req.params.id;

    Product.findByIdAndUpdate(productId, { $inc: { likes: -1 } }, (err, updated) => {
      if (err) return next(err);
      console.log(updated.likes);
      res.redirect('/client/product/' + productId + '/details');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//adding item to cart

router.get('/product/:id/addToCart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    let userId = req.session.userId;

    User.findByIdAndUpdate(
      userId,
      { $push: { cart: itemId } },
      (err, updated) => {
        if (err) return next(err);

        res.redirect('/client/product/list');
      }
    );
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//getting cart items

router.get('/product/cart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let userId = req.session.userId;

    User.findById(userId)
      .populate('cart')
      .exec((err, user) => {
        if (err) return next(err);
        let total = user.cart.reduce((acc, cv) => {
          acc = acc + cv.price;
          return acc;
        }, 0);
        res.render('clientCart', { user, total });
      });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//removing item to cart

router.get('/product/:id/removeFromCart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    let userId = req.session.userId;

    User.findByIdAndUpdate(
      userId,
      { $pull: { cart: itemId } },
      (err, updated) => {
        if (err) return next(err);

        res.redirect('/client/product/cart');
      }
    );
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

module.exports = router;