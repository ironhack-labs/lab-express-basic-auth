function $(id) {
  return document.getElementById(id);
}

class Input {
  constructor(inpElement, label, placeholder) {
    this.inpElement = inpElement;
    this.label = label;
    this.placeholder = placeholder;
  }

  // Sets focus style if field is clicked
  clickInputCheck() {
    //   Doesn't set focus style unless field gets an input
    if (this.label.style.color === "red") {
      return;
    }

    this.label.style.visibility = "visible";
    this.inpElement.removeAttribute("placeholder");
    this.inpElement.setAttribute("class", "fillingOut");
  }

  // Sets the alert style if field is empty
  filloutCheck(e) {
    // keycode 8 = delete key ; keycode 88 = x
    // After pressed if the field is empty it becomes true
    if (
      (e.keyCode === 8 && this.inpElement.value === "") ||
      (e.keyCode === 88 && this.inpElement.value === "") ||
      (e.keyCode === 91 && this.inpElement.value === "")

    ) {
        this.inpElement.removeAttribute("class", "fillingOut");
        this.inpElement.setAttribute("class", "emptyField");
        this.label.style.color = "red";
    } else {
        this.inpElement.removeAttribute("class", "emptyField");
        this.inpElement.setAttribute("class", "fillingOut");
        this.label.style.color = "rgb(33, 155, 135)";
    }
  }

  // Sets the not-empty style
  containerClick(e) {
    //   Doesn't set Not-focused & not-empty style style unless field gets an input
    if(this.label.style.color === "red") {
        return;
    }

    // Sets up style when clicking the input
    if (e.target === this.inpElement) {
        this.label.style.color = "rgb(33, 155, 135)";
        this.clickInputCheck();
        this.inpElement.addEventListener("keyup", (e) => {
            this.filloutCheck(e);
        });
    } else {
        this.label.style.color = "rgb(126, 126, 126)";

        if (this.inpElement.value === "") {
          this.inpElement.setAttribute("placeholder", this.placeholder);
          this.inpElement.removeAttribute("class", "fillingOut");
          this.label.style.visibility = "hidden";
        }
    }
  };

  completeStatus() {
      if(this.inpElement.value === "") {
          return false;
      } else {
          return true;
      }
  };
}