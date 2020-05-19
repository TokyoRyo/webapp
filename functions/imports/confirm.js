exports.confirm = function(password){
   var confirmpassword = require('../confirmpassword.json');
   if(confirmpassword.confirmpassword === password){
      return(true)
   }
   else{
      return(false)
   }
}