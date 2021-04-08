import React from 'react';
import { Link } from 'react-router-dom'
import firebase from '../firebase-setup';
import NavigationStranger from './NavigationStranger';

const SignupErrorMessage = (props) => {
    if (props.message.error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">エラー</h4>
                <p>アカウント作成時にエラーが発生しました。メールアドレスとパスワード等を確認してください。</p>
                <p>解決しない場合は赤沢まで申し出てください。</p>
                <h5>{props.message.errorCode}</h5>
                <p>{props.message.errorMessage}</p>
            </div>
        );
    };
    return "";
};

const PasswordCheck = (props) => {
    if (!props.passwordCheck) {
        return (<span className="badge rounded-pill bg-danger">パスワードが一致しません</span>)
    };
    return (<span></span>)
};

const SignupSubmitButton = (props) => {
    if (props.proceeding) {
        return (<button type="submit" className="btn btn-light" disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> アカウント作成中...</button>);
    };
    if (!props.passwordCheck) {
        return (<button type="submit" className="btn btn-light" disabled>パスワードを確認してください</button>)
    };
    return (<button type="submit" className="btn btn-primary">アカウントを作成</button>);
};

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            commonPassword: "",
            passwordCheck: true,
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
        document.title = 'アカウント登録 | 東京寮ウェブアプリ';
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
        firebase.functions().httpsCallable('confirmCommonPassowrd')({commonPassword: this.state.commonPassword})
            .then((res) => {
                if(res.data.result){
                    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                    .then((userCredential) => {
                        this.database = firebase.database().ref('profile/').update({
                            [userCredential.user.uid]: {
                                name: "名無し",
                                grade: "(学年を指定してください)",
                                job: "(役職を指定してください)",
                            }
                        });
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
                }else{
                    this.setState({
                        message: {
                            error: true,
                            errorCode: "Common Password incorrect",
                            errorMessage: "共通パスワードが違います",
                        },
                        proceeding: false,
                    });
                }
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
                        <h1>新規作成</h1>
                        <hr />
                        <h2>新しいアカウントを作成</h2>
                        <section className="app_section">
                            <SignupErrorMessage message={this.state.message} />
                            <form onSubmit={this.handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="signup_email" className="form-label">メールアドレス</label>
                                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="signup_email" aria-describedby="emailHelp" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="signup_password" className="form-label">パスワード</label>
                                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="signup_password" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="signup_passwordConfirm" className="form-label">パスワード(確認)<PasswordCheck passwordCheck={this.state.password === this.state.passwordConfirm} /></label>
                                    <input type="password" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleChange} className="form-control" id="signup_passwordConfirm" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="signup_commonPassword" className="form-label">共通パスワード(寮内Wi-Fiパスワードと同じ)</label>
                                    <input type="password" name="commonPassword" value={this.state.commonPassword} onChange={this.handleChange} className="form-control" id="signup_commonPassword" />
                                </div>
                                <SignupSubmitButton proceeding={this.state.proceeding}　passwordCheck={this.state.password === this.state.passwordConfirm} />
                            </form>
                        </section>
                        <hr />
                        <h2>ログインする</h2>
                        <section className="app_section">
                            <p className="app_section_subscript">
                                すでにアカウントを持っていますか？<br />
                                以下からログインしてください。
                            </p>
                            <div><Link to="/login"><button type="button" className="btn btn-success">ログインページへ</button></Link></div>
                        </section>
                        <hr />
                        <h2>作成できない</h2>
                        <section className="app_section">
                            <p className="app_section_subscript">
                                作成方法がわかりませんか？<br />
                                あるいはなにか他に問題が発生していますか？<br />
                                アカウントを作成できない場合は赤沢まで連絡してください。
                            </p>
                        </section>
                    </div>
                </div>
                <NavigationStranger />
            </div>
        );
    };
};

export default Signup;
