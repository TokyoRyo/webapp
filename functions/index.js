const functions = require("firebase-functions");
const admin = require("firebase-admin");
const line = require("@line/bot-sdk");
const secret = require("./secret.json");
const firebaseConfig = {
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://tokyo-ryo-default-rtdb.firebaseio.com",
};
const lineConfig = {
  channelSecret: secret.lineChannelSecret,
  channelAccessToken: secret.lineChannelAccessToken,
};

admin.initializeApp(firebaseConfig);
const database = admin.database();

exports.confirmCommonPassowrd = functions
    .https.onCall((req, res) => {
      if (req.commonPassword === secret.commonPassword) {
        return {result: true};
      }
      return {
        result: false,
      };
    });

exports.newPost = functions
    .https.onCall((req, res) => {
        database.ref("/").once("value").then((snapshot) => {
            const databaseData = snapshot.val();
            const check = req.postData.notify;
            var checkListTokyo = [];
            var checkListOkayama = [];
            if (check.grade1Tokyo) {checkListTokyo.push("1年生")};
            if (check.grade1Okayama) {checkListOkayama.push("1年生")};
            if (check.grade2Tokyo) {checkListTokyo.push("2年生")};
            if (check.grade2Okayama) {checkListOkayama.push("2年生")};
            if (check.grade3Tokyo) {checkListTokyo.push("3年生")};
            if (check.grade3Okayama) {checkListOkayama.push("3年生")};
            if (check.grade4Tokyo) {checkListTokyo.push("4年生")};
            if (check.grade4Okayama) {checkListOkayama.push("4年生")};
            if (check.grade5Tokyo) {checkListTokyo.push("院生等")};
            if (check.grade5Okayama) {checkListOkayama.push("院生等")};
            var notifyLineList = [];
            var notifyFCMList = [];
            var uidList = {};
            var unreadList = databaseData.rootInfo.unread ? databaseData.rootInfo.unread : {};
            const profile = databaseData.profile;
            const uids = Object.keys(profile);
            const newPost = database.ref("home/post").push();
            const newPostKey = newPost.key;
            for (var i = 0; i < uids.length; i++) {
                if (
                    (
                        ((profile[uids[i]].status) && (checkListTokyo.indexOf(profile[uids[i]].grade) >= 0)) ||
                        ((!profile[uids[i]].status) && (checkListOkayama.indexOf(profile[uids[i]].grade) >= 0))
                    ) && (req.postData.author !== uids[i])
                ){
                    uidList[uids[i]] = "unread";
                    unreadList[uids[i]] ? unreadList[uids[i]][newPostKey] = true : unreadList[uids[i]] = {[newPostKey]: true};
                    if (profile[uids[i]].line) {
                        notifyLineList.push(profile[uids[i]].line);
                    };
                    if (profile[uids[i]].webpush) {
                        Array.prototype.push.apply(notifyFCMList, Object.keys(profile[uids[i]].webpush));
                    };
                };
            };
            var postData = req.postData;
            delete postData.notify;
            postData.unread = uidList;
            newPost.set(postData);
            database.ref("rootInfo/unread").set(unreadList);
            if (notifyLineList.length > 0) {
                const client = new line.Client(lineConfig);
                client.multicast(notifyLineList, [{
                    "type": "template",
                    "altText": "【新しい掲示】" + postData.title,
                    "template": {
                        "type": "buttons",
                        "title": postData.title.substring(0,40),
                        "text": "新しい掲示が投稿されました。\n東京寮ウェブアプリで確認し、[確認しました]ボタンを押してください。",
                        "actions": [
                            {
                              "type": "uri",
                              "label": "アプリを開く",
                              "uri": "https://tokyo-ryo.web.app/"
                            }
                        ]
                    }
                  }]);
            };
            if (notifyFCMList.length > 0) {
                admin.messaging().sendMulticast({
                    tokens: notifyFCMList,
                    data: {
                        title: postData.title,
                        content: "新しい掲示が投稿されました。\n東京寮ウェブアプリで確認し、[確認しました]ボタンを押してください。",
                    },
                });
            };
            return {
                result: true,
                key: newPostKey,
              };
        });
      return {
        result: false,
      };
    });

exports.webhook = functions.https.onRequest((req, res) => {
    Promise
      .all(req.body.events.map(handleResigterToken))
      .then((result) => res.json(result))
      .catch((result) => console.log('error!!!'));
    
});

async function handleResigterToken(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    };
    if (event.message.text.substring(0,4) !== "UID:") {
        return Promise.resolve(null);
    };
    database.ref("profile/" + event.message.text.substring(4)).update({line: event.source.userId}).then(
        () => {
            const client = new line.Client(lineConfig);
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "登録しました！",
            });
        }
    );
};