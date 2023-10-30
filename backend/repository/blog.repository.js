const { TRUE, ERR } = require("../constants");
const Blog = require("../models/Blog");

const addBlogToDB = async (blogObj) => {
  try {
    await blogObj.save();
    return TRUE;
  } catch (err) {
    return ERR;
  }
};

const getUserBlogsFromDB = async (userId, page, LIMIT) => {
    let blogsData = {
      data: null,
      err: null,
    };
  
    try {
      blogsData.data = await Blog.find({ userId,isDeleted:false})
        .sort({
          creationDateTime: -1,
        })
        .skip((page - 1) * LIMIT)
        .limit(LIMIT);
  
      return blogsData;
    } catch (err) {
      blogsData.err = err;
  
      return blogsData;
    }
  };

  const getBlogDataFromDB = async (blogId) => {
    let blogData = {
      data: null,
      err: null,
    };
  
    try {
      blogData.data = await Blog.findOne({ _id: blogId });
  
      return blogData;
    } catch (err) {
      blogData.err = err;
      return blogData;
    }
  };

  const deleteBlogFromDB = async (blogId) => {
    try {
      await Blog.findByIdAndUpdate(blogId, {
        isDeleted: true,
        deletionDateTime: Date.now(),
      });
  
      return TRUE;
    } catch (err) {
      return ERR;
    }
  };

  const updateBlogInDB = async (blogId, newBlogObj) => {
    try {
      await Blog.findByIdAndUpdate({ _id: blogId }, newBlogObj);
  
      return TRUE;
    } catch (err) {
      return ERR;
    }
  };
  
  const getFollowingBlogsFromDB = async (followingUserIds) => {
    let followingBlogsData = {
      data: null,
      err: null,
    };
  
    try {
      followingBlogsData.data = await Blog.find({
        userId: { $in: followingUserIds },
        isDeleted: false,
      });
  
      return followingBlogsData;
    } catch (err) {
      followingBlogsData.err = err;
      return followingBlogsData;
    }
  };

module.exports={addBlogToDB,getUserBlogsFromDB,getBlogDataFromDB,deleteBlogFromDB,updateBlogInDB,getFollowingBlogsFromDB};