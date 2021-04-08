import firebase from './firebase-setup';
export const init = () => {

    // firebaseアプリの初期化
    const firebaseConfig = {
        apiKey: "AIzaSyDigKfD53FVscLs1v8n2PnSGeXg4woATC4",
        authDomain: "tokyo-ryo.firebaseapp.com",
        databaseURL: "https://tokyo-ryo-default-rtdb.firebaseio.com",
        projectId: "tokyo-ryo",
        storageBucket: "tokyo-ryo.appspot.com",
        messagingSenderId: "758304906265",
        appId: "1:758304906265:web:4298c93dbbde17f5ce1e88"
    };
    firebase.initializeApp(firebaseConfig);

    // functionsをlocalhostで実行するとき(テスト時)
    //firebase.functions().useEmulator("localhost", 5001);

    // vhをCSSの100vhではなくJavaScriptで取得したサイズにする
    window.onresize = () => {
        document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
    };
    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');

    // console.log() に宣伝を表示
    console.log('%cこのアプリに興味がありますか？', 'font-weight: bold; color: #ff4444; font-size: 20px; font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;', '');
    console.log('%cぜひ一緒に開発しましょう！', 'color: #0064d3; font-size: 15px; font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;', '')
    console.log('https://github.com/TokyoRyo/webapp')

    //サービスワーカー
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                registration.onupdatefound = function() {
                    registration.update();
                  }
            }
            );
    };
};
