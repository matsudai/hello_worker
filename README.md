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

### yarnのインストール

[※本来は直接yarnをインストールすべき](https://legacy.yarnpkg.com/ja/docs/install#windows-stable)だが、環境変数を汚染されたくないためnpm経由でインストールする。

```
> npm install -g yarn
```

## やったこと

### ESLint

文法が不安なので導入する。

```
> yarn add eslint
```

下記コマンドはVSCode -> ctrl+p -> ESLint: Create ESLint configuration で実行できる。

```
> node_modules\.bin\eslint.cmd --init

? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? Vue.js
? Does your project use TypeScript? Yes
? Where does your code run? Browser, Node
? How would you like to define a style for your project? Answer questions about your style
? What format do you want your config file to be in? JSON
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? Yes
```

VueやTypescriptなどの設定をコメントアウトする。（今は使わないため）

VSCodeの場合、デフォルトのターミナルがNODE_PATHを拾えるよう、.vscode/settings.jsonに下記を追記する。

```json:.vscode/settings.json
{
  "terminal.integrated.shell.windows": "<プロジェクトまでの絶対パス>/cmd.bat"
}
```

### electronインストール

```
> yarn add electron
```

[チュートリアルページ](https://www.electronjs.org/docs/tutorial/first-app)に従いアプリを作る。

以下で起動する。

```
> yarn start
```

### ファイル（CSV）を取り込む

```
> yarn add csv-parse
```
### NeDBをインストールする

```
> yarn add nedb
```

日付のパース用にMoment.jsを利用する。

```
> yarn add moment
```

### バイナリへパッケージングする

package.jsonのelectronとかeslintとかをdevDependenciesに置く。

packagerだとignoreファイルの扱いに困るのでbuilderでexportする。

```
yarn add electron-builder --dev
```

```
> node electron-builder\win.js
```

## やりたいこと

- [x] Electron
- [x] ファイルを取り込む
- [x] ファイルを取り込んでDBにぶち込む
- [ ] DBのデータを集計して表示する
- [ ] VueとかReactとか使う
- [ ] グラフを表示する
- [ ] Typescript使いたい
- [ ] webpackでいい感じにしたい
- [ ] なんかのサーバと通信したい
