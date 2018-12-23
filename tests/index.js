const { Pezzo, Router } = require("../src/index");
const app = new Pezzo({ port: 8081 });

app.addRouter(
  new Router({ baseUrl: "/users" })
    .get("", (req, res) => {
      return res.send({
        message: "Home"
      });
    })
    .get("/:id", (req, res) => {
      return res.send({
        message: "ID"
      });
    })
    .post("/test", (req, res) => {
      return res.send(req.body);
    })
    .get("/:id/movies/:movieId", (req, res) => {
      return res.send(req.params);
    })
);
app.addRouter(
  new Router({ baseUrl: "/" }).get("", (req, res) => {
    return res.status(403).send({
      message: "Base Page"
    });
  })
);
