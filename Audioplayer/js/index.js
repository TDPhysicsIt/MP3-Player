$(document).ready(function () {
$(document).tooltip({tracks:true});
  var currentvid = 0;

  $("#btn1").click(function () {
    $("#maudiofile").click();
  });

  var musicPaths = [
    "file://localhost/c:/Users/sonvt/Music/",
    "file://localhost/c:/username/sonvt/Music/"
  ];

  $("#filepath").autocomplete({ source: musicPaths });

  function loadTracks(evt) {
    var multiaudiofiles = evt.target.files;
    var maudioext = $(this)[0].value;
    var shuffCtrl = $("#btn4").attr("style");
    var trackpath = $("#filepath").val();
    var output = [];

    if (maudioext.substring(maudioext.lastIndexOf(".")) === ".mp3") {
      for (var i = 0, f; f = multiaudiofiles[i]; i++) {
        var trNr = i + 1 + $("#videotable tbody tr").length;
        output.push('<tr><td style="text-align:center;">' + trNr + '</td><td style="padding-left:10px;">' + f.name.substring(0, f.name.lastIndexOf(".")) + '</td></tr>');
        if (shuffCtrl) {
          random.push(trackpath + "" + f.name.substring(0, f.name.lastIndexOf(".")) + ".mp3");
        }
      }
      $("#videotable tbody").append(output.join(""));
      $("#modtext1").html("Trackload succesfull!<br>" + i + " Tracks in Tracklibrary added!");
    } else {
      $("#modtext1").html("Please select MP3-Files!");
    }
  }

  $("#maudiofile").on("change", loadTracks);

  $("#videotable").on("mouseenter", function () {
    $("#videotable tbody tr").on("click", function () {
      $("#videotable tbody tr").removeClass("selTrack");
      $(this).addClass("selTrack");
      currentvid = $(this).index();
      var vidsource = $("#videotable tbody tr:eq(" + currentvid + ") td:eq(1)").text();
      var trackpath = $("#filepath").val();
      $("#player1").attr("src", trackpath + "" + vidsource + ".mp3");
      $("#artist").html(vidsource);
      $("#play").html("▶").removeAttr("style");
    });
  });

  $("videotable").on("mouseleave", function () {
    $("#videotable tbody tr").off("click");
  });

  $("#play").click(function () {
    var plcol1 = $(this).attr("style");
    var pdis1 = $("#player1").prop("duration");

    if (!plcol1) {
      if (pdis1 > 0) {
        $("#player1").trigger("play");
        $(this).html("❙❙").css({ "background": "linear-gradient(to right, navy, skyblue, navy)", "border-style": "inset", "border-color": "skyblue" });
      }
    } else {
      $("#player1").trigger("pause");
      $(this).html("▶").removeAttr("style");
    }
  });

  $("#searchbox").on("click", function (e) {
    var vfsize1 = $("#searchbox").width();
    var ox = e.offsetX;
    var vpdist1 = $("#player1").prop("duration");
    var vidsc1 = $("#player1").attr("src");
    var sea_pos = ox / vfsize1;
    var vvidpltime1 = ox / vfsize1 * vpdist1;

    if (vidsc1 && vpdist1 > 0) {
      $("#search").animate({ width: sea_pos * 100 + "%" }, 10);
      $("#player1").prop("currentTime", vvidpltime1);
    }
  });

  $("#player1").on("timeupdate", function () {
    var vpdist1 = $("#player1").prop("duration");
    var vpos = $("#player1").prop("currentTime");
    var vpsize = vpos / vpdist1;
    var pldelta = vpdist1 - vpos;

    var plmin = parseInt(pldelta / 60 % 60);
    var plsec = parseInt(pldelta % 60);

    plmin = plmin < 10 ? "0" + plmin : plmin;
    plsec = plsec < 10 ? "0" + plsec : plsec;
    $("#search").css("width", vpsize * 100 + "%");
    $("#playtime").html(plmin + ":" + plsec);
  });

  $("#volumer").slider({ max: 1, min: 0, step: 0.01, value: 1, slide: chgVolume, change: chgVolume });
  $("#pitcher").slider({ max: 4, min: 0.25, step: 0.01, value: 1, slide: chgPitch, change: chgPitch });

  function chgVolume() {
    var plVol = $("#volumer").slider("value");
    $("#player1").prop("volume", plVol);
  }

  function chgPitch() {
    var aud = document.querySelector("#player1");
    var pitch = $("#pitcher").slider("value");

    if ("preservesPitch" in aud) {
      aud.preservesPitch = false;
    } else if ("mozPreservesPitch" in aud) {
      aud.mozPreservesPitch = false;
    }

    $("#player1").prop("playbackRate", pitch);
    $("#pitchRate").val(pitch);
  }

  $("#pitchup").click(function () {
    var pitch = $("#pitcher").slider("value");
    $("#pitcher").slider("value", pitch + 1 * 0.05);
  });

  $("#pitchdown").click(function () {
    var pitch = $("#pitcher").slider("value");
    $("#pitcher").slider("value", pitch - 1 * 0.05);
  });

  $("#pitcher").on("contextmenu", function (evt) {
    var pitch = $("#pitcher").slider("value", 1);
    evt.preventDefault();
  });

  function trackchangeforw1() {
    $("#videotable tbody tr").removeClass("selTrack");
    currentvid++;
    if (currentvid == $("#videotable tbody tr").length) {
      currentvid = 0;
    }
    $("#videotable tbody tr:eq(" + currentvid + ")").addClass("selTrack");
  }

  function trackchangerew1() {
    $("#videotable tbody tr").removeClass("selTrack");
    currentvid--;
    if (currentvid == -1) {
      currentvid = $("#videotable tbody tr").length - 1;
    }
    $("#videotable tbody tr:eq(" + currentvid + ")").addClass("selTrack");
  }

  function load_track() {
    var vidsource = $("#videotable tbody tr:eq(" + currentvid + ") td:eq(1)").text();
    var pitchVal = $("#pitchRate").val();
    var trackpath = $("#filepath").val();

    $("#player1").attr("src", trackpath + "" + vidsource + ".mp3");
    $("#player1").prop("playbackRate", pitchVal);
    $("#player1").trigger("play");
    $("#play").html("❙❙").css({ "background": "linear-gradient(to right, navy, skyblue, navy)", "border-style": "inset", "border-color": "skyblue" });
    $("#artist").html(vidsource);
  }

  $("#trackcount1").click(function () {
    trackchangerew1();
    load_track();
    setPosition();
  });

  $("#trackcount2").click(function () {
    trackchangeforw1();
    load_track();
    setPosition();
  });

  var random;

  function setRandom() { // Set Tracks in Array
    random = [];
    var trnumbs = $("#videotable tbody tr").length - 1; // Length Of Tracks in Tracklist
    var trackpath = $("#filepath").val(); // File-Path

    for (var x = 0; x <= trnumbs; x++) {
      var shuffNumb = $("#videotable tbody tr:eq(" + x + ") td:eq(1)").text();
      random.push(trackpath + "" + shuffNumb + ".mp3"); // Tracks from Tracklist in a Array
    }
  }

  function playRandom(djplayer, tracktitle) { // Load Random-Tack from Array in Player
    var pitchVal = $("#pitchRate").val();
    var randomSize = random.length;
    var randomNumb = Math.floor(Math.random() * randomSize);

    $("#videotable tbody tr").removeClass("selTrack").removeAttr("selected");
    $("#videotable tbody tr:contains(" + random[randomNumb].substring(random[randomNumb].lastIndexOf("/") + 1, random[randomNumb].lastIndexOf(".")) + ")").addClass("selTrack");
    $("#videotable tbody tr[class='selTrack']").each(function () {
      currentvid = $(this).index();
    });
    $("#" + djplayer).attr("src", random[randomNumb]).prop("playbackRate", pitchVal).trigger("play");
    $("#" + tracktitle).html(currentvid + " " + random[randomNumb].substring(random[randomNumb].lastIndexOf("/") + 1, random[randomNumb].lastIndexOf(".")));
    $("#play").html("❙❙").css({ "background": "linear-gradient(to right, navy, skyblue, navy)", "border-style": "inset", "border-color": "skyblue" });

    random.splice(randomNumb, 1);

    if (randomSize < 2) {
      setRandom();
    }
  }

  $("#btn4").on("click", function () {
    var shuffCtrl = $(this).attr("style");

    if (!shuffCtrl) {
      setRandom();
      console.log(random);
      $(this).css({ "background": "linear-gradient(to right, navy, skyblue, navy)", "border-style": "inset", "border-color": "skyblue" });
    } else {
      random = [];
      $(this).removeAttr("style");
    }
  });

  $("#trforw").on("click", function () {
    var trf = $(this).attr("style");

    if (!trf) {
      $(this).css({ "background": "linear-gradient(to right, #312f00, yellow, #312f00)", "border-style": "inset", "border-color": "yellow" });
      $("#trrew").removeAttr("style");
    }
  });

  $("#trrew").on("click", function () {
    var trr = $(this).attr("style");

    if (!trr) {
      $(this).css({ "background": "linear-gradient(to right, #312f00, yellow, #312f00)", "border-style": "inset", "border-color": "yellow" });
      $("#trforw").removeAttr("style");
    }
  });

  function setPosition() {
    var trArea = $("#trackarea").height();
    var trHead = $("#videotable thead tr").outerHeight();
    var trTrack = $("#videotable tbody tr").outerHeight();
    var trPos = currentvid * trTrack + trHead;
    var trScroll = trPos - trArea + 75;
    var shuffCtrl = $("#btn4").attr("style");

    if (shuffCtrl) {
      $("#trackarea").animate({ scrollTop: trPos + "px" }, 10);
    } else {
      if (trPos > trArea) {
        $("#trackarea").animate({ scrollTop: trScroll + "px" }, 10);
      } else if (currentvid === 0) {
        $("#trackarea").animate({ scrollTop: "-100px" }, 10);
      }
    }
  }

  $("#player1").on("ended", function () {
    var shuffCtrl = $("#btn4").attr("style");
    var trf = $("#trforw").attr("style");
    var trr = $("#trrew").attr("style");

    if (shuffCtrl) {
      playRandom("player1", "artist");
    } else {
      if (trf) {
        trackchangeforw1();
      } else {
        trackchangerew1();
      }
      load_track();
    }

    setPosition();
  });

  function setEqal() {
    var scw = window.screen.availWidth;

    if (scw > 1600) {
      $("#player1").equalizer({
        color: "#ff0000",
        color1: '#ffff00',
        color2: '#00ff00',
        width: 1800,
        height: 130,
        bars: 20,
        components: 10
      });
    } else {
      $("#player1").equalizer({
        color: "#ff0000",
        color1: '#ffff00',
        color2: '#00ff00',
        width: 1050,
        height: 130,
        bars: 16,
        components: 10
      });
    }
  }

setEqal();

  var squisher;

  function squish() {
    var vpos = $("#player1").prop("currentTime");
    var pitchVal = $("#pitchRate").val();
    $("#player1").prop("currentTime", vpos - 0.125 * pitchVal);
  }

  function st_squish() {
    var pitchVal = $("#pitchRate").val();
    squisher = setInterval(squish, 93.75 / pitchVal);
  }

  function stop_squish() {
    clearInterval(squisher);
  }

  $("#full1").on("click", function () {
    var fonoff = $(this).attr("style");

    if (!fonoff) {
      st_squish();
      $(this).css({ "background": "linear-gradient(to right, navy, skyblue, navy)", "border-style": "inset" });
    } else {
      stop_squish();
      $(this).removeAttr("style");
    }
  });

 function setScreen() {
    var scw = window.screen.availWidth;

    if (scw > 1600) {
	$("#trackarea").css("height", "500px");
	$("#pitchRate, #filepath").css("height", "50px");
	}
    }

setScreen();

$("#del1").on("click", function() {
    var shuffCtrl = $("#btn4").attr("style");
    var tracksize = $("#videotable tbody tr").length;
    
    $("#videotable tbody tr[class='selTrack']").each(function() {
      $(this).remove();
      
      if (shuffCtrl) {
        random.splice(currentvid,1);
      }
    });
    
    for (var i=0; i<tracksize; i++) {
      var newTrackNumb = i+1;
      $("#videotable tbody tr:eq("+i+") td:eq(0)").html(newTrackNumb);
    }
    
    $("#artist").html(i + " " + trackPosArea);
  });
  
  function setStore() {
    localStorage.setItem("setList", $("#videotable tbody").html());
    localStorage.setItem("setTime", $("#player1").prop("currentTime"));
    localStorage.setItem("setRate", $("#player1").prop("playbackRate"));
    localStorage.setItem("setVol", $("#player1").prop("volume"));
    localStorage.setItem("setSource", $("#player1").attr("src"));
    getStore();
  }
  
  function getStore() {
    var storeSource = localStorage.getItem("setSource");
    var storeList = localStorage.getItem("setList");
    var storeTime = localStorage.getItem("setTime");
    var storeRate = localStorage.getItem("setRate");
    var storeVol = localStorage.getItem("setVol");
    $("#videotable tbody").html(storeList);
    $("#player1").attr("src", storeSource);
    $("#player1").prop("currentTime", storeTime);
    $("#volumer").slider("value", storeVol);
    $("#pitcher").slider("value", storeRate);
  }
  
  if (!localStorage.getItem("setList")) {
    setStore();
  } else {
    getStore();
  }
  
  $("#btn2").on("click", function() {
    setStore();
  });
});
