import React from 'react';
import Lodaing from './Loading';
import firebase from '../firebase-setup';
import Html2Jsx from './Html2Jsx';
import Auth from './Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faMinusCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Alert } from 'react-bootstrap';
import './post.scss';
import WYSIWYGEditor from './WYSIWYGEditor';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const Name = (props) => {
    if (!props.name) {
        return (<span></span>);
    };
    if (!props.name[props.uid].name) {
        if (block) {
            return (<span className='app_post__readCheckName'>アカウント削除済み</span>)
        };
        return (<span>アカウント削除済み</span>)
    }
    if (props.block) {
        return (<span className='app_post__readCheckName'>{props.name[props.uid].name}</span>)
    };
    return (<span>{props.name[props.uid].name}</span>)
};

const ReadButton = (props) => {
    if(!props.show) {
        return (<div></div>);
    }
    return (
        <section className="app_section">
            <Button variant="success" onClick={props.handle}><FontAwesomeIcon icon={faCheck} /> 確認しました</Button>
        </section>
    );
};

class DeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {check: false};
    };
    render() {
        if (!this.props.show) {
            return (<div></div>);
        }
        if (this.state.check) {
            return (
                <section className="app_section">
                    <Alert variant="warning">
                        <FontAwesomeIcon icon={faExclamationCircle} />
                        本当に削除しますか？
                    </Alert>
                    <Button variant="outline-success" onClick={() => {this.setState({check: false})}}><FontAwesomeIcon icon={faMinusCircle} /> キャンセル</Button>
                    <Button variant="outline-danger" onClick={this.props.handleDelete}><FontAwesomeIcon icon={faTrash} /> 削除</Button>
                </section>
            );
        };
        return (
            <section className="app_section">
                <Button variant="outline-danger" onClick={() => {this.setState({check: true})}}><FontAwesomeIcon icon={faTrash} /> 削除</Button>
            </section>
        );
    }
};

const ReadList = (props) => {
    if (props.readList.length === 0 && props.unreadList.length === 0) {
        return (<div></div>)
    };
    return (
        <div>
            <hr />
            <h2>既読確認</h2>
            <section className="app_section">
                <h3>確認済み</h3>
                <div>{props.readList}</div>
                <h3>未確認</h3>
                <div>{props.unreadList}</div>
            </section>
        </div>
    );
};

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            replyContent: EditorState.createEmpty(),
        }
        this.databasePost = firebase.database().ref('home/post/' + this.props.match.params.id);
        this.databaseName = firebase.database().ref('profile');
        this.handleReadButton = this.handleReadButton.bind(this);
        this.handleContent = this.handleContent.bind(this);
        this.postReply = this.postReply.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    };
    componentDidMount() {
        this.databasePost.on('value', (snapshot) => {
            this.setState({post: snapshot.val()});
            if (this.state.post.title) {
                document.title = this.state.post.title + ' | 東京寮ウェブアプリ';
            }else{
                document.title = '掲示 | 東京寮ウェブアプリ';
            };
        });
        this.databaseName.on('value', (snapshot) => {
            this.setState({name: snapshot.val()});
        });
    };
    componentWillUnmount() {
        this.databasePost.off();
        this.databaseName.off();
    }
    render(){
        if (!this.state.post) {
            return(
                <div className="app_frame__contentBox">
                <h1>掲示</h1>
                <hr />
                <Lodaing /><Lodaing /><Lodaing /><Lodaing /><Lodaing /><Lodaing />
            </div>
            )
        }
        var readList = [];
        var unreadList = [];
        var unread = false;
        var replyList = [];
        if (this.state.post.unread) {
            const checkKeys = Object.keys(this.state.post.unread)
            const checkAll = checkKeys.length;
            var checked = 0;
            for (var i = 0; i < checkAll; i++) {
                if (this.state.post.unread[checkKeys[i]] === 'unread' && checkKeys[i] === Auth.myUid) {unread = true};
                if (this.state.post.unread[checkKeys[i]] === 'read') {
                    readList.push(<Name block uid={checkKeys[i]} key={checkKeys[i]}  name={this.state.name} />);
                }else{
                    unreadList.push(<Name block uid={checkKeys[i]} key={checkKeys[i]}  name={this.state.name} />);
                }
            };
        }
        if (this.state.post.reply) {
            const replyKeys = Object.keys(this.state.post.reply);
            for (var i = 0; i < replyKeys.length; i++){
                replyList.push(
                    <section className="app_section" key={replyKeys[i]}>
                        <h3><Name uid={this.state.post.reply[replyKeys[i]].author} name={this.state.name} /></h3>
                        <Html2Jsx html={this.state.post.reply[replyKeys[i]].html} />
                    </section>
                )
            }
        }
        return(
            <div className="app_frame__contentBox">
                <h1>掲示</h1>
                <hr />
                <h2>{this.state.post.title} - {this.state.post.date}</h2>
                <section className="app_section">
                    <h3><Name uid={this.state.post.author} name={this.state.name} />が投稿</h3>
                    <Html2Jsx html={this.state.post.html} />
                </section>
                <ReadButton show={unread} handle={this.handleReadButton} />
                <DeleteButton show={this.state.post.author === Auth.myUid} handleDelete={this.handleDelete} />
                <hr />
                <h2>返信</h2>
                <section className="app_section">
                    <WYSIWYGEditor content={this.state.replyContent} handleContent={this.handleContent} />
                    <Button variant="primary" onClick={this.postReply}>返信</Button>
                </section>
                {replyList}
                <ReadList readList={readList} unreadList={unreadList} />
            </div>
        )
    };
    handleReadButton() {
        firebase.database().ref('home/post/' + this.props.match.params.id + '/unread').update({[Auth.myUid]: 'read'});
        firebase.database().ref('rootInfo/unread/' + Auth.myUid).update({[this.props.match.params.id]: null});
    };
    handleContent(content) {
        this.setState({
            replyContent: content,
        })
    };
    handleDelete() {
        this.setState({check: false});
        this.databasePost.remove();
        this.props.history.push("/");
    }
    postReply() {
        const currentContent = this.state.replyContent.getCurrentContent();
        const html = stateToHTML(currentContent);
        if (html === stateToHTML(EditorState.createEmpty().getCurrentContent())) {
            return false;
        };
        this.setState({replyContent: EditorState.createEmpty()})
        const newReply = this.databasePost.child('reply').push();
        newReply.set({
            author: Auth.myUid,
            html: html
        });
    };
}

export default Post;
