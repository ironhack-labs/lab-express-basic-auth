document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

const strength = {
  0: "Worst ☹",
  1: "Bad ☹",
  2: "Weak ☹",
  3: "Good ☺",
  4: "Strong ☻"
};

const password = document.getElementById("password");
const meter = document.getElementById("password-strength-meter");
const text = document.getElementById("password-strength-text");

password.addEventListener("input", function() {
  const val = password.value;
  const result = zxcvbn(val);

  // Update the password strength meter
  meter.value = result.score;

  // Update the text indicator
  if (val !== "") {
    text.innerHTML =
      "Strength: " +
      "<strong>" +
      strength[result.score] +
      "</strong>" +
      "<span class='feedback'>" +
      result.feedback.warning +
      " " +
      result.feedback.suggestions +
      "</span";
  } else {
    text.innerHTML = "";
  }
});
