const express = require("express");
const {
  createCommunity,
  getCommunities,
  getCommunityDetails,
} = require("../controllers/communityController");
const router = express.Router();

router.post("/", createCommunity);
router.get("/", getCommunities);
router.get("/:communityName", getCommunityDetails);

module.exports = router;
