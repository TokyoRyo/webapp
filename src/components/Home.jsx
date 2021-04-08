import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import { Link } from 'react-router-dom'
import firebase from '../firebase-setup';
import Loading from "./Loading";
import './postSummary.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEye } from '@fortawesome/free-regular-svg-icons';
import { faHome, faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

import Auth from './Auth';

const CovidInfo = (props) => {
    return (
        <section className="app_section">
            <p>{props.level.description}</p>
        </section>
    );
};

const PostSummary = (props) => {
    const reply = props.data.reply ? Object.keys(props.data.reply).length : 0;
    var unread = false;
    var eye = "---"
    if (props.data.unread) {
        const checkKeys = Object.keys(props.data.unread)
        const checkAll = checkKeys.length;
        var checked = 0;
        for (var i = 0; i < checkAll; i++) {
            if (props.data.unread[checkKeys[i]] === 'unread' && checkKeys[i] === Auth.myUid) {unread = true};
            if (props.data.unread[checkKeys[i]] === 'read') {checked++}
        };
        eye = `${checked}/${checkAll}`
    }
    var unreadIcon;
    if (unread) {
        unreadIcon = (
            <div className='app_postSummary__unread unread'>
                <FontAwesomeIcon icon={faBell} />
            </div>
        );
    }else{
        unreadIcon = (
            <div className='app_postSummary__unread'>
                <FontAwesomeIcon icon={faCheck} />
            </div>
        );
    }
    return(
        <section className="app_section app_postSummary">
            {unreadIcon}
            <div className='app_postSummary__time'>{props.data.date}</div>
            <div className="app_postSummary__title">{props.data.title}</div>
            <div className='app_postSummary__reply'><FontAwesomeIcon icon={faCommentDots} /> {reply}</div>
            <div className='app_postSummary__eye'><FontAwesomeIcon icon={faEye} /> {eye}</div>
        </section>
    )
};

const PostsList = (props) => {
    const postsContent = props.post;
    if (!postsContent) {
        return (<div><Loading /><Loading /><Loading /></div>)
    }
    const postKeys = Object.keys(postsContent);
    var postJSX = []
    for (var i = postKeys.length - 1; i >= 0; i-- ){
        postJSX.push(<Link to={'/post/' + postKeys[i]} key={postKeys[i]} className='app_section__hover:hover'><PostSummary data={postsContent[postKeys[i]]} /></Link>);
    };
    return(
        <div>{postJSX}</div>
    )
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            level: {
                description: <Loading />,
                level: <Loading />,
            },
        };
        this.database = firebase.database().ref('home');
    };
    componentDidMount() {
        document.title = 'ホーム | 東京寮ウェブアプリ';
        this.database.on('value', (snapshot) => {
            this.setState(snapshot.val());
        });
    };
    componentWillUnmount() {
        this.database.off();
    };
    render() {
        return(
            <div className="app_frame__contentBox">
                <h1><FontAwesomeIcon icon={faHome} /> ホーム</h1>
                <hr />
                <h2>東京寮コロナ情報</h2>
                <CovidInfo level={this.state.level} />
                <hr />
                <h2>掲示</h2>
                <PostsList post={this.state.post} />
                <hr />
                <h2>新しい掲示を投稿</h2>
                <section className="app_section">
                    <Link to="/newpost"><Button variant="primary">新しい掲示を作成する</Button></Link>
                </section>
            </div>
        );
    };
};

export default Home;
