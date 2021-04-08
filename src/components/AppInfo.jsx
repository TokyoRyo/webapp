import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

class AppInfo extends React.Component {
    render() {
        return(
            <div>
                <h2>バグ報告</h2>
                <section className="app_section">
                <p className="app_section_subscript">
                    バグを発見されたらぜひ報告してください。<br />
                    下のボタンからGoogleフォームで報告できます。<br />
                    または赤沢まで直接連絡するか、GithubのIssueやPull Requestでもかまいません。
                </p>
                <div><a href="https://docs.google.com/forms/d/e/1FAIpQLSfJMj95JDsvEZBJQrqXhKJCtT5XwrVgmb7a8_WUcPkmYt7pSQ/viewform" target="blank"><button type="button" className="btn btn-primary">バグを報告する</button></a></div>
                </section>
                <hr />
                <h2>アプリの情報</h2>
                <section className="app_section">
                <p className="app_section_subscript">
                    東京寮ウェブアプリ<br />
                    https://tokyo-ryo.web.app/<br />
                    バージョン：3.0.0<br />
                    一緒にこのアプリを開発しませんか？興味があれば赤沢まで！
                </p>
                <div><a href="https://github.com/TokyoRyo/webapp" target="blank"><button type="button" className="btn btn-dark"><FontAwesomeIcon icon={faGithub} />　Githubで見る</button></a></div>
            </section>
            </div>
        );
    };
};

export default AppInfo;
