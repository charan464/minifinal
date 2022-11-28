import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon , ArrowRightIcon} from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import countries from './countries.json'

//import countries from './countries.json'

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const ENDPOINT = "http://localhost:5000";

var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain  }) => {
  
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
 const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();



 






 const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

     // setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      //setLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const typingHandler=(e)=>{

    setMessage(e.target.value);

    setNewMessage(e.target.value);

    console.log(socketConnected);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  },[selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if ( !selectedChatCompare ||  selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });


  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing",selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        fetchMessages();
        console.log(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const [to, setTo] = useState('en-GB');
  const [from, setFrom] = useState('en-GB');
  const [message,setMessage]=useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [lang,setLang]=useState('en-GB');



 const sound = () => {

   let utter = new SpeechSynthesisUtterance();
   console.log(newMessage+" "+lang);
   utter.lang=lang;
   utter.text = newMessage;
   utter.volume = 0.5;

   window.speechSynthesis.speak(utter);

 }
 

  //var id=document.getElementById("input").value;




 const translate = () => {

   console.log(from, to,newMessage);

   setInput(newMessage);

   let apiUrl = `https://api.mymemory.translated.net/get?q=${newMessage}&langpair=${from}|${to}`

   fetch(apiUrl).then(response => { return response.json() }).then(data => {

     

      setNewMessage(data.responseData.translatedText);

      console.log(newMessage);

     data.matches.forEach(data => {
       if (data.id === 0) {
         
         setNewMessage(data.translation);
         //console.log(data.translation);
         setLang(to);
         console.log(lang);
         console.log(newMessage);
        // console.log(lang);
       }
     });

     setLang(to);
     console.log(lang);

     console.log(input,newMessage);

     if(input===newMessage)
     translate();

     //console.log(data);

   })

 };





  return ( 
    <>
      


      {selectedChat ? (
        <>
            
          <Text
            fontSize={{ base: "14px", md: "15px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Arial"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
      
        <IconButton>
        < i id="from" class="fas fa-volume-up" onClick={e => sound()} />
        </IconButton>
        <select onChange={(e) => setFrom(e.target.value)}>
                {
                  Object.keys(countries).map((key) => (
                    <option key={key} value={key}>{countries[key]}</option>
                  ))
                }
              </select>

              <IconButton display={{ base: "flex" }} icon={< ArrowRightIcon/>} onClick={translate}  />


              <select onChange={(e) => setTo(e.target.value)}>
                {
                  Object.keys(countries).map((key) => (
                    <option key={key} value={key}>{countries[key]}</option>
                  ))
                }
              </select>

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {/* {getSender(user, selectedChat.users)} */}
                  <ProfileModal
                     user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {/* {selectedChat.chatName.toUpperCase()} */}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                    <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                id="input"
                variant="filled"
                bg="#E0E0E0"
                placeholder="enter a message"
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}


    </>
  );
};

export default SingleChat;
