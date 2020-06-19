$(function(){
   lemonoStyle.loading(1)
   var uid = "";
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
   var database = firebase.database();
   firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         uid = firebase.auth().currentUser.uid;
         var myInfo = database.ref('usersinfo/');
         var statuslist = database.ref('status/');
         var notifylist = database.ref('notify/');
         var thisUrl = location.href;
         if(thisUrl.slice(-11) != 'editprofile'){
            myInfo.on('value', function(snapshot){
               var datalist = snapshot.val();
               if(datalist[uid] == null){
                  window.location.href = "./editprofile"
               }
               else if(thisUrl.slice(-6) != 'status'){
                  statuslist.on('value', function(snapshot){
                     var datalist = snapshot.val();
                     if(datalist[uid] == null){
                        window.location.href = "./status"
                     }
                     else if(thisUrl.slice(-7) != 'webpush'){
                        notifylist.on('value', function(snapshot){
                           var datalist = snapshot.val();
                           if(datalist[uid] == null){
                              window.location.href = "./webpush"
                           }
                           else{
                              lemonoStyle.loaded()
                           }
                        });
                     }
                     else{
                        lemonoStyle.loaded();
                     }
                  });
               }
               else{
                  lemonoStyle.loaded();
               }
            })
         }
         else{
            lemonoStyle.loaded()
         }
      }
      else {
         window.location.href = "./login"
      }
   })
   $('.lemono-auth-signin').submit(function(){
      var email = $('.lemono-auth-signin [name=email]').val();
      var password = $('.lemono-auth-signin [name=password]').val();
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(){
         window.location.href = "./mylemono"
      })
      .catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         alert('エラー' + errorMessage)
         // ...
      });
      return false;
   });
   $('.auth-signout').click(function(){
      firebase.auth().signOut()
      .then(function(){
         window.location.href = "/"
      })
   });
   $('.getname').click(function(){
      console.log('run get name')
      console.log(uid)
      var userinfo = firebase.database().ref('usersinfo/' + uid)
      userinfo.once('value').then(function(snapshot) {
         var name = snapshot.val().name;
      });
      
   });
   $('.editprofile').submit(function(){
      var name = $('.editprofile [name=name]').val();
      var grade = $('.editprofile [name=grade]').val();
      var job = $('.editprofile [name=job]').val();
      var floor = $('.editprofile [name=floor]').val();
      var linename = $('.editprofile [name=linename]').val();
      firebase.database().ref('usersinfo/' + uid).set({
         name: name,
         grade: grade,
         job: job,
         floor: floor,
         linename: linename
      });
      window.location.href = "./"
   });
   var members = firebase.database().ref('usersinfo');
   members.on('value', function(snapshot){
      var userslist = snapshot.val();
      var uidlist = Object.keys(snapshot.val())
      var i = 0;
      var code = '<div class="lemono-table"><table><tr><th>名前</th><th>学年</th><th>役職</th><th>階</th><th>LINEプロフィール名</th><th>ステータス</th></tr>'

      code1 = code;
      code2 = code;
      code3 = code;
      code4 = code;
      code5 = code;
      code6 = code;
      var userinfo = firebase.database().ref('status/')
      userinfo.once('value').then(function(snapshot) {
         var statuslist = snapshot.val();
         for(i = 0; i < uidlist.length; i++){
            var thisStatus = '未登録';
            if(statuslist[uidlist[i]] != null){
               thisStatus = statuslist[uidlist[i]]['status']
            }
            if(userslist[uidlist[i]]['grade'] == '1年生'){
               code1 = `${code1}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
            else if(userslist[uidlist[i]]['grade'] == '2年生'){
               code2 = `${code2}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
            else if(userslist[uidlist[i]]['grade'] == '3年生'){
               code3 = `${code3}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
            else if(userslist[uidlist[i]]['grade'] == '4年生'){
               code4 = `${code4}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
            else if(userslist[uidlist[i]]['grade'] == '院生等'){
               code5 = `${code5}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
            else{
               code6 = `${code6}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
            }
         }
         code1 = code1 + '</table></div>';
         code2 = code2 + '</table></div>';
         code3 = code3 + '</table></div>';
         code4 = code4 + '</table></div>';
         code5 = code5 + '</table></div>';
         code6 = code6 + '</table></div>';
         $('.memberstable1').html(code1);
         $('.memberstable2').html(code2);
         $('.memberstable3').html(code3);
         $('.memberstable4').html(code4);
         $('.memberstable5').html(code5);
         $('.memberstable6').html(code6);
      });
   });
   var question = 1;
   $('.addquestion').on('click', function(){
      var code = '<div class="lemono-textbox"><input type="text" name="q' + question + '"><div class="lemono-textbox__title">質問' + question + '</div></div>';
      $('.questions').append(code);
      question++;
   });
   $('.post').submit(function(){
      var senduidlist = [];
      var gradelist = [];
      $('input:checkbox[name="postto"]:checked').each(function() {
			gradelist.push($(this).val());
      });
      console.log(gradelist)
      var indormitory = $('.post [name=indormitory]').val()
      var i = 1;
      var k = 1;
      var q = {};
      while(k < 51){
         if(($('.post [name=q' + k + ']').val() != undefined)&&($('.post [name=q' + k + ']').val() != '')){
            q['q' + i] = $('.post [name=q' + k + ']').val();
            i++;
         }
         k++;
      }
      console.log(q)
      var toList = firebase.database().ref('/')
      toList.once('value').then(function(snapshot) {
         var userinfolist = snapshot.val().usersinfo;
         var statuslist = snapshot.val().status;
         var uidlist = Object.keys(userinfolist)
         var i;
         for(i = 0; i < uidlist.length; i++){
            var thisStatus = '';
            if(statuslist[uidlist[i]] != undefined){
               thisStatus = statuslist[uidlist[i]]['status'];
            }
            if(((indormitory == 'all')&&(thisStatus != ''))||((indormitory == 'dormitory')&&(thisStatus == '在寮'))||((indormitory == 'home')&&(thisStatus != '在寮')&&(thisStatus != ''))){
               if(gradelist.indexOf(userinfolist[uidlist[i]]['grade']) >= 0){
                  senduidlist.push(uidlist[i]);
               }
            }
         }
         if(senduidlist.indexOf(uid) >= 0){
            senduidlist.splice(senduidlist.indexOf(uid), 1)
         }
         var senduiddict = {};
         for(i = 0; i < senduidlist.length; i++){
            senduiddict[senduidlist[i]] = 'unread';
         }
         var date = new Date();
         var yyyy = date.getFullYear();
         var mm = ("0"+(date.getMonth()+1)).slice(-2);
         var dd = ("0"+date.getDate()).slice(-2);
         var hh = ("0"+date.getHours()).slice(-2);
         var mi = ("0"+date.getMinutes()).slice(-2);
         var sc = ("0"+date.getSeconds()).slice(-2);
         var postDate = yyyy + '' + mm + '' + dd + '' + hh + '' + mi + '' + sc;
         var postContent = {
            postedBy : uid,
            title : $('.post [name=title]').val(),
            content : $('.postcontent').html()
         }
         if(Object.keys(q).length > 0){
            postContent['q'] = q;
         }
         if(Object.keys(senduiddict).length > 0){
            postContent['uidlist'] = senduiddict;
         }
         firebase.database().ref('post/' + postDate).set(postContent);
         var senduidpostdata = ''
         for(i = 0; i < senduidlist.length; i++){
            senduidpostdata = senduidpostdata + senduidlist[i] + ',';
         }
         var xhr = new XMLHttpRequest();
         xhr.open('POST', './sendnotify');
         xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
         xhr.send( 'senduidpostdata=' + senduidpostdata + '&title=' + $('.post [name=title]').val());
         window.location.href = "./"
      })
      return false;
   });
   $('.status [name=status]').on('change', function(){
      if(($('.status [name=status]:checked').val() == '帰省中')||($('.status [name=status]:checked').val() == '外泊中')){
         $('.statusinfo').attr('style', 'display:block;');
         $('.status [name=additionalinfo]').prop('required', true)
      }
      else{
         $('.statusinfo').attr('style', 'display:none;');
         $('.status [name=additionalinfo]').val('')
         $('.status [name=additionalinfo]').prop('required', false)
      }
   });
   $('.status').submit(function(){
      if($('.status [name=status]:checked').val() == '在寮'){
         var status = '在寮'
      }
      else{
         var status = $('.status [name=status]:checked').val() + '(' + $('.status [name=additionalinfo]').val() + ')'
      }
      firebase.database().ref('status/' + uid).set({
         status: status
      });
      window.location.href = "./"
      return false;
   })
   var posts = firebase.database().ref('post');
   posts.on('value', function(snapshot){
      var postlist = snapshot.val();
      if(snapshot.val() == null){
         return false;
      }
      var postidlist = Object.keys(snapshot.val()).sort();
      var i;
      var toList = firebase.database().ref('/usersinfo')
      toList.once('value').then(function(snapshot) {
         var userinfolist = snapshot.val();
         var code = '';
         var popup = '';
         for(i = postidlist.length - 1; i >= 0; i--){
            var posteddate = postidlist[i].substring(0,4) + '年' + postidlist[i].substring(4,6) + '月' + postidlist[i].substring(6,8) + '日 ' + postidlist[i].substring(8,10) + ':' + postidlist[i].substring(10,12)
            var readlist = postlist[postidlist[i]]['uidlist'];
            var popupButton = ''
            if(readlist != null){
               var readuidlist = Object.keys(readlist);
               var j;
               var read1 = '1年生：';
               var read2 = '2年生：';
               var read3 = '3年生：';
               var read4 = '4年生：';
               var read5 = '院生等';
               var unread1 = '1年生：';
               var unread2 = '2年生：';
               var unread3 = '3年生：';
               var unread4 = '4年生：';
               var unread5 = '院生等';
               var readn = 0;
               var unreadn = 0
               var popupButton = ''
               for(j = 0; j < readuidlist.length; j++){
                  if(readlist[readuidlist[j]] == 'unread'){
                     unreadn++;
                     if(userinfolist[readuidlist[j]]['grade'] == '1年生'){
                        unread1 = unread1 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '2年生'){
                        unread2 = unread2 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '3年生'){
                        unread3 = unread3 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '4年生'){
                        unread4 = unread4 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '院生等'){
                        unread5 = unread5 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                  }
                  else if(readlist[readuidlist[j]] == 'read'){
                     readn++;
                     if(userinfolist[readuidlist[j]]['grade'] == '1年生'){
                        read1 = read1 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '2年生'){
                        read2 = read2 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '3年生'){
                        read3 = read3 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '4年生'){
                        read4 = read4 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                     else if(userinfolist[readuidlist[j]]['grade'] == '院生等'){
                        read5 = read5 + userinfolist[readuidlist[j]]['name'] + ' '
                     }
                  }
               }
               popupButton = lemonoStyle.createButton('lemono-button__flat lemono-popup__open lemono-popup__name-' + postidlist[i] , '', readn + '/' + Number(readn + unreadn) + 'が確認済み')
               popup = popup + '<div class="lemono-popup__content lemono-popup__name-' + postidlist[i] + '"><h5>確認済み</h5>' + read1 + '<br>' + read2 + '<br>' + read3 + '<br>' + read4 + '<br>' + read5 + '<h5>未確認</h5>' + unread1 + '<br>' + unread2 + '<br>' + unread3 + '<br>' + unread4 + '<br>' + unread5 + '<br>' + lemonoStyle.createButton('lemono-button__accent lemono-popup__close' , '', '閉じる') + '</div>'
               if(postlist[postidlist[i]]['postedBy'] == uid){
                  code = code + lemonoStyle.createCard({
                     index : userinfolist[postlist[postidlist[i]]['postedBy']]['name'] + ' が投稿',
                     rightIndex : 'あなたが投稿',
                     content : posteddate + '<h4>' + postlist[postidlist[i]]['title'] + '</h5>' + postlist[postidlist[i]]['content'].replace(/\n/g, '<br>'),
                     actions : lemonoStyle.createButton('lemono-button__dark delPost postid-' + postidlist[i], '', 'この掲示を削除する') + popupButton,
                     Class : 'green'
                  });
               }
               else if(postlist[postidlist[i]]['uidlist'][uid] == 'unread'){
                  code = code + lemonoStyle.createCard({
                     index : userinfolist[postlist[postidlist[i]]['postedBy']]['name'] + ' が投稿',
                     rightIndex : '要確認',
                     content : posteddate + '<h4>' + postlist[postidlist[i]]['title'] + '</h5>' + postlist[postidlist[i]]['content'].replace(/\n/g, '<br>'),
                     actions : lemonoStyle.createButton('lemono-button__accent read postid-' + postidlist[i], '', '確認しました') + popupButton,
                     Class : 'red'
                  });
               }
               else{
                  code = code + lemonoStyle.createCard({
                     index : userinfolist[postlist[postidlist[i]]['postedBy']]['name'] + ' が投稿',
                     content : posteddate + '<h4>' + postlist[postidlist[i]]['title'] + '</h5>' + postlist[postidlist[i]]['content'].replace(/\n/g, '<br>'),
                     actions : popupButton,
                  });
               }
            }
            else{
               if(postlist[postidlist[i]]['postedBy'] == uid){
                  code = code + lemonoStyle.createCard({
                     index : userinfolist[postlist[postidlist[i]]['postedBy']]['name'] + ' が投稿',
                     rightIndex : 'あなたが投稿',
                     content : posteddate + '<h4>' + postlist[postidlist[i]]['title'] + '</h5>' + postlist[postidlist[i]]['content'].replace(/\n/g, '<br>'),
                     actions : lemonoStyle.createButton('lemono-button__dark delPost postid-' + postidlist[i], '', 'この掲示を削除する'),
                     Class : 'green'
                  });
               }
               else{
                  code = code + lemonoStyle.createCard({
                     index : userinfolist[postlist[postidlist[i]]['postedBy']]['name'] + ' が投稿',
                     content : posteddate + '<h4>' + postlist[postidlist[i]]['title'] + '</h5>' + postlist[postidlist[i]]['content'].replace(/\n/g, '<br>'),
                  });
               }
               
            }
         }
         $('.posts').html(code);
         if($('.lemono-popup__content.active').attr('class') != undefined){
            var thisClasses = $('.lemono-popup__content.active').attr('class').split(' ');
            var i;
            var contentname = '.dummy'
            for(i = 0; i < thisClasses.length; i++){
               console.log(thisClasses[i].substring(0,18))
               if(thisClasses[i].substring(0,18) == 'lemono-popup__name'){
                  contentname = thisClasses[i];
               };
            };
            console.log('.lemono-popup__content.' + contentname)
         }
         
         $('.lemono-popup').html(popup);
         $('.lemono-popup__content.' + contentname).addClass('active')
      });
   });
   $(document).on('click', '.read', function(){
      var thisClasses = $(this).attr('class').split(' ');
      var i;
      for(i = 0; i < thisClasses.length; i++){
         if(thisClasses[i].substring(0,7) == 'postid-'){
            var postId = thisClasses[i].substring(7);
         }
      };
      var readtemp = {};
      readtemp[uid] = 'read'
      firebase.database().ref('post/' + postId + '/uidlist').update(readtemp);
      console.log('uodated')
   });
   $(document).on('click', '.delPost', function(){
      var result = window.confirm('本当に削除しますか？')
      if(result){
         var thisClasses = $(this).attr('class').split(' ');
         var i;
         for(i = 0; i < thisClasses.length; i++){
            if(thisClasses[i].substring(0,7) == 'postid-'){
               var postId = thisClasses[i].substring(7);
            }
         };
         var readtemp = {};
         readtemp[uid] = 'read'
         firebase.database().ref('post/' + postId).remove();
         window.location.href = "./"
      }
   });
   var notify = firebase.database().ref('notify');
   notify.on('value', function(snapshot){
      var notifydata = snapshot.val();
      if(notifydata[uid] != null){
         if(notifydata[uid]['line'] != null){
            $('.line-notify').addClass('green');
         $('.line-notify__index').html('登録済み');
         }
         if(notifydata[uid]['webpush'] != null){
            $('.chrome-notify').addClass('green');
         $('.chrome-notify__index').html('登録済み');
         }
      }
   });
   $('.nonotify').on('click', function(){
      firebase.database().ref('notify/' + uid).push({
         nonotify: 'nonotify'
      });
      window.location.href = "./"
   })
   $(document).on('click', '.newtopic', function(){
      var date = new Date();
         var yyyy = date.getFullYear();
         var mm = ("0"+(date.getMonth()+1)).slice(-2);
         var dd = ("0"+date.getDate()).slice(-2);
         var hh = ("0"+date.getHours()).slice(-2);
         var mi = ("0"+date.getMinutes()).slice(-2);
         var sc = ("0"+date.getSeconds()).slice(-2);
         var postDate = yyyy + '' + mm + '' + dd + '' + hh + '' + mi + '' + sc;
      firebase.database().ref('topic/' + postDate).set({
         title: '新しいトピック',
         content: '',
         lastupdate: uid
      });
      
      window.location.href = "../edit-" + postDate
   })
   if($('.topicid').html() != undefined){
      var topicid = $('.topicid').html()
      var topic = firebase.database().ref('topic/' + topicid)
      topic.once('value').then(function(snapshot) {
         var topicdata = snapshot.val();
         $('.topictitle').val(topicdata['title']);
         $('.topiccontent').html(topicdata['content'])
         fileupdate(topicid)
      })
   }
   if($('.showtopic').html() != undefined){
      var topicid = $('.showtopic').html()
      var topic = firebase.database().ref('topic/' + topicid)
      topic.once('value').then(function(snapshot) {
         var topicdata = snapshot.val();
         $('.topictitle').html(topicdata['title']);
         $('.insertthistopic').html(topicdata['content'])
         fileupdate(topicid)
      })
   }
   $('.posttopic').submit(function(){
      var topicid = $('.topicid').html()
      firebase.database().ref('topic/' + topicid).update({
         title: $('.topictitle').val(),
         content: $('.topiccontent').html(),
         lastupdate: uid
      });
      window.location.href = './topic'
      return false;
   })
   var topiclist = firebase.database().ref('topic');
   topiclist.on('value', function(snapshot){
      var topiclistdata = snapshot.val();
      var toList = firebase.database().ref('/usersinfo')
      toList.once('value').then(function(snapshot) {
         var userinfolist = snapshot.val();
         if(topiclistdata != null){
            code = ''
            topickeys = Object.keys(topiclistdata)
            var i;
            for (i = 0; i < topickeys.length; i++){
               code = code + lemonoStyle.createCard({
                  index : userinfolist[topiclistdata[topickeys[i]]['lastupdate']]['name'] + ' が最終更新',
                  content : '<h4>' + topiclistdata[topickeys[i]]['title'] + '</h5>',
                  actions : '<a href="./show-' + topickeys[i] + '">' + lemonoStyle.createButton('lemono-button__accent', '', 'このトピックを見る') + '</a><a href="./edit-' + topickeys[i] + '">' + lemonoStyle.createButton('lemono-button__flat', '', 'このトピックを編集する') + '</a>',
                  Class: 'lemono-grid__span4'
               });
            }
            $('.inserttopic').html(code)
         }
      })
   })
   $(document).on('click', '.upload', function(){
      var files = document.getElementById('file').files;
      var file = files[0]
      var i;
      var ref = firebase.storage().ref($('.topicid').html()).child(file.name);
      ref.put(file).then(function(snapshot) {
         firebase.database().ref('topic/' + topicid + '/files').push({
            filename: file.name
         });
         fileupdate($('.topicid').html());
         alert('アップロードしました');
      });
   })
   var fileupdate = function(topicid){
      $('.filelist').html('')
      var topicdata = firebase.database().ref('topic/' + topicid + '/files')
      topicdata.once('value').then(function(snapshot) {
         var filelist = snapshot.val();
         if(filelist != null){
            var filekeys = Object.keys(filelist)
            var i;
            for(i = 0; i < filekeys.length; i++){
               var filename = filelist[filekeys[i]]['filename'];
               $('.filelist').append('<button class="lemono-button__border getdownloadlink" type="button" name="' + filename + '">' + filename + '</button>')
            }
            
         }
         
      });
   }
   $(document).on('click', '.getdownloadlink', function(){
      var filename = $(this).attr('name')
      if($('.topicid').html() != undefined){
         var topicid = $('.topicid').html()
      }
      if($('.showtopic').html() != undefined){
         var topicid = $('.showtopic').html()
      }
      firebase.storage().ref(topicid).child(filename).getDownloadURL().then(function(url){
         window.open(url)
      })
   })
   var positivedata = firebase.database().ref('index');
   positivedata.on('value', function(snapshot){
      var data = snapshot.val();
      var positivelist = Object.keys(data['positive']['data']);
      var i;
      var sevenDaysPositive = 0;
      var th = ''
      var td = ''
      for(i = 0; i < positivelist.length; i++){
         sevenDaysPositive = sevenDaysPositive + Number(data['positive']['data'][positivelist[i]])
         th = '<th>' + positivelist[i] + '</th>' + th
         td = '<td>陽性報告数：' + data['positive']['data'][positivelist[i]] + '人</td>' + td
      }
      if(sevenDaysPositive > 140){
         var positive = '<span class="lemono-marking__red">安全レベル1基準</span>'
      }
      else if(sevenDaysPositive > 105){
         var positive = '<span class="lemono-marking__yellow">安全レベル0/1継続基準</span>'
      }
      else{
         var positive = '<span class="lemono-marking__green">安全レベル0基準</span>'
      }
      if(data['tokyoalert'] == 'yes'){
         var tokyoalert = '<span class="lemono-marking__red">東京アラート発令中(安全レベル1基準)</span>'
      }
      else{
         var tokyoalert = '<span class="lemono-marking__green">東京アラート発令なし(安全レベル0基準)</span>'
      }
      if(data['EmergencyDeclaration'] == 'yes'){
         var EmergencyDeclaration = '<span class="lemono-marking__red">東京都に緊急事態宣言発令中(安全レベル1基準)</span>'
      }
      else{
         var EmergencyDeclaration = '<span class="lemono-marking__green">東京都に緊急事態宣言発令なし(安全レベル0基準)</span>'
      }
      if((sevenDaysPositive > 140)||(data['tokyoalert'] == 'yes')||(data['EmergencyDeclaration'] == 'yes')){
         var positiveClass = 'red'
      }
      else if(sevenDaysPositive > 105){
         var positiveClass = 'yellow'
      }
      else{
         var positiveClass = 'green'
      }
      var dayname = positivelist[positivelist.length - 1].replace(/-/g, '/');
      var thisDay = new Date()
      if((thisDay.getFullYear() + '/' + ('00' + (thisDay.getMonth() + 1)).slice(-2) + '/' + ('00' + (thisDay.getDate())).slice(-2)) == dayname){
         dayname = '今日' + dayname;
      }
      thisDay.setDate(thisDay.getDate() - 1)
      if((thisDay.getFullYear() + '/' + ('00' + (thisDay.getMonth() + 1)).slice(-2) + '/' + ('00' + (thisDay.getDate())).slice(-2)) == dayname){
         dayname = 'きのう' + dayname;
      }
      thisDay.setDate(thisDay.getDate() - 1)
      if((thisDay.getFullYear() + '/' + ('00' + (thisDay.getMonth() + 1)).slice(-2) + '/' + ('00' + (thisDay.getDate())).slice(-2)) == dayname){
         dayname = 'おととい' + dayname;
         thisDay.setDate(thisDay.getDate() - 1)
      }
      var code = '<h4>' + sevenDaysPositive + '人</h4>最近7日間の新規陽性報告数合計<br>' + positive + '<div class="lemono-table"><table><tbody><tr>' + th + '</tr><tr>' + td + '</tr></tbody></table></div>' + '<br>' + tokyoalert + '<br>' + EmergencyDeclaration + '<br><br>陽性患者数は' + data['positive']['update'] +'時点のデータで10分ごとに自動更新。東京アラートと緊急事態宣言は手動入力。<a href="https://catalog.data.metro.tokyo.lg.jp/dataset/t000010d0000000068" target="blank">データの出典</a>'
      $('.positivedata').html(lemonoStyle.createCard({
         index: dayname + 'のデータ',
         rightIndex: 'ライブ',
         content: code,
         Class: positiveClass
      }))
   })
   const messaging = firebase.messaging();
   messaging.usePublicVapidKey("BCUxgO1Xi_Li3_CuoZ0rlQtAYFar1GhriUo5gQ3PMgwfHC_W18jTa1bSaOJo0Nd0RNAKKlMW1FFAeP8j5qk8xLk");
   messaging.onMessage(function(payload) {
      console.log('Message received. ', payload);
      const title = '東京寮WEBアプリ';
      const options = {
      body: payload.data.content,
      };
      const notification = new Notification(title, options);
   });
   $(document).on('click', '.requestPermission', function(){
      messaging.requestPermission()
      .then(function() {
         console.log('Notification permission granted.');
         messaging.getToken()
            .then(function(currentToken) {
               if (currentToken) {
                  var registeredToken = firebase.database().ref('notify/' + uid + '/webpush')
                  registeredToken.once('value').then(function(snapshot) {
                        var registeredTokenList = snapshot.val();
                        if(registeredTokenList != null){
                           var registeredTokenIndex = Object.keys(registeredTokenList);
                           var i;
                           var neworold = ''
                           for(i = 0; i < registeredTokenIndex.length; i++){
                              if(registeredTokenList[registeredTokenIndex[i]]['webpush'] === currentToken){
                                 neworold = 'old';
                              }
                           }
                           if(neworold == ''){
                              firebase.database().ref('notify/' + uid + '/webpush').push({
                                 webpush: currentToken
                              });
                           }
                        }
                        else{
                           firebase.database().ref('notify/' + uid + '/webpush').push({
                              webpush: currentToken
                           });
                        }
                     });
                  var xhr = new XMLHttpRequest();
                  xhr.open('POST', './sendwebpush');
                  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                  xhr.send( 'token=' + currentToken + '' );
                  // ...
               } else {
                  console.log('No Instance ID token available. Request permission to generate one.');
                  // ...
               }
            })
            .catch(function(err) {
               alert('エラーが発生しました。再読み込みしてもう一度やってください。うまくいかなければLINEで通知を受け取ってください。')

            // ...
            });
      })
      .catch(function(err) {
         alert('通知の許可が得られませんでした。ダメそうならLINEで通知を受け取ってください。')
      });
   })
})