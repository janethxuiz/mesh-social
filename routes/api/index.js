const router = require("express").Router();
const userRoutes = require("./userRoutes");
const thoughRoutes = require("./thoughRoutes");

router.use("/users", userRoutes);
router.use ("/thoughts", thoughRoutes);

module.exports = router;