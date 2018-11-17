document.addEventListener('DOMContentLoaded', () => {

  console.log($('.strength_meter'));

  if($('#myPassword').val() === '') {
    $('.strength_meter div').hide();
  } 

  $('#myPassword').strength({
    strengthClass: 'strength',
    strengthMeterClass: 'strength_meter',
    strengthButtonClass: 'button_strength',
    strengthButtonText: 'Show Password',
    strengthButtonTextToggle: 'Hide Password'
});  

}, false);
