// @ts-nocheck
const serverLog = document.getElementById('serverLog');
const loading = document.getElementById('loading');
const logo = document.getElementById('logo');
const settings = document.getElementById('settings');
const formData = document.getElementById('formData');
const reload = document.getElementById('reload');

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
  ipcRenderer.on('toggleServerLog', () => {
    if (serverLog.style.display === 'none' || serverLog.style.display === '') {
      serverLog.style.display = 'block';
      logo.style.display = 'none';
    } else {
      logo.style.display = 'flex';
      serverLog.style.display = 'none';
    }
  });

  // @ts-expect-error
  ipcRenderer.on('toggleSettings', (_event, data) => {
    formData.innerHTML = '';
    if (settings.style.display === 'none' || settings.style.display === '') {
      data.forEach((item) => {
        let input;
        let div = document.createElement('div');
        let label = document.createElement('label');
        label.textContent = item.name;
        if (item.type === 'select') {
          input = document.createElement('select');
          input.setAttribute('name', item.code);
          if (item?.options && Array.isArray(item.options)) {
            item.options.forEach((option) => {
              let optionInput = document.createElement('option');
              optionInput.textContent = option.text;
              optionInput.setAttribute('value', option.value);
              if (option.value === item.value) {
                optionInput.setAttribute('selected', 'selected');
              }
              input.appendChild(optionInput);
            });
          }
        } else {
          input = document.createElement('input');
          input.setAttribute('type', item.type);
          input.setAttribute('value', item.value);
          input.setAttribute('name', item.code);
          if (item.type === 'checkbox') {
            if (item.value === '1') {
              input.setAttribute('checked', 'checked');
            }
            input.setAttribute('value', '1');
          }
        }
        div!.append(label);
        div!.append(input);
        formData!.append(div);
      });
      settings.style.display = 'block';
      logo.style.display = 'none';
    } else {
      logo.style.display = 'flex';
      settings.style.display = 'none';
    }
  });

  settings.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(settings);
    let data = {};
    form.forEach((value, key) => {
      if (typeof value === 'string' && value.length > 0) data[key] = value;
    });
    // @ts-expect-error
    window!.electronAPI.saveSettings(data);
  });

  reload.addEventListener('click', (e) => {
    e.preventDefault();
    // @ts-expect-error
    window!.electronAPI.reloadApp();
  });
})();
