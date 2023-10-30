const Joi = require("joi");
const Blog = require("../models/Blog");
const { addBlogToDB, getUserBlogsFromDB, deleteBlogFromDB, updateBlogInDB, getBlogDataFromDB, getFollowingBlogsFromDB } = require("../repository/blog.repository");
const { ERR, NOT_EXIST, FALSE } = require("../constants");
const { blogBelongsToUser } = require("../utils/blogBelongsToUser");
const { getFollowingListFromDB } = require("../repository/follow.repository");

const createBlog = async (req, res) => {
    const isValid = Joi.object({
      title: Joi.string().required(),
      textBody: Joi.string().min(30).max(1000).required(),
    }).validate(req.body);
  
    if (isValid.error) {
      return res.status(400).send({
        status: 400,
        message: "Invalid data format",
        data: isValid.error,
      });
    }
  
    const { title, textBody } = req.body;
  
    const blogObj = new Blog({
      title,
      textBody,
      creationDateTime: Date.now(),
      username: req.locals.username,
      userId: req.locals.userId,
    });
  
    const response = await addBlogToDB(blogObj);
  
    if (response === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: addBlogToDB failed",
      });
    }
  
    res.status(201).send({
      status: 201,
      message: "Blog created successfully",
    });
  };

  const getUserBlogs = async (req, res) => {
    const userId = req.locals.userId;
    const page = Number(req.query.page) || 1;
    const LIMIT = 10;
  
    const blogsData = await getUserBlogsFromDB(userId, page, LIMIT);
  
    if (blogsData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB error: getUserBlogsFromDB failed",
        data: userData.err,
      });
    }
  
    res.status(200).send({
      status: 200,
      message: "Fetched user blogs successfully",
      data: blogsData.data,
    });
  };

  const deleteBlog = async (req, res) => {
    const blogId = req.params.blogid;
    const userId = req.locals.userId;
  
    const blogBelongsToUserStatus = await blogBelongsToUser(blogId, userId);
  
    if (blogBelongsToUserStatus === NOT_EXIST) {
      return res.status(400).send({
        status: 400,
        message: "Blog dosen't exist",
      });
    } else if (blogBelongsToUserStatus === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getBlogDataFromDB failed",
      });
    } else if (blogBelongsToUserStatus === FALSE) {
      return res.status(403).send({
        status: 403,
        message:
          "Unauthorized to delete the blog. You are not the owner of the blog. ",
      });
    }
  
    const response = await deleteBlogFromDB(blogId);
  
    if (response === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: deleteBlogFromDB failed",
      });
    } else {
      return res.status(200).send({
        status: 200,
        message: "Blog deleted successfully",
      });
    }
  };
  
  const editBlog = async (req, res) => {
    const { blogId, title, textBody } = req.body;
    const userId = req.locals.userId;
  
    const blogBelongsToUserStatus = await blogBelongsToUser(blogId, userId);
  
    if (blogBelongsToUserStatus === NOT_EXIST) {
      return res.status(400).send({
        status: 400,
        message: "Blog dosen't exist",
      });
    } else if (blogBelongsToUserStatus === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getBlogDataFromDB failed",
      });
    } else if (blogBelongsToUserStatus === FALSE) {
      return res.status(403).send({
        status: 403,
        message:
          "Unauthorized to edit the blog. You are not the owner of the blog. ",
      });
    }
  
    const blogData = await getBlogDataFromDB(blogId);
  
    if (blogData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB error: getUserBlogsFromDB failed",
        data: userData.err,
      });
    }
  
    const creationDateTime = blogData.data.creationDateTime;
    const currentTime = Date.now();
  
    const diff = (currentTime - creationDateTime) / (1000 * 60);
  
    if (diff > 30) {
      return res.status(400).send({
        status: 400,
        message: "Not allowed to edit after 30 minutes of creation",
      });
    }
  
    const newBlogObj = {
      title,
      textBody,
    };
  
    const response = await updateBlogInDB(blogId, newBlogObj);
  
    if (response === ERR) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: updateBlogInDB failed",
      });
    }
  
    res.status(200).send({
      status: 200,
      message: "Blog edited successfully",
    });
  };

  const getHomepageBlogs = async (req, res) => {
    const userId = req.locals.userId;
  
    const followingList = await getFollowingListFromDB(userId);
  
    if (followingList.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowingListFromDB failed",
      });
    }
  
    let followingUserIds = [];
    followingList.data.forEach((followObj) => {
      followingUserIds.push(followObj.followingUserId);
    });
  
    const followingBlogs = await getFollowingBlogsFromDB(followingUserIds);
  
    if (followingBlogs.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getFollowingBlogsFromDB failed",
        data: followingBlogs.err,
      });
    }
  
    res.status(200).send({
      status: 200,
      message: "Fetched all homeblogs successfully",
      data: followingBlogs.data,
    });
  };
  
module.exports={createBlog,getUserBlogs,deleteBlog,editBlog,getHomepageBlogs}