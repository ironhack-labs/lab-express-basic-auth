window.onload = function () {

  const form = document.getElementById("photo-submit");
  let formData
  form.onsubmit = async function (e) {
    e.preventDefault()

    formData = new FormData();
    const file = form.avatar.files[0];
    formData.append("avatar", file);
    // console.log(file, typeof file);
    // const fileJson = JSON.stringify(file)

    try {
      const uploadConfig = await axios.get("/upload");
      await axios.put(uploadConfig.data.url, file, {
        headers: {
          "Content-Type": file.type
        }
      });


    } catch (err) {

      console.error(err); // 30
    }




    // axios.post('profileImg', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }).then(response => {
    //   // add photo of linus to dom
    //   const row = document.getElementById("img-row")
    //   const reader = new FileReader()
    //   const img = document.createElement("img")
    //   debugger
    //   reader.onload = function (e) {
    //     debugger
    //     img.src = e.target.result


    //   }
    //   row.appendChild(img)

    //   reader.readAsDataURL(form.avatar.files[0]);
    //   debugger

    //   debugger
    // }).catch(err => {
    //   debugger
    // })
  }

}