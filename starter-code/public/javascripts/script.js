document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

window.onload = function() {
  let submit = document.querySelector("form button");
  submit.addEventListener("click", () => {
    let inputs = document.querySelectorAll("form input:invalid");
    if (inputs.length > 0) $(".auth-form").effect("shake");
  });
};

$("#password").strength({
  strengthClass: "strength",
  strengthMeterClass: "strength_meter",
  strengthButtonClass: "button_strength",
  strengthButtonText: "",
  strengthButtonTextToggle: ""
});
