// Copyright (c)2002-2010 Eric Fredricksen <e@fredricksen.net> all rights reserved

var game = {};
var lasttick, timerid;

function timeGetTime() {
  return new Date().getTime();
}

function StartTimer() {
  if (!timerid) {
    lasttick = timeGetTime();
    timerid = setInterval(Timer1Timer, 100);
  }
}

function StopTimer() {
  clearTimeout(timerid);
  timerid = null;
}

function Q(s) {
  game.queue.push(s);
  Dequeue();
}

function TaskDone() {
  return TaskBar.done();
}

function Odds(chance, outof) {
  return Random(outof) < chance;
}

function RandSign() {
  return Random(2) * 2 - 1;
}

function RandomLow(below) {
  return Min(Random(below), Random(below));
}

function PickLow(s) {
  return s[RandomLow(s.length)];
}

function Copy(s, b, l) {
  return s.substr(b-1, l);
}

function Length(s) {
  return s.length;
}

function Starts(s, pre) {
  return 0 === s.indexOf(pre);
}

function Ends(s, e) {
  return Copy(s, 1+Length(s)-Length(e), Length(e)) == e;
}

function Plural(s) {
  if (Ends(s,'y')) 
    return Copy(s,1,Length(s)-1) + 'ies';
  else if (Ends(s,'us')) 
    return Copy(s,1,Length(s)-2) + 'i';
  else if (Ends(s,'ch') || Ends(s,'x') || Ends(s,'s') || Ends(s, 'sh')) 
    return s + 'es';
  else if (Ends(s,'f')) 
    return Copy(s,1,Length(s)-1) + 'ves';
  else if (Ends(s,'man') || Ends(s,'Man')) 
    return Copy(s,1,Length(s)-2) + 'en';
  else return s + 's';
}

function Split(s, field, separator) {
  return s.split(separator || "|")[field];
}

function Indefinite(s, qty) {
  if (qty == 1) {
    if (Pos(s.charAt(0), 'AEIOUÜaeiouü') > 0) 
      return 'an ' + s;
    else 
      return 'a ' + s;
  } else {
    return IntToStr(qty) + ' ' + Plural(s);
  }
}

function Definite(s, qty) {
  if (qty > 1)
    s = Plural(s);
  return 'the ' + s;
}

function prefix(a, m, s, sep) {
  if (sep == undefined) sep = ' ';
  m = Abs(m);
  if (m < 1 || m > a.length) return s;  // In case of screwups
  return a[m-1] + sep + s;
}

function Sick(m, s) {
  m = 6 - Abs(m);
  return prefix(['dead','comatose','crippled','sick','undernourished'], m, s);
}


function Young(m, s) {
  m = 6 - Abs(m);
  return prefix(['foetal','baby','preadolescent','teenage','underage'], m, s);
}


function Big(m, s) {
  return prefix(['greater','massive','enormous','giant','titanic'], m, s);
}

function Special(m, s) {
  if (Pos(' ', s) > 0)
    return prefix(['veteran','cursed','warrior','undead','demon'], m, s);
  else
    return prefix(['Battle-','cursed ','Were-','undead ','demon '], m, s, '');
}

function InterplotCinematic() {
  switch (Random(3)) {
  case 0: 
    Q('task|1|Exhausted, you arrive at a friendly oasis in a hostile land');
    Q('task|2|You greet old friends and meet new allies');
    Q('task|2|You are privy to a council of powerful do-gooders');
    Q('task|1|There is much to be done. You are chosen!');
    break;
  case 1: 
    Q('task|1|Your quarry is in sight, but a mighty enemy bars your path!');
    var nemesis = NamedMonster(GetI(Traits,'Level')+3);
    Q('task|4|A desperate struggle commences with ' + nemesis);
    var s = Random(3);
    for (var i = 1; i <= Random(1 + Plots.length()); ++i) {
      s += 1 + Random(2);
      switch (s % 3) {
      case 0: Q('task|2|Locked in grim combat with ' + nemesis); break;
      case 1: Q('task|2|' + nemesis + ' seems to have the upper hand'); break;
      case 2: Q('task|2|You seem to gain the advantage over ' + nemesis); break;
      }
    }
    Q('task|3|Victory! ' + nemesis + ' is slain! Exhausted, you lose conciousness');
    Q('task|2|You awake in a friendly place, but the road awaits');
    break;
  case 2: 
    var nemesis2 = ImpressiveGuy();
    Q("task|2|Oh sweet relief! You've reached the protection of the good " + nemesis2);
    Q('task|3|There is rejoicing, and an unnerving encouter with ' + nemesis2 + ' in private');
    Q('task|2|You forget your ' + BoringItem() + ' and go back to get it');
    Q("task|2|What's this!? You overhear something shocking!");
    Q('task|2|Could ' + nemesis2 + ' be a dirty double-dealer?');
    Q('task|3|Who can possibly be trusted with this news!? ... Oh yes, of course');
    break;
  }
  Q('plot|1|Loading');
}


function StrToInt(s) {
  return parseInt(s, 10);
}

function IntToStr(i) {
  return i + "";
}

function NamedMonster(level) {
  var lev = 0;
  var result = '';
  for (var i = 0; i < 5; ++i) {
    var m = Pick(K.Monsters);
    if (!result || (Abs(level-StrToInt(Split(m,1))) < Abs(level-lev))) {
      result = Split(m,0);
      lev = StrToInt(Split(m,1));
    }
  }
  return GenerateName() + ' the ' + result;
}

function ImpressiveGuy() {
  return Pick(K.ImpressiveTitles) + 
    (Random(2) ? ' of the ' + Pick(K.Races) : ' of ' + GenerateName());
}

function MonsterTask(level) {
  var definite = false;
  for (var i = level; i >= 1; --i) {
    if (Odds(2,5))
      level += RandSign();
  }
  if (level < 1) level = 1;
  // level = level of puissance of opponent(s) we'll return

  var monster, lev;
  if (Odds(1,25)) {
    // Use an NPC every once in a while
      monster = ' ' + Split(Pick(K.Races), 0);
    if (Odds(1,2)) {
      monster = 'passing' + monster + ' ' + Split(Pick(K.Klasses), 0);
    } else {
      monster = PickLow(K.Titles) + ' ' + GenerateName() + ' the' + monster;
      definite = true;
    }
    lev = level;
    monster = monster + '|' + IntToStr(level) + '|*';
  } else if (game.questmonster && Odds(1,4)) {
    // Use the quest monster
    monster = K.Monsters[game.questmonsterindex];
    lev = StrToInt(Split(monster,1));
  } else {
    // Pick the monster out of so many random ones closest to the level we want
    monster = Pick(K.Monsters);
    lev = StrToInt(Split(monster,1));
    for (var ii = 0; ii < 5; ++ii) {
      var m1 = Pick(K.Monsters);
      if (Abs(level-StrToInt(Split(m1,1))) < Abs(level-lev)) {
        monster = m1;
        lev = StrToInt(Split(monster,1));
      }
    }
  }

  var result = Split(monster,0);
  game.task = 'kill|' + monster;

  var qty = 1;
  if (level-lev > 10) {
    // lev is too low. multiply...
    qty = Math.floor((level + Random(lev)) / max(lev,1));
    if (qty < 1) qty = 1;
    level = Math.floor(level / qty);
  }

  if ((level - lev) <= -10) {
    result = 'imaginary ' + result;
  } else if ((level-lev) < -5) {
    i = 10+(level-lev);
    i = 5-Random(i+1);
    result = Sick(i,Young((lev-level)-i,result));
  } else if (((level-lev) < 0) && (Random(2) == 1)) {
    result = Sick(level-lev,result);
  } else if (((level-lev) < 0)) {
    result = Young(level-lev,result);
  } else if ((level-lev) >= 10) {
    result = 'messianic ' + result;
  } else if ((level-lev) > 5) {
    i = 10-(level-lev);
    i = 5-Random(i+1);
    result = Big(i,Special((level-lev)-i,result));
  } else if (((level-lev) > 0) && (Random(2) == 1)) {
    result = Big(level-lev,result);
  } else if (((level-lev) > 0)) {
    result = Special(level-lev,result);
  }

  lev = level;
  level = lev * qty;

  if (!definite) result = Indefinite(result, qty);
  return { 'description': result, 'level': level };
}

function LowerCase(s) {
  return s.toLowerCase();
}

function ProperCase(s) {
  return Copy(s,1,1).toUpperCase() + Copy(s,2,10000);
}

function EquipPrice() {
  return  5 * GetI(Traits,'Level') * GetI(Traits,'Level') + 
    10 * GetI(Traits,'Level') + 
    20;
}

function Dequeue() {
  while (TaskDone()) {
    if (Split(game.task,0) == 'kill') {
      if (Split(game.task,3) == '*') {
        WinItem();
      } else if (Split(game.task,3)) {
        Add(Inventory,LowerCase(Split(game.task,1) + ' ' + 
                                ProperCase(Split(game.task,3))),1);
      }
    } else if (game.task == 'buying') {
      // buy some equipment
      Add(Inventory,'Gold',-EquipPrice());
      WinEquip();
    } else if ((game.task == 'market') || (game.task == 'sell')) {
      if (game.task == 'sell') {
        var amt = GetI(Inventory, 1) * GetI(Traits,'Level');
        if (Pos(' of ', Inventory.label(1)) > 0)
          amt *= (1+RandomLow(10)) * (1+RandomLow(GetI(Traits,'Level')));
        Inventory.remove1();
        Add(Inventory, 'Gold', amt);
      }
      if (Inventory.length() > 1) {
        Inventory.scrollToTop();
        Task('Selling ' + Indefinite(Inventory.label(1), GetI(Inventory,1)), 
             1 * 1000);
        game.task = 'sell';
        break;
      }
    }
    
    var old = game.task;
    game.task = '';
    if (game.queue.length > 0) {
      var a = Split(game.queue[0],0);
      var n = StrToInt(Split(game.queue[0],1));
      var s = Split(game.queue[0],2);
      if (a == 'task' || a == 'plot') {
        game.queue.shift();
        if (a == 'plot') {
          CompleteAct();
          s = 'Loading ' + Plots.last().text();
        }
        Task(s, n * 1000);
      } else {
        throw 'bah!' + a;
      }
    } else if (EncumBar.done()) {
      Task('Heading to market to sell loot',4 * 1000);
      game.task = 'market';
    } else if ((Pos('kill|',old) <= 0) && (old != 'heading')) {
      if (GetI(Inventory, 'Gold') > EquipPrice()) {
        Task('Negotiating purchase of better equipment', 5 * 1000);
        game.task = 'buying';
      } else {
        Task('Heading to the killing fields', 4 * 1000);
        game.task = 'heading';
      }
    } else {
      var nn = GetI(Traits, 'Level');
      var t = MonsterTask(nn);
      var InventoryLabelAlsoGameStyleTag = 3;
      nn = Math.floor((2 * InventoryLabelAlsoGameStyleTag * t.level * 1000) / nn);
      Task('Executing ' + t.description, nn);
    }
  }
}


function Put(list, key, value) {
  if (!game[list.id])
    game[list.id] = list.fixedkeys ? {} : [];

  if (list.fixedkeys) {
    game[list.id][key] = value;
  } else {
    var i = 0;
    for (; i < game[list.id].length; ++i) {
      if (game[list.id][i][0] === key) {
        game[list.id][i][1] = value;
        break;
      }
    }
    if (i == game[list.id].length)
      game[list.id].push([key,value]);
  }

  PutUI(list, key, value);

  if (key === 'STR') {
    EncumBar.Max = 10 + value;
    EncumBar.reposition(EncumBar.Position);
  }

  if (list === Inventory)
    EncumBar.reposition(Sum(Inventory) - GetI(Inventory,'Gold'));
}


function PutUI(list, key, value) {
  // Update UI
  var item = list.item(key);
  item.children().last().text(value);
  item.addClass("selected");
  item.each(function () {this.scrollIntoView();});
}


function ProgressBar(id) {
  this.id = id;
  this.bar = $("#"+ id + " > .bar");
  this.hint = '';

  this.reset = function (newmax) {
    this.Max = newmax;
    this.reposition(0);
  };

  this.reposition = function (newpos) {
    this.Position = Min(newpos, this.Max);
    this.bar.css("width", 100 * this.Position / this.Max + "%");

    // Recompute hint
    var label = $("#" + this.id).find(".hint");
    this.percent = (100 * this.Position).div(this.Max);
    this.remaining = Math.floor(this.Max - this.Position);
    this.time = RoughTime(this.Max - this.Position);
    this.hint = template(label.attr("template"), this);
    label.text(this.hint);
  };

  this.increment = function (inc) {
    this.reposition(this.Position + inc);
  };

  this.done = function () {
    return this.Position >= this.Max;
  };

  this.save = function (game) {
    game[id] = {position: this.Position, 
                max: this.Max,
                hint: this.hint};
  };
  
  this.load = function (game) {
    this.Max = game[id].max;
    this.reposition(game[id].position);
  };
}



function Key(tr) {
  return $(tr).children().first().text();
}

function Value(tr) {
  return $(tr).children().last().text();
}



function ListBox(id, columns, fixedkeys) {
  this.id = id;
  //this.box = $("#"+ id);
  this.box = $("tbody#_, #_ tbody".replace(/_/g, id));
  this.columns = columns;
  this.fixedkeys = fixedkeys;

  this.AddUI = function (caption) {
    var tr = $("<tr><td><input type=checkbox disabled> " + 
               caption + "</td></tr>");
    tr.appendTo(this.box);
    tr.each(function () {this.scrollIntoView();});
    return tr;
  };

  this.ClearSelection = function () {
    this.box.find("tr").removeClass("selected");
  };

  this.item = function (key) {
    if (typeof key == typeof 'string') {
      var result = this.rows().filter(function (index) {
        return Key(this) === key;
      });
      if (!result.length) {
        result = $("<tr><td>" + key + "</td><td/></tr>");
        this.box.append(result);
      }
      return result;
    } else {
      return this.box.find("tr").eq(key);
    }
  };

  this.last = function () {
    return this.rows().last();
  };

  this.scrollToTop = function () {
    this.box.parents(".scroll").scrollTop(0);
  };

  this.rows = function () {
    return this.box.find("tr").has("td");
  };

  this.length = function () {
    return this.rows().length;
  };

  this.remove0 = function (n) {
    if (game[this.id])
      game[this.id].shift();
    this.box.find("tr").first().remove();
  };

  this.remove1 = function (n) {
    var t = game[this.id].shift();
    game[this.id].shift();
    game[this.id].unshift(t);
    this.box.find("tr").eq(1).remove();
  };


  this.load = function (game) {
    var that = this;
    var dict = game[this.id];
    if (this.fixedkeys) {
      this.rows().each(function (index) {
        Put(that, Key(this), dict[Key(this)]);
      });
    } else {
      $.each(dict, function (index, row) {
        if (that.columns == 2) 
          Put(that, row[0], row[1]);
        else
          that.AddUI(row);
      });
    }
  };


  this.label = function (n) {
    return Key(this.item(n));
  };
}


var ExpBar, PlotBar, TaskBar, QuestBar, EncumBar;
var Traits,Stats,Spells,Equips,Inventory,Plots,Quests;
var Kill;
var AllBars, AllLists;
    
    
function StrToIntDef(s, def) {
  var result = parseInt(s, 10);
  return isNaN(result) ? def : result;
}


$(document).ready(FormCreate);


function WinSpell() {
  AddR(Spells, K.Spells[RandomLow(Min(GetI(Stats,'WIS')+GetI(Traits,'Level'),
                                      K.Spells.length))], 1);
}

function LPick(list, goal) {
  var result = Pick(list);
  for (var i = 1; i <= 5; ++i) {
    var best = StrToInt(Split(result, 1));
    var s = Pick(list);
    var b1 = StrToInt(Split(s,1));
    if (Abs(goal-best) > Abs(goal-b1))
      result = s;
  }
  return result;
}

function Abs(x) {
  return x < 0 ? -x : x;
}

function WinEquip() {
  var posn = Random(Equips.length());

  if (!posn) {
    stuff = K.Weapons;
    better = K.OffenseAttrib;
    worse = K.OffenseBad;
  } else {
    better = K.DefenseAttrib;
    worse = K.DefenseBad;
    stuff = (posn == 1) ? K.Shields:  K.Armors;
  }
  var name = LPick(stuff, GetI(Traits,'Level'));
  var qual = StrToInt(Split(name,1));
  name = Split(name,0);
  var plus = GetI(Traits,'Level') - qual;
  if (plus < 0) better = worse;
  var count = 0;
  while (count < 2 && plus) {
    var modifier = Pick(better);
    qual = StrToInt(Split(modifier, 1));
    modifier = Split(modifier, 0);
    if (Pos(modifier, name) > 0) break; // no repeats
    if (Abs(plus) < Abs(qual)) break; // too much
    name = modifier + ' ' + name;
    plus -= qual;
    ++count;
  }
  if (plus) name = plus + ' ' + name;
  if (plus > 0) name = '+' + name;

  Put(Equips, posn, name);
  game.bestequip = name;
  if (posn > 1) game.bestequip += ' ' + Equips.label(posn);
}


function Square(x) { return x * x; }

function WinStat() {
  var i;
  if (Odds(1,2))  {
    i = Stats.rows().eq(Random(Stats.length()));
  } else {
    // Favor the best stat so it will tend to clump
    var t = 0;
    Stats.rows().each(function (index,elt) {
      t += Square(StrToInt(Value(this)));
    });
    t = Random(t);
    Stats.rows().each(function (index,elt) {
      i = this;
      t -= Square(StrToInt(Value(this)));
      return t < 0;
    });
  }
  Add(Stats, Key(i), 1);
}

function SpecialItem() {
  return InterestingItem() + ' of ' + Pick(K.ItemOfs);
}

function InterestingItem() {
  return Pick(K.ItemAttrib) + ' ' + Pick(K.Specials);
}

function BoringItem() {
  return Pick(K.BoringItems);
}

function WinItem() {
  Add(Inventory, SpecialItem(), 1);
}

function CompleteQuest() {
  QuestBar.reset(50 + Random(1000));
  if (Quests.last().length) {
    Log('Quest completed: ' + Quests.last().text());
    Quests.rows().find("input:checkbox").attr("checked", "true");
    [WinSpell,WinEquip,WinStat,WinItem][Random(4)]();
  }
  while (Quests.length() > 99)
    Quests.remove0();

  game.questmonster = '';
  var caption;
  switch (Random(5)) {
  case 0: 
    var level = GetI(Traits,'Level');
    var lev = 0;
    for (var i = 1; i <= 4; ++i) {
      var montag = Random(K.Monsters.length);
      var m = K.Monsters[montag];
      var l = StrToInt(Split(m,1));
      if (i == 1 || Abs(l - level) < Abs(lev - level)) {
        lev = l;
        game.questmonster = m;
        game.questmonsterindex = montag;
      }
    }
    caption = 'Exterminate ' + Definite(Split(game.questmonster,0),2);
    break;
  case 1:
    caption = 'Seek ' + Definite(InterestingItem(), 1);
    break;
  case 2: 
    caption = 'Deliver this ' + BoringItem();
    break;
  case 3: 
    caption = 'Fetch me ' + Indefinite(BoringItem(), 1);
    break;
  case 4: 
    var mlev = 0;
    level = GetI(Traits,'Level');
    for (var ii = 1; ii <= 2; ++ii) {
      montag = Random(K.Monsters.length);
      m = K.Monsters[montag];
      l = StrToInt(Split(m,1));
      if ((ii == 1) || (Abs(l - level) < Abs(mlev - level))) {
        mlev = l;
        game.questmonster = m;
      }
    }
    caption = 'Placate ' + Definite(Split(game.questmonster,0),2);
    game.questmonster = '';  // We're trying to placate them, after all
    break;
  }
  if (!game.Quests) game.Quests = [];
  while (game.Quests.length > 99) game.Quests.shift();
  game.Quests.push(caption);
  game.bestquest = caption;
  Quests.AddUI(caption);
    
  
  Log('Commencing quest: ' + caption);

  SaveGame();
}

function toRoman(n) {
  if (!n) return "N";
  var s = "";
  function _rome(dn,ds) {
    if (n >= dn) {
      n -= dn;
      s += ds;
      return true;
    } else return false;
  }
  if (n < 0) {
    s = "-";
    n = -n;
  }
  while (_rome(1000,"M")) {0;}
  _rome(900,"CM");
  _rome(500,"D");
  _rome(400,"CD");
  while (_rome(100,"C")) {0;}
  _rome(90,"XC");
  _rome(50,"L");
  _rome(40,"XL");
  while (_rome(10,"X")) {0;}
  _rome(9,"IX");
  _rome(5,"V");
  _rome(4,"IV");
  while (_rome(1,"I")) {0;}
  return s;
}

function toArabic(s) {
  n = 0;
  s = s.toUpperCase();
  function _arab(ds,dn) {
    if (!Starts(s, ds)) return false;
    s = s.substr(ds.length);
    n += dn;
    return true;
  }
  while (_arab("M",1000)) {0;}
  _arab("CM",900);
  _arab("D",500);
  _arab("CD",400);
  while (_arab("C",100)) {0;}
  _arab("XC",90);
  _arab("L",50);
  _arab("XL",40);
  while (_arab("X",10)) {0;}
  _arab("IX",9);
  _arab("V",5);
  _arab("IV",4);
  while (_arab("I",1)) {0;}
  return n;
}

function CompleteAct() {
  Plots.rows().find("input:checkbox").attr("checked", "true");
  game.act += 1;
  PlotBar.reset(60 * 60 * (1 + 5 * game.act)); // 1 hr + 5/act
  while (Plots.length() > 99)
    Plots.remove0();
  Plots.AddUI((game.bestplot = 'Act ' + toRoman(game.act)));

  if (game.act > 1) {
    WinItem();
    WinEquip();
  }

  Brag('act');
}


function Log(line) {
  if (game.log)
    game.log[+new Date()] = line;
  // TODO: and now what?
}

function Task(caption, msec) {
  Kill.text(caption + '...');
  Log(Kill.text());
  game.kill = Kill.text();
  TaskBar.reset(msec);
}

function Add(list, key, value) {
  Put(list, key, value + GetI(list,key));

  /*$IFDEF LOGGING*/
  if (!value) return;
  var line = (value > 0) ? "Gained" : "Lost";
  if (key == 'Gold') {
    key = "gold piece";
    line = (value > 0) ? "Got paid" : "Spent";
  }
  if (value < 0) value = -value;
  line = line + ' ' + Indefinite(key, value);
  Log(line);
  /*$ENDIF*/
}

function AddR(list, key, value) {
  Put(list, key, toRoman(value + toArabic(Get(list,key))));
}

function Get(list, key) {
  var item = list.item(key);
  return Value(item);
}

function GetI(list, key) {
  return StrToIntDef(Get(list,key), 0);
}

function Min(a,b) {
  return a < b ? a : b;
}

function Max(a,b) {
  return a > b ? a : b;
}

function Sum(list) {
  var result = 0;
  list.rows().each(function (index) {
    result += StrToInt(Value(this));
  });
  return result;
}


function LevelUp() {
  Add(Traits,'Level',1);
  Add(Stats,'HP Max', GetI(Stats,'CON').div(3) + 1 + Random(4));
  Add(Stats,'MP Max', GetI(Stats,'INT').div(3) + 1 + Random(4));
  WinStat();
  WinStat();
  WinSpell();
  ExpBar.Position = 0;
  ExpBar.reset(LevelUpTime(GetI(Traits,'Level')));
  Brag('level');
}

function ClearAllSelections() {
  $.each(AllLists, function () {this.ClearSelection();});
}

function RoughTime(s) {
  if (s < 120) return s + ' seconds';
  else if (s < 60 * 120) return s.div(60) + ' minutes';
  else if (s < 60 * 60 * 48) return s.div(3600) + ' hours';
  else return s.div(3600 * 24) + ' days';
}

function Pos(needle, haystack) {
  return haystack.indexOf(needle) + 1;
}

function Timer1Timer() {
  if (TaskBar.done()) {
    game.tasks += 1;
    game.elapsed += TaskBar.Max.div(1000);

    ClearAllSelections();
      
    if (Kill.text() == 'Loading....') TaskBar.Max = 0;
      
    // gain XP / level up
    var gain = Pos('kill|', game.task) == 1;
    if (gain) {
      if (ExpBar.done()) 
        LevelUp();
      else 
        ExpBar.increment(TaskBar.Max / 1000);
    }

    // advance quest
    if (gain && game.act >= 1) {
      if (QuestBar.done() || !Quests.length()) {
        CompleteQuest();
      } else {
        QuestBar.increment(TaskBar.Max / 1000);
      }
    }
      
    // advance plot
    if (gain || !game.act) {
      if (PlotBar.done()) 
        InterplotCinematic();
      else 
        PlotBar.increment(TaskBar.Max / 1000);
    }
     
    Dequeue();
  } else {
    var elapsed = timeGetTime() - lasttick;
    if (elapsed > 100) elapsed = 100;
    if (elapsed < 0) elapsed = 0;
    TaskBar.increment(elapsed);
  }
  lasttick = timeGetTime();
}

function FormCreate() {
  ExpBar = new ProgressBar("ExpBar");
  PlotBar = new ProgressBar("PlotBar");
  TaskBar = new ProgressBar("TaskBar");
  QuestBar = new ProgressBar("QuestBar");
  EncumBar = new ProgressBar("EncumBar");

  AllBars = [ExpBar,PlotBar,TaskBar,QuestBar,EncumBar];

  // TODO: probably get rid of this line
  $.each(AllBars, function (i,bar) { bar.reset(1); });
  
  Traits = new ListBox("Traits", 2, true);
  Stats = new ListBox("Stats", 2, true);
  Spells = new ListBox("Spells", 2, false);
  Equips = new ListBox("Equips", 2, true);
  Inventory = new ListBox("Inventory", 2, false);
  Plots = new ListBox("Plots", 1);
  Quests = new ListBox("Quests", 1);

  Plots.load = function (sheet) {
    for (var i = Max(0, game.act-99); i <= game.act; ++i)
      this.AddUI(i ? 'Act ' + toRoman(i) : "Prologue");

  };

  AllLists = [Traits,Stats,Spells,Equips,Inventory,Plots,Quests];

  Kill = $("#Kill");

  $("#quit").click(quit);

  LoadCharacter();

  $(document).keypress(FormKeyDown);
}


function quit() {
  SaveGame();
  window.location = "roster.html";
}

function LoadCharacter() {
  var result = true;
  var name = window.location.href.split('#')[1];
  var sheet = loadSheet(name);

  if (!sheet) {
    alert("Error loading " + name);
    window.location = "roster.html";
    return;
  }

  if (!window.localStorage) {
    // Cookies can't hold a whole game save
    storage.removeItem("roster");
    storage = null;
  }

  LoadGame(sheet);

  $("#title").text("Progress Quest - " + GameSaveName());

  if (window.location.href.indexOf("?quit#") > 0)
    quit();  // TODO: cheesy
}



function Cheats() {
  if ($(".cheater").length) return;

  function cheat(label, effect) {
    $("<button/>", {
      class: "cheater",
      text: label,
      click: effect}).appendTo('body');
  }

  cheat("Task", function () {
    TaskBar.reposition(TaskBar.Max);
  });

  cheat("Level", function () {
    LevelUp();
  });

  cheat("Quest", function () {
    QuestBar.reposition(QuestBar.Max);
    TaskBar.reposition(TaskBar.Max);
  });

  cheat("Plot", function () {
    PlotBar.reposition(PlotBar.Max);
    TaskBar.reposition(TaskBar.Max);
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
  })

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

function HotOrNot() {
  // Figure out which spell is best
  var flat = 1;  // Flattening constant
  var best = 0, i;
  for (i = 1; i < Spells.length(); ++i) {
    if ((i+flat) * toArabic(Get(Spells,i)) >
        (best+flat) * toArabic(Get(Spells,best)))
      best = i;
  }
  game.bestspell = Spells.label(best) + ' ' + Get(Spells, best);

  /// And which stat is best?
  best = 0;
  for (i = 1; i <= 5; ++i) {
    if (GetI(Stats,i) > GetI(Stats,best)) 
      best = i;
  }
  game.beststat = Stats.label(best) + ' ' + GetI(Stats, best);
}


function SaveGame() {
  Log('Saving game: ' + GameSaveName());
  $.each(AllBars, function (i, e) { e.save(game); });
  HotOrNot();
  game.date = ''+new Date();
  game.stamp = +new Date();
  game.seed = randseed();
  return addToRoster(game);
}

function LoadGame(sheet) {
  game = sheet;
  randseed(game.seed);
  $.each(AllBars.concat(AllLists), function (i, e) { e.load(game); });
  Kill.text(game.kill);
  ClearAllSelections();
  $.each([Plots,Quests], function () {
    this.rows().find("input:checkbox").not(':last').attr("checked", "true");
  });
  Log('Loaded game: ' + name);
  if (!game.elapsed)
    Brag('start');
  StartTimer();
}

$(document).bind('beforeunload', function () {
  if (!storage)
    return "Are you sure you want to quit? All your progress will be lost!";
});

$(window).unload(function (event) {
  StopTimer();
  SaveGame();
});


function GameSaveName() {
  if (!game.saveName) {
    game.saveName = Get(Traits, 'Name');
    if (game.realm)
      game.saveName += ' [' + game.realm + ']';
  }
  return game.saveName;
}


function InputBox(message, def) {
  var i = prompt(message, def || '');
  return (i !== null) ? i : def;
}

function FormKeyDown(e) {
  if (e.which == 13) { // ^M
    game.motto = InputBox('Declare your motto!', game.motto);
    Brag('motto');
  }

  if (e.which == 2) { // ^B
    Brag('brag');
    //Navigate(GetHostAddr() + 'name=' + UrlEncode(Get(Traits,'Name')));
  }
  
  if (e.which == 3) { // ^C
    Cheats();
  }
  
  if (e.which == 7) { // ^G
    game.guild = InputBox('Choose a guild.\r\rMake sure you undestand the guild rules before you join one. To learn more about guilds, visit http://progressquest.com/guilds.php', game.guild);
    Brag("guild");
  }

}

function Navigate(url) {
  window.open(url);
}

function LFSR(pt, salt) {
  var result = salt;
  for (var k = 1; k <= Length(pt); ++k)
    result = Ord(pt[k]) ^ (result << 1) ^ (1 && ((result >> 31) ^ (result >> 5)));
  for (var kk = 1; kk <= 10; ++kk)
    result = (result << 1) ^ (1 && ((result >> 31) ^ (result >> 5)));
}


function Brag(trigger) {
  SaveGame();
  if (game.isonline) {
    game.bragtrigger = trigger;
    $.post("webrag.php", game, function (data, textStatus, request) {
      if (data.alert) 
        alert(data.alert);
    }, "json");
  } 
}

