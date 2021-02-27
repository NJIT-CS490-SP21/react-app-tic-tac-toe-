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
  const [turn, updateturn] = useState([]);
 
  
 
  
  useEffect(() => {
     socket.on('newboard', (data) => {
     
      const newboard=[...data.board];
 
      setBoard(newboard);
       
    }); 
     socket.on('newmessage', (data) => {
     
      const newtchat=[...data.message];
 
      updatetchat(newtchat);
       
    }); 
    socket.on('newlogin', (data) => {
     
      const newlog=[...data.user];
 
      updateuser(newlog);
       
    }); 
    
    socket.on('newturn', (data) => {
     
      const newturn=[...data.turn];
 
      updateturn(newturn);
       
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
console.log(myArray);




function onclick(index){
 
 
 function winner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
       
      if( winner(board) == null ){
       const x=socket.id;
       
       if (myArray.length>0)
       {
      if (x==myArray[0][0]['cid']&& turn[0]!=x)
     {  
     
      const newboard=[...board];
      
       newboard[index]= "x" ;
     
      setBoard(newboard);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: newboard });
      
      
     }
      
      else if (x==myArray[0][1]['cid']&& turn[0]!=x)
     { 
        
      const new_board=[...board];
     
       new_board[index]= "O" ;
     
      setBoard(new_board);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: new_board });}
     
}
const newturn=[...turn];
  newturn[0]=x;
  updateturn(newturn);
   socket.emit('turn', { turn: newturn });
       
      }
      else { console.log(winner(board));
       
      }
      }


  function restart(){
   
   board.fill(null);
  socket.emit('newboard', { board: board });
   //onclick();
  }
  function login ()
  {
   const email2 = email.current.value;
   const newuser=[...user];
     
      newuser.push(email2);
      updateuser(newuser);
    socket.emit('login', { user:newuser });
    
     }
   
   
  function tchatf ()
  {
   const tchat1 = tchat.current.value;
   const newtchat=[...tchat2];
     
      newtchat.push(tchat1);
      updatetchat(newtchat);
    socket.emit('message', { message:newtchat });
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
  
    <div class="restart">
     <button onClick={()=>{restart();}}> Restart</button> 
     </div>
     
   </div>
  );
}

export default App;

