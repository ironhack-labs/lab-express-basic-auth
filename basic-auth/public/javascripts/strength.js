$(document).ready(function($) {
  $("#myPassword").strength({
    strengthClass: "strength",
    strengthMeterClass: "strength_meter",
    strengthButtonClass: "button_strength",
    strengthButtonText: "Show password",
    strengthButtonTextToggle: "Hide Password"
  });

  console.log("SCRIPT");
});
