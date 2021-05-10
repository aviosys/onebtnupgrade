const ipc = require('electron').ipcRenderer;
const buttonCreated1 = document.getElementById('upload');
const buttonCreated = document.getElementById('ipscan');
const sendmsg = document.getElementById('posmsg');
const ipcinfo = JSON.parse('{"group":{"007650000001":{"devip":"192.168.100.1","devport":"80","ver":"1.27"}}}');

buttonCreated.addEventListener('click', function (event) {
   ipc.send('UDPGO');
});

ipc.on('UDPGO-reply', (event, arg) => {
    // console.log(arg) // prints "pong"
    var listT = document.getElementById("sel");
    var option = document.createElement("option");    
    var group = "group";
    var info = arg.split(",");
    var devinfo={};
    smac=info[2].replace(/-/g,'');
    var MAC=smac.toUpperCase();
    //netmask=infos[4];
    //gateway=infos[5];
    ipport=info[3].split(":");
    ip=ipport[0];
    port=ipport[1];
    version=info[8];

   

    if(MAC.indexOf('9076') == -1)
    {
      devinfo = {[group]:{[MAC]:{"devip":ip,"devport":port,"ver":version}}};
      
      ipcinfo[group][MAC]=devinfo[group][MAC];
       delete ipcinfo[group]['007650000001'];
      //console.log(ipcinfo);
      for(var MAC in devinfo[group]){
        ip= devinfo[group][MAC].devip;
        port= devinfo[group][MAC].devport;
        devver = devinfo[group][MAC].ver;
        //found=""; dift="NO";
          for(var maci in ipcinfo[group])
          {
            if(MAC==maci)
            {  
              //found="found";
              if(ipcinfo[group][maci].devip!=devinfo[group][maci].devip) {  ipcinfo[group][maci].devip=devinfo[group][maci].devip;   }
              if(ipcinfo[group][maci].devport!=devinfo[group][maci].devport) { ipcinfo[group][maci].devport=devinfo[group][maci].devport;   }
            }
          }
        
  
        option.text = MAC+","+ip+","+port+","+devver;
        listT.add(option);       
        
      }
    }

  
  })

buttonCreated1.addEventListener('click', function (event) {
    var x = document.getElementById("sel").value;
    v = x.split(",");
    var prd = v[1];
    ipc.send('uploadfw',prd)
});
 