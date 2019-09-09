window.onload = () => {
  document.querySelector('#song').play()
  setTimeout(() => {
    document.querySelector('.img-fluid').classList.add('forever-gray')
  }, 3800)
}
