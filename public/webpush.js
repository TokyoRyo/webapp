$(function(){
   const messaging = firebase.messaging();
   messaging.usePublicVapidKey("BCUxgO1Xi_Li3_CuoZ0rlQtAYFar1GhriUo5gQ3PMgwfHC_W18jTa1bSaOJo0Nd0RNAKKlMW1FFAeP8j5qk8xLk");
   messaging.requestPermission()
   .then(function() {
      console.log('Notification permission granted.');
      messaging.getToken()
         .then(function(currentToken) {
            if (currentToken) {
               console.log('Registration token. ', currentToken);

               // ...
            } else {
               console.log('No Instance ID token available. Request permission to generate one.');

               // ...
            }
         })
         .catch(function(err) {
            console.log('An error occurred while retrieving token. ', err);

         // ...
         });
   })
   .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
   });
   messaging.onMessage(function(payload) {
      console.log('Message received. ', payload);
      const title = 'this is title';
      const options = {
      body: 'this is message body',
      icon: 'logo.png'
      };
      const notification = new Notification(title, options);
   });
});