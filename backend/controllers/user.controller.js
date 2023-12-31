const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);
const {
    verifyUsernameAndEmailExisits,
  } = require("../utils/verifyEmailUsername");
const { addUserToDB, getUserDataFromUsername, getUserDataFromEmail, getAllUsersFromDB } = require("../repository/user.repository");
const { TRUE, ERR } = require("../constants");
const User = require("../models/User");

//POST-Register User
const registerUser = async (req, res) => {
 // Data validation
 const isValid = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }

  // Checking whether we have any username or email already exisiting in our DB
  const isUserExisiting = await verifyUsernameAndEmailExisits(
    req.body.email,
    req.body.username
  );

  if (isUserExisiting === TRUE) {
    return res.status(400).send({
      status: 400,
      message: "Email or Username already exists.",
    });
  } else if (isUserExisiting === ERR) {
    return res.status(400).send({
      status: 400,
      message: "Err: verifyUsernameAndEmailExisits failed",
    });
  }

  const salt =bcrypt.genSaltSync(BCRYPT_SALTS);
  const hashedPassword=bcrypt.hashSync(req.body.password,salt);

  const userObj = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  const response = await addUserToDB(userObj);

  if (response === ERR) {
    res.status(400).send({
      status: 400,
      message: "DB Error: Failed to add new user",
    });
  } else if (response === TRUE) {
    res.status(201).send({
      status: 201,
      message: "User added successfully",
    });
  }

};

// POST - Login user
const loginUser = async (req, res) => {
  const { loginId, password } = req.body;

  const isEmail = Joi.object({
    loginId: Joi.string().email().required(),
  }).validate({ loginId });

  let userData;

  if (isEmail.error) {
    userData = await getUserDataFromUsername(loginId);
    if (userData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB error: getUserDataFromUsername failed",
        data: userData.err,
      });
    }
  } else {
    userData = await getUserDataFromEmail(loginId);

    if (userData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB error: getUserDataFromEmail failed",
        data: userData.err,
      });
    }
  }

  if (!userData.data) {
    return res.status(400).send({
      status: 400,
      message: "No user found! Please register",
    });
  }

  const isPasswordMatching = bcrypt.compareSync(password,userData.data.password);

  if (!isPasswordMatching) {
    return res.status(400).send({
      status: 400,
      message: "Incorrect Password",
    });
  }

  const payload = {
    username: userData.data.username,
    name: userData.data.name,
    email: userData.data.email,
    userId: userData.data._id,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  
  res.status(200).send({
    status: 200,
    message: "Logged in successfully",
    data: {
      token,
    },
  });
}

const getAllUsers = async (req, res) => {
  const userId = req.locals.userId;

  const allUsersData = await getAllUsersFromDB(userId);

  if (allUsersData.err) {
    return res.status(400).send({
      status: 400,
      message: "DB Error: getAllUsersFromDB failed",
    });
  }

  let usersData = [];
  allUsersData.data.map((user) => {
    let userObj = {
      name: user.name,
      username: user.username,
      email: user.email,
      _id: user._id,
    };

    usersData.push(userObj);
  });

  res.status(200).send({
    status: 200,
    message: "All users fetched successfully",
    data: usersData,
  });
};

module.exports = { registerUser,loginUser,getAllUsers};