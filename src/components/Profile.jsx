import React from 'react';
import firebase from '../firebase-setup';
import Auth from './Auth';
import Loading from "./Loading";
import Logout from './Logout';
import WebPush from './WebPush';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import LineNotify from './LineNotify';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: <Loading />,
            grade: <Loading />,
            job: <Loading />,
            status: <Loading />,
            webpush: null,
        }
        this.database = firebase.database().ref('profile/' + Auth.myUid);
    };
    render() {
        return(
            <div>
                <hr />
                <h2>プロフィール</h2>
                <section className="app_section">
                    <p>{this.state.name}</p>
                    <p className="app_section_subscript">
                        {this.state.grade}<br />
                        {this.state.job}
                    </p>
                    <p className="app_section_subscript">UID: {Auth.myUid}</p>
                    <Link to="/editprofile">
                        <button type="button" className="btn btn-primary"><FontAwesomeIcon icon={faUserEdit} /> プロフィールを編集</button>
                    </Link>
                </section>
                <hr />
                <h2>ステータス</h2>
                <section className="app_section">
                    <div className="alert alert-primary" role="alert">
                        一部の掲示は、在寮の人のみ、または帰省・外泊中の人のみに通知を送信します。<br />
                        ここでステータスを正しく設定すると、適切な通知が受け取れます。
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={this.state.status === true} onChange={() => this.database.update({status: true})} />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        在寮中
                    </label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={this.state.status === false} onChange={() => this.database.update({status: false})} />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        帰省・外泊中
                    </label>
                    </div>
                </section>
                <hr />
                <h2>通知の設定</h2>
                <WebPush token={this.state.webpush} />
                <LineNotify lineToken={this.state.line} />
                <hr />
                <h2>ログアウト</h2>
                <section className="app_section">
                <Logout />
                </section>
            </div>
        );
    };
    componentDidMount() {
        this.database.on('value', (snapshot) => {
            this.setState(snapshot.val());
        });
    };
    componentWillUnmount() {
        this.database.off();
    };
    initMessaging() {
        if(firebase.messaging.isSupported) {
            this
        }else{
            this.setState({webpushAvail: 'unavail'});
        }
    }
    registerToken() {
        try {
            firebase.messaging().getToken()
            .then((token) => {
                this.setState({webpushAvail: 'avail'});
                if (this.state.webpush){
                    if(!this.state.webpush[token]){
                        this.database.child('webpush').update({[token]: true});
                    }
                }else{
                    this.database.child('webpush').set({[token]: true});
                }
            }).catch(() => {
                this.setState({webpushAvail: 'unavail'});
            })
        } catch {
            this.setState({webpushAvail: 'unavail'});
        }
        
    };
    requestPermission() {
        Notification.requestPermission()
            .then(() => {
                this.registerToken();
            });
    };
};

export default Profile;
