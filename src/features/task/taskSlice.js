import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/api/tasks/'
const token = localStorage.localJWT

// 一覧データの取得
export const fetchAsyncGet = createAsyncThunk('tasks/get', async() => {
    const res = await axios.get(apiUrl, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    })
    return res.data
})

// データ作成
export const fetchAsyncCreate = createAsyncThunk('tasks/post', async(task) => {
    const res = await axios.post(apiUrl, task, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
        },
    })
    return res.data
})

// データの更新
export const fetchAsyncUpdate = createAsyncThunk('tasks/put', async(task) => {
    const res = await axios.put(`${apiUrl}${task.id}/`, task, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
        },
    })
    return res.data
})

// データの削除処理
export const fetchAsyncDelete = createAsyncThunk('tasks/delete', async(id) => {
    // deleteの場合は第2引数で渡すデータはない
    await axios.delete(`${apiUrl}${id}/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
        },
    })
    return id
})


const taskSlice = createSlice({
    name: 'task',
    initialState: {
        // tasks: apiのエンドポイントで管理されているデータのため配列
        tasks: [
            {
                id: 0,
                title: '',
                created_at: '',
                updated_at: '',
            },
        ],
        // taskの編集時に選択・保持するstate
        editedTask: {
            id: 0,
            title: '',
            created_at: '',
            updated_at: '',
        },
        // taskの詳細表示をした際に保持するstate
        selectedTask: {
            id: 0,
            title: '',
            created_at: '',
            updated_at: '',
        },
    },
    reducers: {
        editTask(state, action) {
            state.editTask = action.payload
        },
        selectTask(state, action) {
            state.selectedTask = action.payload
        },
    },
    extraReducers: (builder) => {
        // Apiが成功したときの処理を記載
        builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
            return {
                ...state,
                tasks: action.payload, //apiから取得したtaskの情報をstateのtasksに格納
            }
        })
        builder.addCase(fetchAsyncCreate.fulfilled, (state, action) => {
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
            }
        })
        builder.addCase(fetchAsyncUpdate.fulfilled, (state, action) => {
            return {
                ...state,
                // 現在のtask一覧の要素をtというテンポラリの変数に格納して、選択したidに一致するidには変更したデータを格納
                tasks: state.tasks.map((t) => 
                    t.id === action.payload.id ? action.payload : t
                ),
                // 選択されている詳細taskにも更新したデータを格納
                selectedTask: action.payload,
            }
        })
        builder.addCase(fetchAsyncDelete.fulfilled, (state, action) => {
            return {
                ...state,
                // 削除対象のtask以外のidでフィルターをかけてstateを更新
                tasks: state.tasks.filter((t) => t.id !== action.payload.id),
                // 値を初期値に再設定
                selectedTask: {id: 0, title: '', created_at: '', updated_at: ''},
            }
        })
    },
})

export const { editTask, selectTask } = taskSlice.actions

export const selectSelectedTask = (state) => state.task.selectedTask
export const selectEditedTask = (state) => state.task.editedTask
export const selectTasks = (state) => state.task.tasks

export default taskSlice.reducer