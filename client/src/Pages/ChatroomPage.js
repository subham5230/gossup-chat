import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import $ from 'jquery'; 

  const ChatroomPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  
  function autoLoad() {
    if(scrolled === false){
      $("#submitMessage").click(function() {
          $("#chatContent").animate({
              scrollTop: $(
                '#chatContent').get(0).scrollHeight
          }, 2000);
      })
      setScrolled(true);
    }
  };

  function getChatroomName(){
    axios
    .get("http://localhost:8000/chatroom/get/" + chatroomId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
    })
    .then((response) => {
      console.log(response);
      setRoomName(response.data.name);
      
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function loadMessages(){
    axios
    .get("http://localhost:8000/chatroom/" + chatroomId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
    })
    .then((response) => {
      setMessages(response.data);
      
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

React.useEffect(() => {
  if (socket) {
    socket.on("newMessage", (message) => {
      const newMessages = [...messages, message];
      setMessages(newMessages);
    });
  }
});
  React.useEffect(() => {
    
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    console.log("first time")
    getChatroomName();
    setScrolled(false);
    autoLoad();
  }, [])
  

  React.useEffect(() => {
    //eslint-disable-next-line
    loadMessages();
    
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  $("#typeMessage").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#submitMessage").click();
    }
  });


  return (
    
    <div className="chatroomPage bg-dark container-fluid d-grid justify-content-center">
      <h2 className="text-center display-4 pt-5 text-warning">{roomName}</h2>
      <div className="chatroomSection bg-light rounded">
        <div id="chatContent" className="chatroomContent p-4">
          {messages.map((message, i) => (
            <div key={i} className="message row">
              <div className="col" style={
                  userId === message.user ?{textAlign: "right"} : {textAlign:"left"}
                }>
                  <span
                    className={
                      userId === message.user ? "ownMessage" : "otherMessage"
                    }>
                    {userId === message.user? `You` : message.name }:
                  </span>{" "}
                  <p style={{overflowWrap: "break-word"}}>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              id="typeMessage"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
            />
          </div>
          <div>
            <button id="submitMessage" className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatroomPage);
