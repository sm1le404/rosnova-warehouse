import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getExpressAppUrl: () => ipcRenderer.invoke('get-express-app-url'),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
});

contextBridge.exposeInMainWorld('electronAPI', {
  saveSettings: (param) => ipcRenderer.invoke('saveSettings', param),
  reloadApp: () => ipcRenderer.invoke('reloadApp'),
});
