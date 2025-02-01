const express = require("express");
const {
  createCommunity,
  getCommunities,
  getCommunityDetails,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  getAdminCommunityById,
  updateAdminCommunity,
  deleteAdminCommunity,
} = require("../controllers/communityController");
 
const router = express.Router();

router.post("/", createCommunity);
router.get("/", getCommunities);
router.get("/:communityName", getCommunityDetails);
router.get("/id/:communityId", getCommunityById);
router.put("/id/:communityId", updateCommunity);
router.delete("/id/:communityId", deleteCommunity);





module.exports = router;
 