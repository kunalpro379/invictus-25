const express = require("express");
const router = express.Router();
const userRouter = require("./user");

router.use("/users", userRouter);
router.get("/", (req, res) => {
  res.send("Working!");
});

module.exports = router;
