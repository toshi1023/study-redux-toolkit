import React from 'react';
import styles from './App.module.css';

import { FaSignInAlt } from 'react-icons/fa';
import TaskList from './features/task/TaskList';
import TaskDetails from './features/task/TaskDetails';
import TaskInput from './features/task/TaskInput';

function App() {
  // ログアウト処理
  const Logout = () => {
    localStorage.removeItem('localJWT')
    window.location.href = '/'
  }

  return (
       <div className={styles.containerTasks}>
         <div className={styles.appTasks}>
           <button onClick={Logout} className={styles.signBtn}>
             <FaSignInAlt />
           </button>
           <TaskInput />
           <TaskList />
         </div>
         <div className={styles.appDetails}>
           <TaskDetails />
         </div>
       </div>

  )
}

export default App;
