const path = require("path");
const { Pezzo } = require("../src/index");
const app = new Pezzo();

app.initialize(path.resolve(__dirname, "./"));
app.listen(process.env.APP_PORT);
