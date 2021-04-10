import React from 'react';
import Auth from './Auth';
import firebase from '../firebase-setup';
import { Table } from 'react-bootstrap';
import Loading from './Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLine, faChrome } from '@fortawesome/free-brands-svg-icons';

const Notify = (props) => {
    if (props.show){
        return (
            <FontAwesomeIcon icon={props.icon} />
        )
    }
    return (<span></span>)
}

class Members extends React.Component {
    constructor(props) {
        super(props);
        this.state = null;
        this.database = firebase.database().ref('profile/');
    }
    componentDidMount() {
        this.database.on('value', (snapshot) => {
            this.setState(snapshot.val());
        });
    }
    componentWillUnmount() {
        this.database.off();
    };
    render() {
        if(!this.state) {
            return (
                <div className="app_frame__contentBox">
                    <h1>メンバー一覧</h1>
                    <hr />
                    <Loading />
                    <Loading />
                    <Loading />
                    <Loading />
                </div>
            );
        }
        const uidKeys = Object.keys(this.state);
        var grade1 = [];
        var grade2 = [];
        var grade3 = [];
        var grade4 = [];
        var grade5 = [];
        var grade6 = [];
        for (var i=0; i<uidKeys.length; i++) {
            var myData = this.state[uidKeys[i]];
            if (myData.grade === '1年生') {
                grade1.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
            else if (myData.grade === '2年生') {
                grade2.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
            else if (myData.grade === '3年生') {
                grade3.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
            else if (myData.grade === '4年生') {
                grade4.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
            else if (myData.grade === '院生等') {
                grade5.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
            else {
                grade6.push(
                    <tr key={uidKeys[i]}>
                        <td>{myData.name}</td>
                        <td>{myData.job}</td>
                        <td>{myData.status ? '在寮' : '帰省'}</td>
                        <td>
                            <Notify show={myData.line} icon={faLine} /> <Notify show={myData.webpush} icon={faChrome} />
                        </td>
                    </tr>
                )
            }
        };
        return (
            <div className="app_frame__contentBox">
                <h1>メンバー一覧</h1>
                <hr />
                <h2>1年生</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade1}
                            </tbody>
                        </Table>
                    </div>
                </section>
                <hr />
                <h2>2年生</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade2}
                            </tbody>
                        </Table>
                    </div>
                </section>
                <hr />
                <h2>3年生</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade3}
                            </tbody>
                        </Table>
                    </div>
                </section>
                <hr />
                <h2>4年生</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade4}
                            </tbody>
                        </Table>
                    </div>
                </section>
                <hr />
                <h2>院生等</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade5}
                            </tbody>
                        </Table>
                    </div>
                </section>
                <hr />
                <h2>その他・未指定</h2>
                <section className="app_section" className="app_section">
                    <div className="app_section__overfllowX">
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                <th>名前</th>
                                <th>ステータス</th>
                                <th>役職</th>
                                <th>通知</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade6}
                            </tbody>
                        </Table>
                    </div>
                </section>
            </div>
        );
    }
}

export default Members;
