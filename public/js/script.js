const checker = [false, false];

document.querySelector('#username').addEventListener('keyup', e => {
  if (e.target.value.length > 0) {
    document.querySelector('.namecheck').style.visibility = 'hidden'
    checker[0] = true;
  } else {
    document.querySelector('.namecheck').style.visibility = 'visible'
    checker[0] = false;
  }
  if ( checker[0] === true && checker[1] === true) {
    document.querySelector('button').removeAttribute('disabled')
  } else {
    document.querySelector('button').setAttribute('disabled', true)
  }
})

document.querySelector('#password').addEventListener('keyup', e => {
  if (e.target.value.length > 3) {
    document.querySelector('span').style.visibility = 'visible';
    checker[1] = true;
  } else if (e.target.value.length > 0) {
    document.querySelector('.passwordcheck').style.visibility = 'hidden'
  } else {
    document.querySelector('.passwordcheck').style.visibility = 'visible'
    document.querySelector('span').style.visibility = 'hidden';
    document.querySelector('button').setAttribute('disabled', true)
  }
  if ( checker[0] === true && checker[1] === true) {
    document.querySelector('button').removeAttribute('disabled')
  } else {
    document.querySelector('button').setAttribute('disabled', true)
  }
})

