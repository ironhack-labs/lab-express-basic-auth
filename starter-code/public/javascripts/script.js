document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


// document.onload = function() {
//   document.getElementById('myPassword').strength({
//               strengthClass: 'strength',
//               strengthMeterClass: 'strength_meter',
//               strengthButtonClass: 'button_strength',
//               strengthButtonText: 'Show Password',
//               strengthButtonTextToggle: 'Hide Password'
//           });
//   };

$(document).ready(function ($) {

  $("#myPassword").strength();

});

$('#myPassword').strength({
  strengthClass: 'strength',
  strengthMeterClass: 'strength_meter',
  strengthButtonClass: 'button_strength',
  strengthButtonText: 'Show password',
  strengthButtonTextToggle: 'Hide Password'
});   