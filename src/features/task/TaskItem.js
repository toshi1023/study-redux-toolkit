import React from 'react';
import styles from './TaskItem.module.css';

import {BsTrash} from 'react-icons/bs';
import {FaEdit} from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { fetchAsyncDelete, selectTask, editTask, selectTasks } from './taskSlice';

const TaskItem = ({task}) => {
    const dispatch = useDispatch()
    return (
        <li className={styles.listItem}>
            {/* taskのタイトルをクリックしたときにselectTaskアクションを実行 */}
            <span
                className={styles.cursor}
                onClick={() => dispatch(selectTask(task))}
            >
                {task.title}
            </span>
            <div>
                <button 
                    onClick={() => dispatch(fetchAsyncDelete(task.id))}
                    className={styles.taskIcon}
                >
                    <BsTrash />
                </button>
                <button
                    onClick={() => dispatch(editTask(task))}
                    className={styles.taskIcon}
                >
                    <FaEdit />
                </button>
            </div>
        </li>
    )
}

export default TaskItem
