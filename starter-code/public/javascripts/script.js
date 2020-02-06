/* document.addEventListener(
    "DOMContentLoaded",
    () => {
      console.log("IronGenerator JS imported successfully!");
    },
    false
  );

  $(document).ready
  $("#password").strength({
    strengthClass: "strength",
    strengthMeterClass: "strength_meter",
    strengthButtonClass: "button_strength",
    strengthButtonText: "",
    strengthButtonTextToggle: ""
  });

  console.log("script.JS terminado"); */

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      console.log("IronGenerator JS imported successfully!");
    },
    false
  );
  $(document).ready(function($) {
    $("#myPassword").strength();
  });