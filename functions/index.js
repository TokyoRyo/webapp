const functions = require("firebase-functions")
const express = require("express")
const path = require("path")
const line = require('@line/bot-sdk');
var admin = require('firebase-admin');
var serviceAccount = require('./secretKey.json')
const sendmail = require('sendmail')();
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
app.get('/post', function(req, res, next) {
   res.render('post', { title: '掲示' });
});
app.get('/members', function(req, res, next) {
   res.render('members', { title: 'メンバー' });
});
app.get('/onlinemeeting', function(req, res, next) {
   res.render('onlinemeeting', { title: 'オンライン会議' });
});
app.get('/status', function(req, res, next) {
   res.render('status', { title: '在寮/帰省/外泊' });
});
app.get('/about', function(req, res, next) {
   res.render('about', { title: 'このアプリについて' });
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
      res.render('login', { title: 'ログイン' });
   }
})
app.get('/editprofile', function(req, res, next) {
   res.render('editprofile', { title: 'プロフィールの設定' });
});
app.get('/webpush', function(req, res, next) {
   res.render('webpush', { title: '実験' });
});
app.get('/dict', function(req, res, next) {
   var data = {"80WK3Ty73IeERHVA7fYD4QVGMa32":{"floor":"4階","grade":"4年生","job":"ネットワーク","linename":"よっこい","name":"末長祥一"},"KhS0XBTCBFeo1PtcN2Vfc9tPZKB3":{"floor":"4階","grade":"院生等","job":"ネットワーク","linename":"赤沢第輔(DaisukeAkazawa)","name":"赤沢第輔"},"PCQ24Ag3OWZpRyaMCuVJKX3THF32":{"floor":"未指定/分からない","grade":"学年：未指定/分からない","job":"役職：未指定/分からない","linename":"かさ","name":"あかさた"},"urTjss5KYcVhzdo0oIyRrLU4ESA3":{"floor":"未指定/分からない","grade":"学年：未指定/分からない","job":"役職：未指定/分からない","linename":"なし","name":"サンプルアカウント"},"zDuT0OuB6yaTsiRydsXQiyDOHzo2":{"floor":"4階","grade":"院生等","job":"会計","linename":"ochiai","name":"落合 厚"}}
   var uidlist = Object.keys(data);
   var i;
   var getName = '赤沢第輔'
   code = ''
   for(i = 0; i < uidlist.length; i++){
      if(data[uidlist[i]]['name'] === getName){
         code = code + data[uidlist[i]]['name'] + 'は一致しました。 / '
      }
      else{
         code = code + data[uidlist[i]]['name'] + 'は一致しませんでした。 / '
      }
   }
   return res.send(code)
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
app.post('/linecheck', function(req, res, next) {
   var db = admin.database();
   var ref = db.ref("usersinfo"); 
   ref.once("value").then(data => {
   var uidlist = Object.keys(data);
   var i;
   var getName = '赤沢第輔'
   code = ''
   for(i = 0; i < uidlist.length; i++){
      if(data[uidlist[i]]['name'] === getName){
         code = code + data[uidlist[i]]['name'] + 'は一致しました。 / '
      }
      else{
         code = code + data[uidlist[i]]['name'] + 'は一致しませんでした。 / '
      }
   }
      return res.send(data)
   })
   .catch(error => {
      res.status(404).send('No data available.');
   });
   
   
   
   
   
   
   
});
async function handleEvent(event) {
   if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
   }
   var db = admin.database();
   var ref = db.ref("usersinfo"); 
   ref.on("value", function(snapshot) {
      var userslist = snapshot.val();
      var uidlist = Object.keys(snapshot.val())
      var i = 0;
      var code = ''
      var lineName = event.message.text;
      for(i = 0; i < uidlist.length; i++){
         var thisName = userslist[uidlist[i]]['name']
         code = code + uidlist[i] + ':' + thisName + '\n'
         //if(thisName === lineName){
         //   var lineUid = userslist[uidlist[i]];
         //   admin.database().ref('notify/' + lineUid).set({
         //      line: event.source.userId
         //   });
         //}
      }
      //return client.replyMessage(event.replyToken, {
      //   type: 'text',
      //   text: code
      //});
   }, 
   function(errorObject) {
      console.log("エラーThe read failed: " + errorObject.code);
   } );
   
}

exports.app = functions.https.onRequest(app);