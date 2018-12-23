const { Router } = require("../../../src/index");
const router = new Router({ baseUrl: "/" });

const isAdmin = require("../middleware/is-admin");

router.get("", [isAdmin], (req, res) => {
  return res.send({
    message: "Base Page"
  });
});

module.exports = router;
