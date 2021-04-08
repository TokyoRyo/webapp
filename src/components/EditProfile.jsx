import React from 'react';
import { Redirect } from 'react-router';
import firebase from '../firebase-setup';
import Auth from './Auth';
import Loading from "./Loading";

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            grade: "(学年を指定してください)",
            job: "(役職を指定してください)",
        }
        this.database = firebase.database().ref('profile/' + Auth.myUid);
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveProfile = this.handleSaveProfile.bind(this);
    };
    render() {
        return(
            <div className="app_frame__contentBox">
                <h1>プロフィールの編集</h1>
                <hr />
                <h2>プロフィールの編集</h2>
                <section className="app__section">
                    <p className="app__section_subscript">プロフィールを編集して保存してください。</p>
                    <form className="form-horizontal" onSubmit={this.handleSaveProfile}>
                        <div className="mb-3">
                            <label htmlFor="editprofile_name" className="form-label">名前(フルネーム スペースなし)</label>
                            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" id="editprofile_name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="editprofile_grade" className="control-label col-xs-2">学年(寮での学年 留年等は考慮しない)</label>
                            <div className="col-xs-3">
                                <select name="grade" className="form-control" aria-label="Default select example" id="editprofile_grade" value={this.state.grade} onChange={this.handleChange}>
                                    <option value="(役職を指定してください)">(学年を指定してください)</option>
                                    <option value="1年生">1年生</option>
                                    <option value="2年生">2年生</option>
                                    <option value="3年生">3年生</option>
                                    <option value="4年生">4年生</option>
                                    <option value="院生等">院生等</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>
                        </div>     
                        <div className="form-group">
                            <label htmlFor="editprofile_job" className="control-label col-xs-2">役職</label>
                            <div className="col-xs-3">
                                <select name="job" className="form-control" aria-label="Default select example" id="editprofile_job" value={this.state.job} onChange={this.handleChange}>
                                    <option value="(役職を指定してください)">(役職を指定してください)</option>
                                    <option value="ネットワーク">ネットワーク委員</option>
                                    <option value="ネットワーク(委員長)">ネットワーク委員(委員長)</option>
                                    <option value="会計">会計委員</option>
                                    <option value="会計(委員長)">会計委員(委員長)</option>
                                    <option value="文化">文化委員</option>
                                    <option value="文化(委員長)">文化委員(委員長)</option>
                                    <option value="懲罰">懲罰委員</option>
                                    <option value="懲罰(委員長)">懲罰委員(委員長)</option>
                                    <option value="厚生">厚生委員</option>
                                    <option value="厚生(委員長)">厚生委員(委員長)</option>
                                    <option value="議長">議長</option>
                                    <option value="委員長">委員長</option>
                                    <option value="副議長">副議長</option>
                                    <option value="書記">書記</option>
                                    <option value="なし">なし</option>
                                    <option value="寮長">寮長</option>
                                    <option value="その他">その他</option>
                                    <option value="未指定/分からない">未指定/分からない</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">保存する</button>                   
                    </form>
                </section>
            </div>
        );
    };
    componentDidMount() {
        document.title = 'プロフィールの編集 | 東京寮ウェブアプリ';
        this.database.once('value', (snapshot) => {
            this.setState(snapshot.val());
        });
    };
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
        [name]: value
        });
    };
    handleSaveProfile(event) {
        event.preventDefault();
        this.database.update(this.state);
        this.props.history.push("/settings");
    };
};

export default EditProfile;
