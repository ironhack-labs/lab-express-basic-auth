$(document).ready(function ($) {

    $("#myPassword").strength();
  console.log($("#myPassword").strength());
  });
  
  $('#myPassword').strength({
    strengthClass: 'strength',
    strengthMeterClass: 'strength_meter',
    strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show password',
    strengthButtonTextToggle: 'Hide Password'
  });   