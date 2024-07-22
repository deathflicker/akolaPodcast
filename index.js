//variables
var podcasts;
var episodes = [];
var audios = [];
var myAudio = document.getElementById("myAudio");

var isPlaying = false;

var counter = 0;

if(localStorage.getItem("autoPlay")==null){
    localStorage.setItem("autoPlay", true);
}
else{
    if(localStorage.getItem("autoPlay")=="true"){
        
    }
    else{
        document.getElementById("flexSwitchCheckChecked").checked = false;
    }
}










//functions
var myTimer = setTimeout(function(){
    clearTimeout(myTimer);
    fetchGscriptJson();
}, 3000);

function fetchGscriptJson() {
    // Replace 'YOUR_GSCRIPT_URL' with the actual URL of your gscript
    const url = 'https://script.google.com/macros/s/AKfycbxVcrPi6GWEjqRv-moDKIqQJ95Zt3HvSv1_FO-PZK9qdBSVZObqQo3J9wutQ41BNM8/exec';
  
    // Fetch the content from the URL
    $.getJSON(url, function(data) {
        //console.log("Fetched JSON data:", data);
        
        podcasts = data;
        // You can further process the data here (e.g., manipulate the array)
      })
      .done(function() {
        $("#welcomeDiv").fadeOut(200);
        $("#podcasts").fadeIn(200);
        $("#podcasts").css("display","flex");
        for(i=0;i<podcasts.length;i++){
            $("#podcasts").html($("#podcasts").html()+"<div style='background-image: url("+'"'+podcasts[i].image+'"'+")'>"+podcasts[i].link+" <span class='material-symbols-outlined' onclick='whichPodcast("+i+")'> play_arrow </span></div>");
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching JSON data:", textStatus, errorThrown);
      });
  }
  

  function whichPodcast(which){
    $("#akolaPlayer").fadeIn(100);
    $("#akolaPlayer span").css("background-image","url('"+podcasts[which].image+"')");
    const url = podcasts[which].link;
  
    // Fetch the content from the URL
    $.getJSON(url, function(data) {
        //console.log("Fetched JSON data:", data);
        $("#myDropdown").html("");
        for(i=0;i<data.length;i++){
            episodes.push(data[i].episode);
            $("#myDropdown").html($("#myDropdown").html()+"<a id='ep"+i+"'"+" onclick='playSelect("+i+")'>"+data[i].episode+"</a>")
            audios.push(data[i].audio);
        }
        
      })
      .done(function() {
        //$("#playerLabel").text("Now Playing: " + episodes[0]);
        $("#akolaPlayer span audio").attr("src",audios[0]);
        $("#ep0").css("background-color","green");
        myAudio.play();
        isPlaying = true;
        $("#pausePlayBtn").text("pause");
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching JSON data:", textStatus, errorThrown);
      });
  }




  function checkPlay(){
    if(isPlaying){
        isPlaying = false;
        myAudio.pause();
        $("#pausePlayBtn").text("play_arrow");
    }
    else{
        isPlaying = true;
        myAudio.play();
        $("#pausePlayBtn").text("pause");
    }
  }




  
  function filterFunction() {
    const input = document.getElementById("myInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("myDropdown");
    const a = div.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  function playSelect(select){
    myAudio.pause();
    counter = select;
    $("#myDropdown a").css("background-color", "black");
    //$("#playerLabel").text("Now Playing: " + episodes[select]);
    $("#ep"+select).css("background-color","green");
    $("#myAudio").attr("src",audios[select]);
    myAudio.play();
    $("#pausePlayBtn").text("pause");
    isPlaying = true;
    document.getElementById("ep"+counter).scrollIntoView();
  }


  myAudio.onended = function() {

    if(localStorage.getItem("autoPlay")=="true"){

        if(counter==audios.length-1){
            myAudio.pause();
            episodes = [];
            audios = [];
            counter = 0;
            $("#akolaPlayer").fadeOut(200);
            $("#myDropdown").html("");
            //$("#playerLabel").text("Loading...");
        }
        else{
            myAudio.pause();
            counter++;
            $("#myAudio").attr("src",audios[counter]);
            document.getElementById("ep"+counter).scrollIntoView();
            $("#myDropdown a").css("background-color", "black");
            //$("#playerLabel").text("Now Playing: " + episodes[counter]);
            $("#ep"+counter).css("background-color","green");
            myAudio.play();
        }
    }
    else{
        $("#pausePlayBtn").text("play_arrow");
        isPlaying = false;
    }
    
};