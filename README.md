# 東京寮寮生専用Webアプリ
## このリポジトリについて
新型コロナウイルス感染症(COVID-19)感染拡大防止を目的として、寮生の活動の一部をオンラインで行うための情報と連絡手段を提供する新しいウェブアプリの公開リポジトリです。  
このサイトは、岡山県育英会東京寮寮長の許可を受けて、一部の寮生が管理・運営しています。  
運営に岡山県育英会は関与しておりません。    
バグや提案などがあれば気軽にIssueに投稿して下さい。  

## 開発に貢献する
寮生の貢献をお待ちしています。  
興味がある人は赤沢まで連絡してください。
実装できる方はPull Requestして下さい。    
以下に概要を示します。

### プラットフォーム
- Firebase
    - Authentication (すべての認証)
    - Realtime Database (すべてのデータベース)
    - Hosting (フロントエンド)
    - Functions (サーバーサイド)
    - Cloud Messaging (Web Push 通知)
- LINE Messaging API  (LINE公式アカウントでの通知)

### フロントエンド
- JavaScript
    - React (メインフレームワーク)
    - Draft.js (WYSIWYGエディタ)
- CSS (SCSS)
    - Bootstrap
    - Font Awsome

### サーバーサイド
- JavaScript (Node.js)
    - `functions.https.onCall()`
        - アカウント作成時の共通パスワード認証
        - 新しい通知の投稿と通知の送信
        - 未読数の掲示データからの更新
    - `functions.https.onRequest()`
        - LINE Messaging API とのやりとり (POST)

### 外部API
- LINE Messaging API
    - LINE公式アカウントでのメッセージ送受信

## ファイルの構造
- `webpack.*.js`の中身はほぼ同じでバンドルがdevelopモードかproductモードかの違いです。
- エントリーポイントは`/src/index.js`です。バンドルすると`/public/tokyoryo-webapp-bundle.js`と`/public/tokyoryo-webapp-bundle.css`が出力されます。
- 共通パスワード等の秘密情報は`/functions/secret.json`に保存されています。このファイルは秘密なので`.gitignore`しています。デプロイ時にはこのファイルが必要です。

## リソースの制限
プラットフォームにはGoogle Firebaseの従量制プラン(Blazeプラン)を利用しています。このプランの無料枠内で利用できるようにする必要があります。無料枠で利用できるリソースの詳細は[ここ](https://firebase.google.com/pricing)から確認できます。

## リファレンス
このアプリを開発する際に参考にしたドキュメント・記事をまとめました。
### Firebase
- [公式ドキュメント](https://firebase.google.com/docs/web/setup?authuser=0) 公式ドキュメントでおおよそのことは理解できます。
- [ReactでFirebase Authenticationを使う](https://qiita.com/zaburo/items/801bd288cec47bd28764) Firebase Authenticationの認証をReactコンポーネントに応用するサンプルです。
### React
- [公式チュートリアル: 一段ずつ学べるガイド](https://ja.reactjs.org/docs/hello-world.html) Reactの基礎については公式チュートリアルが必要かつ十分かつわかりやすいです。
- [【React】ルーティング設定方法](https://qiita.com/k-penguin-sato/items/e46725edba00013a8300) React Routerの基礎がわかります。
### Draft.js
- [30分で出来るDraft.js+React.js リッチエディタ作成入門](https://qiita.com/mottox2/items/9534f8efb4b09093a304) この記事を参考にしてWYSIWYGエディタを作成しています。Reactの知識が必須です。
### LINE Messaging API
- [FirebaseでLINE botを作ってみた](https://qiita.com/vedokoy/items/e996d7e2d5e8baa93dac) LINE Messging API と Firebase Functions とのやりとりがわかります。この記事ではExpressを利用していますが、本アプリでは`functions.https.onRequest()`を利用しています。

## 開発中/開発検討中の機能
- デザインの改善(もっと見やすく)
- Chrome 93 以降でもPWAに対応できるようにオフラインに対応&キャッシュ破棄システムの構築
- WYSIWYGエディタをよりリッチに
- 掲示にファイル添付機能をつける
- WYSIWYGエディタを利用したリアルタイム共有メモ(ver2のトピックに相当)
- 一部の大きなコンポーネントをより細かいコンポーネントに分ける
- 認証情報や名前など、コンポーネントでの管理に向かないデータをRedux等で管理

## 更新履歴
### ver3.0.1
- バグ修正
    - Firebase Cloud Messaging に非対応のブラウザで`/settings`が読み込まれないバグを修正
    - 掲示を削除した際に未読数が更新されるように修正
    - 一部スペルミスを修正
- 機能追加
    - メンバー一覧ページを追加
### ver3.0.0
- Firebaseプロジェクトの変更及びそれに伴いURLを変更
- フロントエンドを大幅刷新
    - jQueryの使用を停止(Bootstrap内依存を除く)
    - Reactを導入
    - webpack, babelの導入
    - WYSIWYGエディタにDraft.jsを導入
    - Bootstrap, Font Awsome はReact版を導入
- サーバーサイドを大幅変更
    - Exoressの使用を停止
    - Hostingは`/index.html`に集約
    - クライアントからのFunctionsの実行を`functions.https.onCall()`に変更
    - Webhookのトリガーは`functions.https.onRequest()`に変更
- Realtime Database の構想を変更
    - 階層構造をフロントエンドのコンポーネントを意識して設定