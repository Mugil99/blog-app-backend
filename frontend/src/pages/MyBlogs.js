import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/Blogs/BlogCard";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/blog/get-user-blogs`, {
        headers: {
          "X-Acciojob": token,
        },
      })
      .then((res) => {
        setMyBlogs(res.data.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, [token]);
  return (
    <div style={{ padding: "3rem" }}>
    <h1 style={{ textAlign: "center", marginBottom: "40px" }}>My Blogs</h1>
    {myBlogs?.map((blog, key) => (
      <BlogCard
        key={key}
        props={blog}
        setMyBlogs={setMyBlogs}
        myBlogs={myBlogs}
        homepage={false}
      />
    ))}
  </div>
  )
}

export default MyBlogs;