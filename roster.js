$(document).ready(function () {

  var games;
  
  function load() {
    var roster = $("#roster");
    roster.empty();
    
    games = loadRoster();
    if (!games) {
      roster.html("<b>This browser does not support local storage. You may still play fast and loose: the game will last only as long as the page stays open in your browser.");
      return;
    }
    $.each(games, function (key, c) {
      var name = c.Traits.Name;

      var br = brag(c);
      roster.append(br);
      br.find("a.go").attr("href", "main.html#" + name);

      br.find("a.x").click(function () {
        if (confirm("Terminate " + Pick(["faithful","noble","loyal","brave"])+ 
                    " " + name + "?")) {
          delete games[name];
          storeRoster(games);
          load();
        }
      });
 
      br.find("a.sheet").click(function () {
        alert(template($("#sheet").html(), games[name]));
        // TODO: put in a window or whatev
      });
 
      /*
      var p = $("<p style='font:6pt verdana'/>");
      p.appendTo(roster);
      p.text(JSON.stringify(c));
      */
    });
  }

  load();
  
  $("#roll").click(function () {
    window.location = "newguy.html";
  });
  
  $("#test").click(function () {
    window.location = "newguy.html?sold";
  });
  
  function brag(sheet) {
    var brag = $(template($("#badge").html(), sheet));
    if (sheet.motto) 
      brag.find(".bs").text('"' + sheet.motto + '"');
    return brag;
  }
  
  $("#clear").click(function () {
    storeRoster({});
    load();
  });
});
