import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import axios from "axios";
import BlogCard from "../components/Blogs/BlogCard";

function Homepage() {
  const [homeBlogs, setHomeBlogs] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/blog/homepage-blogs`, {
        headers: {
          "X-Acciojob": token,
        },
      })
      .then((res) => {
        setHomeBlogs(res.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [token]);

  return (
    <div>
      <div style={{ padding: "30px" }}>
        {homeBlogs?.map((blog) => (
          <BlogCard props={blog} homepage={true} />
        ))}
      </div>
    </div>
  );
}

export default Homepage;