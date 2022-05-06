var express = require('express');
var User = require('../models/user');
var Product = require('../models/product');
var auth = require('../middlewares/auth');

var _ = require('lodash');

var router = express.Router();

/* handle create items request. */
router.get('/product/new', function (req, res, next) {
  // console.log(req.session.isAdmin);
  if (req.session.isAdmin === 'true' && req.session.userId) {
    return res.render('productListingForm');
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.post('/product/new', function (req, res, next) {
  console.log(req.session.isAdmin);
  if (req.session.isAdmin === 'true' && req.session.userId) {
    req.body.createdBy = req.session.userId;
    Product.create(req.body, (err, product) => {
      if (err) return next(err);
      res.redirect('/admin/product/list');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

// list items list for admin

router.get('/product/list', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    Product.find({}, (err, products) => {
      if (err) return next(err);
      let arrOfcategory = [];
      products.forEach((ele) => {
        if(ele.category) {
          if (ele.category.length > 0) {
            arrOfcategory.push(ele.category);
          }
        }
      });
      let arr = _.uniq(_.flattenDeep(arrOfcategory));
      res.render('adminProductList', { products, arr });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin list by category
router.get('/product/list/:category', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let category = req.params.category;
    Product.find({}, (err, allProducts) => {
      if (err) return next(err);
      let arrOfcategory = [];
      allProducts.forEach((ele) => {
        if(ele.category) {
          if (ele.category.length > 0) {
            arrOfcategory.push(ele.category);
          }
        }
      });
      let arr = _.uniq(_.flattenDeep(arrOfcategory));
      Product.find({ category: category }, (err, products) => {
        if (err) return next(err);
        res.render('adminProductList', { products, arr });
      });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin item details

router.get('/product/details/:id', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let productId = req.params.id;
    Product.findById(productId, (err, product) => {
      if (err) return next(err);
      res.render('adminProductDetails', { product });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin edit item

router.get('/product/:id/edit', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let productId = req.params.id;
    Product.findById(productId, (err, product) => {
      if (err) return next(err);
      res.render('adminProductEdit', { product });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.post('/product/:id/edit', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let productId = req.params.id;
    Product.findByIdAndUpdate(productId, req.body, (err, product) => {
      if (err) return next(err);
      res.redirect('/admin/product/details/' + productId);
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin item delete
router.get('/product/:id/delete', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let productId = req.params.id;
    Product.findByIdAndDelete(productId, (err, product) => {
      if (err) return next(err);
      res.redirect('/admin/product/list');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

module.exports = router;