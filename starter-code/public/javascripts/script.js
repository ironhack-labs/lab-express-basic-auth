document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

$(document).ready(function($) {
  $("#passwordLog").strength();
});
