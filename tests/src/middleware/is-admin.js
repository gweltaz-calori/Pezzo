module.exports = function isAdmin(req, res, next) {
  const isAdmin = false;

  if (isAdmin) {
    return next();
  }

  return res.status(401).send("Unauthorized");
};
