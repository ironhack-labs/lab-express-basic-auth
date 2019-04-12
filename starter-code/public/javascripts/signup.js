(function(){
  const showPassword = document.querySelector('#show-password');
  const hidePassword = document.querySelector('#hide-password');
  const password = document.querySelector('#password');
  
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

  showPassword.onclick = togglePassword;
  hidePassword.onclick = togglePassword;
})();