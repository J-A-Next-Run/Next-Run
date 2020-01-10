import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Header, Form, Button, Comment, Segment } from "semantic-ui-react";

//PUSHER________________
const Pusher = require("pusher-js");

const pusherObject = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  disableStats: true
});

//CSS

const commentStyle = {
  padding: "5%",
  display: "table"
};

//* Functions
const Chatbox = ({
  court,
  toKebabCase,
  allMessages,
  addMessageToAllMessages
}) => {
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const onTextChange = e => {
    e.preventDefault();
    setNewMessage(e.target.value);
  };

  const sendMessage = () => {
    if (newMessage !== "") {
      axios.post("/chat/send", {
        message: newMessage,
        channel: `${toKebabCase(court.name)}-chat`
      });
    }
  };

  //* Use Effect

  //* Subscribe chat channel for court
  useEffect(() => {
    /**
     * Subscribes to Court chat and listens for incoming messages
     */
    const handelIncomingMessage = data => {
      addMessageToAllMessages(data.incomingMessage);
    };

    if (court !== undefined) {
      setRoom(court.name);
      const courtChatChannel = pusherObject.subscribe(
        `${toKebabCase(court.name)}-chat`
      );
      courtChatChannel.bind("message", handelIncomingMessage);

      return () => {
        courtChatChannel.unbind("message", handelIncomingMessage);
      };
    }
  }, [court]);

  useEffect(scrollToBottom, [allMessages]);

  //*Sub Components
  const messageItems = allMessages.map((message, index) => {
    return (
      <Comment key={index}>
        <Comment.Content>
          <Comment.Author as="a">{`Random`}</Comment.Author>
          <Comment.Metadata>
            <div>Yesterday at 12:30AM</div>
          </Comment.Metadata>
          <Comment.Text>
            <p> {message} </p>
          </Comment.Text>
        </Comment.Content>
      </Comment>
    );
  });

  return (
    <div>
      <Comment.Group style={commentStyle}>
        <Header as="h3" dividing>
          {room}
        </Header>

        <div style={{ overflow: "auto", maxHeight: 200, height: 200 }}>
          {allMessages.length > 0 && messageItems}
          <div ref={messagesEndRef} />
        </div>

        <Form reply onSubmit={sendMessage}>
          <Form.TextArea type="text" onChange={onTextChange} style={{height: 100}} />
          <Button
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            primary
            type="submit"
          />
        </Form>
      </Comment.Group>
    </div>
  );
};

export default Chatbox;