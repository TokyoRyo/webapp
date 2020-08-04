const functions = require("firebase-functions")
const express = require("express")
const path = require("path")
const line = require('@line/bot-sdk');
var admin = require('firebase-admin');
var serviceAccount = require('./secretKey.json')
var request = require('request');
admin.initializeApp({
   credential: admin.credential.applicationDefault(),
   databaseURL: 'https://tokyoryo-20a72.firebaseio.com'
});
const app = express()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const api = functions.https.onRequest(app)
const getPositiveData = functions.pubsub.schedule('*/10 * * * *').onRun((context) => {
   request('https://stopcovid19.metro.tokyo.lg.jp/data/130001_tokyo_covid19_patients.csv', (error, response, data) => {
      // エラーチェック
      if( error !== null ){
         console.error('error:', error);
         return(false);
      }
      var linedata = data.split('\n');
      var i,j;
      var datedata = []
      var index = -1;
      var indexlist = linedata[0].split(',');
      for(i = 0; i < indexlist.length; i++){
         if(indexlist[i] === '公表_年月日'){
            index = i
         }
      }
      if(index === -1){
         return false
      }
      for(i = 1; i < linedata.length; i++){
         datedata.push(linedata[i].split(',')[index]);
      }
      require('date-utils');
      var removedays = -1
      for(i = 0; i < 8; i++){
         if(datedata.indexOf((new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))).remove({"days": i}).toFormat('YYYY-MM-DD')) !== -1){
            removedays = i
            break
         }
      }
      if(removedays === -1){
         return false;
      }
      let now = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
      now.remove({"days": removedays - 1});
      var day = [];
      for(i = 0; i < 7; i++){
         day[i] = now.remove({'days': 1}).toFormat('YYYY-MM-DD')
      }
      var positivelist = {}
      for(i = 0; i < 7; i++){
         positivelist[day[i]] = 0;
      }
      for(i = 0; i < datedata.length; i++){
         for(j = 0; j < 7; j++){
            if(datedata[i] === day[j]){
               positivelist[day[j]]++;
            }
         }
      }
      admin.database().ref('index/positive').set({data: positivelist, update: new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)).toFormat("YYYY/MM/DD HH24:MI")});
      
      return null;
   });
   return null;
});
module.exports = {
   api,getPositiveData
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
app.post('/confirm', (req, res, next) => {
   var confirm = require('./imports/confirm');
   if(confirm.confirm(req.body.password)){
      res.render('createaccount', {title: 'アカウントを作成'})
   }
   else{
      res.render('loginerror', { title: 'ログイン' });
   }
})
app.post('/webhook', line.middleware(config), (req, res) => {
   console.log(req.body.events);
   Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((result) => console.log('error!!!'));
});
app.post('/sendwebpush', (req, res, next) => {
   console.log(req.body.token)
   var webpushToken = req.body.token;
   var message = {
      data: {
         content: '正常に設定されました！\n今後新しい掲示や緊急のお知らせがあった場合にこのように通知します。'
      },
      token: webpushToken
   }
   admin.messaging().send(message)
   .then((response) => {
      return false;
   })
   .catch((error) => {
      return false;
   });
});
app.post('/sendnotify', (req, res, next) => {
   var db = admin.database();
   var ref = db.ref("usersinfo"); 
   ref.once("value").then(data => {
      var uidstring = req.body.senduidpostdata;
      var uidlist = uidstring.split(',')
      var notifydata = data.val();
      var i;
      var webpushlist = [];
      var linelist = [];
      var j;
      var keys = [];
      for(i = 0; i < uidlist.length - 1; i++){
         if(notifydata[uidlist[i]]['notify'] !== undefined){
            if(notifydata[uidlist[i]]['notify']['webpush'] !== undefined){
               keys = Object.keys(notifydata[uidlist[i]]['notify']['webpush'])
               for(j = 0; j < keys.length; j++){
                  webpushlist.push(notifydata[uidlist[i]]['notify']['webpush'][keys[j]]['webpush'])
               }
            }
         }
         if(notifydata[uidlist[i]]['notify'] !== undefined){
            if(notifydata[uidlist[i]]['notify']['line'] !== undefined){
               keys = Object.keys(notifydata[uidlist[i]]['notify']['line'])
               for(j = 0; j < keys.length; j++){
                  linelist.push(notifydata[uidlist[i]]['notify']['line'][keys[j]]['line'])
               }
            }
         }
      }
      if(linelist !== []){
         const linemessage = {
            type: 'text',
            text: '【通知】\n' + req.body.title + '\n掲示を確認して「確認しました」ボタンを押してください。\nhttps://tokyoryo-20a72.web.app/?openExternalBrowser=1' 
         }
         client.multicast(linelist, [linemessage])
      }
      if(webpushlist !== []){
         const webpushmessage = {
            data: {content: '【通知】' + req.body.title + '\n掲示を確認して「確認しました」ボタンを押してください。' },
            tokens: webpushlist
         }
         admin.messaging().sendMulticast(webpushmessage)
      }
      return false;
   })
   .catch(error => {
      return false;
   });
   
   res.render('editprofile', { title: '実験' });
});
app.post('/sendpersonalnotify', (req, res, next) => {
   var db = admin.database();
   var ref = db.ref("usersinfo"); 
   ref.once("value").then(data => {
      var uidstring = req.body.senduidpostdata;
      var uidlist = uidstring.split(',')
      var notifydata = data.val();
      var i;
      var webpushlist = [];
      var linelist = [];
      var j;
      var keys = [];
      for(i = 0; i < uidlist.length - 1; i++){
         if(notifydata[uidlist[i]]['notify'] !== undefined){
            if(notifydata[uidlist[i]]['notify']['webpush'] !== undefined){
               keys = Object.keys(notifydata[uidlist[i]]['notify']['webpush'])
               for(j = 0; j < keys.length; j++){
                  webpushlist.push(notifydata[uidlist[i]]['notify']['webpush'][keys[j]]['webpush'])
               }
            }
         }
         if(notifydata[uidlist[i]]['notify'] !== undefined){
            if(notifydata[uidlist[i]]['notify']['line'] !== undefined){
               keys = Object.keys(notifydata[uidlist[i]]['notify']['line'])
               for(j = 0; j < keys.length; j++){
                  linelist.push(notifydata[uidlist[i]]['notify']['line'][keys[j]]['line'])
               }
            }
         }
      }
      if(linelist !== []){
         const linemessage = {
            type: 'text',
            text: req.body.content + '\n(ここにメッセージしても返信できません。要件がある場合は直接連絡してください。)'
         }
         client.multicast(linelist, [linemessage])
      }
      if(webpushlist !== []){
         const webpushmessage = {
            data: {content: req.body.content },
            tokens: webpushlist
         }
         admin.messaging().sendMulticast(webpushmessage)
      }
      return false;
   })
   .catch(error => {
      return false;
   });
   
   res.render('editprofile', { title: '実験' });
});
app.get('/*', (req, res, next) => {
   res.render('index');
});
async function handleEvent(event) {
   if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
   }
   var db = admin.database();
   var ref = db.ref("usersinfo"); 
   ref.once("value").then(data => {
      var gotName = event.message.text;
      var usersinfo = data.val();
      var uidlist = Object.keys(usersinfo);
      var i;
      var gotuid = ''
      for(i = 0; i < uidlist.length; i++){
         if(usersinfo[uidlist[i]]['name'] === gotName){
            gotuid = uidlist[i];
         }
      }
      if(gotuid !== ''){
         admin.database().ref('usersinfo/' + gotuid + '/notify/line').push({
            line: event.source.userId
         });
         return client.replyMessage(event.replyToken, {
            type: 'text',
            text: '正常に登録されました。\n今後あなた宛ての通知をお送りします。\n大切な通知ですので、通知をOFFにしないでください。'
         });
      }else{
         return false;
      }
   })
   .catch(error => {
      return false;
   });
   return false;
}

exports.app = functions.region('asia-northeast1').https.onRequest(app);