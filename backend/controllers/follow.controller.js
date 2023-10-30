const Joi = require("joi");
const { ERR, FALSE, TRUE } = require("../constants");
const { verifyUserId } = require("../utils/verifyUserId");
const { checkIfUserFollows } = require("../utils/checkIfUserFollows");
const { addFollowToDB, deleteFollowFromDB, getFollowingListFromDB, getFollowingDetailsFromDB, getFollowerListFromDB, getFollowerDetailsFromDB } = require("../repository/follow.repository");
const Follow = require("../models/Follow");

const followUser = async (req, res) => {
    const followerUserId = req.locals.userId;
    const { followingUserId } = req.body;
  
    // validate the body
    const isValid = Joi.object({
      followingUserId: Joi.string().required(),
    }).validate(req.body);
  
    if (isValid.error) {
      return res.status(400).send({
        status: 400,
        message: "Invalid User Id",
        data: isValid.error,
      });
    }
  
    // validate followingUserId
    const isUser = await verifyUserId(followingUserId);
    if (isUser === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Following User dosen't exist",
      });
    }
  
    // validate followerUserId
    const isUser1 = await verifyUserId(followerUserId);
    if (isUser1 === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser1 === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Follower User dosen't exist",
      });
    }
  
    // Check if the followerUserId already follows the followingUserId
    const alreadyFollows = await checkIfUserFollows(
      followingUserId,
      followerUserId
    );
  
    if (alreadyFollows === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowData failed",
      });
    } else if (alreadyFollows === TRUE) {
      return res.status(400).send({
        status: 400,
        message: "You already follow this user",
      });
    }
  
    const followObj = new Follow({
      followingUserId,
      followerUserId,
      creationDateTime: Date.now(),
    });
  
    const response = await addFollowToDB(followObj);
  
    if (response === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: addFollowToDB failed",
      });
    }
  
    res.status(201).send({
      status: 201,
      message: "Followed successfully",
    });
  };
  
  const unfollowUser = async (req, res) => {
    const followerUserId = req.locals.userId;
    const { followingUserId } = req.body;
  
    // validate the body
    const isValid = Joi.object({
      followingUserId: Joi.string().required(),
    }).validate(req.body);
  
    if (isValid.error) {
      return res.status(400).send({
        status: 400,
        message: "Invalid User Id",
        data: isValid.error,
      });
    }
  
    // validate followingUserId
    const isUser = await verifyUserId(followingUserId);
    if (isUser === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Following User dosen't exist",
      });
    }
  
    // validate followerUserId
    const isUser1 = await verifyUserId(followerUserId);
    if (isUser1 === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser1 === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Follower User dosen't exist",
      });
    }
  
    // Check if the followerUserId already follows the followingUserId
    const alreadyFollows = await checkIfUserFollows(
      followingUserId,
      followerUserId
    );
  
    if (alreadyFollows === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowData failed",
      });
    } else if (alreadyFollows === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "You don't follow this user",
      });
    }
  
    const response = await deleteFollowFromDB(followerUserId, followingUserId);
  
    if (response === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: deleteFollowFromDB failed",
      });
    }
  
    res.status(201).send({
      status: 201,
      message: "Unfollowed successfully",
    });
  };

  const getFollowingList = async (req, res) => {
    const userId = req.locals.userId;
  
    // validate followingUserId
    const isUser = await verifyUserId(userId);
    if (isUser === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Following User dosen't exist",
      });
    }
  
    const followingList = await getFollowingListFromDB(userId);
  
    if (followingList.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowingListFromDB failed",
      });
    }
  
    let followingUserId = [];
    followingList.data.forEach((followObj) => {
      followingUserId.push(followObj.followingUserId);
    });
  
    const followingDetails = await getFollowingDetailsFromDB(followingUserId);
  
    if (followingDetails.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowingDetailsFromDB failed",
      });
    }
  
    let usersData = [];
    followingDetails.data.map((user) => {
      let userData = {
        name: user.name,
        username: user.username,
        email: user.email,
        _id: user._id,
      };
  
      usersData.push(userData);
    });
  
    return res.status(200).send({
      status: 200,
      message: "Fetched following List",
      data: usersData,
    });
  };

  const getFollowerList = async (req, res) => {
    const userId = req.locals.userId;
  
    // validate followerUserId
    const isUser = await verifyUserId(userId);
    if (isUser === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromId failed",
      });
    } else if (isUser === FALSE) {
      return res.status(400).send({
        status: 400,
        message: "Follower User dosen't exist",
      });
    }
  
    const followerList = await getFollowerListFromDB(userId);
  
    if (followerList.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowerListFromDB failed",
      });
    }
  
    let followerUserId = [];
    followerList.data.forEach((followObj) => {
      followerUserId.push(followObj.followerUserId);
    });
  
    const followerDetails = await getFollowerDetailsFromDB(followerUserId);
    if (followerDetails.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowerDetailsFromDB failed",
      });
    }
  
    let usersData = [];
    followerDetails.data.map((user) => {
      let userData = {
        name: user.name,
        username: user.username,
        email: user.email,
        _id: user._id,
      };
  
      usersData.push(userData);
    });
  
    return res.status(200).send({
      status: 200,
      message: "Fetched follower List",
      data: usersData,
    });
  };

  module.exports = {
    followUser,
    unfollowUser,
    getFollowingList,
    getFollowerList
}