import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db} from '../firebase'

import { set, ref, onValue, remove, update, push } from 'firebase/database';
import { AuthProvider, useAuth } from "../context/AuthContext";

const ToDo = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [priority, setPriority] = useState(); 
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            const todoList = Object.values(data);
            setTodos(todoList);
          }
        });
      } else if (!user) {
        navigate("/");
      }
    });
  }, []);

  async function handleSignOut() {
    setError("")

    try {
      await logout()
      navigate('/')
    } catch {
      setError("Failed to log out")
    } 
  }
  const writeToDatabase = (event) => {
    event.preventDefault();
    if (todo !== "" && priority !== undefined) {
      const uidd = push(ref(db, `/${auth.currentUser.uid}`)).key;
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        completed: false,
        priority: priority,
        uidd: uidd,
      });
  
      setTodo("");
      setPriority(1);
    } else {
      
      console.error("Todo or priority is missing.");
    }
  };
  

  const handleDelete = (uidd) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uidd}`));
  };
  const handleComplete = (uidd) => {
    const todoToUpdate = todos.find((todo) => todo.uidd === uidd);
    update(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
      completed: !todoToUpdate.completed,
    });
  };

  const handleClearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        remove(ref(db, `/${auth.currentUser.uid}/${todo.uidd}`));
      }
    });
  };

  return (
    <AuthProvider>
      <div className='main flex flex-col  items-center bg-black h-screen'>
      <div className="background-image "></div>
      <div className="header z-[1] flex justify-between gap-[195%] items-center self-start ml-[22%] mt-[25px]">
        <div className="title">
        <div className="title text-[white] tracking-[55px] text-[50px] font-semibold flex items-center justify-center py-12 ">
            CHECKMATE
        </div>
        </div>
        <div className="logout">
          <button onClick={handleSignOut}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="35px" width="35px" id="Logout">
              <path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z" fill="#ffffff" className="color000000 svgShape"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="new-todo  z-[2]">
          <form onSubmit={writeToDatabase}>
            <div className="new">
              <div className="new-todo-input">
                <input
                  id="todo-input"
                  type="text"
                  placeholder="Create a new todo..."
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                />
              </div>
              <input
                type="number"
                className="priority-input"
                placeholder='Set Priority (1 to 100)'
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min="1"
                max="100"
              />
              <button type="submit" className="add_delete">
                +
              </button>
            </div>
          </form>
        </div>

      <div className="items overflow-hidden w-[700px] bg-[hsl(235,24%,19%)] shadow-[0px_2px_30px_0px_rgba(0,0,0,0.4)] mt-[50px] rounded-md;
">
        {todos
          .filter((todo) => {
            if (filterStatus === 'active') {
              return !todo.completed;
            } else if (filterStatus === 'completed') {
              return todo.completed;
            } else {
              return true;
            }
          })
          .sort((a, b) => a.priority - b.priority)
          .map((todo) => (
            <div className={`todo-items ${todo.completed ? 'completed' : ''}`} key={todo.uidd}>
              <div className={`todo-item w-full h-[70px] bg-[#25273c] flex cursor-pointer transition-all duration-[0.25s] ease-[ease]  border-b-[#393a4c] border-b border-solid;
 priority-${todo.priority}`}>
                <div className={`check  ${todo.completed ? 'completed' : ''}`}
                  onClick={() => handleComplete(todo.uidd)}>
                  <div className={`check-mark ${todo.completed ? 'checked' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                      <path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6" />
                    </svg>
                  </div>
                </div>
                <div
                  className={`todo-text flex items-center text-lg text-[#cacde8] gap-4 grow ${todo.completed ? 'completed' : ''}`}
                  onClick={() => handleComplete(todo.uidd)}
                >
                  {todo.todo}
                </div>
                <button
                  className="add_delete"
                  onClick={() => handleDelete(todo.uidd)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        

        <div className="todo-items-info fixed z-10 w-full h-[70px] bg-[#25273c] flex items-center text-[#4d5066]  justify-between px-[90px] left-0 bottom-0">
          <div className="items-left">{todos.filter(todo => !todo.completed).length} items left</div>
          <div className="items-statuses">
            <span className={filterStatus === 'all' ? 'active' : ''} onClick={() => setFilterStatus('all')}>
              All
            </span>
            <span className={filterStatus === 'active' ? 'active' : ''} onClick={() => setFilterStatus('active')}>
              Active
            </span>
            <span className={filterStatus === 'completed' ? 'active' : ''} onClick={() => setFilterStatus('completed')}>
              Completed
            </span>
          </div>
          <div className="items-clear" onClick={handleClearCompleted}>
            <span>Clear Completed</span>
          </div>
        </div>
      </div>
    </div>
    
    </AuthProvider>
  );
};

export default ToDo;
