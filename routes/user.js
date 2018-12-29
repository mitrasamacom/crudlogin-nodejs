var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');
var gravatar = require('gravatar');

//pengendali untuk login
router.get('/login', function(req, res ) {
  if (req.user){
    /*if (req.user.role == 'Admin')
      return res.redirect('/profile');
    else if (req.user.role == 'Karyawan')
      return res.redirect('/profile2');*/

    return res.redirect('/profile');
  }
  res.render('accounts/login', { message: req.flash('loginMessage')});
});

//setelah klik submit akan mengecek dengan security passport
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

//pengendali untuk menuju halaman profile
router.get('/profile', function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);
    res.render('accounts/profile', { user: user });
  });
});

//pengendali untuk menuju halaman signup
router.get('/signup', function(req, res, next) {
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

//pengendali untuk fungsi signup dan proses pengecekan data
router.post('/signup', function(req, res, next) { 
  var user = new User();

  user.profile.name = req.body.name; //mengambil data nama
  user.email = req.body.email; //mengambil data email
  user.address = req.body.address; //mengambil data address
  user.password = req.body.password; //mengambil data password
  user.profile.picture = user.gravatar; //mengambil data picture

  //mengecek database berdasarkan email
  User.findOne({ email: req.body.email }, function(err, existingUser) {

    if (existingUser) { //jika data email sudah ada
      req.flash('errors', 'Account with that email address already exists');
      return res.redirect('/signup');
    } else { //jika data email belum ada
      user.save(function(err, user){ //menyimpan data signup
        if (err) return next(err);

        req.logIn(user, function(err) { //lalu menjalankan login
          if (err) return next(err);
          res.redirect('/profile');
        });
      });
    }
  });
});

//pengendali untuk melakukan fungsi logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

//pengendali untuk melakukan menuju halaman edit profile
router.get('/edit-profile', function(req, res, next) {
  res.render('accounts/edit-profile', { message: req.flash('success')});
});

//pengendali untuk melakukan fungsi edit profile
router.post('/edit-profile', function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {

    if (err) return next(err);

    if (req.body.name) user.profile.name = req.body.name; //mengambil data nama dari textbox
    if (req.body.address) user.address = req.body.address; //mengambil data alamat dari textbox

    user.save(function(err) { //menjalankan funsi simpan
      if (err) return next(err); //jika proses simpan berhasil
      req.flash('success', 'Successfully Edited your profile');
      return res.redirect('/profile'); //di arahkan ke halaman profile
    });
  });
});

module.exports = router;