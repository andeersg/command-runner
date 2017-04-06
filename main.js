'use strict';

const electron = require('electron');
const Config = require('electron-config');
const isDev = require('electron-is-dev');
const log = require('electron-log');

const config = new Config({
	defaults: {
		zoomFactor: 1,
		lastWindowState: {
			width: 800,
			height: 600
		},
		alwaysOnTop: false,
		bounceDockOnMessage: false
	}
});

const {app, ipcMain} = electron;

let mainWindow;
let isQuitting = false;

const isAlreadyRunning = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

if (isAlreadyRunning) {
	app.quit();
}

function createMainWindow() {
	const lastWindowState = config.get('lastWindowState');

	const win = new electron.BrowserWindow({
		title: app.getName(),
		show: false,
		x: lastWindowState.x,
		y: lastWindowState.y,
		width: lastWindowState.width,
		height: lastWindowState.height,
		icon: process.platform === 'linux' && path.join(__dirname, 'static/Icon.png'),
		minWidth: 400,
		minHeight: 200,
		titleBarStyle: 'hidden-inset',
		autoHideMenuBar: true,
		transparent: true
	});

	if (process.platform === 'darwin') {
		win.setSheetOffset(40);
	}

	win.loadURL('file://'+__dirname+'/app/index.html');

	win.on('close', e => {
		if (!isQuitting) {
			e.preventDefault();

			if (process.platform === 'darwin') {
				app.hide();
			} else {
				win.hide();
			}
		}
	});

	return win;
}

if (!isDev && process.platform !== 'linux') {
	//autoUpdater.logger = log;
	//autoUpdater.logger.transports.file.level = 'info';
	//autoUpdater.checkForUpdates();
}

app.on('ready', () => {
	//electron.Menu.setApplicationMenu(appMenu);
	mainWindow = createMainWindow();
	//tray.create(mainWindow);

	mainWindow.show();
});

app.on('activate', () => {
	mainWindow.show();
});

app.on('before-quit', () => {
	isQuitting = true;

	if (!mainWindow.isFullScreen()) {
		config.set('lastWindowState', mainWindow.getBounds());
	}
});