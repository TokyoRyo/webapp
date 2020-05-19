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
   res.render('index', { title: '東京寮ウェブアプリ' });
});
app.get('/login', function(req, res, next) {
   res.render('login', { title: 'ログイン' });
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
app.post('/confirm', function(req, res, nest){
   var bodyParser = require('body-parser');
   app.use(bodyParser());
   app.use(bodyParser.urlencoded({extended: true}));
   var confirm = require('./imports/confirm');
   if(confirm.confirm(req.body.password)){
      res.render('createaccount', {title: 'ID:認証できました'})
   }
   else{
      res.render('login', { title: '実験' });
   }
})
app.get('/editprofile', function(req, res, next) {
   res.render('editprofile', { title: '実験' });
});


// CloudFunctionへのリクエストをExpressに引き継ぐためのコード
const api = functions.https.onRequest(app)
module.exports = {
   api
}