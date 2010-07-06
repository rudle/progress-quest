$(document).ready(function () {

  var games;
  
  function load() {
    var roster = $("#roster");
    roster.empty();
    
    games = loadRoster();
    if (!games) {
      roster.text("Err...no local storage");
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
    var n = GenerateName();
    games[n] = {Traits: {Level: -10,Name:n,Race:GenerateName(),
                         Class:GenerateName()},
                Stats: {best: "STR 99"},
                Plots: {last: "Act VII"},
                Spells: {best: "Bad Schwarma XIV"},
                Equips: {best: "Cottonwood Sollerets"}};
    storeRoster(games);
    load();
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
