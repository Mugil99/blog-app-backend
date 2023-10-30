import React, { useEffect, useState } from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Login() {
  const [loginId, setLoginId] = useState();
  const [password, setPassword] = useState();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/homepage";
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const loginObj = {
      loginId,
      password,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, loginObj)
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.setItem("token", res.data.data.token);
          window.location.href = "/homepage";
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
        Login into Blog App
      </h1>
      <Form.Group className="mb-3" controlId="loginId">
        <Form.Label>Login ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter LoginId"
          onChange={(e) => setLoginId(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" style={{ marginTop: "20px" }}>
        Login
      </Button>
    </Form>
  </div>
  )
}

export default Login;