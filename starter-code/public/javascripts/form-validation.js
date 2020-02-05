const signupForm = document.getElementById("signup-form");
const inputPassword = document.getElementById("password");
const inputPasswordError = document.getElementById("password-error");

if (signupForm) {
  inputPassword.oninput = checkPasswordInput;
  signupForm.onsubmit = checkFormSubmission;
}

function checkPasswordInput(e) {
  if (!inputPassword.validity.valid) {
    showInputError(inputPassword, inputPasswordError);
  } else {
    inputPasswordError.textContent = "";
  }
}

function checkFormSubmission(e) {
  if (!inputPassword.validity.valid) {
    showInputError(inputPassword, inputPasswordError);
    e.preventDefault();
  }
}

function showInputError(inputElement, messageTarget) {
  if (inputElement.validity.valueMissing) {
    messageTarget.innerHTML = "A value is required";
  } else if (inputElement.validity.patternMismatch) {
    messageTarget.innerHTML = "Value should be from 6 to 10 characters, <br>lower or upper case or number";
  } else {
    messageTarget.innerHTML = "Something is wrong";
  }
}
