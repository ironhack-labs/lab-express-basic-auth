document.addEventListener(
  "DOMContentLoaded",
  () => {
    setCurrentPg();
  },
  false
);

function setCurrentPg(){
  let ele = 'nav-home'; //placeholder
  const onPage = window.location.pathname;

  if(onPage.includes('login'))
    ele = 'nav-login';
  else if(onPage.includes('signup'))
    ele = 'nav-signup'
  else if(onPage.includes('profile'))
    ele = 'nav-profile'    
  // else 
  //   ele = 'nav-home'

  document.getElementById(ele).classList.toggle('active');
  return true;
  }