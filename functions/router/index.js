var express = require('express');
const functions = require('firebase-functions');
var app = express.Router();
/* GET home page. */
router.get('/', function(req, res, nest) {
   res.render('index', { title: 'Node.js Test' });
});

module.exports = router;