const serverLog = document.getElementById('serverLog');
const loading = document.getElementById('loading');
const logo = document.getElementById('logo');

(async () => {
  // @ts-expect-error
  ipcRenderer.on('server-running', () => {
    loading!.style.display = 'none';
    logo!.style.display = 'flex';
  });

  // @ts-expect-error
  ipcRenderer.on('server-log-entry', (_event, data) => {
    let infoSpan = document.createElement('span');
    infoSpan.textContent = data;
    serverLog!.append(infoSpan);
    serverLog!.append(document.createElement('br'));
  });

  // @ts-expect-error
  ipcRenderer.on('show-server-log', () => {
    if (serverLog.style.display === 'none' || serverLog.style.display === '') {
      serverLog.style.display = 'block';
      logo!.style.display = 'none';
    } else {
      logo!.style.display = 'flex';
      serverLog.style.display = 'none';
    }
  });
})();
