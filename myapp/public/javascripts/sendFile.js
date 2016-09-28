
    //UPLOAD FILE WITH JUST JS AND XHR
    function  sendObj(){
      var msg = document.getElementById("mensaje"),
      formData = new FormData(document.forms.namedItem("fileinfo"));
      var xhr = new XMLHttpRequest();
      xhr.upload.onprogress = updateProgress;
      xhr.open("POST", "http://192.168.1.74:3000/rest", true);
      xhr.onload = function() 
      {
        if (xhr.status == 200) {
            msg.innerHTML = xhr.responseText;
        } 
        else {
            msg.innerHTML = xhr.responseText;
        } 
      };
      xhr.send(formData);
}

//SHOW BAR PROGRESS
    function updateProgress(evt) {
      if (evt.lengthComputable)
      {
          var percentComplete = evt.loaded / evt.total;
          percentComplete = Math.round( percentComplete*100 );
          if(document.getElementById("percentage"))
          {
            document.getElementById("percentage").innerHTML = " Loading "+percentComplete+"%.";
          }
      }

};