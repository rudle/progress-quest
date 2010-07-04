$(document).ready(function () {

  var games;
  
  function load() {
    var roster = $("#roster");
    roster.empty();
    
    games = loadRoster()
    if (!games) {
      roster.text("Err...no local storage");
      return;
    }
    $.each(games, function (key, c) {
      var name = c.Traits.Name;

      var br = brag(c);
      roster.append(br);
      br.find("a").attr("href", "main.html#" + name)

      br.find("button").click(function () {
        delete games[name];
        storeRoster(games);
        load();
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
    games[n] = {Traits: {Level: -10,Name:n,Race:GenerateName(),Class:GenerateName()}};
    storeRoster(games);
    load();
  });
  
  function brag(sheet) {
    var tmpl = $("#bumble").html();
    var brag = tmpl.replace(/\$([A-Za-z.]+)/g, function (str, p1) {
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
