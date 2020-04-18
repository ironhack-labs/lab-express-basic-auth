document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

$(document).ready(function ($) {

  $('#myPasswordSignUp').strength({
    strengthClass: 'strength',
    strengthMeterClass: 'strength_meter',
    strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show password',
    strengthButtonTextToggle: 'Hide Password'
  });

  $('#myPasswordLoggin').strength({
    // strengthClass: 'strength',
    // strengthMeterClass: 'strength_meter',
    // strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show password',
    strengthButtonTextToggle: 'Hide Password'
    });   

}); 