'use strict';

const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const os = require('os');
const {dialog} = require('electron');

const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { net } = require('electron');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const client = dgram.createSocket('udp4');
var HOST = require("ip").address();
var num = 0;
var info = [];
var flg=0;

function createWindow () {
// Create the browser window.
const win = new BrowserWindow({
	width: 800,
	height: 600,
	webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
	}
})

// Load the index.html of the app.
win.loadFile('index.html')

// Open the DevTools.
win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
// On macOS it is common for applications and their menu bar
// To stay active until the user quits explicitly with Cmd + Q
if (process.platform !== 'darwin') {
	app.quit()
}
})

app.on('activate', () => {
// On macOS it's common to re-create a window in the
// app when the dock icon is clicked and there are no
// other windows open.
if (BrowserWindow.getAllWindows().length === 0) {
	createWindow()
}
})

// In this file, you can include the rest of your
// app's specific main process code. You can also
// put them in separate files and require them here.


ipc.on('uploadfw', (event, arg) =>  {   
      
  const boundaryKey = '----WebKitFormBoundaryWdFFCdVh1ngt8UKf';
  const user = 'admin';
  const pw = '12345678';
  const host = arg;
  const cgi = '/cgi-bin/upload.cgi';   
  const form = new FormData();
  form.append('filename', fs.createReadStream('./root_uImage'));

  let request = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: host,
    path: cgi
  });
  request.setHeader("Content-Type",'multipart/form-data; boundary=' + boundaryKey);
  request.setHeader("Connection","keep-alive");

  request.on('login', (authInfo, callback) => {
      callback(user, pw);
    })

  request.on('response', (response) => {
  console.log(`STATUS: ${response.statusCode}`);
  dialog.showMessageBox({
    title: 'MessageBox',
    message: 'Upgrade firmware OK',
  });
  console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
  response.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  })
  response.on('error', (error) => {
      console.log(`ERROR: ${JSON.stringify(error)}`);
   })
  })
  
  form.pipe(request, { end: false });
  form.on('end', function () {
      console.log("end");  
      request.end('\r\n--' + boundaryKey + '--\r\n');        
  });
    
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
 
server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});


server.bind(9999, HOST,function () {
 server.setBroadcast(true);
 
 });

ipc.on('UDPGO', (event, arg) =>  {   

  const client = dgram.createSocket('udp4');
  client.on('close',()=>{
    console.log('client.socket已關閉');
  });
  
  client.on('error',(err)=>{
    console.log(err);
    client.close();
  });
  
  client.bind(42324,HOST,function () {
    client.setBroadcast(true);  
  });
  
  function sendMsg(){
    var message = Buffer.from('IPQUERY,0');
    client.send(message, 0, message.length, 10000, '255.255.255.255', function(err, bytes) {
      client.close();
    });
  } 
  sendMsg();

  server.on('message', (msg, rinfo) => {
    
    
   
    if(`${msg}`.indexOf('90-76') == -1)
    {  
      //console.log(`${msg}`);

      info[num] = `${msg}`;
      //console.log(info);
      num++;
     
      event.reply('UDPGO-reply',`${msg}`);

    }


  });
 

});
