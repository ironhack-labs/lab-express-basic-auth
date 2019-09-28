window.onload = function () {

  const form = document.getElementById("photo-submit");
  let formData
  form.onsubmit = function (e) {
    e.preventDefault()
    formData = new FormData();
    formData.append("avatar", form.avatar.files[0]);
    axios.post('profileImg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      // add photo of linus to dom
      const row = document.getElementById("img-row")
      const reader = new FileReader()
      const img = document.createElement("img")
      debugger
      reader.onload = function (e) {
        debugger
        img.src = e.target.result


      }
      row.appendChild(img)

      reader.readAsDataURL(form.avatar.files[0]);
      debugger

      debugger
    }).catch(err => {
      debugger
    })
  }

}