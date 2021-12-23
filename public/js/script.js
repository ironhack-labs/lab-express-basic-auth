document.addEventListener(
  "DOMContentLoaded",
  () => {
    const container = document.getElementsByClassName("container")[0];

    const signupTitle = $("signupTitle");
    const signupBtn = $("signupBtn");
    const signupBtnCreate = $("signupCreate");
    const singupInputName = $("inputName");
    const signupInputEmail = $("inputEmail");
    const signupInputPass = $("inputPassword");

    const nameInputSingup = $("inputName");
    const emailInputSingup = $("inputEmail");
    const emailInputSignupLabel = $("emailSignupInput");
    const nameInputSignupLabel = $("nameSignupInput");

    const nameInput = new Input(nameInputSingup, nameInputSignupLabel, "Name");
    const emailInput = new Input(emailInputSingup, emailInputSignupLabel, "Email");

    singupInputName
      .addEventListener("input", () => {
        nextButtonFunction();
      });

    signupInputEmail
      .addEventListener("input", () => {
      nextButtonFunction();
    });

    signupInputPass
      .addEventListener('input', () => {
        passwordButtonFunction();
      });

    const nextButtonFunction = () => {
      if (singupInputName.value !== "" && signupInputEmail.value !== "") {
        signupBtn.disabled = false;

        signupBtn.addEventListener("click", () => {
          signupTitle.textContent = 'Setup a password'
          signupInputPass.style.display = "inline";
          singupInputName.style.visibility = "hidden";
          singupInputName.style.position = 'absolute'
          signupInputEmail.style.visibility = "hidden";
          signupInputEmail.style.position = "absolute";

          signupBtn.disabled = true;
          return;
        });
      }
    };

    const passwordButtonFunction = () => {
      if(signupInputPass !== '') {
        signupBtn.disabled = false;

        signupBtn.addEventListener("click", () => {
          signupBtn.disabled = false;
          emailInputSignupLabel.style.display = "none";
          nameInputSignupLabel.style.display = "none";
          signupTitle.textContent = "Create your account";
          signupInputPass.style.display = "inline";
          singupInputName.style.visibility = "visible";
          singupInputName.style.position = "relative";
          signupInputEmail.style.visibility = "visible";
          signupInputEmail.style.position = "relative";
          signupBtn.style.display = 'none';
          signupBtnCreate.style.display = 'inline';
          return;
        });
      }
    }

    // ---------------------------------

    container.addEventListener('click', (e) => {
      nameInput.containerClick(e);
      emailInput.containerClick(e);
      // containerClick(nameInputSingup, nameInputSignupLabel, e, "Name");
      // containerClick(emailInputSingup, emailInputSignupLabel, e, "Email");
    });

    nameInputSingup.addEventListener('click', () => {
      nameInput.clickInputCheck();
      // clickInputCheck(nameInputSingup, nameInputSignupLabel);
    });
    
    emailInputSingup.addEventListener("click", () => {
      emailInput.clickInputCheck();
      // clickInputCheck(emailInputSingup, emailInputSignupLabel);
    });

    nameInputSingup.addEventListener('keyup', (e) => {
      nameInput.filloutCheck(e);
      // filloutCheck(nameInputSingup, nameInputSignupLabel, e);
    })

    emailInputSingup.addEventListener('keyup', (e) => {
      emailInput.filloutCheck(e);
      // filloutCheck(emailInputSingup, emailInputSignupLabel, e);
    })

  },
  false
);
