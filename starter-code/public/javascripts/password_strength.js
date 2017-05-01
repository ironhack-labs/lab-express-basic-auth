$(document).ready(()=>{
 $("#password").keyup((e)=>{

   var pwd = zxcvbn($("#password").val());

   var message="";

   switch (pwd.score) {
     case 0:
     message = "very poor";

       break;
    case 1:
    message = "almost poor";
    break;
    case 2:

    message = "MAN";

    break;
    case 3:

    message = "very MAN";
    break;
    case 4:
    message = "Asturian guy";

    break;


   }
   $("#password_strength").html(message);
 })
})
