const { ERR, TRUE, FALSE } = require("../constants");
const { getFollowData } = require("../repository/follow.repository");

const checkIfUserFollows = async (followingUserId, followerUserId) => {
    const followData = await getFollowData(followingUserId, followerUserId);
  
    // Different states of response
    if (followData.err) {
      return ERR;
    } else if (followData.data !== null) {
      return TRUE;
    } else {
      return FALSE;
    }
  };
  
  module.exports = { checkIfUserFollows };