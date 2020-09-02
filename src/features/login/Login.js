import React from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Login.module.css';
import {
    editUsername,
    editPassword,
    toggleMode,
    fetchAsyncLogin,
    fetchAsyncRegister,
    selectAuthen,
    selectIsLoginView,
} from './loginSlice';

const Login = () => {
    const dispatch = useDispatch()

    // storeのstateから値を参照
    const authen = useSelector(selectAuthen)
    const isLoginView = useSelector(selectIsLoginView)
    // IDとパスワードの入力が無ければボタンを有効化しない設定(返り値はtrue,false)
    const btnDisabler = authen.username === '' || authen.password === ''

    // ログイン処理の非同期処理の関数
    const login = async() => {
        if(isLoginView) {
            // ログインのビューの場合はログインの処理
            await dispatch(fetchAsyncLogin(authen))
        } else {
            const result = await dispatch(fetchAsyncRegister(authen))
            // 新規ユーザを作成するレジスターのビュー
            // resultの値がfetchAsyncRegisterのfulfilledと一致する場合(= Api通信が成功した場合)
            if (fetchAsyncRegister.fulfilled.match(result)) {
                await dispatch(fetchAsyncLogin(authen))
            }
        }
    }

    return (
        <div className={styles.containerLogin}>
            <div className={styles.appLogin}>
                {/* stateのisLoginViewがtrueかfalseかで値をセット */}
                <h1>{isLoginView ? 'Login' : 'Register'}</h1>
                <span>Username</span>
                <input
                    type="text"
                    className={styles.inputLog}
                    name="username"
                    placeholder=""
                    // editUsernameのstateの値を入力値に変更
                    onChange={(e) => dispatch(editUsername(e.target.value))}
                    required
                />
                <span>Password</span>
                <input
                    type="password"
                    className={styles.inputLog}
                    name="password"
                    placeholder=""
                    // editPasswordのstateの値を入力値に変更
                    onChange={(e) => dispatch(editPassword(e.target.value))}
                    required
                />
                <div className={styles.switch}>
                    <Button
                        variant="contained"
                        disabled={btnDisabler}
                        color="primary"
                        onClick={login}
                    >
                        {isLoginView ? 'Login' : 'Create'}
                    </Button>
                </div>
                <span
                    className={styles.switchText}
                    onClick={() => dispatch(toggleMode())}
                >
                    {isLoginView ? 'Create Account ?' : 'Back to Login'}
                </span>
            </div>
        </div>
    )
}

export default Login