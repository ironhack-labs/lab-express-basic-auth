function $(id) {
  return document.getElementById(id);
}

class Input{
    constructor(inpElement, label, placeholder) {
        this.inpElement = inpElement;
        this.label = label;
        this.placeholder = placeholder;
        this.empty = false;
    }

    clickInputCheck() {
        if(this.empty) {
            return;
        }

        this.label.style.visibility = "visible";
        this.inpElement.removeAttribute("placeholder");
        this.inpElement.setAttribute("class", "fillingOut");
        this.label.style.color = "rgb(21, 168, 161)";
    }

    filloutCheck(e) {
        if (e.keyCode === 8 && this.inpElement.value === "") {
            this.inpElement.removeAttribute("class", "fillingOut");
            this.inpElement.setAttribute("class", "emptyField");
            this.label.style.color = "red";
            signupBtn.disabled = true;
            this.empty = true;
        } else {
            this.inpElement.removeAttribute("class", "emptyField");
            this.inpElement.setAttribute("class", "fillingOut");
            this.inpElement.style.borderColor = "rgb(33, 155, 135)";
            this.label.style.color = "rgb(33, 155, 135)";
            this.empty = false;
        }
    }

    containerClick(e) {
        if(this.empty) {
            return;
        }

        if (e.target !== this.inpElement) {
            if (this.inpElement.value === "") {
            this.inpElement.setAttribute("placeholder", this.placeholder);
            this.inpElement.removeAttribute("class", "fillingOut");
            this.label.style.visibility = "hidden";
            } else {
            this.label.style.color = "rgb(126, 126, 126)";
            }
        }
    }
}

// function clickInputCheck(input, label) {
//   if (isEmpty) {
//     return;
//   }
//   label.style.visibility = "visible";
//   input.removeAttribute("placeholder");
//   input.setAttribute("class", "fillingOut");
//   label.style.color = "rgb(21, 168, 161)";
// }

// function filloutCheck(input, label, e) {
//   if (e.keyCode === 8 && input.value === "") {
//     input.removeAttribute("class", "fillingOut");
//     input.setAttribute("class", "emptyField");
//     // input.style.borderColor = "red";
//     label.style.color = "red";
//     signupBtn.disabled = true;
//   } else {
//     input.removeAttribute("class", "emptyField");
//     input.setAttribute("class", "fillingOut");
//     input.style.borderColor = "rgb(33, 155, 135)";
//     label.style.color = "rgb(33, 155, 135)";
//   }
// }

// function containerClick(input, label, e, ph) {
//   if (isEmpty) {
//     return;
//   }
//   if (e.target !== input) {
//     if (input.value === "") {
//       input.setAttribute("placeholder", ph);
//       input.removeAttribute("class", "fillingOut");
//       label.style.visibility = "hidden";
//     } else {
//       label.style.color = "rgb(126, 126, 126)";
//     }
//   }
// }