const electron = require('electron');

// アプリケーション開始時に初期表示ウィンドウを表示する
electron.app.on('ready', () => {
  // 初期表示ウィンドウ用の設定を構築する
  const main_windown_config = {
    width:  800,
    height: 600,
    webPreferences: {
      // レンダラからIPCにアクセスする
      nodeIntegration: true
    }
  };

  // 初期表示ウィンドウ用のファイルを読み込む
  let main_window = new electron.BrowserWindow(main_windown_config);
  main_window.loadFile('index.html');

  // アプリがパッケージされていないときは開発者ツールを表示する
  if (!electron.app.isPackaged) {
    main_window.webContents.openDevTools();
  }

  // // メインウィンドウが閉じられたらアプリを終了する
  // main_window.on('closed', () => {
  //   main_window = null;
  //   electron.app.quit();
  // });
});

// すべてのウィンドウが閉じられたらアプリを終了する
electron.app.on('window-all-closed', () => {
  // OSがMacの場合はOSに任せる
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});
