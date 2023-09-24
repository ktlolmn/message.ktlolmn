import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIRouter';
import {v4 as uuidv4} from "uuid"

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
//   gửi thông tin giữa user và ng được chat lên db
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post(getAllMessageRoute, {
              from: currentUser._id,
              to: currentChat._id,
            });
            setMessages(response.data);
          } catch (error) {
            // Xử lý lỗi ở đây, ví dụ:
            console.error("Error fetching data:", error);

          }
        };
      
        fetchData();
      }, [currentChat]);
      console.log(messages)
      
    //   gửi tn lên db bao gồm thông tin ng gửi, người nhân và message
    const handleSendMesg = async (msg)=>{
        console.log(currentChat._id, currentUser._id, msg)
        await axios.post(sendMessageRoute,{
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        })

        // làm việc với socket
        socket.current.emit("send-msg",{
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        })

        const  msgs = [...messages]
        msgs.push({
            fromSelf: true, 
            message: msg,
        })
        setMessages(msgs)
    }

    useEffect(()=>{
        if(socket.current){
            socket.current.on("msg-recieve", (msg)=>{
                setArrivalMessage({fromSelf: false, message: msg})
            })
        }
    },[])


    useEffect(()=>{
        arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    },[arrivalMessage])


    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behaviour: " smooth"})
    },[messages])

    return (
    <>
        {
            currentChat && (
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img 
                                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar" 
                                />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <Logout />
                    </div>
                    <div className="chat-messages">
                        {
                            messages.map((message)=>{
                                console.log(message)
                                return (
                                    <div ref={scrollRef} key= {uuidv4()}>
                                        <div key={message._id} className={`message ${message.fromSelf ? "sended": "recieved"}`}>
                                            <div className="content">
                                                <p>
                                                    {message.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <ChatInput handleSendMesg = {handleSendMesg} />
                </Container>
            )
        }   
    </>
  )
}

const Container =  styled.div`
padding-top: 1rem;
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: hidden;
.chat-header{
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    .user-details{
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar{
            img{
                height: 3rem;
            }
        }
        .username{
            h3{
                color: white;
            }
        }
    }
}
.chat-messages{
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .message{
        display: flex;
        align-items: center;
        .content{
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 1rem;
            font-size: 1.1 rem;
            color: #d1d1d1;
            border-radius: 1rem;
        }
    }
    &::-webkit-scrollbar{
        width: 0.2rem;
        &-thumb{
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }
}
.sended{
    justify-content: flex-end;
    .content{
        color: red;
        background-color: #4f04ff21;
    }
}
.recieved{
    justify-content: flex-start;
    .content{
        color: red;
        background-color: #9900ff20;
    }
}
`
