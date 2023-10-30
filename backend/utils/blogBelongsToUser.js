const { NOT_EXIST, ERR, TRUE, FALSE } = require("../constants");
const { getBlogDataFromDB } = require("../repository/blog.repository");

const blogBelongsToUser = async (blogId, userId) => {
    const blogData = await getBlogDataFromDB(blogId);
  
    if (blogData.data === null && blogData.err === null) {
      return NOT_EXIST;
    }
  
    if (blogData.err) {
      return ERR;
    } else if (blogData.data.userId == userId) { // why double equalto is bcos one is of type string and
      return TRUE;                               // another is of type object _id
    } else {
      return FALSE;
    }
  };
  
  module.exports = { blogBelongsToUser };