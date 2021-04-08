import React from 'react';
import { Redirect } from 'react-router-dom';
import firebase from '../firebase-setup';
import FullScreenLoading from "./FullScreenLoading";

class StrangerCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signinCheck: false,
            signedIn: false,
        };
        this._isMounted = false;
        this.myUid = null
    };

    componentDidMount() {
        this._isMounted = true;
        // ログインしているかどうか
        firebase.auth().onAuthStateChanged(user => {
            if (user) { // ログインしている
                if (this._isMounted) {
                    this.myUid = user.uid;
                    this.setState({
                        signinCheck: true,
                        signedIn: true,
                    });
                };
            } else { // ログインしていない
                if (this._isMounted) {
                    this.setState({
                        signinCheck: true,
                        signedIn: false,
                    });
                };
            };
        })
    };
    componentWillUnmount() {
        this._isMounted = false;
    };
    render() {
        if (!this.state.signinCheck) { // ログインチェックが終わっていない場合はローディングをレンダリング
            return (
                <FullScreenLoading />
            );
        };
        // ログイン用
        if (!this.state.signedIn) {
            return (this.props.children); // ログインしているときは子コンポーネントを表示
        }else{
            return (<Redirect to='/' />)
        };
    };
};

export default StrangerCheck;
