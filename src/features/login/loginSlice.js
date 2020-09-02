import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl='http://localhost:8000/'
// localStorage: 検証のApplicationを開くと確認できる
const token = localStorage.localJWT

/**
 * Apiにアクセスする関数
 */
// auth: 認証に関わる情報(authen)を渡す引数
export const fetchAsyncLogin = createAsyncThunk('login/post', async(auth) =>{
    // axios: 引数1: URL, 引数2: 渡すデータ, 引数3: メタ情報
    const res = await axios.post(`${apiUrl}authen/jwt/create`, auth, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    // Apiからの返り値
    return res.data
})

/**
 * アカウントが存在しない場合に新規作成する非同期関数
 */
export const fetchAsyncRegister = createAsyncThunk('login/register', async(auth) =>{
    // axios: 引数1: URL, 引数2: 渡すデータ, 引数3: メタ情報
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    // Apiからの返り値
    return res.data
})

/**
 * ログインしているユーザのIDとパスワードを取得する関数
 */
export const fetchAsyncProf = createAsyncThunk('login/get', async() =>{
    // axios: 引数1: URL, 引数2: 渡すデータ, 引数3: メタ情報
    const res = await axios.get(`${apiUrl}api/myself`, {
        headers: {
            Authorization: `JWT ${token}`,
        },
    })
    // Apiからの返り値
    return res.data
})

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        // 認証に使うstate
        authen: {
            username: '',
            password: '',
        },
        // loginとregisterをstateでフラグ管理
        isLoginView: true,
        profile: {
            id: 0,
            username: '',
        },
    },
    reducers: {
        editUsername(state, action) {
            // action.payload: ユーザが入力したデータ
            state.authen.username = action.payload
        },
        editPassword(state, action) {
            // action.payload: ユーザが入力したデータ
            state.authen.password = action.payload
        },
        // loginモードとregisterモードを切り替え
        toggleMode(state) {
            state.isLoginView = !state.isLoginView
        }
    },
    extraReducers: (builder) => {
        // fulfilled: createAsyncThunkを使うと正常終了の機能を自動的に提供する。その値。
        // ※createAsyncThunkは他にエラーやロード中(pending)も自動で提供する
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            // access: JWTのTOKENを取得できる属性(fetchAsyncLoginの返り値(res.data)がpayloadに渡される)
            // JWTのTOKENの実態をlocalStrageに格納
            localStorage.setItem('localJWT', action.payload.access)
            // ログインに成功すると自動で/tasksページに飛ぶように設定
            action.payload.access && (window.location.href = '/tasks')
        })
        builder.addCase(fetchAsyncProf.fulfilled, (state, action) => {
            // ログイン情報を渡す
            state.profile = action.payload
        })
    },
})

// Reactのコンポーネントからdispatchで呼び出せるようにexport
// ※コンポーネントのdispatchでアクションtypeを呼ぶ必要があるため、
//   loginSlice.actionsを代入する
export const {editUsername, editPassword, toggleMode} = loginSlice.actions
// Reactのコンポーネントから参照できるように設定
export const selectAuthen = (state) => state.login.authen
export const selectIsLoginView = (state) => state.login.isLoginView
export const selectProfile = (state) => state.login.profile

export default loginSlice.reducer