var router = require('express').Router();
var User = require('../models/user');

//pengendali untuk menuju halaman home ketika di akses root
router.get('/', function(req, res) {
  res.render('main/home');
});

//pengendali untuk munuju halaman about
router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  })
})

module.exports = router;