var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/log', function(req, res, next) {
  res.status(200).send('eden is the king!');
});


module.exports = router;
