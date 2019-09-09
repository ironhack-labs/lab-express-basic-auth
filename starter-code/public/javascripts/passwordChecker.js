const password = document.querySelector('#password')
const passwordScale = document.querySelector('#password-scale')

const checkPassword = () => {
  if (password.value.length >= 1 && password.value.length < 8) {
    passwordScale.classList.remove('d-none')
    passwordScale.classList.add('bg-warning')
    passwordScale.classList.remove('text-white')
    passwordScale.innerText = 'weak 👀'
  } else if (password.value.length >= 8) {
    passwordScale.classList.remove('bg-warning')
    passwordScale.classList.add('bg-info')
    passwordScale.classList.add('text-white')
    passwordScale.innerText = 'good 👌'
  } else {
    passwordScale.classList.add('d-none')
  }
}

password.addEventListener('input', () => {
  checkPassword()
})
