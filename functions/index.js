const functions = require("firebase-functions")
const express = require("express")
const path = require("path")
const line = require('@line/bot-sdk');
var admin = require('firebase-admin');
var serviceAccount = require('./secretKey.json')
admin.initializeApp({
   credential: admin.credential.applicationDefault(),
   databaseURL: 'https://tokyoryo-20a72.firebaseio.com'
});
// Express Appを準備
const app = express()

// ExpressのView EngineにPUGを指定
// pugファイルを格納するフォルダ「views」を宣言
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const api = functions.https.onRequest(app)
module.exports = {
   api
}
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));

'use strict';


const config = {
   channelSecret: '5bed2d5621428a3431a41c67c2528fac',
   channelAccessToken: 'f/6tsH7+1ECNZaEx3i7du/+VC+ceSV4cd+SQHE4ASeBs6kF0/K+5/3VvIrtVaWY0DyEdqDHe3H2Wgw6WOL7lKm6gAEEIUfylwZqKntZnnqYEBO0fo5zHoSB5tq2S+Xwo+jlNQqOUviipvIDdnzfWwQdB04t89/1O/w1cDnyilFU='
};
const client = new line.Client(config);

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
app.post('/loginold', function(req, res, next){
   res.render('board', {title: 'ID:' + req.body.id});
})
app.post('/confirm', function(req, res, next){
   
   var confirm = require('./imports/confirm');
   if(confirm.confirm(req.body.password)){
      res.render('createaccount', {title: 'アカウントを作成'})
   }
   else{
      res.render('login', { title: '実験' });
   }
})
app.get('/editprofile', function(req, res, next) {
   res.render('editprofile', { title: '実験' });
});

app.post('/webhook', line.middleware(config), (req, res) => {
   console.log(req.body.events);
   Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((result) => console.log('error!!!'));
});

app.post('/sendnotify', function(req, res, next) {
   const message = {
      type: 'text',
      text: '新しい掲示です\n' + req.body.message
   }
   client.multicast(['U9dcfde078df0733db0a614346cde45bf'],
      [message]
   )
   res.render('editprofile', { title: '実験' });
});
app.get('/database', function(req, res, next) {
   console.log('分岐に入った')
   var db = admin.database();
   console.log('db読み込んだ')
   var ref = db.ref("usersinfo/KhS0XBTCBFeo1PtcN2Vfc9tPZKB3"); //room1要素への参照
   console.log('ref移動した')

   /*room1以下に対しての非同期コールバック */
   ref.on("value", function(snapshot) {
      console.log('snapshotとった')
      /* ここに取得したデータを用いた何らかの処理 */
      console.log(snapshot.val());
      res.render('board', { title: 'database:：' + snapshot.val().name });
   }, 
   function(errorObject) {
      console.log("エラーThe read failed: " + errorObject.code);
   } );
})
async function handleEvent(event) {
   if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
   }

   return client.replyMessage(event.replyToken, {
      type: 'text',
      text: event.message.text + '/' + event.source.userId //実際に返信の言葉を入れる箇所
   });
}

exports.app = functions.https.onRequest(app);