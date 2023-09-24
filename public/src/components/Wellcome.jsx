import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'

export default function Wellcome({currentUser}) {
  console.log(currentUser.username)
  return (
    <Container>
        <img src={Robot} alt="" />
        <h1>Wellcome, <span>{currentUser.username}</span></h1>
        <h3>Please select a chat to Start Messaging</h3>
    </Container>
  )
}
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    img{
        height: 20rem;
    }
    span{
        color: #4e00ff;
    }
`
