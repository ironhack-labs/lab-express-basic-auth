document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

// function popup(){
//   const target = document.getElementById("error")
//   return target ? setTimeout(target => target.textContent = "",5000) : ""
// }

// popup()

const userInput = document.querySelector('.username')
const userPassword = document.querySelector('password')

userInput.oninput = emptyChecker
userPassword.oninput = emptyChecker

function emptyChecker() {
  userInput === "" || userPassword === "" ? document.getElementById("error").textContent = "Please complete fields" : document.getElementById("error").textContent
}