document.addEventListener('DOMContentLoaded', () => {

  //console.log('IronGenerator JS imported successfully!');

}, false);

$(document).ready(($) => {

  $('#securePassword').strength({
    strengthClass: 'strength',
    strengthMeterClass: 'strength_meter',
    strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show password',
    strengthButtonTextToggle: 'Hide Password'
  });

});
