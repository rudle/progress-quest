function Cheats() {
  if ($(".cheater").length) return;

  function cheat(label, effect) {
    $("<button/>", {
      "class": "cheater",
      text: label,
      click: effect}).appendTo('body');
  }

  cheat("Task", function () {
    TaskBar.reposition(TaskBar.Max());
  });

  cheat("Level", function () {
    LevelUp();
  });

  cheat("Quest", function () {
    QuestBar.reposition(QuestBar.Max());
    TaskBar.reposition(TaskBar.Max());
  });

  cheat("Plot", function () {
    PlotBar.reposition(PlotBar.Max());
    TaskBar.reposition(TaskBar.Max());
  });


  cheat("Pause", function () {
    if (timerid) {
      StopTimer();
    } else {
      StartTimer();
    }
  });

  cheat("Break", function () {
    debugger;
  });
  cheat("Equip", function () {
    WinEquip();
  });

  cheat("Item", function () {
    WinItem();
  });

  cheat("Clear items", function () {
    while (Inventory.length() > 1)
      Inventory.remove1();
  });

  cheat("Spell", function () {
    WinSpell();
  });

  cheat("Stat", function () {
    WinStat();
  });

  cheat("$$$", function () {
    Add(Inventory,'Gold',Random(100));
  });

  cheat("Save", function () {
    SaveGame();
    alert(JSON.stringify(game).length);
  });

  cheat("Quit", quit);

}

