console.log('Node : '+process.version);
console.log('Chomium : '+process.versions['chrome']);
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const ipc = require('electron').ipcMain
const apk_parser = require('node-apk-parser-promise');
const AppInfoParser = require('app-info-parser')
const Apk = require('node-apk');
const sshpk = require('sshpk');

let win;

function createWindow() {


 
  win = new BrowserWindow({ 
    width: 800, 
    height: 600 , 
    frame: false,
    title: 'APK Analyzer',
    webPreferences: { webSecurity: false }
    
  });
  initIPC();   

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/cli/index.html`),
      protocol: "file:",
      slashes: true
    })
    
  );

  win.openDevTools();
  


  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow(); 
  }
});

/*********************************************************************
****************************   IPC   *********************************
***********************************************************************/
function initIPC(){
  IPC_LoadApk();
}

function IPC_LoadApk(){
  ipc.on('load-apk', function (event, json_String) {
    let json = JSON.parse(json_String);
    
    /*
    let reader;
    let info = {};


    apk_parser
    .load(json.fileName)
    .then((r) => {
      reader = r;
      return reader.readManifest();
    })
    .then((manifest) => {
      info.manifest = manifest;
      return reader.readCertificate();
    })
    .then((certInfo) => {
      info.certInfo = certInfo;
    })
    .catch((err) => {
      console.error("ERROR: " + err);
    })
    .finally(() => {
      reader && reader.close();

      win.webContents.send('load-apk', JSON.stringify(info));

    });

    */

    /*

    const parser = new AppInfoParser(json.fileName)
    parser.parse().then(result => {
      win.webContents.send('load-apk', JSON.stringify({
        manifest: result}
      ));
    }).catch(err => {
      console.log('err ----> ', err)
      win.webContents.send('load-apk', JSON.stringify({error:err}));
    })

    */

    const apk = new Apk.Apk(json.fileName);    

    
    Promise.all([apk.getManifestInfo(), apk.getResources(), apk.getCertificateInfo()]).then(([manifest, resources, certs]) => {
      let res = {
        manifest : manifest,
        certs : {list : []},
        resources : {}
      };


      certs.forEach((c,i) => {
        let pem = '-----BEGIN CERTIFICATE-----\n'+c.bytes.toString('base64')+'\n-----END CERTIFICATE-----';
        let cert = sshpk.Certificate.parse(pem, 'pem')
        cert.pemEncoded = pem;
        res.certs.list.push(cert);
      });
      





      let label = manifest.applicationLabel;
      if (typeof label !== "string") {
          const all = resources.resolve(label);
          res.manifest.labels = all;  
      }

      let iconFile = resources.resolve(manifest.applicationIcon).filter(r => r.value.endsWith('.png'))[0].value;
      apk.extract(iconFile).then(icon => {
        res.resources.applicationIcon = {file: iconFile, data: icon.toString('base64')};
        win.webContents.send('load-apk', JSON.stringify(res));

        apk.close();

      });
      
    

    

      
    }).catch(err => {
      console.log('err ----> ', err)
      win.webContents.send('load-apk', JSON.stringify({error:err}));
    });







    
  }) 
}
