import React from 'react';
import { Link } from 'react-router-dom'
import firebase from '../firebase-setup';
import NavigationStranger from './NavigationStranger';

const LoginErrorMessage = (props) => {
    if (props.message.error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">エラー</h4>
                <p>ログイン時にエラーが発生しました。メールアドレスとパスワード等を確認してください。</p>
                <p>解決しない場合は赤沢まで申し出てください。</p>
                <h5>{props.message.errorCode}</h5>
                <p>{props.message.errorMessage}</p>
            </div>
        );
    };
    return "";
};

const LoginSubmitButton = (props) => {
    if (props.proceeding) {
        return (<button type="submit" className="btn btn-light" disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 認証中...</button>);
    };
    return (<button type="submit" className="btn btn-primary">ログイン</button>);
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            persistence: true,
            message : {
                error: false,
                errorCode: "",
                errorMessage: "",
            },
            proceeding: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    };
    componentDidMount() {
        document.title = 'ログイン | 東京寮ウェブアプリ';
    };
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
        [name]: value
        });
    };
    handleLogin(event) {
        event.preventDefault();
        this.setState({
            message : {
                error: false,
                errorCode: "",
                errorMessage: "",
            },
            proceeding: true
        });
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                // サインイン成功
                if(this.state.persistence){
                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                };
                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({
                    message: {
                        error: true,
                        errorCode: error.code,
                        errorMessage: error.message,
                    },
                    proceeding: false,
                });
            })
    };
    render() {
        return (
            <div className="app_frame">
                <div className="app_frame__content">
                    <div className="app_frame__contentBox">
                        <h1>ログイン</h1>
                        <hr />
                        <h2>東京寮ウェブアプリにログイン</h2>
                        <section className="app_section">
                            <LoginErrorMessage message={this.state.message} />
                            <form onSubmit={this.handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="login_email" className="form-label">メールアドレス</label>
                                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="login_email" aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="login_password" className="form-label">パスワード</label>
                                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="login_password" />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" name="persistence" checked={this.state.persistence} onChange={this.handleChange} className="form-check-input" id="login_persistence" />
                                    <label className="form-check-label" htmlFor="login_persistence">次回から自動ログイン</label>
                                </div>
                                <LoginSubmitButton proceeding={this.state.proceeding} />
                            </form>
                        </section>
                        <hr />
                        <h2>アカウントを作成</h2>
                        <section className="app_section">
                            <p className="app_section_subscript">
                                東京寮の関係者でまだアカウントをお持ちでないですか？<br />
                                以下からアカウントを作成してください。
                            </p>
                            <div><Link to="/signup"><button type="button" className="btn btn-success">アカウントを作成する</button></Link></div>
                        </section>
                        <hr />
                        <h2>ログインできない</h2>
                        <section className="app_section">
                            <p className="app_section_subscript">
                                メールアドレスもしくはパスワードを忘れましたか？<br />
                                あるいは他の問題でログインできませんか？<br />
                                ログインできない場合は赤沢まで連絡してください。
                            </p>
                        </section>
                    </div>
                </div>
                <NavigationStranger />
            </div>
        );
    };
};

export default Login;
