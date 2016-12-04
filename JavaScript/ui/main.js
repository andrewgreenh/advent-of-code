const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 1500, height: 600 });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.webContents.openDevTools();
}
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());
