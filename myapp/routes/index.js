var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




var controller = require('../controllers/mis_controllers')

router.get('/users/raw_list', controller.raw_users_list);
router.get('/users/bulk_add', controller.bulk_add);


module.exports = router;
