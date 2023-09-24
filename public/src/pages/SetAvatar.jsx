import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../assets/loading2.gif'
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRouter';
import {Buffer} from 'buffer'

function SetAvatar() {
  const api = 'http://api.multiavatar.com/45678945';
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(undefined);
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  useEffect(()=>{
    if(!localStorage.getItem("chat-app-user")){
      navigate("/")
    }
  },[]);

  const setProfilePicture = async () => {
    if(selectedAvatarIndex === undefined){
      toast.error("Please select an avatar.",toastOptions);
    }else{
      const user = await JSON.parse(localStorage.getItem('chat-app-user'))
      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatarIndex]
      })
      if(data.isSet){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user',JSON.stringify(user))
        navigate("/")
      }else{
        toast.error("Error please try agian!", toastOptions)
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = new Buffer.from(image.data);
          data.push(buffer.toString('base64'));
        }
        setAvatars(data);
        setIsLoading(false);
        console.log('ok');
      } catch (error) {
        toast.error("Lỗi vui lòng tải lại", toastOptions)
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      
      {
        isLoading ? 
        <Container>
          <img src={Loader} alt="loading" className='loader' />
        </Container> 
        :
        <Container>
        <div className="title-container">
          <h1>Pick an avatar as a profile picture</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div
                key={index}
                className={`avatar ${selectedAvatarIndex === index ? 'selected' : ''}`}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => {
                    setSelectedAvatarIndex(index);
                  }}
                />
              </div>
            );
          })}
        </div>
        <button onClick={()=>{setProfilePicture()}}>Create with avatar is selected</button>
      </Container>
      }
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader{
    height: 100%;
    width: 100%;
}
.title-container{
    h1{
        color: white;
    }
}
.avatars{
    display: flex;
    gap: 2rem;
    .avatar{

        border: 0.4rem solid transparent;
        padding: 0.4rem;
        border-radius: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.5s ease-in-out;
        img{
            height: 6rem;
        }
    }
    .selected{
        border: 0.4rem solid #4e0eff;
    }
}
button{
  background-color: #997af0;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition: 0.5s ease-in-out;
  &:hover{
      background-color: #4e0eff;
  }
}
`;

export default SetAvatar;
