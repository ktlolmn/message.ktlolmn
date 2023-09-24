import React, {useState} from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import {BsEmojiSmileFill} from 'react-icons/bs'
import {IoMdSend} from 'react-icons/io'

export default function ChatInput({handleSendMesg}) {
    const [showEmojiPicker, setShowEmojiPicker] =useState(false)
    const [msg, setMsg] = useState("")

    const handleEmojiPickerHideShow = ()=>{
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick = (event, emoji)=>{
        
    }

    const sendChat = (event)=>{
        event.preventDefault();
        if(msg.length > 0){
            handleSendMesg(msg);
            setMsg("")
        }
    }
    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                    {
                        showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                    }
                </div>
            </div>
            <form className="input-container" onSubmit={(e)=>{sendChat(e)}}>
                <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>{
                    setMsg(e.target.value)
                }} />
                <button className='submit'>
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color: #080420;
    padding: 0 2rem;
    padding-bottom: 0.3rem;
    .button-container {
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;
        .emoji {
            position: relative;
            svg {
                font-size: 1.5rem;
                color: #ffff08;
                cursor: pointer;
            }
            .EmojiPickerReact{
                position: absolute;
                top: -470px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9186f3;
                .epr-scroll-wrapper::-webkit-scrollbar{
                    background-color: #080420;
                    width: 5px;
                    &-thumb{
                        background-color: #9186f3;
                    }
                }
                .epr-search-container{
                    button{
                        filter: contrast(0);
                    }
                }
                .epr-search{
                    background-color: transparent;
                    border-color: #9186f3;
                }
                .epr-emoji-category-label{
                    background-color: transparent;
                    
                }
            }
        }
    }
    .input-container{
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-content: center;
        gap: 2rem;
        background-color: #ffffff34;
        input{
            width: 90%;
            background-color: transparent;
            color: white;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection{
                background-color:  #9286f3;
            }
            &::placeholder{
                
            }

            &:focus{
                outline: none;
            }
        }
        button{
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            background-color: #9a86f3;
            border: none;
            svg{
                font-size: 2rem;
                color: white;
            }
        }
    }
`