(function(){
  const showPassword = document.querySelector('#show-password');
  const hidePassword = document.querySelector('#hide-password');
  const password = document.querySelector('#password');
  const passwordStrength = document.querySelector('#password-strength');
  
  function togglePassword(){
  
    if([...showPassword.classList].includes('hidden')){
      showPassword.className = '';
      hidePassword.className = 'hidden'; 
      password.setAttribute('type', 'password');
    }else{
      showPassword.className = 'hidden';
      hidePassword.className = ''; 
      password.setAttribute('type', 'text');
    }
  }

  function controlStrength(){
    console.log('Changed')
    let rawPassword = password.value;


    let specialChar = /[\$@!%*#?&]+/.test(rawPassword);
    let upperChar = /[A-Z]+/.test(rawPassword);
    let lowerChar = /[a-z]+/.test(rawPassword);
    let digitChar = /[\d]+/.test(rawPassword);

    let count = specialChar + upperChar + lowerChar + digitChar;
    switch(count){
      case 0:
      case 1:
        passwordStrength.innerText = 'weak';
        passwordStrength.style.backgroundColor = 'hsl(0, 50%, 50%)';
        passwordStrength.style.color = 'white';
      break;
      case 2:
      case 3:
        passwordStrength.innerText = 'normal';
        passwordStrength.style.backgroundColor = 'hsl(20, 75%, 50%)';
        passwordStrength.style.color = 'black';
      break;
      case 4:
        passwordStrength.innerText = 'strong';
        passwordStrength.style.backgroundColor = 'hsl(210, 50%, 50%)';
        passwordStrength.style.color = 'white';
      break;
    }
  }

  showPassword.onclick = togglePassword;
  hidePassword.onclick = togglePassword;
  password.onkeyup = controlStrength;
})();