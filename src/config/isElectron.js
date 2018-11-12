let isElectron = false;

// Currently only using this to play music.
// Once that changes then we'll take out the process check.
var userAgent = navigator.userAgent.toLowerCase();
if (
  userAgent.indexOf(" electron/") > -1 ||
  process.env.NODE_ENV === "development" ||
  true
) {
  // Electron-specific code
  isElectron = true;
}

export default isElectron;
