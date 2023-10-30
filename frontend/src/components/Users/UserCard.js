import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function UserCard({ props }) {
  const token = localStorage.getItem("token");

  const handleFollow = (userId) => {
    const followObj = { followingUserId: userId };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/follow/follow-user`,
        followObj,
        {
          headers: {
            "X-Acciojob": token,
          },
        }
      )
      .then((res) => {
        alert("Successfully followed!");
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleUnfollow = (userId) => {
    const followObj = { followingUserId: userId };

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/follow/unfollow-user`,
        followObj,
        {
          headers: {
            "X-Acciojob": token,
          },
        }
      )
      .then((res) => {
        alert("Successfully unfollowed!");
        window.location.reload();
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <Card style={{ width: "18rem", margin: "10px" }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>{props.username}</Card.Text>
        <Card.Text>{props.email}</Card.Text>
        {props.follow ? (
          <>
            <Button variant="danger" onClick={() => handleUnfollow(props._id)}>
              Unfollow
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => handleFollow(props._id)}>
              Follow
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserCard;