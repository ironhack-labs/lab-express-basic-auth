$(document).ready(function($) {
    
  $('#passwordID').strength({
              strengthClass: 'my-5 strength',
              strengthMeterClass: 'strength_meter',
              strengthButtonClass: 'button_strength',
              strengthButtonText: 'Show Password',
              strengthButtonTextToggle: 'Hide Password'
          });
  });