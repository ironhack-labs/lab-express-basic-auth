document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

$(document).ready(function ($) {

});

$('#password').keyup(function(s) {
  console.log($("#password").val())
  if ($("#password").val().length > 5) {
    $("#password").strength();
  }
})
