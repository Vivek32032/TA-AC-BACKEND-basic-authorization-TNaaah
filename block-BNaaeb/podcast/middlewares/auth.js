const User = require('../models/User');

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session && req.session.userId) {
      next();
    } else {
      return res.redirect('/users/login');
    }
  },
  userInfo: function (req, res, next) {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, ' _id email name userType ', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
  isAdmin: function (req, res, next) {
    let user = req.user;
    if (user.userType === 'admin') {
      next();
    } else {
      return res.redirect('/home');
    }
  },
  isClient: function (req, res, next) {
    let user = req.user;
    if (user.userType !== 'admin') {
      next();
    } else {
      return res.redirect('/home');
    }
  },
};