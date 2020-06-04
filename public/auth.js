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
                     else lemonoStyle.loaded()
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
         
         
      } else {
         window.location.href = "./login"
      }
   });
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
      return false;
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
               code3 = `${code1}<tr><td>${userslist[uidlist[i]]['name']}</td><td>${userslist[uidlist[i]]['grade']}</td><td>${userslist[uidlist[i]]['job']}</td><td>${userslist[uidlist[i]]['floor']}</td><td>${userslist[uidlist[i]]['linename']}</td><td>${thisStatus}</td></tr>`
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
   //$('.post').submit(function(){
      $('.notsubmit').click(function(){
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
            senduidlist.splice(senduidlist.indexOf(uid) >= 0, 1)
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
            content : $('.post [name=content]').val()
         }
         if(Object.keys(q).length > 0){
            postContent['q'] = q;
         }
         if(Object.keys(senduiddict).length > 0){
            postContent['uidlist'] = senduiddict;
         }
         firebase.database().ref('post/' + postDate).set(postContent);
         return false;
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
      return false;
   })
})