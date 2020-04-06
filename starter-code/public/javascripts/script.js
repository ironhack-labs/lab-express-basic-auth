// document.addEventListener('DOMContentLoaded', () => {

//   console.log('IronGenerator JS imported successfully!');

//   $('#myPassword').strength({
//     strengthClass: 'strength',
//     strengthMeterClass: 'strength_meter',
//     strengthButtonClass: 'button_strength',
//     strengthButtonText: 'Show Password',
//     strengthButtonTextToggle: 'Hide Password'
// });


// }, false);


$(document).ready(function($) {
  console.log('leu o script')
    
  $('#myPassword').strength();
    // {
    //           strengthClass: 'strength',
    //           strengthMeterClass: 'strength_meter',
    //           strengthButtonClass: 'button_strength',
    //           strengthButtonText: 'Show Password',
    //           strengthButtonTextToggle: 'Hide Password'
    //       }
          // );
  
  });