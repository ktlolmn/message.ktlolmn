import axios from 'axios';
import React from 'react'
import { useEffect,useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utils/APIRouter';
import Contacts from '../components/Contacts';
import Wellcome from '../components/Wellcome';
import ChatContainer from '../components/ChatContainer'
import styled from 'styled-components';
import {io} from "socket.io-client"
import { host } from '../utils/APIRouter';


function Chat() {
  const socket = useRef()
  const [currentUser, setCurrentUser] = useState(undefined)
  const [contacts, setContacts] = useState([])
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoader, setisLoader] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        const userData = JSON.parse(localStorage.getItem('chat-app-user'));
        setCurrentUser(userData);
        setisLoader(true)
      }
    };
  
    fetchData();
  }, []);



  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser.isAvatarImageSet) {
        try {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } catch (error) {
          // Handle any errors here
          console.error("Error fetching contacts:", error);
        }
      } else {
        navigate("/setAvatar");
      }
    };
  
    if (currentUser) {
      fetchContacts();
    }
  }, [currentUser]);

  const handleChatChange = (chat)=>{
    setCurrentChat(chat)
  }
  
  return (
    <>
      <Container>
        <div className="container">
          <Contacts 
            contacts={contacts} 
            currentUser={currentUser} 
            changeChat = {handleChatChange}
          />
          {
            isLoader && currentChat === undefined ? (
              <Wellcome 
                currentUser={currentUser} 
              />
            ):(
              <ChatContainer 
                currentChat = {currentChat} 
                currentUser ={currentUser} 
                socket ={socket}
              />
            )
          }
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height : 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    
  }
`

export default Chat