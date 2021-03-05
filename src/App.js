
import './App.css';
import './Board1.css';
import {Board} from './Board.js';
import {User} from './User.js';
import {Tchat} from './Tchat.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const socket = io(); // Connects to socket connection



  function App() {
  
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myArray, updateMyArray] = useState([]);
  const [user, updateuser] = useState([]);
  const [isShown, setshown] = useState(false);
  const [isShow, setshow] = useState(false);
  const [tchat2, updatetchat] = useState([]);
  const email=useRef(null);
  const tchat=useRef(null);
  const [turn, updateturn] = useState([]);
  const [dic, updatedic]=useState({});
  //const [username,updateusername] = useState([]);
  const [rank,updaterank] = useState([]);
 // const [score, updatescore]=useState({});
 
 
 
  
 
  
  useEffect(() => {
   
     socket.on('newrank', (data) => {
     
      
      const newrank=[...rank];
      for (const x in data)
      {newrank.push(data[x]);}
      //newrank=newrank[0];
      updaterank(newrank);
      
      
      
      //const newusername=[...username];
      //for (const y in data['username']){
      //newusername.push(data['username'][y]);}
     
      //updateusername(newusername);
      //console.log(newusername);
      //console.log(newrank);
       
    }); 
    
     socket.on('newboard', (data) => {
     
      const newboard=[...data.board];
 
      setBoard(newboard);}); 
      socket.on('newlogin2', (data) => {
     
      const newarr=[...data.array];
 
      updateMyArray(newarr);
      
       
    }); 
    
    socket.on('dicrecieved', (data) => {
     
      const newdic2={...data.dic};
 
      updatedic(newdic2);
      //console.log(newdic2);
       
    }); 
     socket.on('newmessage', (data) => {
     
      const newtchat=[...data.message];
 
      updatetchat(newtchat);
       
    }); 
    
    
    
    socket.on('newuser', (data) => {
    
     const newlog=[...data.user];
      
      updateuser(newlog);
     
      
    }); 
    
    
    socket.on('newturn', (data) => {
     
      const newturn=[...data.turn];
 
      updateturn(newturn);
       
    }); 
   
    
    
  }, []);
function addEmoji(emoji) {
      const { newMessage } = this.state;
      const text = `${newMessage}${emoji.native}`;

      this.setState({
        newMessage: text,
        showEmojiPicker: false,
      });
    }

 //calculate winner
 function winner(board) {
  const lst=['X','O'];
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
      const win=dic[board[a]];
      const index = lst.indexOf(board[a]);
      lst.splice(index,1);
      const looser=dic[lst[0]];
      
      socket.emit('winner', { winner: win,looser:looser });
      return (<div><div> GAME OVER { win } WON THE GAME  </div>
      <div> CLICK ON RESTART TO PLAY AGAIN</div></div>);
      
    }
    if (!board.includes(null))
    {
     return (<div><div> GAME OVER IT'S A TIE GAME </div>
     <div> CLICK ON RESTART TO PLAY AGAIN</div></div>);
    }
  }
  return null;
}


function onclick(index){
 
       
       //game stop if winner is found
      if( winner(board) == null ){
       const x=socket.id;
       //adding first connected user to list and assiging 'X"
       if (myArray.length>0)
       {
      if (x==myArray[0]&&turn[0]!=x)
     {  
     
      const newboard=[...board];
      
       newboard[index]= "X" ;
     
      setBoard(newboard);
      socket.emit('board', { index: index });
      socket.emit('newboard', { board: newboard });
      const newturn=[...turn];
     newturn[0]=x;
     updateturn(newturn);
     socket.emit('turn', { turn: newturn });
      
     }
      //adding 2nd connected user to list and assiging 'O'
      else if (x==myArray[1]&& turn[0]!=x)
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
     
      
      }

  //Only Palyers can reset the board
  function restart(){
   if( myArray.includes(socket.id))
   {
   board.fill(null);
   onclick(0);
  
  socket.emit('newboard', { board: board });
  
   
  }}
  
  
  //update tchat list
  function tchatf ()
  {
   const tchat1 = tchat.current.value;
   
   const newtchat=[...tchat2];
     
      newtchat.push(tchat1);
      updatetchat(newtchat);
    socket.emit('message', { message:newtchat });
    return(<div> {dic[socket.id]} </div>);
     }
     
   function showboard(){
    
    
    const email2 = email.current.value;
    
   const newuser=[...user];
   //user cannot take username already taken
      if (newuser.includes(email2))
      {  return;
       }
      else{
      newuser.push(email2);
      updateuser(newuser);
       socket.emit('newlogin', { user:newuser });
      
      }
      const newlog=[...myArray];
      if (myArray.length<2){
       newlog.push(socket.id);
      updateMyArray(newlog);
     }
     socket.emit('login2', { array: newlog });
      
      const newdic={...dic};
      if (socket.id==newlog[0])
      {
      newdic['X']=email2;}
      else if (socket.id==newlog[1])
      {
      newdic['O']=email2;}
      updatedic(newdic);
      socket.emit('newdic', { dic:newdic });
    
    if (email2.length>0)
    { 
    setshown((prevShown)=>{
     return !prevShown;
    });}
   }
   
   function showrank(){
   socket.emit('rank', { });
    setshow((prevShow)=>{
     return !prevShow;
    });
   }
    
// <Picker onSelect={addEmoji} /> 
  return (
  <div>
  <div className="title" >
  <h1> WELCOME TO THE GAME </h1 >
  </div>
  <div className="user">
  Users Connected 
  </div>
  
  <div className="login">
   <input className="input1" ref={email}  type= "text"/>
   
   <button onClick={()=>{showboard ();}}> Log in</button> 
   </div>
   <div className="list">
   {user.map((item) => <User  value={item} />)}
  </div>
  
  {isShown ?(
 <div>
  <div className="tchat_box">
  Chat Box!
  </div>
  <div className ="win">
    {winner(board)}</div>
   <div className="tchat">
  
   <textarea ref={tchat} placeholder="Type message.."></textarea>
   <button onClick={()=>{tchatf()}}> Post</button> 
   {tchat2.map((item)=> <Tchat value= {item}  />)}
  
   </div>
   
  <div className="reset">
   <button onClick={()=>{restart();}}> Restart</button> 
   </div>
   
   <div className="board">
    {board.map((item,index) => <Board name={() => onclick(index)} value={item} />)}
    
    </div>
    <div className="rank">
    <button onClick={()=>{showrank();}}> Show rank</button> 
    </div>
    {isShow ?(
    <table className="center">
    
    <thead>
        <tr>
            <th colSpan="2">Leader Board</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        {rank.map((user) => (<tr>{user} </tr> ))}
        </tr>
    </tbody>
</table>
 
 ) : null}
   
    </div>
     
   ) : null}
  
   </div> 
   
   
  );
}

export default App;
