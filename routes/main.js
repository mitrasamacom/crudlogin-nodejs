var router = require('express').Router();

//pengendali untuk menuju halaman home ketika di akses root
router.get('/', function(req, res) {
  res.render('main/home');
});

//pengendali untuk munuju halaman about
router.get('/about', function(req, res) {
  res.render('about');
});

module.exports = router;