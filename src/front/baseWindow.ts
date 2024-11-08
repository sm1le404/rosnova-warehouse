import { Readable } from 'stream';
import {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  utilityProcess,
  autoUpdater,
  dialog,
  ipcMain,
} from 'electron';
import * as path from 'path';
import { spawn } from 'child_process';
import { isDarwin } from '../common/utility';
import { updateElectronApp, UpdateSourceType } from 'update-electron-app';
import { APP_STARTED_MESS, APP_STORE_URL } from './updater.conf';
import MessageBoxOptions = Electron.MessageBoxOptions;
import {
  envirmomentFields,
  getEnvValue,
  setEnvValue,
} from '../common/utility/environment';

export class BaseWindow {
  /**
   * Базовое окно
   * @private
   */
  private mainWindow: BrowserWindow | null;

  /**
   * Работа в трее
   * @private
   */
  private tray: Tray | null;

  /**
   * Очищаем перед выводом консольного результата, иначе лишние символы
   * @param text
   * @protected
   */
  protected static stripAnsiColors(text: string): string {
    return text.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      '',
    );
  }

  constructor(startDir: string) {
    const appName = app.getPath('exe');
    const devMode =
      appName.endsWith(`Electron`) || appName.endsWith(`electron.exe`);
    const extEnvPath = `${app.getPath('userData')}${path.sep}.env`;

    //on install process close base window
    if (require('electron-squirrel-startup')) app.quit();

    //drop second instance
    if (!app.requestSingleInstanceLock()) {
      app.quit();
    }

    // Someone tried to run a second instance, we should focus our window.
    app.on('second-instance', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.focus();
      }
    });

    app.once('ready', () => {
      this.createWindow(devMode, startDir, appName);

      ipcMain.handle('saveSettings', async (event, params: object) => {
        envirmomentFields.forEach((item) => {
          setEnvValue(extEnvPath, item.code, '');
        });

        for (const [key, value] of Object.entries(params)) {
          setEnvValue(extEnvPath, key, value);
        }
      });

      ipcMain.handle('reloadApp', async () => {
        app.relaunch();
        app.exit();
      });
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0)
        this.createWindow(devMode, startDir, appName);
    });

    app.on('window-all-closed', () => {
      if (!isDarwin()) app.quit();
    });

    try {
      updateElectronApp({
        updateSource: {
          type: UpdateSourceType.StaticStorage,
          baseUrl: `${APP_STORE_URL}/${process.platform}/${process.arch}`,
        },
        updateInterval: '30 minutes',
        notifyUser: false,
      });

      autoUpdater.on(
        'update-downloaded',
        (event, releaseNotes, releaseName) => {
          const dialogOpts: MessageBoxOptions = {
            type: 'info',
            buttons: ['Выполнить сейчас c перезапуском приложения', 'Позже'],
            title: 'Обновление приложения ROSNOVA WAREHOUSE',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail:
              'Была выпущена новая версия приложения, ' +
              'необходимо обновить его в ближайшее удобноее время',
          };

          dialog.showMessageBox(dialogOpts).then(({ response }) => {
            if (response === 0) autoUpdater.quitAndInstall();
          });
        },
      );
    } catch (e) {
      console.error(e);
    }
  }

  /**
   *
   * @param devMode
   * @param startDir
   * @param appName
   */
  createWindow(devMode: boolean, startDir: string, appName: string) {
    let productionPath: Array<string> = [
      appName,
      '..',
      '..',
      './Resources/app.asar',
      './dist/main.js',
    ];
    if (!isDarwin()) {
      productionPath = [
        appName,
        '..',
        './resources/app.asar',
        './dist/main.js',
      ];
    }

    const nestPath = !devMode ? path.join(...productionPath) : './dist/main.js';

    let nestApp: any;

    if (isDarwin()) {
      app.dock.hide(); // hide from taskbar
      nestApp = utilityProcess.fork(`${nestPath}`, [], {
        env: {
          DEV: devMode.toString(),
          USER_DATA: app.getPath('userData'),
        },
        stdio: 'pipe',
      });
    } else {
      let params = {
        ELECTRON_RUN_AS_NODE: '1',
        DEV: devMode.toString(),
        USER_DATA: app.getPath('userData'),
        ROOT: '',
        CLEAR_UPDATE_DIR: 'N',
      };
      //Если это win, мы пытаемся почистить папки со старыми версиями
      if (!devMode) {
        const rootPathDir = app.getPath('exe').split(path.sep);
        rootPathDir.pop();
        params.ROOT = path.join(...rootPathDir);
        params.CLEAR_UPDATE_DIR = 'Y';
      }

      nestApp = spawn(appName, [nestPath], {
        env: { ...params },
      });
    }

    // Create a new tray
    this.tray = new Tray(path.join(startDir, 'assets', 'faviconx32.png'));
    this.tray.on('right-click', () => {
      this.toggleWindow();
    });
    this.tray.on('double-click', () => {
      this.toggleWindow();
    });
    this.tray.on('click', () => {
      this.toggleWindow();
    });
    if (isDarwin()) this.tray.setIgnoreDoubleClickEvents(true);

    this.mainWindow = new BrowserWindow({
      autoHideMenuBar: !devMode,
      width: 800,
      height: 800,
      icon: path.join(startDir, 'assets', 'favicon.png'),
      webPreferences: {
        preload: path.join(startDir, 'preload.js'),
        allowRunningInsecureContent: true,
      },
      skipTaskbar: false,
    });

    nestApp.on('spawn', () => {
      this.mainWindow!.webContents.send(
        'server-log-entry',
        `User data path: ${app.getPath('userData')}`,
      );
      this.mainWindow!.webContents.send(
        'server-log-entry',
        `Execute path: ${app.getPath('exe')}`,
      );
    });

    if (nestApp?.stdout) {
      this.redirectOutput(nestApp.stdout as Readable, this.mainWindow);
    }

    if (nestApp?.stderr) {
      this.redirectOutput(nestApp.stderr as Readable, this.mainWindow);
    }

    this.mainWindow.on('closed', () => {
      nestApp.kill();
      this.mainWindow = null;
      app.quit();
    });

    this.mainWindow.on('focus', this.registerGlobalShortcuts);
    this.mainWindow.on('blur', this.unregisterAllShortcuts);
    this.mainWindow.on('minimize', (event) => {
      event.preventDefault();
      this.mainWindow.hide();
    });

    this.mainWindow.loadURL(`file://${startDir}/../index.html`);
  }

  /**
   *
   * @param stream
   * @param mainWindow
   * @private
   */
  private redirectOutput(stream: Readable, mainWindow: BrowserWindow) {
    stream.on('data', (data: any) => {
      if (!this.mainWindow) return;
      data
        .toString()
        .split('\n')
        .forEach((line: string) => {
          if (line !== '') {
            mainWindow!.webContents.send(
              'server-log-entry',
              BaseWindow.stripAnsiColors(line),
            );
            if (line.includes(APP_STARTED_MESS)) {
              this.mainWindow!.webContents.send('server-running');
            }
          }
        });
    });
  }

  /**
   * Горячие клавиши
   */
  registerGlobalShortcuts() {
    globalShortcut.register('CommandOrControl+F2', () => {
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send('toggleServerLog');
      }
    });

    globalShortcut.register('Shift+F4', () => {
      const extEnvPath = `${app.getPath('userData')}${path.sep}.env`;
      envirmomentFields.forEach((item) => {
        item.value = getEnvValue(extEnvPath, item.code) ?? '';
      });

      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send('toggleSettings', envirmomentFields);
      }
    });
  }

  unregisterAllShortcuts() {
    globalShortcut.unregisterAll();
  }

  getWindowPosition() {
    const windowBounds = this.mainWindow.getBounds();
    const trayBounds = this.tray.getBounds();
    // Center window horizontally below the tray icon
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
    );

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);
    return { x: x, y: y };
  }

  showWindow() {
    const position = this.getWindowPosition();
    this.mainWindow.setPosition(position.x, position.y, false);
    this.mainWindow.show();
    this.mainWindow.focus();

    if (!isDarwin()) {
      this.mainWindow.moveTop();
    }
  }

  toggleWindow() {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  }
}
