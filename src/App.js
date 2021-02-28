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
  const [isShown, setshown] = useState(false);
  const [tchat2, updatetchat] = useState([]);
  const email=useRef(null);
  const tchat=useRef(null);
  const [turn, updateturn] = useState([]);
  //const [dict, updatedict] = useState({});
  const [couser, updatecouser] = useState([]);
  
  
 
  
 
  
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
      const newcouser=[...data.id];
 
      updatecouser(newcouser);
       
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
    
    //socket.on('newdict', (data) => {
    //const newdict={...data.dict};
    //updatedict(newdict);    });
    
  }, []);





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
      return (board[a]);
    }
  }
  return null;
}
       //users can still play if there is no winner
      if( winner(board) == null ){
       const x=socket.id;
       //adding first connected user to list and assiging 'X"
       if (myArray.length>0)
       {
      if (x==myArray[0][0]['cid']&&turn[0]!=x)
     {  
     
      const newboard=[...board];
      
       newboard[index]= "x" ;
     
      setBoard(newboard);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: newboard });
     const newturn=[...turn];
    newturn[0]=x;
    updateturn(newturn);
    socket.emit('turn', { turn: newturn });
      
     }
      //adding 2nd connected user to list and assiging 'O'
      else if (x==myArray[0][1]['cid']&& turn[0]!=x)
     { 
        
      const new_board=[...board];
     
       new_board[index]= "O" ;
     
      setBoard(new_board);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: new_board });}
     const newturn=[...turn];
  newturn[0]=x;
  updateturn(newturn);
   socket.emit('turn', { turn: newturn });
}

       
      }
      console.log(turn);
      
      }

  //reset the board
  function restart(){
   if( socket.id == myArray[0][0]  ){
   board.fill(null);
   }
   if( socket.id == myArray[0][1]  ){
   board.fill(null);
   }
  
  socket.emit('newboard', { board: board });
   
  }
  //to log in users
  function login ()
  {
   
    //const newdict={...dict};
    //newdict[socket.id]=email2;
   // updatedict(newdict);
   
    //socket.emit('dict', { dict:newdict});
    
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
    const email2 = email.current.value;
   const newuser=[...user];
     
      newuser.push(email2);
      updateuser(newuser);
      
    socket.emit('login', { user:newuser,id:socket.id });
    //users need to enter username to see board
    if (couser.includes(socket.id) ) {return false;}
    else if (email2.length>0)
    { 
    setshown((prevShown)=>{
     return !prevShown;
    });}
   }
    

  return (
  <div>
  <div class="title" >
  <h1> WELCOME TO THE GAME </h1 >
  </div>
  <div class="user">
  Users Connected 
  </div>
  
  <div class="login">
   <input class="input1" ref={email}  type= "text"/>
   
   <div class="list"> {user.map((item)=> { return <div>{item}</div>;})} </div>
   <button onClick={()=>{showboard ();}}> Log in</button> 
   </div>
  
  
  {isShown ?(
 <div>
  <div class="tchat_box">
  Chat Box!
  </div>
   
   <div class="tchat">
   
   <textarea ref={tchat} placeholder="Type message.." name="msg" required></textarea>
   <button onClick={()=>{tchatf();}}> Post</button> 
   {tchat2.map((item)=> { return <li>  {item} </li>;})}
   </div>
   
  <div class="reset">
   <button onClick={()=>{restart();}}> Restart</button> 
   </div>
   
   <div class="board">
    {board.map((item,index) => <Board name={() => onclick(index)} value={item} />)}
    </div>
    </div>
     
   ) : null}
  
   </div> 
   
   
  );
}

export default App;
