$(function(){
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
         window.location.href = "./"
      } else {
         //
      }
   });
   $('.lemono-auth-signin').submit(function(){
      var email = $('.lemono-auth-signin [name=email]').val();
      var password = $('.lemono-auth-signin [name=password]').val();
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(){
         window.location.href = "./"
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
   $('.lemono-auth-signout').click(function(){
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
})