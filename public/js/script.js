document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("lab-express-basic-auth JS imported successfully!");
  },
  false
);

//Selecionar los elementos del icono(ojos)
const mostrar = document.getElementById("mostrar");
const ocultar = document.getElementById("ocultar");
const inputPassword = document.getElementById("inputPassword")

console.log(mostrar, ocultar);

//addEventListener
mostrar.addEventListener("click",()=>{
  console.log("MOstrar contraseña");
  inputPassword.type= "text";
  ocultar.classList.remove("noShow")
  mostrar.classList.add("noShow")
});

ocultar.addEventListener("click",()=>{
  console.log("Ocultar contraseña");
  inputPassword.type = "password";
  ocultar.classList.add("noShow")
  mostrar.classList.remove("noShow")
});
