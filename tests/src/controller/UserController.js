const { Router } = require("../../../src/index");

const router = new Router({ baseUrl: "/users" });

router.get("", (req, res) => {
  return res.send([
    {
      name: "bob"
    },
    {
      name: "tom"
    }
  ]);
});

module.exports = router;
