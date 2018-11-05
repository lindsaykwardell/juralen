let isElectron = false;

var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
  // Electron-specific code
  isElectron = true;
}

export default isElectron;