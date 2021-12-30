document.addEventListener(
  "DOMContentLoaded",
  () => {
    // ----- SIGNUP 
    // ----- DOM variable setup
    const container = document.getElementsByClassName("container")[0];

    const signupTitle = $("signupTitle");
    const signupBtnCreate = $("signupCreate");

    const nameInputSingup = $("inputName");
    const emailInputSingup = $("inputEmail");
    const passInputSignup = $("inputPassword");

    const nameInputSignupLabel = $("nameSignupInput");
    const emailInputSignupLabel = $("emailSignupInput");
    const passInputSignupLabel = $("passSignupInput");

    const nameInput = new Input(nameInputSingup, nameInputSignupLabel, "Name");
    const emailInput = new Input(emailInputSingup, emailInputSignupLabel, "Email");
    const passInput = new Input(passInputSignup, passInputSignupLabel, "Password");

    // ----- Name & Email fields

    container.addEventListener("click", (e) => {
      nameInput.containerClick(e);
      emailInput.containerClick(e);
      passInput.containerClick(e);
    });

    container.addEventListener("input", () => {
      if(
        nameInput.completeStatus() &&
        emailInput.completeStatus() &&
        passInput.completeStatus()
      ) {
        signupBtnCreate.disabled = false;
      } else {
        signupBtnCreate.disabled = true;
      }
    })

    // ----- 

    const closeIcon = $("closeIcon");
    const errMessage = $("signupErrMess");
    const exclamationMark = $("exclamationMark");

    closeIcon.addEventListener('click', () => {
      errMessage.style.display = "none";
      closeIcon.style.display = "none";
      exclamationMark.style.display = "none";
    })

    // const errorMessageCont = [...document.getElementsByClassName("errorMessageCont")];
    
    // errorMessageCont.forEach((each) => {
    //   each.addEventListener("click", (e) => {
    //     e.target.parentNode.style.display = "none";
    //   })
    // })
  },
  false
);
