var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/log', function(req, res, next) {
  const data = { message: 'eden is the king!' };
  res.status(200).json(data);
});

module.exports = router;
