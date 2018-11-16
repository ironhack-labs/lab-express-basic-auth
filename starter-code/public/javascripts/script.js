document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');


  document.querySelector('form').onsubmit = function(e) {
    let user = document.querySelector('input[name="user"]').value;
    let pass = document.querySelector('input[name="password"]').value;

    if (user === "" || pass === "") {
      document.querySelector('div').innerHTML = "Indicate a username and a password to sign up";
      e.preventDefault();
    }

    e.preventDefault();
  }

}, false);
