// Copyright (c)2002-2010 Eric Fredricksen <e@fredricksen.net> all rights reserved

// revs:
// 6: pq 6.3/web 
// 5: pq 6.3
// 4: pq 6.2
// 3: pq 6.1
// 2: pq 6.0
// 1: pq 6.0, some early release I guess;)n't remember
var RevString = '&rev=6';

var game = {}; // queue: [] };


function timeGetTime() {
  return new Date().getTime();
}

function StartTimer() {
  if (!game.timerid) {
    game.lasttick = timeGetTime();
    game.timerid = setInterval(Timer1Timer, 100);
  }
  // BS location for this, but...
  // MainForm.Caption = 'ProgressQuest - ' + ChangeFileExt(ExtractFileName(MainForm.GameSaveName), '');
}

function GetPasskey() { return game.passkey; }
function SetPasskey(v) { game.passkey = v; }

function GetMotto() { return game.motto; }
function SetMotto(v) { game.motto = v; }

function GetHostName() { return game.hostname; }
function SetHostName(v) { game.hostname = v; }

function GetHostAddr() { return game.hostaddr; }
function SetHostAddr(v) { game.hostaddr = v; }

function GetLogin() { return game.login; }
function SetLogin(v) { game.login = v; }

function GetPassword() { return game.password; }
function SetPassword(v) { game.password = v; }

function GetGuild() { return game.guild; }
function SetGuild(v) { game.guild = v; }

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

function Pick(s) {
  return s[Random(s.length)];
}

function RandomLow(below) {
  return Min(Random(below), Random(below));
}

function PickLow(s) {
  return s[RandomLow(s.length)];
}

function Copy(s, b, l) {
  return s.substr(b, l);
}

function Ends(s, e) {
  return Copy(s,1+Length(s)-Length(e),Length(e)) = e;
}

function Plural(s) {
  if (Ends(s,'y')) 
    return Copy(s,1,Length(s)-1) + 'ies'
  else if (Ends(s,'us')) 
    return Copy(s,1,Length(s)-2) + 'i'
  else if (Ends(s,'ch') || Ends(s,'x') || Ends(s,'s')) 
    return s + 'es'
  else if (Ends(s,'f')) 
    return Copy(s,1,Length(s)-1) + 'ves'
  else if (Ends(s,'man') || Ends(s,'Man')) 
    return Copy(s,1,Length(s)-2) + 'en'
  else return s + 's';
}

function Split(s, field, separator) {
  return s.split(separator || "|")[field];
}

function Indefinite(s, qty) {
  if (qty == 1) {
    if (Pos(s[1], 'AEIOUÜaeiouü') > 0
   ) return 'an ' + s
    else return 'a ' + s;
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
  m = abs(m)
  if (m < 1 || m > a.length) return s;  // In case of screwups
  return a[m-1] + sep + s;
}

function Sick(m, s) {
  m = 6 - abs(m);
  return prefix(['dead','comatose','crippled','sick','undernourished'], m, s);
}


function Young(m, s) {
  m = 6 - abs(m);
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
    for (var i = 1; i <= Random(1 + Plots.length); ++i) {
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
    var nemesis = ImpressiveGuy;
    Q("task|2|Oh sweet relief! You've reached the protection of the good " + nemesis);
    Q('task|3|There is rejoicing, and an unnerving encouter with ' + nemesis + ' in private');
    Q('task|2|You forget your ' + BoringItem() + ' and go back to get it');
    Q("task|2|What's this!? You overhear something shocking!");
    Q('task|2|Could ' + nemesis + ' be a dirty double-dealer?');
    Q('task|3|Who can possibly be trusted with this news!? ... Oh yes, of course');
    break;
  }
  Q('plot|1|Loading');
}


function StrToInt(s) {
  return s.valueOf();
}

function TMainForm_NamedMonster(level) {
  var lev = 0;
  var result = '';
  for (var i = 1; i <= 5; ++i) {
    var m = Pick(K.Monsters.Lines);
    if (result == '' || (abs(level-StrToInt(Split(m,1))) < abs(level-lev))) {
      result = Split(m,0);
      lev = StrToInt(Split(m,1));
    }
  }
  return GenerateName + ' the ' + result;
}

function TMainForm_ImpressiveGuy() {
  return Pick(K.ImpressiveTitles.Lines) + 
    (Random(2) ? ' of the ' + Pick(K.Races.Lines) : ' of ' + GenerateName);
}

function TMainForm_MonsterTask(level) {
  var definite = false;
  for (var i = level; i >= 1; --i) {
    if (Odds(2,5))
      level += RandSign();
  }
  if (level < 1) level = 1;
  // level = level of puissance of opponent(s) we'll return

  if (Odds(1,25)) {
    // Use an NPC every once in a while
    var monster = ' ' + Pick(NewGuyForm.Race);
    if (Odds(1,2)) {
      monster = 'passing' + monster + ' ' + Pick(NewGuyForm.Klass);
    } else {
      monster = PickLow(K.Titles.Lines) + ' ' + GenerateName + ' the' + monster;
      definite = true;
    }
    var lev = level;
    monster = monster + '|' + IntToStr(level) + '|*';
  } else if ((game.questmonster != '') && Odds(1,4)) {
    // Use the quest monster
    var monster = k.Monsters.Lines[fQuest.Tag];
    var lev = StrToInt(Split(monster,1));
  } else {
    // Pick the monster out of so many random ones closest to the level we want
    var monster = Pick(K.Monsters.Lines);
    var lev = StrToInt(Split(monster,1));
    for (var i = 0; i < 5; ++i) {
      var m1 = Pick(K.Monsters.Lines);
      if (abs(level-StrToInt(Split(m1,1))) < abs(level-lev)) {
        monster = m1;
        lev = StrToInt(Split(monster,1));
      }
    }
  }

  game.task = monster;
  var result = Split(monster,0);
  game.task = 'kill|' + game.task;

  var qty = 1;
  if ((level-lev) > 10) {
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
  } else if (((level-lev) < 0) && (Random(2) = 1)) {
    result = Sick(level-lev,result);
  } else if (((level-lev) < 0)) {
    result = Young(level-lev,result);
  } else if ((level-lev) >= 10) {
    result = 'messianic ' + result;
  } else if ((level-lev) > 5) {
    i = 10-(level-lev);
    i = 5-Random(i+1);
    result = Big(i,Special((level-lev)-i,result));
  } else if (((level-lev) > 0) && (Random(2) = 1)) {
    result = Big(level-lev,result);
  } else if (((level-lev) > 0)) {
    result = Special(level-lev,result);
  }

  lev = level;
  level = lev * qty;

  if (!definite) result = Indefinite(result, qty);
  return { 'description': result, 'level': level };
}

function ProperCase(s) {
  return UpperCase(Copy(s,1,1)) + Copy(s,2,10000);
}

function TMainForm_EquipPrice() {
  return  5 * GetI(Traits,'Level') * GetI(Traits,'Level')
          + 10 * GetI(Traits,'Level')
          + 20;
}

function Dequeue() {
  while (TaskDone()) {
    if (Split(game.task,0) == 'kill') {
      if (Split(game.task,3) == '*') {
        WinItem();
      } else if (Split(game.task,3) != '') {
        Add(Inventory,LowerCase(Split(game.task,1) + ' ' + ProperCase(Split(game.task,3))),1);
      }
    } else if (game.task == 'buying') {
      // buy some equipment
      Add(Inventory,'Gold',-EquipPrice);
      WinEquip();
    } else if ((game.task == 'market') || (game.task == 'sell')) {
      if (game.task = 'sell') {
        Inventory.Tag = GetI(Inventory.Inventory,1);
        Inventory.Tag = Inventory.Tag * GetI(Traits,'Level');
        if (Pos(' of ', Inventory[1].Caption) > 0)
          Inventory.Tag = Inventory.Tag * (1+RandomLow(10)) * (1+RandomLow(GetI(Traits,'Level')));
        Inventory[0].MakeVisible(false);
        Inventory.Delete(1);
        Add(Inventory, 'Gold', Inventory.Tag);
      }
      if (Items.length > 1) {
        Task('Selling ' + Indefinite(Inventory[1].Caption, GetI(Inventory,1)), 1 * 1000);
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
        if (a == 'plot') {
          CompleteAct();
          s = 'Loading ' + Plots[Plots.length-1].Caption;
        }
        Task(s, n * 1000);
        game.queue.shift();
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
      var n = GetI(Traits, 'Level');
      var t = MonsterTask(n);
      var InventoryLabelAlsoGameStyleTag = 3;
      var n = Math.floor((2 * InventoryLabelAlsoGameStyleTag * t.level * 1000) / n);
      Task('Executing ' + t.description, n);
    }
  }
}

function IndexOf(list, key) {
  for (var i = 0; i < list.length; ++i)
    if (list.Item[i].Caption == key) 
      return i;
  var item = list.Add;
  item.Caption = key;
  item.MakeVisible(false);
  list.Width = list.Width - 1; // trigger an autosize
  return item.Index;
}

function TMainForm_Put(list, key, value) {
  Put(list, IndexOf(list,key), value);
}

function TMainForm_Put(list, key, value) {
  Put(list,key,IntToStr(value));
  if (key == 'STR')
    Encumbar.Max = 10 + value;
  if (list == Inventory) {
    Encumbar.Position = Sum(Inventory) - GetI(Inventory,'Gold');
    Encumbar.Hint = IntToStr(Encumbar.Position) + '/' + IntToStr(Encumbar.Max) + ' cubits';
  }
}

function TMainForm_Put(list, pos, value) {
  var item = list.Item[pos];
  if (item.SubItems.length < 1) 
    item.SubItems.Add(value);
  else 
    item.SubItems[0] = value;
  list[pos].Selected = true;
}

function LevelUpTime(level) {  // seconds 
  // 20 minutes per level
  return 20 * level * 60;
}


function ProgressBar(id) {
  this.bar = $("#"+ id + " > .bar");

  this.reset = function (newmax) {
    this.Max = newmax;
    this.reposition(0);
  }

  this.reposition = function (newpos) {
    this.Position = newpos;
    this.bar.css("width", 100 * this.Position / this.Max + "%")
  }

  this.increment = function (inc) {
    this.reposition(this.Position + inc);
  }

  this.done = function () {
    return this.Position >= this.Max;
  }
};


function ListBox(id) {
  this.box = $("#"+ id);

  this.Add = function (caption) {
    var tr = this.box.append("<tr><td>" + caption + "</td></tr>");
    return tr;
  }

  this.ClearSelection = function () {
    // TODO
  }
};


var ExpBar, PlotBar, TaskBar, QuestBar;
var Traits,Stats,Spells,Equips,Inventory,Plots,Quests;
var Kill;
    
    
function GoButtonClick() {
  ExpBar = new ProgressBar("ExpBar");
  PlotBar = new ProgressBar("PlotBar");
  TaskBar = new ProgressBar("TaskBar");
  QuestBar = new ProgressBar("QuestBar");

  Traits = new ListBox("Traits");
  Stats = new ListBox("Stats");
  Spells = new ListBox("Spells");
  Equips = new ListBox("Equips");
  Inventory = new ListBox("Inventory");
  Plots = new ListBox("Plots");
  Quests = new ListBox("Quests");

  Kill = $("#Kill");


  ExpBar.reset(LevelUpTime(1));

  game.task = '';
  game.questmonster = '';
  game.queue = [];

  Task('Loading.',2000); // that dot is spotted for later...
  Q('task|10|Experiencing an enigmatic and foreboding night vision');
  Q("task|6|Much is revealed about that wise old bastard you'd underestimated");
  Q('task|6|A shocking series of events leaves you alone and bewildered, but resolute');
  Q('task|4|Drawing upon an unexpected reserve of determination, you set out on a long and dangerous journey');
  Q('task|2|Loading');

  PlotBar.reset(26);
  Plots.Add('Prologue');

  StartTimer();
  SaveGame();
  Brag('s');
}


$(document).ready(GoButtonClick);


function TMainForm_WinSpell() {
  AddR(Spells, K.Spells.Lines[RandomLow(Min(GetI(Stats,'WIS')+GetI(Traits,'Level'),
                                            K.Spells.Lines.length))], 1);
}

function LPick(list, goal) {
  var result = Pick(list);
  for (var i = 1; i <= 5; ++i) {
    var best = StrToInt(Split(result, 1));
    var s = Pick(list);
    var b1 = StrToInt(Split(s,1));
    if (abs(goal-best) > abs(goal-b1))
      result = s;
  }
  return result;
}

function TMainForm_WinEquip() {
  var posn = Random(Equips.length);
  Equips.Tag = posn; // remember as the "best item"
  if (posn == 0) {
    stuff = K.Weapons.Lines;
    better = K.OffenseAttrib.Lines;
    worse = K.OffenseBad.Lines;
  } else {
    better = K.DefenseAttrib.Lines;
    worse = K.DefenseBad.Lines;
    if (posn == 1) 
      stuff = K.Shields.Lines
    else 
      stuff = K.Armors.Lines;
  }
  var name = LPick(stuff,GetI(Traits,'Level'));
  var qual = StrToInt(Split(name,1));
  name = Split(name,0);
  var plus = GetI(Traits,'Level') - qual;
  if (plus < 0) better = worse;
  var count = 0;
  while ((count < 2) && (plus != 0)) {
    var modifier = Pick(better);
    qual = StrToInt(Split(modifier, 1));
    modifier = Split(modifier, 0);
    if (Pos(modifier, name) > 0) Break; // no repeats
    if (Abs(plus) < Abs(qual)) Break; // too much
    name = modifier + ' ' + name;
    plus -= qual;
    ++count;
  }
  if (plus != 0) name = plus + ' ' + name;
  if (plus > 0) name = '+' + name;

  Put(Equips, posn, name);
}


function Square(x) { return x * x; }

function TMainForm_WinStat() {
  var i;
  if (Odds(1,2))  {
    i = Random(Stats.length)
  } else {
    // Favor the best stat so it will tend to clump
    var t = 0;
    for (i = 0; i <= 5; ++i) t += Square(GetI(Stats,i));
    t = Random(t);
    i = -1;
    while (t >= 0) {
      ++i;
      t -= Square(GetI(Stats,i));
    }
  }
  Add(Stats, Stats[index].Caption, 1);
}

function TMainForm_SpecialItem() {
  return InterestingItem + ' of ' + Pick(K.ItemOfs.Lines);
}

function TMainForm_InterestingItem() {
  return Pick(K.ItemAttrib.Lines) + ' ' + Pick(K.Specials.Lines);
}

function TMainForm_BoringItem() {
  return Pick(K.BoringItems.Lines);
}

function TMainForm_WinItem() {
  Add(Inventory, SpecialItem, 1);
}

function TMainForm_CompleteQuest() {
  var lev = 0;  // Quell stupid compiler warning
  QuestBar.Position = 0;
  QuestBar.Max = 50 + Random(100);
  if (Quests.length > 0) {
    /*$IFDEF LOGGING*/
    Log('Quest completed: ' + Quests[Quests.length-1].Caption);
    /*$ENDIF*/
    Quests[Quests.length-1].StateIndex = 1;
    [WinSpell,WinEquip,WinStat,WinItem][Random(4)]();
    while (Quest.length > 99) Quest.Delete(0);

    var item = Quest.Add;
    switch (Random(5)) {
    case 0: 
      var level = GetI(Traits,'Level');
      for (var i = 1; i <= 4; ++i) {
        var montag = Random(K.Monsters.Lines.length);
        var m = K.Monsters.Lines[montag];
        var l = StrToInt(Split(m,1));
        if (i == 1 || abs(l - level) < abs(lev - level)) {
          var lev = l;
          game.questmonster = m;
          fQuest.Tag = montag;
        }
      }
      item.Caption = 'Exterminate ' + Definite(Split(game.questmonster,0),2);
      break;
    case 1:
      game.questmonster = InterestingItem;
      Caption = 'Seek ' + Definite(game.questmonster,1);
      game.questmonster = '';
      break;
    case 2: 
      game.questmonster = BoringItem;
      Caption = 'Deliver this ' + game.questmonster;
      game.questmonster = '';
      break;
    case 3: 
      game.questmonster = BoringItem;
      Caption = 'Fetch me ' + Indefinite(game.questmonster,1);
      game.questmonster = '';
      break;
    case 4: 
      level = GetI(Traits,'Level');
      for (var i = 1; i <= 2; ++i) {
        montag = Random(K.Monsters.Lines.length);
        m = K.Monsters.Lines[montag];
        l = StrToInt(Split(m,1));
        if ((i == 1) || (abs(l - level) < abs(lev - level))) {
          lev = l;
          game.questmonster = m;
        }
      }
      Caption = 'Placate ' + Definite(Split(game.questmonster,0),2);
      game.questmonster = '';
      break;
    }
    /*$IFDEF LOGGING*/
    Log('Commencing quest: ' + Caption);
    /*$ENDIF*/
    item.StateIndex = 0;
    item.MakeVisible(false);
  }
  Quest.Width = Quest.Width - 1;  // trigger a column resize
  SaveGame();
}

Number.prototype.toRoman = function() {
  n = this;
  if (n == 0) return "N";
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
  while (_rome(1000,"M")) {}
  _rome(900,"CM");
  _rome(500,"D");
  _rome(400,"CD");
  while (_rome(100,"C")) {}
  _rome(90,"XC");
  _rome(50,"L");
  _rome(40,"XL");
  while (_rome(10,"X")) {}
  _rome(9,"IX");
  _rome(5,"V");
  _rome(4,"IV");
  while (_rome(1,"I")) {}
  return s;
}

String.prototype.toArabic = function() {
  n = 0;
  s = this.toUpperCase();
  function _arab(ds,dn) {
    if (!s.prefix(ds)) return false;
    s = s.substr(ds.length);
    n += dn;
    return true;
  }
  while (_arab("M",1000)) {}
  _arab("CM",900);
  _arab("D",500);
  _arab("CD",400);
  while (_arab("C",100)) {}
  _arab("XC",90);
  _arab("L",50);
  _arab("XL",40);
  while (_arab("X",10)) {}
  _arab("IX",9);
  _arab("V",5);
  _arab("IV",4);
  while (_arab("I",1)) {}
  return n;
}

function TMainForm_CompleteAct() {
  PlotBar.Position = 0;
  Plots[Plots.length-1].StateIndex = 1;
  PlotBar.Max = 60 * 60 * (1 + 5 * Plots.length); // 1 hr + 5/act
  PlotBar.Hint = 'Cutscene omitted';
  var item = Plots.Add;
  item.Caption = 'Act ' + (PlotsItems.length-1).toRoman();
  item.MakeVisible(false);
  item.StateIndex = 0;
  item.Width = item.Width-1;

  WinItem();
  WinEquip();
  SaveGame();
  Brag('a');
}


/*$IFDEF LOGGING*/
function Log(line) {
  /* TODO
  if (FLogEvents) {
    var logname = ChangeFileExt(GameSaveName, '.log');
    DateTimeToString(stamp, '[yyyy-mm-dd hh:nn:ss]', Now);
    AssignFile(log, logname);
    if (FileExists(logname)) Append(log); else Rewrite(log);
    WriteLn(log, stamp + ' ' + line);
    Flush(log);
    CloseFile(log);
  }
  */
}
/*$ENDIF*/

function TMainForm_ExportCharSheet() {
  AssignFile(f, ChangeFileExt(GameSaveName, '.sheet'));
  Rewrite(f);
  Write(f, CharSheet());
  Flush(f);
  CloseFile(f);
}

function TMainForm_CharSheet() {
  var f = '';
  function Wr(a) { f = f + a; }
  function WrLn(a) { if (a != undefined) Wr(a); Wr("\r\n"); }

  Wr(Get(Traits,'Name'));
  if (GetHostName != '')
    Wr(' [' + GetHostName + ']');
  WrLn;
  WrLn(Get(Traits,'Race') + ' ' +  Get(Traits,'Class'));
  WrLn(Format('Level %d (exp. %d/%d)', [GetI(Traits,'Level'), ExpBar.Position, ExpBar.Max]));
  //WrLn('Level ' + Get(Traits,'Level') + ' (' + ExpBar.Hint + ')');
  WrLn;
  if (Plots.length > 0)
    WrLn('Plot stage: ' + Plots[Plots.length-1].Caption + ' (' + PlotBar.Hint + ')');
  if (Quests.length > 0)
    WrLn('Quest: ' + Quests[Quests.length-1].Caption + ' (' + QuestBar.Hint + ')');
  WrLn();
  WrLn( 'Stats:');
  WrLn( Format('  STR%7d', [GetI(Stats,'STR')]));
  WrLn( Format('  CON%7d', [GetI(Stats,'CON')]));
  WrLn( Format('  DEX%7d', [GetI(Stats,'DEX')]));
  WrLn( Format('  INT%7d', [GetI(Stats,'INT')]));
  WrLn( Format('  WIS%7d      HP Max%7d', [GetI(Stats,'WIS'), GetI(Stats,'HP Max')]));
  WrLn( Format('  CHA%7d      MP Max%7d', [GetI(Stats,'CHA'), GetI(Stats,'MP Max')]));
  WrLn();
  WrLn( 'Equipment:');
  for (var i = 1; i <= Equips.length-1; ++i)
    if (Get(Equips,i) != '')
      WrLn( '  ' + LeftStr(Equips[i].Caption + '            ', 12) + Get(Equips,i));
  WrLn();
  WrLn( 'Spell Book:');
  for (var i = 1; i <= Items.length-1; ++i)
    WrLn( '  ' + Spells[i].Caption + ' ' + Get(Spells,i));
  WrLn();
  WrLn( 'Inventory (' + EncumBar.Hint + '):');
  WrLn( '  ' + Indefinite('gold piece', GetI(Inventory, 'Gold')));
  for (var i = 2; i <= Items.length-1; ++i) {
    if (Pos(' of ', Inventory[i].Caption) > 0) 
      WrLn( '  ' + Definite(Inventory[i].Caption, GetI(Inventory,i)));
    else 
      WrLn( '  ' + Indefinite(Items[i].Caption, GetI(Inventory,i)));
  }
  WrLn();
  WrLn( '-- ' + DateTimeToStr(Now));
  WrLn( '-- Progress Quest 6.2 - http://progressquest.com/');
  return f;
}


function Task(caption, msec) {
  Kill.text(caption + '...');
  /*$IFDEF LOGGING*/
  Log(Kill.text());
  /*$ENDIF*/
  TaskBar.reset(msec);
}

function TMainForm_Add(list, key, value) {
  Put(list, key, value + GetI(list,key));
  if (value = 0) Exit;

  var line = (value > 0) ? 'Gained' : 'Lost';
  if (key == 'Gold') {
    key = 'gold piece';
    line = (value > 0) ? 'Got paid' : 'Spent';
  }
  if (value < 0) value = -value;
  line = line + ' ' + Indefinite(key, value);
  /*$IFDEF LOGGING*/
  Log(line);
  /*$ENDIF*/
}

function TMainForm_AddR(list, key, value) {
  Put(list, key, (value + Get(list,key).toArabic()).toRoman());
}

function TMainForm_Get(list, key) {
  return Get(list, IndexOf(list, key));
}

function TMainForm_Get(list, index) {
  var item = list.Item[index];
  return (item.SubItems.length < 1) ? '' : item.SubItems[0];
}

function TMainForm_GetI(list, key) {
  return StrToIntDef(Get(list,key), 0);
}

function TMainForm_GetI(list, index) {
  return StrToIntDef(Get(list,index), 0);
}

function TMainForm_Sum(list) {
  var result = 0;
  for (var i = 0; i <= list.length - 1; ++i)
    Result += GetI(list,i);
}

function PutLast(list, value) {
  if (list.length > 0) {
    with (list.Item[list.length-1]) {
      if (SubItems.length < 1) 
        SubItems.Add(value);
      else 
        SubItems[0] = value;
    }
  }
  list.Width = list.Width - 1; // trigger an autosize
}

Number.prototype.div = function (divisor) {
  var dividend = this / divisor;
  return (dividend < 0 ? Math.ceil : Math.floor)(dividend);
}

function LevelUp() {
  Add(Traits,'Level',1);
  Add(Stats,'HP Max', GetI(Stats,'CON').div(3) + 1 + Random(4));
  Add(Stats,'MP Max', GetI(Stats,'INT').div(3) + 1 + Random(4));
  WinStat();
  WinStat();
  WinSpell();
  with (ExpBar) {
    Position = 0;
    Max = LevelUpTime(GetI(Traits,'Level'));
  }
  SaveGame();
  Brag('l');
}

function ClearAllSelections() {
  Equips.ClearSelection();
  Spells.ClearSelection();
  Stats.ClearSelection();
  Traits.ClearSelection();
  Inventory.ClearSelection();
  Plots.ClearSelection();
  Quests.ClearSelection();
}

function RoughTime(s) {
  if (s < 120) return s + ' seconds'
  else if (s < 60 * 120) return s.div(60) + ' minutes'
  else if (s < 60 * 60 * 48) return s.div(3600) + ' hours'
  else return s.div(3600 * 24) + ' days';
}

function Pos(haystack, needle) {
  return haystack.indexOf(needle) + 1;
}

function Timer1Timer() {
  var gain = Pos('kill|',game.task) == 1;
  if (TaskBar.done()) {
    ClearAllSelections();
      
    if (Kill.text() == 'Loading....') TaskBar.Max = 0;
      
    // gain XP / level up
    if (gain) {
      if (ExpBar.done()) 
        LevelUp();
      else 
        ExpBar.increment(TaskBar.Max / 1000);
    }
    ExpBar.Hint = Math.floor(ExpBar.Max-ExpBar.Position) + ' XP needed for next level';

    // advance quest
    if (gain) {
      if (Plots.length > 1) {
        if (QuestBar.done()) {
          CompleteQuest();
        } else if (Quests.length > 0) {
          QuestBar.increment(TaskBar.Max / 1000);
          QuestBar.Hint = IntToStr(100 * QuestBar.Position.div(QuestBar.Max)) + '% complete';
        }
      }
    }
      
    // advance plot
    if (gain) {
      if (PlotBar.done()) InterplotCinematic();
      else PlotBar.increment(TaskBar.Max / 1000);

      PlotBar.Hint = RoughTime(PlotBar.Max-PlotBar.Position) + ' remaining';
    }
     
    Dequeue();
  } else {
    var elapsed = timeGetTime() - game.lasttick;
    if (elapsed > 100) elapsed = 100;
    if (elapsed < 0) elapsed = 0;
    TaskBar.increment(elapsed);
  }
  game.lasttick = timeGetTime();
}

function TMainForm_FormCreate() {
  QuestBar.Position = 0;
  PlotBar.Position = 0;
  TaskBar.Position = 0;
  ExpBar.Position = 0;
  Encumbar.Position = 0;

  FReportSave = true;
  FLogEvents = false;
  FMakeBackups = true;
  FMinToTray = true;
  FExportSheets = false;
}

function TMainForm_SpeedButton1Click() {
  /*$IFDEF CHEATS*/
  TaskBar.reposition(TaskBar.Max);
  /*$ENDIF*/
}

function TMainForm_RollCharacter() {
  var reuslt = true;
  for (;;) {
    if (! NewGuyForm.Go())
      return false;
    Put(Traits, 'Name', NewGuyForm.Name.Text);
    if (FileExists(GameSaveName) &&
        (mrNo = MessageDlg('The saved game "' + GameSaveName + '" already exists. Do you want to overwrite it?', mtWarning, [mbYes,mbNo], 0))) {
      // go around again
    } else {
      f = FileCreate(GameSaveName);
      if (f = -1) {
        ShowMessage("The thought police don't like the name '" + GameSaveName + "'. Choose a name without \\ / : * ? \" < > || | in it.");
      } else {
        FileClose(f);
        Break;
      }
    }
  }

  with (NewGuyForm) {
    Put(Traits,'Name',Name.Text);
    Put(Traits,'Race',Race[Race.ItemIndex]);
    Put(Traits,'Class',Klass[Klass.ItemIndex]);
    Put(Traits,'Level',1);
    Put(Stats,'STR',STR.Tag);
    Put(Stats,'CON',CON.Tag);
    Put(Stats,'DEX',DEX.Tag);
    Put(Stats,'INT',INT.Tag);
    Put(Stats,'WIS',WIS.Tag);
    Put(Stats,'CHA',CHA.Tag);
    Put(Stats,'HP Max',Random(8) + CON.Tag.div(6));
    Put(Stats,'MP Max',Random(8) + INT.Tag.div(6));
    Put(Equips,'Weapon','Sharp Stick');
    Put(Inventory,'Gold',0);
    ClearAllSelections;
    GoButtonClick(NewGuyForm);
  }
}

var KUsage =
    'Usage: pq [flags] [game.pq3]\n' +
    '\n' +
    'Flags:\n' +
    '  -no-backup     Do ! make a backup file when saving the game\n' +
    /*$IFDEF LOGGING*/
    '  -log           Create a text log) { events as they occur in the game\n' +
    /*$ENDIF*/
    '  -no-report-save   Do ! display the "Game saved" message when saving\n' +
    '  -no-tray       Do ! minimize to the system tray\n' +
    '  -export        Export a text character sheet periodically\n' +
    '  -export-only   Export a text character sheet now,) exit\n' +
    '  -no-proxy      Do ! use Internet Explorer proxy settings\n' +
    '  -help          Display this chatter (and exit)\n' ;

function TMainForm_FormShow() {
  if (Timer1.Enabled) Exit;
  var done = false;
  var exportandexit = false;
  for (var i = 1; i <= ParamCount; ++i) {
    if (ParamStr(i) == '-backup') FMakeBackups = true
    /*$IFDEF LOGGING*/
    else if (ParamStr(i) == '-log') FLogEvents = true
    /*$ENDIF*/
    else if (ParamStr(i) == '-no-report-save') FReportSave = false
    else if (ParamStr(i) == '-no-tray') FMinToTray = false
    else if (ParamStr(i) == '-export') FExportSheets = true
    else if (ParamStr(i) == '-export-only') exportandexit = true
    else if (ParamStr(i) == '-no-proxy') ProxyOK = false
    else if (ParamStr(i) == '-help') {
      ShowMessage(KUsage);
      Close();
      Exit();
    } else {
      LoadGame(ParamStr(i));
      if (exportandexit) {
        ExportCharSheet();
        Timer1.Enabled = false;
        Close();
      }
      Exit();
    }
  }
  while (!done) {
    SetHostName('');
    SetHostAddr('');
    SetLogin('');
    SetPassword('');
    switch (FrontForm.ShowModal) {
    case mrOk: 
      done = RollCharacter;
      break;
    case mrRetry:
      // load
      if (FrontForm.OpenDialog1.Execute) {
        LoadGame(FrontForm.OpenDialog1.Filename);
        done = true;
      }
      break;
    case mrYesToAll: 
      done = ServerSelectForm.Go;
      break;
    case mrCancel:
      Close();
      done = true;
      break;
    }
  }
}

function TMainForm_Button1Click() {
  /*$IFDEF CHEATS*/
  LevelUp();
  /*$ENDIF*/
}

function TMainForm_CashInClick() {
  /*$IFDEF CHEATS*/
  WinEquip;
  WinItem;
  WinSpell;
  WinStat;
  Add(Inventory,'Gold',Random(100));
  /*$ENDIF*/
}

function TMainForm_FinishQuestClick() {
  /*$IFDEF CHEATS*/
  QuestBar.reposition(QuestBar.Max);
  TaskBar.reposition(TaskBar.Max);
  /*$ENDIF*/
}

function TMainForm_CheatPlotClick() {
  /*$IFDEF CHEATS*/
  PlotBar.reposition(PlotBar.Max);
  TaskBar.reposition(TaskBar.Max);
  /*$ENDIF*/
}

function SaveGame() {
  /* TODO
  Log('Saving game: ' + GameSaveName());
  try {
    if (FMakeBackups) {
      DeleteFile(ChangeFileExt(GameSaveName, '.bak'));
      MoveFile(PChar(GameSaveName), PChar(ChangeFileExt(GameSaveName, '.bak')));
    }
    f = TFileStream.Create(GameSaveName, fmCreate);
  } catch (EfCreateError) {
    return false;
  }

  //ClearAllSelections;
  var m = TMemoryStream.Create;
  for (var i = 0; i < ComponentCount-1; ++i)
    m.WriteComponent(Components[i]);

  m.Seek(0, soFromBeginning);
  ZCompressStream(m, f);

  m.Free();
  f.Free()
  return true;;
  */
}

function TMainForm_LoadGame(name) {
  FSaveFileName = name;
  var m = TMemoryStream.Create;
  var f = TFileStream.Create(name, fmOpenRead);
  Traits.Clear();
  Stats.Clear();
  Equips.Clear();
  m.Seek(0, soFromBeginning);
  for (i = 0; i <= ComponentCount-1; ++i)
    m.ReadComponent(Components[i]);
  m.Free();
  /*$IFDEF LOGGING*/
  Log('Loaded game: ' + name);
  /*$ENDIF*/
  StartTimer();
  TriggerAutosizes();
}

function TMainForm_TriggerAutosizes() {
  Plots.Width = 100;
  Quests.Width = 100;
  Inventory.Width = 100;
  Equips.Width = 100;
  Spells.Width = 100;
  Traits.Width = 100;
  Stats.Width = 100;
}

function TMainForm_FormClose() {
  if (Timer1.Enabled) {
    Timer1.Enabled = false;
    if (SaveGame())
      if (FReportSave)
        ShowMessage('Game saved as ' + GameSaveName);
  }
  FReportSave = true;
  Action = caFree;
}

function TMainForm_GameSaveName()
{
  if (FSaveFileName = '') {
    FSaveFileName = Get(Traits,'Name');
    if (GetHostName != '')
      FSaveFileName = FSaveFileName + ' [' + GetHostName + ']';
    FSaveFileName = FSaveFileName + kFileExt;
    FSaveFileName = ExpandFileName(PChar(FSaveFileName));
  }
  return FSaveFileName;
}

function TMainForm_FormKeyDown() {
  if ((FindWindow('TAppBuilder', nil) > 0) && (ssCtrl in Shift) && (ssShift in Shift) && (Key = ord('C'))) {
    /*$IFDEF CHEATS*/
    Cheats.Visible = ! Cheats.Visible;
    /*$ENDIF*/
  }
  if ((ssCtrl in Shift) && (Key = ord('A'))) {
    ShowMessage(CharSheet);
  }
  if (GetPasskey = 0) Exit; // no need for these things
  if ((ssCtrl in Shift) && (Key = ord('B'))) {
    Brag('b');
    Navigate(GetHostAddr + 'name=' + UrlEncode(Get(Traits,'Name')));
  }
  if ((ssCtrl in Shift) && (Key = ord('M'))) {
    SetMotto(InputBox('Progress Quest', 'Declare your motto!', GetMotto));
    Brag('m');
    Navigate(GetHostAddr + 'name=' + UrlEncode(Get(Traits,'Name')));
  }
  if ((ssCtrl in Shift) && (Key = ord('G'))) {
    SetGuild(InputBox('Progress Quest', 'Choose a guild.\r\rMake sure you undestand the guild rules before you join one. To learn more about guilds, visit http://progressquest.com/guilds.php', GetGuild));
    Guildify;
  }
}

function Navigate(url) {
  ShellExecute(GetDesktopWindow(), 'open', PChar(url), nil, '', SW_SHOW);
}

function LFSR(pt, salt) {
  var result = salt;
  for (var k = 1; k <= Length(pt); ++k)
    result = Ord(pt[k]) ^ (result << 1) ^ (1 && ((result >> 31) ^ (result >> 5)));
  for (var k = 1; k <= 10; ++k)
    result = (result << 1) ^ (1 && ((result >> 31) ^ (result >> 5)));
}


function Brag(trigger) {
  /* TODO
  var flat = 1;
  if (FExportSheets)
    ExportCharSheet;
  if (GetPasskey = 0) return; // not a online game!
  var url = 'cmd=b&t=' + trigger;
  with (Traits) for (i = 0; i <= Items.length-1; ++i) 
    url = url + '&' + LowerCase(Items[i].Caption[1]) + '=' + UrlEncode(Items[i].Subitems[0]);
  url = url + '&x=' + IntToStr(ExpBar.Position);
  url = url + '&i=' + UrlEncode(Get(Equips,Equips.Tag));
  if (Equips.Tag > 1) url = url + '+' + Equips[Equips.Tag].Caption;
  var best = 0;
  if (Spells.length > 0) with (Spells) {
    for (i = 1; i <= Items.length-1; ++i)
      if ((i+flat) * RomanToInt(Get(Spells,i)) >
          (best+flat) * RomanToInt(Get(Spells,best)))
        best = i;
    url = url + '&z=' + UrlEncode(Items[best].Caption + ' ' + Get(Spells,best));
  }
  best = 0;
  for (var i = 1; i <= 5; ++i)
    if (GetI(Stats,i) > GetI(Stats,best)) best = i;
  url = url + '&k=' + Stats[best].Caption + '+' + Get(Stats,best);
  url = url + '&a=' + UrlEncode(Plots[Plots.length-1].Caption);
  url = url + '&h=' + UrlEncode(GetHostName);
  url = url + RevString;
  url = url + '&p=' + IntToStr(LFSR(url, GetPasskey));
  url = url + '&m=' + UrlEncode(GetMotto);
  url = AuthenticateUrl(GetHostAddr + url);
  try {
    body = DownloadString(url);
    if ((LowerCase(Split(body,0)) = 'report'))
      ShowMessage(Split(body,1));
  } catch (EWebError) {
    // 'ats okay.
  }
  */
}

function TMainForm_AuthenticateUrl(url) {
  if ((GetLogin != '') || (GetPassword != ''))
    return StuffString(url, 8, 0, GetLogin+':'+GetPassword+'@')
  else
    return url;
}

function TMainForm_Guildify() {
  if (GetPasskey = 0) return; // not a online game!
  var url = 'cmd=guild';
  with (Traits) for (i = 0; i <= Items.length-1; ++i)
    url = url + '&' + LowerCase(Items[i].Caption[1]) + '=' + UrlEncode(Items[i].Subitems[0]);
  url = url + '&h=' + UrlEncode(GetHostName);
  url = url + RevString;
  url = url + '&guild=' + UrlEncode(GetGuild);
  url = url + '&p=' + IntToStr(LFSR(url, GetPasskey));
  url = AuthenticateUrl(GetHostAddr + url);
  try {
    b = DownloadString(url);
    s = Take(b);
    if (s != '') ShowMessage(s);
    s = Take(b);
    if (s != '') Navigate(s);
  } catch (EWebError) {
    // 'ats okay.
    Abort();
  }
}

function TMainForm_OnQueryEndSession() {
  FReportSave = false;
  FormClose(Self, Action);
  ReplyMessage(-1);
}

function TMainForm_OnEndSession() {
  if (Msg.wParam != 0) {
    FReportSave = false;
    FormClose(Self, Action);
  }
  ReplyMessage(0);
}

