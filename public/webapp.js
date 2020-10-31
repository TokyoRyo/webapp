// coding: utf-8
// (C) Copy Right Daisuke AKAZAWA
// Lisence: MIT
// More info: https://github.com/TokyoRyo/webapp

$(() => {
   var ResisterEvents = () => {
      $(document).ready(function(){
         var vh = $(window).height();
         document.documentElement.style.setProperty('--vh', vh + 'px');
      });
      $(window).resize(function(){
         var vh = $(window).height();
         document.documentElement.style.setProperty('--vh', vh + 'px');
      });
      window.onpopstate = () => {
         RenderPage();
      };
      $(document).on("click", ".app-link", function () {
         if($(this).attr('href') == window.location.pathname){
            return(false);
         };
         if(window.location.pathname.substring(0, 6) == '/edit/'){
            closeTopicEditor();
         };
         window.history.pushState('', '', $(this).attr('href'));
         RenderPage();
         document.querySelectorAll('.ListLayerContent.post')[0].scrollTo(0, 0);
         document.querySelectorAll('.ListLayerContent.topic')[0].scrollTo(0, 0);
         return(false);
      });
      $(document).on('click', '.logout', () => {
         firebase.auth().signOut();
      });
      $(document).on('click', ".ReadButton", function() {
         var ReadUpdateList = {};
         ReadUpdateList[MyUID] = 'read';
         firebase.database().ref('post/' + $(this).attr('name') + '/uidlist').update(ReadUpdateList);
      });
      $(document).on('click', ".DeletePostButton", function() {
         var result = window.confirm('本当に削除しますか？');
         if(result){
            firebase.database().ref('post/' + $(this).attr('name')).remove();
            window.history.pushState('', '', '/');
            RenderPage();
         };
      });
      $(document).on("click", ".topicFile", function () {
         var filepath = $(this).attr('name').substring(0, 14) + '/' + TopicData[$(this).attr('name').substring(0, 14)].files[$(this).attr('name').substring(15)].filename;
         var Strage = firebase.storage().ref().child(filepath);
         Strage.getDownloadURL().then(function(url){
            window.location.href = url;
         });
      });
      $(document).on("click", ".changeStatus", function () {
         firebase.database().ref('usersinfo/' + MyUID).update({status: $(this).html().substring(0,2)});
         return(false);
      });
      $(document).on("click", ".showIndex", function () {
         if(window.location.pathname == '/index'){
            return(false);
         };
         window.history.pushState('', '', '/index');
         RenderPage();
      });
      $('.LoginForm').submit(() => {
         $('.LoadingBar').removeClass('.Loaded');
         var email = $('.LoginForm [name=email]').val();
         var password = $('.LoginForm [name=password]').val();
         firebase.auth().signInWithEmailAndPassword(email, password)
         .then(() => {
            window.history.pushState('', '', '/');
            RenderPage();
            return(false);
         })
         .catch((error) => {
            $('.LoadingBar').addClass('.Loaded')
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('エラー' + errorMessage);
            // ...
            return(false);
         });
         return(false);
      });
      $(document).on('click', '.postReply', () => {
         if($('.replyContent').val() == ''){
            return(false);
         };
         var postid = $('.replyPostId').val();
         var replyContent = $('.replyContent').val();
         $('.replyContent').val('');
         firebase.database().ref('post/' + postid + '/reply').push({
            postedBy: MyUID,
            content: replyContent
         });
      });
      $(document).on('click', '.editTopicButton', function () {
         var uniqueKey = firebase.database().ref('/topic/' + $(this).attr('name') + '/editing').push().key;
         var editingDict = {};
         closeTopicEditor = () => {
            lmnEditor.onChange['editTopic'] = () => {};
            firebase.database().ref('/topic/' + $(this).attr('name') + '/editing/' + uniqueKey).remove();
            $('.lmnEditor-content#editTopic-content').html('');
         }
         editingDict[uniqueKey] = MyUID;
         firebase.database().ref('/topic/' + $(this).attr('name') + '/editing').set(editingDict);
         firebase.database().ref('/topic/' + $(this).attr('name') + '/editing/' + uniqueKey).onDisconnect().remove();
         $('.AppMain').addClass('Hide');
         $('.editTopicContent').removeClass('Hide');
         OpenEditTopic($(this).attr('name'));
      });
      $('#userMatchInput').keyup(() => {
         var content = $('#userMatchInput').val();
         var uidList = Object.keys(MemberInfo);
         if(content == ''){
            $('.userMatch').html('');
         }else{
            var userMatchContent = ''
            for(var i = 0; i < uidList.length; i++){
               if(content == MemberInfo[uidList[i]].name.substring(0, content.length)){
                  userMatchContent = userMatchContent + '<button type="button" class="btn btn-sm btn-outline-primary addPersonalNotify" name="' + uidList[i] + '">' + MemberInfo[uidList[i]].name + ' <i class="fa fa-plus-circle" aria-hidden="true"></i></button>';
               };
            };
            if(userMatchContent == ''){
               userMatchContent = '該当する寮生はいません';
            };
            $('.userMatch').html('<div class="alert alert-light" role="alert">' + userMatchContent + '</div>');
         };
      });
      $(document).on('click', '.addPersonalNotify', function () {
         personalNotifyUidList.push($(this).attr('name'));
         var personalNotifyTo = '';
         for(var i = 0; i < personalNotifyUidList.length; i++){
            var notifyWay = '';
            if(MemberInfo[personalNotifyUidList[i]].notify.line){
               notifyWay = notifyWay + '<i class="fab fa-line" aria-hidden="true"></i>';
            };
            if(MemberInfo[personalNotifyUidList[i]].notify.webpush){
               notifyWay = notifyWay + '<i class="fa fa-chrome" aria-hidden="true"></i>';
            };
            if(notifyWay == ''){
               notifyWay = '(送信されません)';
            };
            personalNotifyTo = personalNotifyTo + '<button type="button" class="btn btn-sm btn-primary">' +  MemberInfo[personalNotifyUidList[i]].name + notifyWay + '</button> '
         };
         if(personalNotifyTo == ''){
            $('.personalNotifyTo').html('送信先を1つ以上設定してください');
         }else{
            $('.personalNotifyTo').html('<div class="alert alert-primary" role="alert">送信先：' + personalNotifyTo + '</div>');
         };
         $('#userMatchInput').val('');
         $('.userMatch').html('');
      });
      $(document).on('click', '.sendPersonalNotify', function () {
         if(personalNotifyUidList.length == 0){
            alert('送信先を少なくとも1つ設定してください。');
            return(false);
         };
         if($('#personalNotifyMessage').val() == ''){
            alert('メッセージの内容を記入してください。');
            return(false);
         };
         var result = window.confirm('送信しますか？');
         if(result){
            var uidstring = '';
            for(var i = 0; i < personalNotifyUidList.length; i++){
               var meggase = '【' + MemberInfo[MyUID].name + 'からメッセージです】\n' + $('#personalNotifyMessage').val();
               uidstring = uidstring + personalNotifyUidList[i] + ','
            };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/sendpersonalnotify');
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            xhr.send( 'senduidpostdata=' + uidstring + '&content=' + meggase);
            alert('送信しました');
            RenderPage();
         };
      });
      $('.SetProfile').submit(() => {
         firebase.database().ref('/usersinfo/' + MyUID).update({
            name: $('.SetProfile [name=name]').val(),
            grade: $('.SetProfile [name=grade]').val(),
            job: $('.SetProfile [name=job]').val(),
            floor: $('.SetProfile [name=floor]').val(),
            linename: $('.SetProfile [name=linename]').val()
         });
         alert('設定しました');
         return(false);
      });
      $(document).on('click', '.submitNewPost', function () {
         if($('#postTitle').val() == ''){
            alert('掲示のタイトルを入力して下さい')
            return(false);
         }
         var result = window.confirm('掲示を投稿しますか？');
         if(result){
            var notifyDomitory = [];
            var notifyHome = [];
            if($('#Grade1Domitory').prop('checked')){
               notifyDomitory.push('1年生');
            };
            if($('#Grade2Domitory').prop('checked')){
               notifyDomitory.push('2年生');
            };
            if($('#Grade3Domitory').prop('checked')){
               notifyDomitory.push('3年生');
            };
            if($('#Grade4Domitory').prop('checked')){
               notifyDomitory.push('4年生');
            };
            if($('#Grade5Domitory').prop('checked')){
               notifyDomitory.push('院生等');
            };
            if($('#Grade1Home').prop('checked')){
               notifyHome.push('1年生');
            };
            if($('#Grade2Home').prop('checked')){
               notifyHome.push('2年生');
            };
            if($('#Grade3Home').prop('checked')){
               notifyHome.push('3年生');
            };
            if($('#Grade4Home').prop('checked')){
               notifyHome.push('4年生');
            };
            if($('#Grade5Home').prop('checked')){
               notifyHome.push('院生等');
            };
            var UidList = Object.keys(MemberInfo);
            var uidstring = '';
            var uiddict = {};
            for(var i = 0; i < UidList.length; i++){
               if(UidList[i] == MyUID){
                  continue;
               };
               if((MemberInfo[UidList[i]]['status'] == '在寮') && (notifyDomitory.indexOf(MemberInfo[UidList[i]]['grade']) >= 0)){
                  uidstring = uidstring + UidList[i] + ',';
                  uiddict[UidList[i]] = 'unread';
               };
               if((MemberInfo[UidList[i]]['status'] != '在寮') && (notifyHome.indexOf(MemberInfo[UidList[i]]['grade']) >= 0)){
                  uidstring = uidstring + UidList[i] + ',';
                  uiddict[UidList[i]] = 'unread';
               };
            };
            var date = new Date();
            var yyyy = date.getFullYear();
            var mm = ("0"+(date.getMonth()+1)).slice(-2);
            var dd = ("0"+date.getDate()).slice(-2);
            var hh = ("0"+date.getHours()).slice(-2);
            var mi = ("0"+date.getMinutes()).slice(-2);
            var sc = ("0"+date.getSeconds()).slice(-2);
            var postDate = yyyy + '' + mm + '' + dd + '' + hh + '' + mi + '' + sc;
            var postContent = {
               title: $('#postTitle').val(),
               content: $('#newPost-content').html(),
               postedBy: MyUID
            };
            if(Object.keys(uiddict).length > 0){
               postContent['uidlist'] = uiddict;
            };
            firebase.database().ref('post/' + postDate).set(postContent).then(() => {
               var xhr = new XMLHttpRequest();
               xhr.open('POST', '/sendnotify');
               xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
               xhr.send( 'senduidpostdata=' + uidstring + '&title=' + $('#postTitle').val());
               window.history.pushState('', '', '/post/' + postDate);
               RenderPage();
            }).catch(() => {
               alert('エラーが発生しました。');
            });
         };
      });
      $(document).on('change', '#topicTitle', function () {
         if($('#topicTitle').val() == ''){
            $('#topicTitle').val('新しいトピック')
         };
         firebase.database().ref('topic/' + $(this).attr('name')).update({title: $('#topicTitle').val()});
      });
      $(document).on('change', '#topicFileUploadInout', function () {
         var files = document.getElementById('topicFileUploadInout').files;
         var file = files[0];
         if(file){
            $('#topicFileUploadInoutLabel').html(file.name);
         };
      });
      $(document).on('click', '#topicFileUpload', function () {
         var topicid = $(this).attr('name');
         var files = document.getElementById('topicFileUploadInout').files;
         var file = files[0];
         console.log(file)
         if(!(file)){
            alert('アップロードするファイルを選択してください。')
            return(false);
         };
         var strageRef = firebase.storage().ref().child(topicid + '/' + file.name);
         strageRef.put(file).then(() => {
            firebase.database().ref('topic/' + topicid + '/files').push({
            filename: file.name
         });
         alert('アップロードしました');
      }).catch((err) => {alert('エラーが発生しました。' + err)});
      });
      $(document).on('click', '#closeTopicEditing', function () {
         closeTopicEditor();
         window.history.pushState('', '', window.location.pathname.substring(5));
         RenderPage();
      });
      $(document).on('click', '.reserveButton', function () {
         var reserveid = $(this).attr('name');
         if(reserveid.substring(0,9) == 'breakfast'){
            var reserveList = {};
            reserveList[reserveid.substring(9)] = MyUID;
            firebase.database().ref('reserve/breakfast/data').update(reserveList);
         };
         if(reserveid.substring(0,6) == 'dinner'){
            var reserveList = {};
            reserveList[reserveid.substring(6)] = MyUID;
            firebase.database().ref('reserve/dinner/data').update(reserveList);
         };
         if(reserveid.substring(0,6) == 'shower'){
            var reserveList = {};
            reserveList[reserveid.substring(6)] = MyUID;
            firebase.database().ref('reserve/shower/data').update(reserveList);
         };
      });
      $(document).on('click', '.reserveCancelButton', function () {
         var reserveid = $(this).attr('name');
         if(reserveid.substring(0,9) == 'breakfast'){
            var reserveList = {};
            reserveList[reserveid.substring(9)] = null;
            firebase.database().ref('reserve/breakfast/data').update(reserveList);
         };
         if(reserveid.substring(0,6) == 'dinner'){
            var reserveList = {};
            reserveList[reserveid.substring(6)] = null;
            firebase.database().ref('reserve/dinner/data').update(reserveList);
         };
         if(reserveid.substring(0,6) == 'shower'){
            var reserveList = {};
            reserveList[reserveid.substring(6)] = null;
            firebase.database().ref('reserve/shower/data').update(reserveList);
         };
      });
   };
   var RenderPage = () => {
      $('.LoadingBar').removeClass('loaded');
      $('.ListLayerContent').html('');
      $('.AppAsideNav.active').removeClass('active');
      var thisPage = window.location.pathname;
      $('.AppMain').addClass('Hide');
      if(thisPage == '/index'){
         $('title').html('安全レベルと指標 | 東京寮WebApp');
         $('.COVIDIndexContent').removeClass('Hide');
      }else if(thisPage == '' || thisPage == '/' || thisPage == '/'){
         $('.AppAsideNav.post').addClass('active');
         $('title').html('ホーム | 東京寮WebApp');
         $('.post.Hide').removeClass('Hide');
         $('.postlink.show').removeClass('show');
         $('.ListLayerContent.post').addClass('Hide');
         $('.ListLayerContent.post').html('<div style="text-align: center;">表示する掲示が選択されていません。左の一覧から選択して表示します。</div>');
         $('.Home').removeClass('Hide');
      }else if(thisPage == '/login'){
         $('.LoadingBar').addClass('loaded')
         $('title').html('ログイン | 東京寮WebApp');
         $('.Login').removeClass('Hide');
      }else if(thisPage.substring(0,6) == '/post/'){
         $('.AppAsideNav.post').addClass('active');
         $('.Home').removeClass('Hide');
         if(PostsData == ''){
            return(false);
         };
         RenderPost(thisPage.substring(6));
      }else if(thisPage == '/topic'){
         $('.AppAsideNav.topic').addClass('active');
         $('title').html('トピック | 東京寮WebApp');
         $('.topic.Hide').removeClass('Hide');
         $('.topiclink.show').removeClass('show');
         $('.ListLayerContent.topic').addClass('Hide');
         $('.ListLayerContent.topic').html('<div style="text-align: center;">表示するトピックが選択されていません。左の一覧から選択して表示します。</div>');
         $('.Topic').removeClass('Hide');
      }else if(thisPage.substring(0,7) == '/topic/'){
         $('.AppAsideNav.topic').addClass('active');
         $('.Topic').removeClass('Hide');
         if(TopicData == ''){
            return(false);
         };
         RenderTopic(thisPage.substring(7));
      }else if(thisPage == '/onlinemeeting'){
         $('.AppAsideNav.meeting').addClass('active');
         $('title').html('オンライン会議 | 東京寮WebApp');
         $('.OnlineMeeting').removeClass('Hide');
      }else if(thisPage == '/reserve'){
         $('.AppAsideNav.reserve').addClass('active');
         $('title').html('食事と風呂の予約 | 東京寮WebApp');
         $('.ReserveContent').removeClass('Hide');
      }else if(thisPage == '/newpost'){
         lmnEditor.open('newPost', '');
         $('title').html('掲示の投稿 | 東京寮WebApp');
         $('.NewPostContent').removeClass('Hide');
      }else if(thisPage == '/member'){
         personalNotifyUidList = [];
         $('.personalNotifyTo').html('送信先を1つ以上設定してください');
         $('#personalNotifyMessage').val('');
         $('.AppAsideNav.member').addClass('active');
         $('title').html('メンバー | 東京寮WebApp');
         $('.MemberContent').removeClass('Hide');
      }else if(thisPage == '/setnotify'){
         $('title').html('通知の設定 | 東京寮WebApp');
         if(MemberInfo != ''){
            UpdateUsersInfo(MemberInfo);
         };
         $('.Notify').removeClass('Hide');
      }else if(thisPage == '/editprofile'){
         $('title').html('プロフィールの設定 | 東京寮WebApp');
         $('.EditProfile').removeClass('Hide');
      }else if(thisPage.substring(0,6) == '/edit/'){
         window.location.href = thisPage.substring(5);
      }else if(thisPage == '/newtopic'){
         var date = new Date();
         var yyyy = date.getFullYear();
         var mm = ("0"+(date.getMonth()+1)).slice(-2);
         var dd = ("0"+date.getDate()).slice(-2);
         var hh = ("0"+date.getHours()).slice(-2);
         var mi = ("0"+date.getMinutes()).slice(-2);
         var sc = ("0"+date.getSeconds()).slice(-2);
         var postDate = yyyy + '' + mm + '' + dd + '' + hh + '' + mi + '' + sc;
         firebase.database().ref('/topic/' + postDate).set({
            title: '新しいトピック',
            content: '',
            lastupdate: MyUID
         }).then(() => {
            window.history.pushState('', '', '/topic/' + postDate);
            RenderPage();
         });
      }else{
         RenderError();
      };
   };
   var Initialization = () => {
      var firebaseConfig = {
         apiKey: "AIzaSyAFwYCHTlYgN_feZFKsFnR5U6hWCnfbvaY",
         authDomain: "tokyoryo-20a72.firebaseapp.com",
         databaseURL: "https://tokyoryo-20a72.firebaseio.com",
         projectId: "tokyoryo-20a72",
         storageBucket: "tokyoryo-20a72.appspot.com",
         messagingSenderId: "202064602931",
         appId: "1:202064602931:web:6bf7dad51b1d6fccbcc046",
         measurementId: "G-4HGXFJK0TL"
      };
      firebase.initializeApp(firebaseConfig);
      try{
         messaging = firebase.messaging();
         messaging.usePublicVapidKey("BCUxgO1Xi_Li3_CuoZ0rlQtAYFar1GhriUo5gQ3PMgwfHC_W18jTa1bSaOJo0Nd0RNAKKlMW1FFAeP8j5qk8xLk");
      }
      catch{
         $('.webpushVailed').html('<div class="alert alert-danger" role="alert"><i class="fa fa-times" aria-hidden="true"></i>この端末/ブラウザはWeb Push 通知に対応していません。</div>');
      }
   };
   var Authentication = () => {
      firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            if(window.location.pathname == '/login'){
               window.location.href = '/';
            };
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            MyUID = user.uid;
            ResisterDatabaseEvent(user.uid);
            $('.LoadingBar').addClass('Authentication');
            $('.AppAside').addClass('Authentication');
         } else {
            if(window.location.pathname != '/login'){
               window.location.href = '/login';
            };
         };
      });
   };
   var ResisterDatabaseEvent = () => {
      var Connection = firebase.database().ref('.info/connected');
      Connection.on('value', (snapshot) => {
         if (snapshot.val() === true) {
            $('.DisConnect').addClass('Hide');
            $('.LoadingBar').addClass('Connected');
            $('.DisConnect').removeClass('Unload');
         } else {
            $('.DisConnect').removeClass('Hide');
            $('.LoadingBar').removeClass('Connected');
            if(window.location.pathname.substring(0, 6) == '/edit/'){
               window.history.pushState('', '', window.location.pathname.substring(5));
               RenderPage();
            };
         };
      });
      var UsersInfo = firebase.database().ref('usersinfo/');
      UsersInfo.on('value', (snapshot) => {
         $('.LoadingBar').removeClass('UsersInfo');
         UpdateUsersInfo(snapshot.val());
      });
      var COVIDIndex = firebase.database().ref('index');
      COVIDIndex.on('value', (snapshot) => {
         $('.LoadingBar').removeClass('COVIDIndex');
         UpdateCOVIDIndex(snapshot.val());
      });
      var Posts = firebase.database().ref('post');
      Posts.on('value', (snapshot) => {
         $('.LoadingBar').removeClass('Posts');
         UpdatePosts(snapshot.val());
      });
      var Topic = firebase.database().ref('topic');
      Topic.on('value', (snapshot) => {
         $('.LoadingBar').removeClass('Topic');
         UpdateTopic(snapshot.val());
      });
      var Reserve = firebase.database().ref('reserve');
      Reserve.on('value', (snapshot) => {
         $('.LoadingBar').removeClass('Reserve');
         UpdateReserve(snapshot.val());
      });
      var OnlineMeeting = firebase.database().ref('onlinemeeting');
      OnlineMeeting.once('value', (snapshot) => {
         var Room = Object.keys(snapshot.val());
         var i;
         for(i = 0; i < Room.length; i++){
            $('.' + Room[i]).append('<a href="' + snapshot.val()[Room[i]] + '" target="_blank"><button type="button" class="btn btn-outline-primary"><i class="fa fa-skype" aria-hidden="true"></i>Skypeを開く<i class="fa fa-external-link-alt" aria-hidden="true"></i></button></a>');
         };
      });
   };
   var UpdateReserve = (reserveData) => {
      var i,j
      var isBreakfastReserved = false;
      for (i = 1; i < 10; i++){
         if(reserveData["breakfast"]["data"]){
            for (j = 1; j < 6; j++){
               if(reserveData["breakfast"]["data"][i + "-" + j]){
                  if(reserveData["breakfast"]["data"][i + "-" + j] === MyUID){
                     isBreakfastReserved = true;
                     $(".breakfast" + i + "-" + j).html('<b><span class="uidToname ' + reserveData["breakfast"]["data"][i + "-" + j] + '"></span></b> <button type="button" class="btn btn-sm btn-danger reserveCancelButton" name="breakfast' + i + '-' + j + '">取消</button>');
                  }else{
                     $(".breakfast" + i + "-" + j).html('<span class="uidToname ' + reserveData["breakfast"]["data"][i + "-" + j] + '"></span>');
                  };
               }else{
                  $(".breakfast" + i + "-" + j).html("");
               };
            };
         }else{
            for (j = 1; j < 6; j++){
               $(".breakfast" + i + "-" + j).html("");
            };
         };
      };
      if(isBreakfastReserved){
         $(".breakfastDate").html('(' + reserveData["breakfast"]["date"] + ')<span class="badge badge-success">予約済み</span>');
      }else{
         for (i = 1; i < 10; i++){
            for (j = 1; j < 6; j++){
               if($(".breakfast" + i + "-" + j).html() == ""){
                  $(".breakfast" + i + "-" + j).html("<button type='button' class='btn btn-sm btn-outline-success reserveButton' name='breakfast" + i + "-" + j + "'>予約する</button>");
               };
            };
         };
         $(".breakfastDate").html('(' + reserveData["breakfast"]["date"] + ')');
      };
      var isDinnerReserved = false;
      for (i = 1; i < 10; i++){
         if(reserveData["dinner"]["data"]){
            for (j = 1; j < 6; j++){
               if(reserveData["dinner"]["data"][i + "-" + j]){
                  if(reserveData["dinner"]["data"][i + "-" + j] === MyUID){
                     isDinnerReserved = true;
                     $(".dinner" + i + "-" + j).html('<b><span class="uidToname ' + reserveData["dinner"]["data"][i + "-" + j] + '"></span></b> <button type="button" class="btn btn-sm btn-danger reserveCancelButton" name="dinner' + i + '-' + j + '">取消</button>');
                  }else{
                     $(".dinner" + i + "-" + j).html('<span class="uidToname ' + reserveData["dinner"]["data"][i + "-" + j] + '"></span>');
                  };
               }else{
                  $(".dinner" + i + "-" + j).html("");
               };
            };
         }else{
            for (j = 1; j < 6; j++){
               $(".dinner" + i + "-" + j).html("");
            };
         };
      };
      if(isDinnerReserved){
         $(".dinnerDate").html('(' + reserveData["dinner"]["date"] + ')<span class="badge badge-success">予約済み</span>');
      }else{
         for (i = 1; i < 10; i++){
            for (j = 1; j < 6; j++){
               if($(".dinner" + i + "-" + j).html() == ""){
                  $(".dinner" + i + "-" + j).html("<button type='button' class='btn btn-sm btn-outline-success reserveButton' name='dinner" + i + "-" + j + "'>予約する</button>");
               };
            };
         };
         $(".dinnerDate").html('(' + reserveData["dinner"]["date"] + ')');
      };
      var isShowerReserved = false;
      for (i = 1; i < 35; i++){
         if(reserveData["shower"]["data"]){
            for (j = 1; j < 4; j++){
               if(reserveData["shower"]["data"][i + "-" + j]){
                  if(reserveData["shower"]["data"][i + "-" + j] === MyUID){
                     isShowerReserved = true;
                     $(".shower" + i + "-" + j).html('<b><span class="uidToname ' + reserveData["shower"]["data"][i + "-" + j] + '"></span></b> <button type="button" class="btn btn-sm btn-danger reserveCancelButton" name="shower' + i + '-' + j + '">取消</button>');
                  }else{
                     $(".shower" + i + "-" + j).html('<span class="uidToname ' + reserveData["shower"]["data"][i + "-" + j] + '"></span>');
                  };
               }else{
                  if($(".shower" + i + "-" + j).html() != "×"){
                     $(".shower" + i + "-" + j).html("");
                  }
               };
            };
         }else{
            for (j = 1; j < 4; j++){
               if($(".shower" + i + "-" + j).html() != "×"){
                  $(".shower" + i + "-" + j).html("");
               }
            };
         };
      };
      if(isShowerReserved){
         $(".showerDate").html('(' + reserveData["shower"]["date"] + ')<span class="badge badge-success">予約済み</span>');
      }else{
         for (i = 1; i < 35; i++){
            for (j = 1; j < 4; j++){
               if($(".shower" + i + "-" + j).html() == ""){
                  $(".shower" + i + "-" + j).html("<button type='shower' class='btn btn-sm btn-outline-success reserveButton' name='shower" + i + "-" + j + "'>予約する</button>");
               };
            };
         };
         $(".showerDate").html('(' + reserveData["shower"]["date"] + ')');
      };
      if(MemberInfo != ''){
         RenderMemberInfo();
      };
   };
   var UpdateUsersInfo = (UsersInfo) => {
      MemberInfo = UsersInfo;
      var HeaderUserInfo = '' +
         '<div class="btn-group" style="z-index: 10001;">' +
         '<button type="button" class="btn btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
         '<i class="fa fa-user" aria-hidden="true"></i>' + UsersInfo[MyUID]['status'] +
         '</button><div class="dropdown-menu">' +
         '<a class="dropdown-item" href="#"> ' + UsersInfo[MyUID]['name'] + ' さん</a>' +
         '<div class="dropdown-divider"></div>' +
         '<a class="dropdown-item changeStatus" href="#">在寮にする</a>' +
         '<a class="dropdown-item changeStatus" href="#">帰省中にする</a>' +
         '<a class="dropdown-item changeStatus" href="#">外泊中にする</a>' +
         '<a class="dropdown-item app-link" href="/editprofile">プロフィール設定</a>' +
         '<a class="dropdown-item app-link" href="/setnotify">通知の設定</a>' +
         '<div class="dropdown-divider"></div>' +
         '<a class="dropdown-item logout" href="#">ログアウト</a>' +
         '</div></div>';
      RenderMemberInfo();
      var MemberContent = {1: "", 2: "", 3: "", 4: "", 5: "", 6: ""};
      var GradeName = {"1年生": 1, "2年生": 2, "3年生": 3, "4年生": 4, "院生等": 5, "その他": 6};
      var uidlist = Object.keys(UsersInfo);
      var i;
      var statusBadge;
      for(i = 0; i < uidlist.length; i++){
         if(UsersInfo[uidlist[i]]['status'] == '在寮'){
            statusBadge = '<span class="badge badge-success">在寮</span> ';
         }else if(UsersInfo[uidlist[i]]['status'] == '帰省'){
            statusBadge = '<span class="badge badge-warning">帰省</span> ';
         }else if(UsersInfo[uidlist[i]]['status'] == '外泊'){
            statusBadge = '<span class="badge badge-primary">外泊</span> ';
         }else{
            statusBadge = '<span class="badge badge-secondary">その他</span> '
         };
         var vailedNotify = '';
         if(UsersInfo[uidlist[i]]['notify']['line']){
            vailedNotify = vailedNotify + '<i class="fab fa-line" aria-hidden="true"></i>'
         };
         if(UsersInfo[uidlist[i]]['notify']['webpush']){
            vailedNotify = vailedNotify + '<i class="fa fa-chrome" aria-hidden="true"></i>'
         }
         MemberContent[GradeName[UsersInfo[uidlist[i]]['grade']]] = MemberContent[GradeName[UsersInfo[uidlist[i]]['grade']]] +
         '<tr class="MemberTable"><th scope="row">' + statusBadge + UsersInfo[uidlist[i]]['name'] + '</th><td>' + UsersInfo[uidlist[i]]['job'] + '</td><td>' + UsersInfo[uidlist[i]]['linename'] + '</td><td>' + UsersInfo[uidlist[i]]['floor'] + '</td><td>' + vailedNotify + '</td></tr>';
      };
      $('.tbodyGrade1').html(MemberContent[1]);
      $('.tbodyGrade2').html(MemberContent[2]);
      $('.tbodyGrade3').html(MemberContent[3]);
      $('.tbodyGrade4').html(MemberContent[4]);
      $('.tbodyGrade5').html(MemberContent[5]);
      $('.tbodyGrade6').html(MemberContent[6]);
      $('.HeaderUserInfo').html(HeaderUserInfo);
      if(window.location.pathname == '/setnotify'){
         if(messaging){
            messaging.getToken().then((currentToken) => {
               if (currentToken) {
                  if(UsersInfo[MyUID]['notify']['webpush'] == undefined){
                     firebase.database().ref('/usersinfo/' + MyUID + '/notify/webpush').push({webpush: currentToken});
                  }else{
                     var webPushTokenListKey = Object.keys(UsersInfo[MyUID]['notify']['webpush']);
                     var tokenFound = false;
                     for(var i = 0; i < webPushTokenListKey.length; i++){
                        if(currentToken == UsersInfo[MyUID]['notify']['webpush'][webPushTokenListKey[i]]['webpush']){
                           tokenFound = true;
                        }
                     };
                     if(!(tokenFound)){
                        firebase.database().ref('/usersinfo/' + MyUID + '/notify/webpush').push({webpush: currentToken});
                     };
                  };
                  $('.webpushVailed').html('<div class="alert alert-success" role="alert"><i class="fa fa-check" aria-hidden="true"></i>登録済みです。この端末で通知を受け取ることができます。</div>');
               }else {
                  $('.webpushVailed').html('<div class="alert alert-danger" role="alert"><i class="fa fa-times" aria-hidden="true"></i>通知を許可してください。<br>または通知がブロックされているか、対応していない端末です。</div>');
               }
            }).catch((err) => {
               $('.webpushVailed').html('<div class="alert alert-danger" role="alert"><i class="fa fa-times" aria-hidden="true"></i>通知を許可してください。<br>または通知がブロックされているか、対応していない端末です。</div>');
            });
         }
      };
      if(UsersInfo[MyUID]['notify']['line']){
         $('.lineVailed').html('<div class="alert alert-success" role="alert"><i class="fa fa-check" aria-hidden="true"></i>登録済みです。東京寮公式LINEから通知を送ります。</div>');
      }else{
         $('.lineVailed').html('<div class="alert alert-warning" role="alert"><i class="fa fa-times" aria-hidden="true"></i>LINE通知は登録されていません。友だち登録後、フルネームをメッセージしてください。</div>');
      };
      $('#name').val(UsersInfo[MyUID]['name']);
      $('#grade').val(UsersInfo[MyUID]['grade']);
      $('#job').val(UsersInfo[MyUID]['job']);
      $('#floor').val(UsersInfo[MyUID]['floor']);
      $('#linename').val(UsersInfo[MyUID]['linename']);
      $('.LoadingBar').addClass('UsersInfo');
   };
   var UpdateCOVIDIndex = (COVIDIndex) => {
      var SafetyLevelBadge = {'0': 'success', '1': 'primary', '2': 'warning', '3': 'danger', '4': 'secondary'};
      var SafetyLevelDrop = '' +
      '<div class="btn-group">' +
      '<button class="showIndex btn btn-sm btn-' + SafetyLevelBadge[COVIDIndex.safetylebel] + '">' +
      'レベル' + COVIDIndex.safetylebel +
      '</button>' +
      '<button type="button" class="btn btn-sm btn-' + SafetyLevelBadge[COVIDIndex.safetylebel] + ' dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="sr-only">Toggle Dropdown</span>' +
      '</button>' +
      '<div class="dropdown-menu dropdown-menu-right">' +
      '<a class="dropdown-item app-link" href="/index"><i class="fa fa-chart-bar" aria-hidden="true"></i>本寮の安全レベルと指標</a>' +
      '<div class="dropdown-divider"></div>' +
      '<a class="dropdown-item" href="https://stopcovid19.metro.tokyo.lg.jp/" target="_blank"><i class="fa fa-external-link-alt" aria-hidden="true"></i>東京都 新型コロナ対策サイト</a>' +
      '<a class="dropdown-item" href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000164708_00001.html" target="_blank"><i class="fa fa-external-link-alt" aria-hidden="true"></i>厚労省 新型コロナについて</a>' +
      '<a class="dropdown-item" href="https://corona.go.jp/" target="_blank"><i class="fa fa-external-link-alt" aria-hidden="true"></i>内閣官房 新型コロナ対策</a>' +
      '<a class="dropdown-item" href="https://stopcovid19.metro.tokyo.lg.jp/flow" target="_blank"><i class="fa fa-external-link-alt" aria-hidden="true"></i>新型コロナが心配なときに</a>' +
      '</div>' +
      '</div>';
      $('.HeaderSafetyLevel').html(SafetyLevelDrop);
      IndexDetails = {
         '0': '<p>引き続き個人での感染対策を十分に行いましょう。</p><hr><p>レベル0での寮の規定については「新しい生活様式」に従います。</p>',
         '1': '<p>マニュアルに従い、感染拡大防止に注意しながら生活しましょう。</p><hr><p>寮生総会、寮生委員会はオンラインで実施します。</p><p>食堂と浴場の利用には予約が必要です。</p><p>利用可能な空き部屋がある限り、2人部屋の寮生は空き部屋を利用できます。</p>',
         '2': '<p>新型コロナウイルス感染疑いの寮生が出ました。</p><hr><p>寮長からの連絡を注視してこれにしたがってください。</p>',
         '3': '<p>新型コロナウイルス感染の寮生が出ました。</p><hr><p>寮長からの連絡を注視してこれにしたがってください。</p>',
         '4': '<p>緊急事態です。</p><hr><p>寮長からの連絡を注視してこれにしたがってください。</p>'
      };
      var IndexDate = Object.keys(COVIDIndex.positive.data);
      var IndexNumber = [COVIDIndex.positive.data[IndexDate[0]], COVIDIndex.positive.data[IndexDate[1]],COVIDIndex.positive.data[IndexDate[2]],COVIDIndex.positive.data[IndexDate[3]],COVIDIndex.positive.data[IndexDate[4]],COVIDIndex.positive.data[IndexDate[5]],COVIDIndex.positive.data[IndexDate[6]]];
      var positiveSum = Number(IndexNumber[0]) + Number(IndexNumber[1]) + Number(IndexNumber[2]) + Number(IndexNumber[3]) + Number(IndexNumber[4]) + Number(IndexNumber[5]) + Number(IndexNumber[6]);
      COVIDIndexContent = '' + 
         '<div class="alert alert-' + SafetyLevelBadge[COVIDIndex.safetylebel] + ' ContentBoxNoBackGround" role="alert">' +
         '<h4 class="alert-heading">現在、安全レベル' + COVIDIndex.safetylebel + 'です。</h4>' +
         IndexDetails[COVIDIndex.safetylebel] +
         '</div><div class="ContentBox">' +
         '東京都 新規患者に関する報告件数<br>' + IndexDate[6].replace(/-/g, '/') + 'までの最近7日間の合計' +
         '<h2>' + positiveSum + ' 人</h2>' +
         '<span class="badge badge-success">ライブ 10分おきに更新</span><br>' + COVIDIndex.positive.update + ' 時点' +
         '</div><div class="ContentBox" style="height: 50vh;"><canvas id="stage"></canvas></div>' +
         '<div class="ContentBox"><h4>データの出典</h4>「東京都 新型コロナウイルス陽性患者発表詳細」<br>東京都福祉保健局<br><a href="https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068" target="_blank">リソースを開く<i class="fa fa-external-link-alt" aria-hidden="true"></a></div>';
      $('.COVIDIndexContent').html(COVIDIndexContent);
      var positivedata = {
         labels: IndexDate,
         datasets: [
         {
            label: '報告件数',
            hoverBackgroundColor: "rgba(0, 45, 87, 0.9)",
            backgroundColor: "rgba(0, 45, 87, 0.5)",
            data: IndexNumber,
         }
         ]
      };
      var options = {
         responsive: true,
         maintainAspectRatio: false,
         title: {    
            display: true,
            text: '東京都 新規患者に関する報告件数の推移'
         },
         scales: {
            yAxes: [{
               ticks: {
                  beginAtZero: true
               }
            }]
         }
      };
      var canvas = document.getElementById('stage');
      var chart = new Chart(canvas, {
         type: 'bar',
         data: positivedata,
         options: options
      });
      $('.LoadingBar').addClass('COVIDIndex');
   };
   var UpdatePosts = (Posts) => {
      PostsData = Posts;
      var PostKeys = Object.keys(Posts);
      var i;
      var PostsList = '<div class="list-group">';
      $('.AppAsideNav.post').removeClass('unread');
      for(i = PostKeys.length - 1; i >= 0; i--){
         var unread = '';
         if(Posts[PostKeys[i]].uidlist != undefined){
            if(Posts[PostKeys[i]].uidlist[MyUID] != undefined){
               if(Posts[PostKeys[i]].uidlist[MyUID] == 'unread'){
                  unread = ' unread';
                  $('.AppAsideNav.post').addClass('unread');
               };
            };
         };
         var replyNumber = '';
         if(Posts[PostKeys[i]].reply){
            replyNumber = '【<i class="fa fa-reply" aria-hidden="true"></i>' + Object.keys(Posts[PostKeys[i]].reply).length + '件】'
         }
         PostsList = PostsList + '<a href="/post/' + PostKeys[i] + '" class="app-link"><span class="ListLayerListIndex postlink ' + PostKeys[i] + unread + '">' + Posts[PostKeys[i]].title + replyNumber + '</span></a>';
      };
      $('.ListLayerList.post').html(PostsList);
      if(window.location.pathname.substring(0,6) == '/post/'){
         RenderPage();
      };
      $('.LoadingBar').addClass('Posts');
   };
   var RenderPost = (postid) => {
      if(PostsData[postid] == undefined){
         RenderError();
         return(false);
      };
      $('.post.Hide').removeClass('Hide');
      $('.ListLayerList.post').addClass('Hide');
      $('.ListLayerPush.post').addClass('Hide');
      $('title').html(PostsData[postid].title + ' | 東京寮WebApp');
      $('.postlink.show').removeClass('show');
      $('.postlink.' + postid).addClass('show');
      var posteddate = postid.substring(0,4) + '年' + postid.substring(4,6) + '月' + postid.substring(6,8) + '日 ' + postid.substring(8,10) + ':' + postid.substring(10,12);
      var readbudge = '';
      var ReadButton = '';
      var ReadTable = 'この掲示は通知と確認を使用していません';
      if(PostsData[postid].uidlist != undefined){
         if(PostsData[postid].uidlist[MyUID] != undefined){
            if(PostsData[postid].uidlist[MyUID] == 'unread'){
               readbudge = '  <span class="badge badge-pill badge-danger">未確認</span>';
               ReadButton = '<hr><div class="ReadButtonDiv"><button type="button" class="btn btn-primary ReadButton" name="' + postid + '"><i class="fa fa-check" aria-hidden="true"></i>確認しました</button></div>';
            }else if(PostsData[postid].uidlist[MyUID] == 'read'){
               readbudge = '  <span class="badge badge-pill badge-success">確認済み</span>';
            };
         };
         var ReadUID = Object.keys(PostsData[postid].uidlist);
         var i;
         var ReadUsers = '';
         var UnreadUsers = '';
         for(i = 0; i < ReadUID.length; i++){
            if(PostsData[postid].uidlist[ReadUID[i]] == "unread"){
               UnreadUsers = UnreadUsers + '<span class="inline-block uidTonameMatch Grade ' + ReadUID[i] + '"></span>';
            }else if(PostsData[postid].uidlist[ReadUID[i]] == "read"){
               ReadUsers = ReadUsers + '<span class="inline-block uidTonameMatch Grade ' + ReadUID[i] + '"></span>';
            };
         };
         ReadTable = '<table class="table"><thead><th scope="col">学年</th><th scope="col">確認済み</th><th scope="col">未確認</th></thead><tbody>' +
         '<tr><th scope="row">1年生</th><td>' + ReadUsers.replace(/Grade/g, 'Grade1') + '</td><td>' + UnreadUsers.replace(/Grade/g, 'Grade1') + '</td></tr>' +
         '<tr><th scope="row">2年生</th><td>' + ReadUsers.replace(/Grade/g, 'Grade2') + '</td><td>' + UnreadUsers.replace(/Grade/g, 'Grade2') + '</td></tr>' +
         '<tr><th scope="row">3年生</th><td>' + ReadUsers.replace(/Grade/g, 'Grade3') + '</td><td>' + UnreadUsers.replace(/Grade/g, 'Grade3') + '</td></tr>' +
         '<tr><th scope="row">4年生</th><td>' + ReadUsers.replace(/Grade/g, 'Grade4') + '</td><td>' + UnreadUsers.replace(/Grade/g, 'Grade4') + '</td></tr>' +
         '<tr><th scope="row">院生等</th><td>' + ReadUsers.replace(/Grade/g, 'Grade5') + '</td><td>' + UnreadUsers.replace(/Grade/g, 'Grade5') + '</td></tr>' +
         '</tbody></table>';
      };
      var ReplyContent = '';
      var ReplyBadge = '';
      if(PostsData[postid].reply != undefined){
         var i;
         var reply = Object.keys(PostsData[postid].reply);
         for(i = 0; i < reply.length; i++){
            ReplyContent = ReplyContent + '<div class="ContentBox"><h5><span class="uidToname ' + PostsData[postid].reply[reply[i]].postedBy + '"></span> <i class="fa fa-reply" aria-hidden="true"></i></h5>' + PostsData[postid].reply[reply[i]].content + '</div>';
         };
         ReplyContent = ReplyContent.replace(/\n/g, '<br>');
         ReplyBadge = '<br><br><button type="button" class="btn btn-primary"><i class="fa fa-reply" aria-hidden="true"></i>返信あり <span class="badge badge-light">' + reply.length + '件</span></button>'
      };
      var postedByYou = '';
      var DeleteButton = '';
      if(PostsData[postid].postedBy == MyUID){
         postedByYou = '  <span class="badge badge-pill badge-primary">あなたが投稿</span>'
         DeleteButton = '<hr><div class="ReadButtonDiv"><button type="button" class="btn btn-dark DeletePostButton" name="' + postid + '"><i class="fa fa-trash" aria-hidden="true"></i>この掲示を削除する</button></div>';
      };
      var postContent = '' +
      '<div class="ContentBox">' +
      '<h2>' + PostsData[postid].title + '</h2>' +
      '<h4><span class="uidToname ' + PostsData[postid].postedBy + '"></span> が投稿</h4>' + posteddate + readbudge + postedByYou + ReplyBadge +
      '<hr>' +
      PostsData[postid].content +
      ReadButton + DeleteButton +
      '</div>' +
      ReplyContent +
      '<div class="ContentBox"><h5>返信</h5>追記やアンケートの回答はここからできます。' +
      '<input type="hidden" class="replyPostId" name="postid" value="' + postid + '">' +
      '<div class="input-group">' +
      '<textarea class="form-control replyContent" aria-label="With textarea"></textarea>' +
      '<div class="input-group-prepend">' +
      '<button type="button" class="postReply input-group-text primary">送信</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="ContentBox"><h5>確認/未確認</h5>' +
      ReadTable +
      '</div>';
      $('.ListLayerContent.post').html(postContent);
      if(MemberInfo != ''){
         RenderMemberInfo();
      };
   };
   var UpdateTopic = (Topic) => {
      TopicData = Topic;
      if(window.location.pathname.substring(0,6) == '/edit/'){
         if(TopicData[window.location.pathname.substring(12)]['editing']){
            if(TopicData[window.location.pathname.substring(12)]['editing'][Object.keys(TopicData[window.location.pathname.substring(12)]['editing'])[0]] != MyUID){
               window.location.href = window.location.pathname.substring(5);
            };
         };
      };
      var TopicKeys = Object.keys(Topic);
      var i;
      var TopicList = '<div class="list-group">';
      for(i = TopicKeys.length - 1; i >= 0; i--){
         TopicList = TopicList + '<a href="/topic/' + TopicKeys[i] + '" class="app-link"><span class="ListLayerListIndex topiclink ' + TopicKeys[i] + '">' + Topic[TopicKeys[i]].title + '</span></a>';
      };
      $('.ListLayerList.topic').html(TopicList);
      if(window.location.pathname.substring(0,7) == '/topic/'){
         RenderPage();
      };
      if(window.location.pathname.substring(0,6) == '/edit/'){
         var Files = '';
         if(TopicData[window.location.pathname.substring(12)].files != undefined){
            var FileKeys = Object.keys(TopicData[window.location.pathname.substring(12)].files);
            var i;
            Files = '<div class="ContentBox"><h5>ファイル</h5>';
            for(i = 0; i < FileKeys.length; i++){
               Files = Files + '<button type="button" class="topicFile btn btn-outline-primary" name="' + window.location.pathname.substring(12) + '-' + FileKeys[i] + '">' + TopicData[window.location.pathname.substring(12)].files[FileKeys[i]].filename + '</button> ';
            };
            Files = Files + '</div>';
         };
         $('.editTopicFileList').html(Files);
      }
      $('.LoadingBar').addClass('Topic');
   };
   var RenderTopic = (topicid) => {
      if(TopicData[topicid] == undefined){
         RenderError();
         return(false);
      };
      $('.topic.Hide').removeClass('Hide');
      $('.ListLayerList.topic').addClass('Hide');
      $('.ListLayerPush.topic').addClass('Hide');
      $('title').html(TopicData[topicid].title + ' | 東京寮WebApp');
      $('.topiclink.show').removeClass('show');
      $('.topiclink.' + topicid).addClass('show');
      var Files = '';
      if(TopicData[topicid].files != undefined){
         var FileKeys = Object.keys(TopicData[topicid].files);
         var i;
         Files = '<div class="ContentBox"><h5>ファイル</h5>';
         for(i = 0; i < FileKeys.length; i++){
            Files = Files + '<button type="button" class="topicFile btn btn-outline-primary" name="' + topicid + '-' + FileKeys[i] + '">' + TopicData[topicid].files[FileKeys[i]].filename + '</button> ';
         };
         Files = Files + '</div>';
      };
      if(TopicData[topicid].editing){
         var editTopic = '<div class="ContentBox"><h5>編集</h5>現在、<span class="uidToname ' + TopicData[topicid].editing[Object.keys(TopicData[topicid].editing)[0]] + '"></span> が編集中です。<br>編集を中止させて強制的に編集権限を奪う場合には下のボタンをクリックしてください。<br><button type="button" class="editTopicButton btn btn-outline-danger" name="' + topicid + '">強制的に編集する</button></div>';
      }else{
         var editTopic = '<div class="ContentBox"><h5>編集</h5><button type="button" class="editTopicButton btn btn-primary" name="' + topicid + '">このトピックを編集する</button></div>';
      }
      var topicContent = '' +
      '<div class="ContentBox">' +
      '<h1>' + TopicData[topicid].title + '</h1>' +
      '<h3><span class="uidToname ' + TopicData[topicid].lastupdate + '"></span> が最終更新</h3>' +
      '<hr>' +
      TopicData[topicid].content +
      '</div>' + Files + editTopic;
      $('.ListLayerContent.topic').html(topicContent);
      $('.editTopicFileList').html(Files);
      if(MemberInfo != ''){
         RenderMemberInfo();
      };
   };
   var OpenEditTopic = (topicid) => {
      window.history.pushState('', '', '/edit/topic/' + topicid)
      $('#topicFileUpload').attr('name', topicid);
      $('#topicTitle').attr('name', topicid);
      $('#topicTitle').val(TopicData[topicid].title)
      lmnEditor.open('editTopic', TopicData[topicid].content);
      lmnEditor.onChange['editTopic'] = (content) => {
         clearTimeout(window.SaveTopicTimer);
         window.SaveTopicTimer = setTimeout(saveTopic, 500, content, topicid);
         
      }
   };
   var saveTopic = (content, topicid) => {
      firebase.database().ref('/topic/' + topicid).update({content: content, lastupdate: MyUID});
   }
   var RenderMemberInfo = () => {
      var i;
      for(i = 0; i < $('.uidToname').length; i++){
         $('.uidToname').eq(i).html(MemberInfo[$('.uidToname').eq(i).attr('class').substring(10)].name);
      };
      $('.uidToname').removeClass('uidToname');
      var GradeList = {Grade1: '1年生', Grade2: '2年生', Grade3: '3年生', Grade4: '4年生', Grade5: '院生等'};
      for(i = 0; i < $('.uidTonameMatch').length; i++){
         if(GradeList[$('.uidTonameMatch').eq(i).attr('class').substring(28, 34)] == MemberInfo[$('.uidTonameMatch').eq(i).attr('class').substring(35)].grade){
            $('.uidTonameMatch').eq(i).html(MemberInfo[$('.uidTonameMatch').eq(i).attr('class').substring(35)].name);
         }else{
            $('.uidTonameMatch').eq(i).removeClass('inline-block');
         };
      };
      $('.uidTonameMatch').removeClass('uidTonameMatch');
   };
   var RenderError = () => {
      $('.AppMain').addClass('Hide');
      $('.Error').removeClass('Hide');
      $('title').html('エラー | 東京寮WebApp');
      var ErrorContent = '' +
         '<div class="alert alert-danger" role="alert">' +
         '<h4 class="alert-heading">エラー Unknown Page Render Request</h4>' +
         '<p>存在しないリクエストを受け取りました。URLが誤っているか、すでに削除されたコンテンツにアクセスしようとしている可能性があります。</p>' +
         '<p>リクエスト： ' + window.location.pathname + '</p>' +
         '<hr>' +
         '<p class="mb-0">存在するはずのページであるのにこのエラーが表示される場合は、<a href="https://github.com/TokyoRyo/webapp/issues" target="_blank">東京寮ウェブアプリのGithubリポジトリのIssues</a>か<a href="https://docs.google.com/forms/d/e/1FAIpQLSfK8Hv9x7CzTJndZg5PzhjH4wME5kHLKV6HIh-SxND5nvUQPw/viewform" target="_blank">バグ報告・フィードバックフォーム</a>で報告してください。</p>' +
         '</div>';
      $('.Error').html(ErrorContent);
   };
   var MyUID = '';
   var COVIDIndexContent = '';
   var PostsData = '';
   var TopicData = '';
   var MemberInfo = '';
   var messaging;
   var personalNotifyUidList = [];
   var closeTopicEditor;
   ResisterEvents();
   Initialization();
   Authentication();
   RenderPage();
});