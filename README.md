# kintai bi app

## 環境構築

### Node.jsのダウンロード（バイナリ）

- [Node.js公式](https://nodejs.org/ja/)の[ダウンロード](https://nodejs.org/ja/download/)からの[node-v-12.14.1-win-x64](https://nodejs.org/dist/v12.14.1/node-v12.14.1-win-x64.zip)のダウンロード
- ./node-v12.14.1-win-x64 以下への展開
  ```text
  ./node-v12.14.1-win-x64
  　┣ .keep   // exists
  　┣ <code>npm.exe // new!
  　┗ ...
  ```

## cmd.batの作成

- ./cmd.batを参照
- node系コマンドを使うときは下記を実行して開いたコマンドプロンプトを利用する
  ```cmd
  > cmd.bat
  ```

### yarnのインストール

(※本来は直接yarnをインストールすべき)[https://legacy.yarnpkg.com/ja/docs/install#windows-stable]だが、環境変数を汚染されたくないためnpm経由でインストールする。

```cmd
> npm install -g yarn
```

## やりたいこと

- [ ] Electron
- [ ] ファイルを取り込む
- [ ] ファイルを取り込んでDBにぶち込む
- [ ] DBのデータを集計して表示する
- [ ] VueとかReactとか使う
- [ ] グラフを表示する
- [ ] Typescript使いたい
- [ ] webpackでいい感じにしたい
- [ ] なんかのサーバと通信したい
