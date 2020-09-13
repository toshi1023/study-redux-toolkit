import React from 'react';
import styles from './TaskInput.module.css';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';

import {
    fetchAsyncCreate, 
    fetchAsyncUpdate, 
    editTask, 
    selectEditedTask
} from './taskSlice';

const TaskInput = () => {
    const dispatch = useDispatch()
    const editedTask = useSelector(selectEditedTask)

    // stateのeditTaskの値を変えるアクションをdispatch
    const handleInputChange = (e) => {
        // idが0の場合(idがない場合)は新規作成を実行
        editedTask.id === 0
            ? dispatch(editTask({ id: 0, title: e.target.value })) // idはバックエンド側で自動で連番を作成するため、何を設定してもOK
            : dispatch(editTask({ id: editedTask.id, title: e.target.value }))
    }

    // タイトルに文字が入力されていないか判定(0の場合はtrue)
    const isDisabled = editedTask.title.length === 0

    // 作成(stateのeditTaskの値をApiで送信)
    const createClicked = () => {
        dispatch(fetchAsyncCreate(editedTask))
        dispatch(editTask({ id: 0, title: '' }))
    }

    // 更新(stateのeditTaskの値をApiで送信)
    const updateClicked = () => {
        dispatch(fetchAsyncUpdate(editedTask))
        dispatch(editTask({ id: 0, title: '' }))
    }

    return (
        <div>
            <input
                type="text"
                className={styles.taskInput}
                value={editedTask.title}
                onChange={handleInputChange}
                placeholder="Please input task"
            />

            <div className={styles.switch}>
                {/* 新規作成と編集でボタンを分岐 */}
                {editedTask.id === 0 ? (
                    <Button
                        variant="contained"
                        disabled={isDisabled}
                        onClick={createClicked}
                        color="primary"
                    >
                        Create
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        disabled={isDisabled}
                        onClick={updateClicked}
                        color="primary"
                    >
                        Update
                    </Button>
                )}
            </div>
        </div>
    )
}

export default TaskInput
