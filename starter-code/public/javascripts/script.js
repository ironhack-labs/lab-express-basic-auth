document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");

    var password = document.getElementById("myPassword");

    password.addEventListener("input", function(event) {
      if (password.validity.typeMismatch) {
        password.setCustomValidity("Your password needs a minimun length of 6 characters!");
      } else {
        password.setCustomValidity("");
      }
    });

    var username = document.getElementById("username");

    username.addEventListener("input", function(event) {
      if (username.validity.typeMismatch) {
        username.setCustomValidity("Only lower case letters, please!");
      } else {
        username.setCustomValidity("");
      }
    });

    $(document).ready(function($) {
      $("#myPassword").strength({
        strengthClass: "strength",
        strengthMeterClass: "strength_meter",
        strengthButtonClass: "button_strength",
        strengthButtonText: "Show password",
        strengthButtonTextToggle: "Hide Password"
      });
    });
  },
  false
);
