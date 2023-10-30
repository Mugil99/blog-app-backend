const { ERR, TRUE } = require("../constants");
const User = require("../models/User");

const findUsersWithEmailOrUsername = async (email, username) => {
    let userData = {
      data: null,
      err: null,
    };
    try {
      // DB call to find if any records exists with the email and username given
      userData.data = await User.find({ $or: [{ email }, { username }] });
  
      return userData;
    } catch (err) {
      userData.err = err;
      return userData;
    }
  };

  const addUserToDB = async (userObj) => {
    try {
      await userObj.save();
  
      return TRUE;
    } catch (err) {
      return ERR;
    }
  };

  const getUserDataFromUsername = async (username) => {
    const userData = {
      data: null,
      err: null,
    };
    
    try {
      userData.data = await User.findOne({ username });
  
      return userData;
    } catch (err) {
      userData.err = err;
      return userData;
    }
  };

  const getUserDataFromId = async (userId) => {
    const userData = {
      data: null,
      err: null,
    };
  
    try {
      userData.data = await User.findById(userId);
  
      return userData;
    } catch (err) {
      userData.err = err;
      return userData;
    }
  };

  const getUserDataFromEmail = async (email) => {
    const userData = {
      data: null,
      err: null,
    };
  
    try {
      userData.data = await User.findOne({ email });
      console.log(userData.data);
  
      return userData;
    } catch (err) {
      userData.err = err;
      return userData;
    }
  };

  const getAllUsersFromDB = async (userId) => {
    const allUserData = {
      data: null,
      err: null,
    };
  
    try {
      allUserData.data = await User.find({ _id: { $ne: userId } });
  
      return allUserData;
    } catch (err) {
      allUserData.err = err;
      return allUserData;
    }
  };
  module.exports = {
    findUsersWithEmailOrUsername,
    addUserToDB,
    getUserDataFromUsername,
    getUserDataFromEmail,
    getUserDataFromId,
    getAllUsersFromDB,
  };