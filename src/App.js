import logo from './logo.svg';
import './App.css';
import './Board1.css';
import {Board} from './Board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io(); // Connects to socket connection


function App() {
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myArray, updateMyArray] = useState([]);
  const [user, updateuser] = useState([]);
  const [isShown, setshown] = useState(true);
  const [tchat2, updatetchat] = useState([]);
  const email=useRef(null);
   const tchat=useRef(null);
 
  
 
  
  
  useEffect(() => {
     socket.on('newboard', (data) => {
     
      const newboard=[...data.board];
 
      setBoard(newboard);
       
    }); 
    socket.on('connect', () => {
     const cid=socket.id;
     socket.emit('clientid', { cid: cid });

      
    });
    socket.on('user', (data) => {
     const array=[...myArray];
     
      array.push(data);
      updateMyArray(array);
      
    });
    
  }, []);

//console.log(myArray);
function onclick(index){
       
       const x=socket.id;
       //console.log(x);
      if (x==myArray[0][1]['cid'])
     { 
      const newboard=[...board];
      
       newboard[index]= "0" ;
     
      setBoard(newboard);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: newboard });}
      
      else if (x==myArray[0][0]['cid'])
     { 
       
      const new_board=[...board];
     
       new_board[index]= "X" ;
     
      setBoard(new_board);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: new_board });}
      
}

  
  function login ()
  {
   const email2 = email.current.value;
   const newuser=[...user];
     
      newuser.push(email2);
      updateuser(newuser);
     }
   
   
  function tchatf ()
  {
   const tchat1 = tchat.current.value;
   const newtchat=[...tchat2];
     
      newtchat.push(tchat1);
      updatetchat(newtchat);
     }
   function showboard(){
    //login();
    setshown((prevShown)=>{
     return !prevShown;
    });
   }
    

  return (
  <div>
  <h> WELCOME TO THE GAME </h>
  <div class="title">
  <div> Users Connected </div>
  </div>
   <div class="login">
   
   <input ref={email}  type= "text"/>
         
   <button onClick={()=>{login();}}> Log in</button> 
   <div class="user"> {user.map((item)=> { return <div>{item}</div>;})} </div>
   </div>
   <div class="tchat">
   
   <input ref={tchat}  type= "text"/>
         
   <button onClick={()=>{tchatf();}}> Post</button> 
  <div> {tchat2.map((item)=> { return <div>{item}</div>;})} </div>
   </div>
   
   <div class="board">
        
    {board.map((item,index) => <Board name={() => onclick(index)} value={item} />)}
  
    </div>
   </div>
  );
}

export default App;

