const app   = require("./app");
const chalk = require('chalk')
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(chalk.bgGreen(`Server listening on port http://localhost:${PORT}`));
});
