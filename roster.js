$(document).ready(function () {

  var games;
  
  function load() {
    var roster = $("#roster");
    roster.empty();
    roster.text("Loading...");
    
    games = loadRoster()
    if (!games) {
      roster.text("Err...no local storage");
      return;
    }
    $.each(games, function (index, c) {
      var p = $("<dt/>");
      p.appendTo(roster);
      p.text(c.name);
      var a = $("<a/>", {href: "main.html#" + c.name})
      a.text(c.name);
      a.appendTo(p);
      p = $("<dd/>");
      p.appendTo(roster);
      p.text("Level " + (c.level || 1) + " " + c.race + " " + c['class']);
    });
  }

  load();
  
  $("#test").click(function () {
    games.push({testy:"cul", "name":"betsy"});
    storeRoster(games);
    load();
  });
  
  $("#clear").click(function () {
    storeRoster([]);
    load();
  });
});
