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
    $.each(games, function (key, c) {
      roster.append(brag(c));

      var p = $("<p/>");
      p.appendTo(roster);
      p.text(JSON.stringify(c));
      
      var p = $("<dt/>");
      p.appendTo(roster);
      var a = $("<a/>", {href: "main.html#" + c.name})
      a.text(c.name);
      a.appendTo(p);

      var rm = $("<button/>");
      rm.text("X");
      rm.css("color", "red");
      rm.appendTo(roster);
      rm.click(function () {
        delete games[c.name];
        storeRoster(games);
        load();
      });

      p = $("<dd/>");
      p.appendTo(roster);
      p.text("Level " + (c.level || 1) + " " + c.race + " " + c['class']);
    });
  }

  load();
  
  $("#roll").click(function () {
    window.location = "newguy.html";
  });
  
  $("#test").click(function () {
    var n = GenerateName();
    games[n] = {traits: {level: -10},name:n,race:GenerateName(),"class":GenerateName()};
    storeRoster(games);
    load();
  });
  
  function brag(sheet) {
    var tmpl = $("#bumble").html();
    var brag = tmpl.replace(/\$([a-z.]+)/g, function (str, p1) {
      var dict = sheet;
      $.each(p1.split("."), function (i,v) {
        if (!dict) return true;
        dict = dict[v];
      });
      return dict || '';
    });
    return $(brag);
  }
  
  $("#clear").click(function () {
    storeRoster({});
    load();
  });
});
