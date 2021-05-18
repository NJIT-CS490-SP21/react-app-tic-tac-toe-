import './App.css';
import './Board1.css';
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import { User } from './User.js';
import { Rank } from './Rank.js';

// import { Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Tchat } from './Tchat.js';
// import 'emoji-mart/css/emoji-mart.css';
// import { Picker } from 'emoji-mart';

const socket = io(); // Connects to socket connection

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myArray, updateMyArray] = useState([]);
  const [user, updateuser] = useState([]);
  const [isShown, setshown] = useState(false);
  const [isShow, setshow] = useState(false);
  const [tchat2, updatetchat] = useState([]);
  const email = useRef(null);
  const tchat = useRef(null);
  const search = useRef(null);
  const [turn, updateturn] = useState([]);
  const [dic, updatedic] = useState({});
  const [rank, updaterank] = useState([]);
  const [score, updatescore] = useState([]);

  useEffect(() => {
    socket.on('newrank', (data) => {
      const newrank = [...rank];
      const newscore = [...score];
      for (let x = 0; x < data[0].length; x += 1) {
        if (data[2].user.includes(data[0][x])) {
          newrank.push(<p>{data[0][x]}</p>);
          newscore.push(<p>{data[1][x]}</p>);
        } else {
          newrank.push(data[0][x]);
          newscore.push(data[1][x]);
        }
      }

      updaterank(newrank);
      updatescore(newscore);
    });

    socket.on('newboard2', (data) => {
      const newboard = [...data.board];

      setBoard(newboard);
    });
    socket.on('newlogin2', (data) => {
      const newarr = [...data.array];

      updateMyArray(newarr);
    });

    socket.on('dicrecieved', (data) => {
      const newdic2 = { ...data.dic };

      updatedic(newdic2);
      // console.log(newdic2);
    });
    socket.on('newmessage', (data) => {
      const newtchat = [...data.message];

      updatetchat(newtchat);
    });

    socket.on('newuser', (data) => {
      const newlog = [...data.user];

      updateuser(newlog);
    });

    socket.on('newturn', (data) => {
      const newturn = [...data.turn];

      updateturn(newturn);
    });
  }, []);

  // calculate winner
  function winner(board2) {
    const lst = ['X', 'O'];
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
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (board2[a] && board2[a] === board2[b] && board2[a] === board2[c]) {
        // onclick();
        const win = dic[board2[a]];
        const index = lst.indexOf(board2[a]);
        lst.splice(index, 1);
        const looser = dic[lst[0]];

        socket.emit('winner', { winner: win, looser });
        socket.emit('rank', { user });

        return (
          <div>
            <div>
              GAME OVER
              {'  '}
              {win}
              {'  '}
              WON THE GAME
              {' '}
            </div>
            <div> CLICK ON RESTART TO PLAY AGAIN</div>
          </div>
        );
      }
      if (!board2.includes(null)) {
        return (
          <div>
            <div> GAME OVER TIE GAME </div>
            <div> CLICK ON RESTART TO PLAY AGAIN</div>
          </div>
        );
      }
    }
    return null;
  }

  function onclick(index) {
    // game stop if winner is found
    if (winner(board) == null) {
      const x = socket.id;
      // adding first connected user to list and assiging 'X"
      if (myArray.length > 0) {
        if (x === myArray[0] && turn[0] !== x) {
          const newboard = [...board];

          newboard[index] = 'X';

          setBoard(newboard);
          socket.emit('board', { index });
          socket.emit('newboard', { board: newboard });
          const newturn = [...turn];
          newturn[0] = x;
          updateturn(newturn);
          socket.emit('turn', { turn: newturn });

          // adding 2nd connected user to list and assiging 'O'
        } else if (x === myArray[1] && turn[0] !== x) {
          const newboard3 = [...board];

          newboard3[index] = 'O';

          setBoard(newboard3);
          // socket.emit('board', { index });
          socket.emit('newboard', { board: newboard3 });
        }
        const newturn = [...turn];
        newturn[0] = x;
        updateturn(newturn);
        socket.emit('turn', { turn: newturn });
      }

      // update screen to display new score
    } else {
      socket.emit('newboard', { board });
    }
  }

  // Only Palyers can reset the board
  function restart() {
    if (myArray[0] === socket.id || myArray[1] === socket.id) {
      board.fill(null);
      socket.emit('newboard', { board });
      // onclick();
    }
  }

  // update tchat list
  function tchatf() {
    const tchat1 = tchat.current.value;
    const newarr = [...myArray];
    const newtchat = [...tchat2];
    const idx = newarr.indexOf(socket.id);
    newtchat.push(`${user[idx]} : ${tchat1}`);
    updatetchat(newtchat);
    socket.emit('message', { message: newtchat });
    return (
      <div>
        {' '}
        {dic[socket.id]}
        {' '}
      </div>
    );
  }

  function showboard() {
    const email2 = email.current.value;

    const newuser = [...user];
    // user cannot take username already taken
    if (newuser.includes(email2)) {
      return;
    }
    newuser.push(email2);
    updateuser(newuser);
    socket.emit('newlogin', { user: newuser });

    const newlog = [...myArray];

    newlog.push(socket.id);
    updateMyArray(newlog);

    socket.emit('login2', { array: newlog });

    const newdic = { ...dic };
    if (socket.id === newlog[0]) {
      newdic.X = email2;
    } else if (socket.id === newlog[1]) {
      newdic.O = email2;
    }
    updatedic(newdic);

    socket.emit('newdic', { dic: newdic });

    if (email2.length > 0) {
      setshown((prevShown) => !prevShown);
    }
  }

  function logout() {
    setshown((prevShown) => !prevShown);
    const newarr = [...myArray];
    const idx = newarr.indexOf(socket.id);
    const newtchat = [...tchat2];
    if (newarr[0] === socket.id || newarr[1] === socket.id) {
      if (user.length > 2) {
        newtchat.push(`${user[idx]} logged out ${user[idx + 2]} you can play`);
        updatetchat(newtchat);
        socket.emit('message', { message: newtchat });
      } else {
        newtchat.push(`${user[idx]} logged out`);
        updatetchat(newtchat);
        socket.emit('message', { message: newtchat });
      }
    } else {
      newtchat.push(`${user[idx]} logged out`);
      updatetchat(newtchat);
      socket.emit('message', { message: newtchat });
    }
    newarr.splice(idx, 1);
    updateMyArray(newarr);
    socket.emit('login2', { array: newarr });
    const user2 = [...user];
    user2.splice(idx, 1);
    updateuser(user2);
    socket.emit('newlogin', { user: user2 });
    const dic2 = { ...dic };
    if (dic2.X === user[idx]) { delete dic2.X; } else if (dic2.O === user[idx]) { delete dic2.O; }
    updatedic(dic2);
    socket.emit('newdic', { dic: dic2 });
    board.fill(null);
    socket.emit('newboard', { board });

    user.fill(null);
  }

  function showrank() {
    socket.emit('rank', { user });

    setshow((prevShow) => !prevShow);
  }

  function Search() {
    const searchs = search.current.value;
    if (rank.includes(searchs)) {
      const arr = [searchs];
      const arrs = rank.indexOf(searchs);

      const narr = [score[arrs]];

      const newrank = [...arr];
      const newscore = [...narr];
      updatescore(newscore);
      updaterank(newrank);
    }
  }

  return (
    <div>

      <div className="title">
        <h1> WELCOME TO THE GAME </h1>

      </div>
      <div className="user">Users Connected</div>

      {!isShown ? (

        <div className="login">

          <input className="input1" ref={email} type="text" />

          <button
            type="button"
            onClick={() => {
              showboard();
            }}
          >
            {' '}
            Log in
          </button>

        </div>
      ) : null}
      <div className="list">
        {user.map((item) => (
          <User value={item} />
        ))}
      </div>

      {isShown ? (

        <div>

          <div className="logout">
            <button type="button" onClick={() => { logout(); }}>log out</button>
          </div>
          <div className="tchat_box">Chat Box!</div>
          <div className="win">{winner(board)}</div>

          <div className="tchat">
            <textarea ref={tchat} placeholder="Type message.." />
            <button
              type="button"
              onClick={() => {
                tchatf();
              }}
            >
              {' '}
              Post
            </button>
            {tchat2.map((item) => (
              <Tchat value={item} />
            ))}
          </div>

          <div className="reset">
            <button
              type="button"
              onClick={() => {
                restart();
              }}
            >
              {' '}
              Restart
            </button>
          </div>

          <div className="board">
            {board.map((item, index) => (
              <Board name={() => onclick(index)} value={item} />
            ))}
          </div>
          <div className="rank">
            <button
              type="button"
              onClick={() => {
                showrank();
              }}
            >
              {' '}
              Show rank
            </button>
          </div>
          {isShow ? (
            <div className="search">
              <input className="input1" ref={search} type="text" />
              {' '}
              <button
                type="button"
                onClick={() => {
                  Search();
                }}
              >
                {' '}
                Search
                {' '}
              </button>
              <table className="center">
                <thead>
                  <tr>
                    <th colSpan="2"> Leader Board</th>
                  </tr>
                </thead>
                <tbody>
                  {rank.map((item, index) => (
                    <Rank value={item} data={score[index]} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}

export default App;
