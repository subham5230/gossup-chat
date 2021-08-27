import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = (props) => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const [chatroomName, setChatroomName] = React.useState("");

  const createChatroom = (e) => {
    console.log("create chatroom: " + e);
    
    axios
      .post("http://localhost:8000/chatroom", {
        name: e,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
        getChatrooms();
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-dark page">
      <h2 className="text-center pt-5 pb-2 display-4 text-warning">Join the Pack!</h2>
      <div className="card">
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Create Chatroom</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="Enter a name"
            value={chatroomName}
            onChange={(e) => {setChatroomName(e.target.value)}}
          />
          <button className="mt-3" type="submit" onClick={() => {createChatroom(chatroomName)}}>Create Chatroom</button>
        </div>
      </div>
      
      <div className="chatrooms" style={{overflowY: "auto", maxHeight:"200px"}}>
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default DashboardPage;
