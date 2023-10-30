import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Header from "../components/common/Header";
function CreateBlog() {
    const [title, setTitle] = useState();
  const [textBody, setTextBody] = useState();

  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();

    const blogObj = {
      title,
      textBody,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/blog/create-blog`, blogObj, {
        headers: {
          "X-Acciojob": token,
        },
      })
      .then((res) => {
        if (res.data.status === 201) {
          window.location.href = "/my-blogs";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
    <Form onSubmit={handleSubmit}>
      <h1
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Create a Blog
      </h1>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="textbody">
        <Form.Label>Text Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter Text Body"
          onChange={(e) => setTextBody(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" style={{ marginTop: "20px" }}>
        Create Blog
      </Button>
    </Form>
  </div>
  )
}

export default CreateBlog;