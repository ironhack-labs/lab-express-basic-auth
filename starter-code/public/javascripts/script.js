document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);



$(document).ready(function($) {
    
  const password = $('#myPassword')
  console.log(password)
  password.strength({
    strengthClass: 'input is-primary is-large strength',
    strengthMeterClass: 'strength_meter',
    strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show password',
    strengthButtonTextToggle: 'Hide Password'
  });	
  
  });