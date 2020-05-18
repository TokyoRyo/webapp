const functions = require("firebase-functions")
const express = require("express")
const path = require("path")

// Express Appを準備
const app = express()

// ExpressのView EngineにPUGを指定
// pugファイルを格納するフォルダ「views」を宣言
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Expressルーティングルールの設定
// サイトルートへのリクエスト時にはindex.pugをレンダリングするように指定
app.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});
app.get('/login', function(req, res, next) {
   res.render('login', { title: '実験' });
});
app.get('/board/:idname', function(req, res, next) {
   res.render('board', { title: 'パラメータ：' + req.params['idname'] });
});
app.post('/loginold', function(req, res, nest){
   var bodyParser = require('body-parser');
   app.use(bodyParser());
   app.use(bodyParser.urlencoded({extended: true}));
   res.render('board', {title: 'ID:' + req.body.id});
})
app.post('/login', function(req, res, nest){
   var bodyParser = require('body-parser');
   app.use(bodyParser());
   app.use(bodyParser.urlencoded({extended: true}));
   var auth = require('./auth/auth');
   var data = new auth(req, res);
   res.render('board', {title: 'ID:' + data.login()})
})


// CloudFunctionへのリクエストをExpressに引き継ぐためのコード
const api = functions.https.onRequest(app)
module.exports = {
   api
}