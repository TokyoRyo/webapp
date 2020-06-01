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
         var thisUrl = location.href;
         if(thisUrl.slice(-11) != 'editprofile'){
            myInfo.on('value', function(snapshot){
               var datalist = snapshot.val();
               if(datalist[uid] == null){
                  window.location.href = "./editprofile"
               }
               else lemonoStyle.loaded()
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
   var loaded = function(){
      loading.pause();
      $('.loading').addClass('hide');
      $('.loaded').removeClass('hide');
   }
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
   console.log('uid' + uid)
   var members = firebase.database().ref('usersinfo');
   members.on('value', function(snapshot){
      var userslist = snapshot.val();
      var uidlidt = Object.keys(snapshot.val())
      var i = 0;
      var code = ''
      for(i = 0; i < uidlidt.length; i++){
         code = `${code}<div class="card mdl-cell mdl-cell--4-col"><div class="card__title">${userslist[uidlidt[i]]['name']}</div><div class="card__content">${userslist[uidlidt[i]]['grade']}<br>${userslist[uidlidt[i]]['job']}<br>${userslist[uidlidt[i]]['floor']}<br>LINEのプロフィール名：${userslist[uidlidt[i]]['linename']}</div></div>`
      }
      console.log(uidlidt)
      $('.memberslist').html(code)
   })
})