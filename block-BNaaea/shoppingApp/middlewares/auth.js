var User = require('../models/user');

module.exports = {
    loggedInUser: (req, res, next) =>  {
        if(req.session && req.session.userId) {
            next();
        } else {
            req.flash('error', 'You must be logged-In to perform this action');
            res.redirect('/users/login');
        }
    },
    isAdmin: (req, res, next) => {
      if (req.session && req.session.isAdmin === 'true') {
        next();
      } else {
        res.redirect('/home');
      }
    },
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if(userId) {
            User.findById(userId, "fullName email", (err, user) => {
                if(err) return next(err);
                req.user = user;
                res.locals.user = user;
                next();               
            })
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }  
    }
  };