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


// CloudFunctionへのリクエストをExpressに引き継ぐためのコード
const api = functions.https.onRequest(app)
module.exports = {
   api
}