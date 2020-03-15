# kintai bi app

## 環境

- Windows 10
- VSCode

## 環境構築

### Node.jsのダウンロード（バイナリ）

- [Node.js公式](https://nodejs.org/ja/)の[ダウンロード](https://nodejs.org/ja/download/)から[node-v-12.14.1-win-x64](https://nodejs.org/dist/v12.14.1/node-v12.14.1-win-x64.zip)をダウンロードする
- ./node-v12.14.1-win-x64 以下へ展開する
  ```
  ./node-v12.14.1-win-x64
  　┣ .keep   // exists
  　┣ <code>npm.exe // new!
  　┗ ...
  ```

## cmd.batの作成

- ./cmd.batを参照
- node系コマンドを使うときは下記を実行して開いたコマンドプロンプトを利用する
  ```
  > cmd.bat
  ```

## やりたいこと

- [x] ファイルを取り込む
- [ ] 表示
  - [ ] 取り込むファイルのプレビュー
  - [ ] カラムのマッピング
  - [ ] LocalStorageかなんかにマッピング情報を記録する
  - [ ] 集計
    - [ ] 社員・案件・週ごとの合計作業時間
    - [ ] 社員・案件・月ごとの合計作業時間
- [ ] ESLint
- [ ] WIP: VueとかReactとか使う
- [ ] グラフを表示する
- [ ] Typescript使いたい
- [x] webpackでいい感じにしたい
- [ ] なんかのサーバと通信したい
