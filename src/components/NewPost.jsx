import React from 'react';
import firebase from '../firebase-setup';
import Auth from './Auth';
import Loading from "./Loading";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faExclamationCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import WYSIWYGEditor from './WYSIWYGEditor';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { FormCheck, Button, Spinner, Alert } from 'react-bootstrap'

const TitleBadge = (props) => {
    if (props.title === '') {
        return (
            <div><span className="badge rounded-pill bg-danger">タイトルは必須です</span></div>
        );
    }
    return (<span></span>);
};

class NotifyCheck extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return(
            <td>
                <FormCheck label="通知" id={this.props.name} name={this.props.name} type="checkbox" checked={this.props.check === true} onChange={this.props.handleChange} />
            </td>
        );
    }
};

class SendPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            check: false,
        }
        this.postNotify = this.postNotify.bind(this);
    }
    postNotify() {
        this.setState({check: false});
        this.props.handlePost();
    }
    render() {
        if (this.props.proceeding) {
            return(<Button variant="success" disabled><Spinner as="span" size="sm" animation="border" /> 掲示を投稿しています...</Button>);
        }
        if (this.props.complete) {
            return(<Button variant="primary" disabled>タイトルを確認してください</Button>)
        }
        if (this.state.check){
            return(<div>
                <Alert variant="warning">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    掲示を送信しますか？
                </Alert>
                <Button variant="outline-danger" onClick={() => {this.setState({check: false})}}><FontAwesomeIcon icon={faMinusCircle} /> 中止して戻る</Button>
                <Button variant="primary" onClick={this.postNotify}><FontAwesomeIcon icon={faPaperPlane} /> 掲示を投稿</Button>
            </div>)
        }
        return(
            <Button variant="primary" onClick={() => {this.setState({check: true})}}><FontAwesomeIcon icon={faPaperPlane} /> 掲示を投稿</Button>
        );
    }
}

class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            proceeding: false,
            content: EditorState.createEmpty(),
            html: '',
            title: '',
            check: {
                grade1Tokyo: false,
                grade1Okayama: false,
                grade2Tokyo: false,
                grade2Okayama: false,
                grade3Tokyo: false,
                grade3Okayama: false,
                grade4Tokyo: false,
                grade4Okayama: false,
                grade5Tokyo: false,
                grade5Okayama: false,
            },
        }
        this.database = firebase.database().ref('/');
        this.handleContent = this.handleContent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNotify = this.handleNotify.bind(this);
        this.postNotify = this.postNotify.bind(this);
    };
    handleContent(content) {
        this.setState({
            content: content,
        })
    }
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
        [name]: value
        });
    };
    handleNotify(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var tmpState = this.state.check;
        tmpState[name] = value;
        this.setState({check: tmpState});
    };
    postNotify() {
        this.setState({proceeding: true})
        const currentContent = this.state.content.getCurrentContent()
        const date = new Date();
        const dateString = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
        var postData = {
            title: this.state.title,
            html: stateToHTML(currentContent),
            author: Auth.myUid,
            notify: this.state.check,
            date: dateString,
        }
        firebase.functions().httpsCallable('newPost')({postData: postData})
            .then((res) => {
                this.props.history.push("/");
            });
    }
    render() {
        return(
            <div className="app_frame__contentBox">
                <h1>新しい掲示の投稿</h1>
                <hr />
                <h2>掲示のタイトル</h2>
                <section className="app_section">
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange} className="form-control" id="editprofile_name" />
                    <TitleBadge title={this.state.title} />
                </section>
                <hr />
                <h2>掲示の本文</h2>
                <section className="app_section">
                    <WYSIWYGEditor content={this.state.content} handleContent={this.handleContent} />
                </section>
                <hr />
                <h2>通知の設定</h2>
                <section className="app_section">
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">学年</th>
                            <th scope="col">在寮</th>
                            <th scope="col">帰省</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1年生</th>
                                <NotifyCheck name="grade1Tokyo" check={this.state.check.grade1Tokyo} handleChange={this.handleNotify} />
                                <NotifyCheck name="grade1Okayama" check={this.state.check.grade1Okayama} handleChange={this.handleNotify} />
                            </tr>
                            <tr>
                                <th scope="row">2年生</th>
                                <NotifyCheck name="grade2Tokyo" check={this.state.check.grade2Tokyo} handleChange={this.handleNotify} />
                                <NotifyCheck name="grade2Okayama" check={this.state.check.grade2Okayama} handleChange={this.handleNotify} />
                            </tr>
                            <tr>
                                <th scope="row">3年生</th>
                                <NotifyCheck name="grade3Tokyo" check={this.state.check.grade3Tokyo} handleChange={this.handleNotify} />
                                <NotifyCheck name="grade3Okayama" check={this.state.check.grade3Okayama} handleChange={this.handleNotify} />
                            </tr>
                            <tr>
                                <th scope="row">4年生</th>
                                <NotifyCheck name="grade4Tokyo" check={this.state.check.grade4Tokyo} handleChange={this.handleNotify} />
                                <NotifyCheck name="grade4Okayama" check={this.state.check.grade4Okayama} handleChange={this.handleNotify} />
                            </tr>
                            <tr>
                                <th scope="row">院生等</th>
                                <NotifyCheck name="grade5Tokyo" check={this.state.check.grade5Tokyo} handleChange={this.handleNotify} />
                                <NotifyCheck name="grade5Okayama" check={this.state.check.grade5Okayama} handleChange={this.handleNotify} />
                            </tr>
                        </tbody>
                    </table>
                </section>
                <hr />
                <section className="app_section">
                    <SendPost handlePost={this.postNotify} proceeding={this.state.proceeding} complete={this.state.title === ''} />
                </section>
            </div>
        );
    };
    componentDidMount() {
        document.title = '新しい掲示の投稿 | 東京寮ウェブアプリ';
    };
};

export default NewPost;
