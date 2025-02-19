const hbs = require("hbs");

hbs.registerPartials(__dirname + "/../views/partials");

hbs.registerHelper("isSelected", function (id, cast, options) {
  // Verifica si el id está en el array cast
  if (cast.includes(id)) {
    return "selected";
  }

  return "";
});