const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

function onReady() {
  win = new BrowserWindow({ width: 900, height: 6700 });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/consultent-portal/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
}

if (require("electron-squirrel-startup")) app.quit();

app.on("ready", onReady);
