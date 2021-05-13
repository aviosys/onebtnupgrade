const ipc = require('electron').ipcRenderer;
const buttonCreated1 = document.getElementById('upload');
const buttonCreated = document.getElementById('ipscan');
const sendmsg = document.getElementById('posmsg');
//const ipcinfo = JSON.parse('{"group":{"007650000001":{"devip":"192.168.100.1","devport":"80","ver":"1.27"}}}');
const ipcinfo = [];
var Total = '';
var num = 0;
var flg = 0;
buttonCreated.addEventListener('click', function (event) {
   ipc.send('UDPGO');
});

ipc.on('UDPGO-reply', (event, arg) => {
   var listT = document.getElementById("sel");
  var option = document.createElement("option");

  listT.options.length = 0;
  //console.log(arg.length);

  info = arg.split(",");
  var devinfo;
  var smac=info[2].replace(/-/g,'');
  var MAC=smac.toUpperCase();
  var ipport=info[3].split(":");
  var ip=ipport[0];
  var port=ipport[1];
  var version=info[8];
  devinfo = MAC+','+ip+','+version;
  console.log(devinfo);
  setTimeout(function(){

  option.text = devinfo;
  
  if(listT.length > 1)
  {
    for(var i=0; i < listT.length; i++)
    {
      var infoA = listT.options[listT.length - 1].innerHTML;
      var infoB = listT.options[i].innerHTML;
      if(infoA == infoB)
      {
        if(flg == 0)
        {
          infoB = infoA;
          flg = 1;
        }
        else if(flg == 1)
        {
          listT.remove(listT.length - 1);
        }
      }
      else
      {
        listT.add(option);
        flg = 0;
      }

    }
  }
  else
  {
    listT.add(option);
  }




}, 2000);

  
  })

buttonCreated1.addEventListener('click', function (event) {
    var x = document.getElementById("sel").value;
    v = x.split(",");
    var prd = v[1];
    ipc.send('uploadfw',prd)
});
 
