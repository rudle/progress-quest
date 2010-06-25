// Copyright (c)2002-2010 Eric Fredricksen <e@fredricksen.net> all rights reserved

// TODO: All these Hints

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

function Length(s) {
  return s.length;
}

String.prototype.prefix = function(s) {
  return 0 == this.indexOf(s);
}

function Ends(s, e) {
  return Copy(s, 1+Length(s)-Length(e), Length(e)) == e;
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
  m = Abs(m)
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
    var nemesis = ImpressiveGuy();
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

function IntToStr(i) {
  return i + "";
}

function NamedMonster(level) {
  var lev = 0;
  var result = '';
  for (var i = 0; i < 5; ++i) {
    var m = Pick(K.Monsters);
    if (result == '' || (Abs(level-StrToInt(Split(m,1))) < Abs(level-lev))) {
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
      monster = PickLow(K.Titles) + ' ' + GenerateName + ' the' + monster;
      definite = true;
    }
    var lev = level;
    monster = monster + '|' + IntToStr(level) + '|*';
  } else if ((game.questmonster != '') && Odds(1,4)) {
    // Use the quest monster
    var monster = k.Monsters[fQuest.Tag];
    var lev = StrToInt(Split(monster,1));
  } else {
    // Pick the monster out of so many random ones closest to the level we want
    var monster = Pick(K.Monsters);
    var lev = StrToInt(Split(monster,1));
    for (var i = 0; i < 5; ++i) {
      var m1 = Pick(K.Monsters);
      if (Abs(level-StrToInt(Split(m1,1))) < Abs(level-lev)) {
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
          s = 'Loading ' + Plots.last().text();
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


function Put(list, key, value) {
  var item = list.item(key);
  item.children().last().text(value);
  item.addClass("selected");

  if (key === 'STR') {
    EncumBar.Max = 10 + value;
    EncumBar.reposition(EncumBar.Position);
  }

  if (list === Inventory) {
    EncumBar.reposition(Sum(Inventory) - GetI(Inventory,'Gold'));
    EncumBar.Hint = IntToStr(EncumBar.Position) + '/' + IntToStr(EncumBar.Max) + ' cubits';
  }
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

function alert(k) {
  Plots.Add(k);
}

function ListBox(id) {
  this.box = $("#"+ id);

  this.Add = function (caption) {
    var tr = this.box.append("<tr><td>" + caption + "</td></tr>");
    return tr;
  }

  this.ClearSelection = function () {
    this.box.find("tr").removeClass("selected");
  }

  this.item = function (key) {
    if (typeof key == typeof 'string') {
      return this.box.find("tr").filter(function (index) {
        return $(this).children().first().text() === key;
      });
    } else {
      return this.box.find("tr").eq(key);
    }
  }

  this.last = function () {
    return this.box.find("tr").last();
  }

  this.scrollToBottom = function () {
    // TODO
  }

  this.rows = function () {
    return this.box.find("tr").has("td");
  }

  this.length = function () {
    return this.rows().length;
  }
};


var ExpBar, PlotBar, TaskBar, QuestBar;
var Traits,Stats,Spells,Equips,Inventory,Plots,Quests;
var Kill;
    
    
function GoButtonClick() {
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
  
  alert(toArabic("LIX"));
  var n55 = 55;
  alert(toRoman(3333));
  AddR(Spells, "Lasers", 3);
  alert("DEBUG " + GetI(Stats, 3));
}


function StrToIntDef(s, def) {
  var result = parseInt(s);
  return result == NaN ? def : result;
}


$(document).ready(FormCreate);
$(document).ready(GoButtonClick);


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
  var posn = Random(Equips.box.find("tr").length);
  game.bestequip = posn; // remember as the "best item"
  if (posn == 0) {
    stuff = K.Weapons;
    better = K.OffenseAttrib;
    worse = K.OffenseBad;
  } else {
    better = K.DefenseAttrib;
    worse = K.DefenseBad;
    if (posn == 1) 
      stuff = K.Shields
    else 
      stuff = K.Armors;
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
    if (Pos(modifier, name) > 0) break; // no repeats
    if (Abs(plus) < Abs(qual)) break; // too much
    name = modifier + ' ' + name;
    plus -= qual;
    ++count;
  }
  if (plus != 0) name = plus + ' ' + name;
  if (plus > 0) name = '+' + name;

  Put(Equips, posn, name);
}


function Square(x) { return x * x; }

function WinStat() {
  var items = Stats.rows();
  if (Odds(1,2))  {
    var i = items.eq(Random(items.length));
  } else {
    // Favor the best stat so it will tend to clump
    var t = 0;
    items.each(function (index,elt) {
      t += Square(StrToInt($(this).children().last().text()));
    });
    t = Random(t);
    var i;
    items.each(function (index,elt) {
      i = this;
      t -= Square(StrToInt($(this).children().last().text()));
      return t < 0;
    });
  }
  Add(Stats, $(i).find("td").first().text(), 1);
}

function SpecialItem() {
  return InterestingItem + ' of ' + Pick(K.ItemOfs);
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
  QuestBar.reset(50 + Random(100));
  if (Quests.last().length) {
    /*$IFDEF LOGGING*/
    Log('Quest completed: ' + Quests.last().text());
    /*$ENDIF*/
    Quests.last().wrap("<s/>");
    [WinSpell,WinEquip,WinStat,WinItem][Random(4)]();
    while (Quest.box.children().length > 99) 
      Quest.box.find("tr").first().remove();

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
          fQuest.Tag = montag;  // TODO wat's this?
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
      Caption = 'Fetch me ' + Indefinite(BoringItem(), 1);
      break;
    case 4: 
      var lev = 0;
      level = GetI(Traits,'Level');
      for (var i = 1; i <= 2; ++i) {
        montag = Random(K.Monsters.length);
        m = K.Monsters[montag];
        l = StrToInt(Split(m,1));
        if ((i == 1) || (Abs(l - level) < Abs(lev - level))) {
          lev = l;
          game.questmonster = m;
        }
      }
      Caption = 'Placate ' + Definite(Split(game.questmonster,0),2);
      game.questmonster = '';  // We're trying to placate them, after all
      break;
    }
    Quest.Add(caption);

    /*$IFDEF LOGGING*/
    Log('Commencing quest: ' + caption);
    /*$ENDIF*/
    Quests.scrollToBottom();
  }
  Quest.Width = Quest.Width - 1;  // trigger a column resize
  SaveGame();
}

function toRoman(n) {
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

function toArabic(s) {
  n = 0;
  s = s.toUpperCase();
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

function CompleteAct() {
  PlotBar.reposition(0);
  Plots.last().wrap("<s/>");
  PlotBar.reset(60 * 60 * (1 + 5 * Plots.length())); // 1 hr + 5/act
  PlotBar.Hint = 'Cutscene omitted';
  Plots.Add('Act ' + toRoman(Plots.length()));
  Plots.scrollToBottom();

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

function ExportCharSheet() {
  /* TODO
  AssignFile(f, ChangeFileExt(GameSaveName, '.sheet'));
  Rewrite(f);
  Write(f, CharSheet());
  Flush(f);
  CloseFile(f);
*/
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
  if (Plots.length() > 0)
    WrLn('Plot stage: ' + Plots.last().text() + ' (' + PlotBar.Hint + ')');
  if (Quests.length > 0)
    WrLn('Quest: ' + Quests.last().text() + ' (' + QuestBar.Hint + ')');
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

function Add(list, key, value) {
  Put(list, key, value + GetI(list,key));

  /*$IFDEF LOGGING*/
  if (value == 0) return;
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
  return item.children().last().text();
}

function GetI(list, key) {
  return StrToIntDef(Get(list,key), 0);
}

function Min(a,b) {
  return a < b ? a : b;
}

function Sum(list) {
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
      if (Plots.length() > 1) {
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

function FormCreate() {
  ExpBar = new ProgressBar("ExpBar");
  PlotBar = new ProgressBar("PlotBar");
  TaskBar = new ProgressBar("TaskBar");
  QuestBar = new ProgressBar("QuestBar");
  EncumBar = new ProgressBar("QuestBar");

  Traits = new ListBox("Traits");
  Stats = new ListBox("Stats");
  Spells = new ListBox("Spells");
  Equips = new ListBox("Equips");
  Inventory = new ListBox("Inventory");
  Plots = new ListBox("Plots");
  Quests = new ListBox("Quests");

  Kill = $("#Kill");

  QuestBar.reposition(0);
  PlotBar.reposition(0);
  TaskBar.reposition(0);
  ExpBar.reposition(0);
  EncumBar.reposition(0);
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
        break;
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


function FormShow() {
  if (game.timerid) return;
  var done = false;
  var exportandexit = false;

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


/*$IFDEF CHEATS*/
$(function() {
  function cheat(label, effect) {
    $('body').append("<button>"+label+"</button>").click(effect);
  }

  cheat("Task", function () {
    TaskBar.reposition(TaskBar.Max);
  });

  cheat("Level", function () {
    LevelUp();
  });

  cheat("$$$", function () {
    WinEquip();
    WinItem();
    WinSpell();
    WinStat();
    Add(Inventory,'Gold',Random(100));
  });

  cheat("Quest", function () {
    QuestBar.reposition(QuestBar.Max);
    TaskBar.reposition(TaskBar.Max);
  });

  cheat("Plot", function () {
    PlotBar.reposition(PlotBar.Max);
    TaskBar.reposition(TaskBar.Max);
  });

});
/*$ENDIF*/


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
  window.open(url);
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
  url = url + '&i=' + UrlEncode(Get(Equips, game.bestequip));
  if (game.bestequip > 1) url = url + '+' + Equips[game.bestequip].Caption;
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
  url = url + '&a=' + UrlEncode(Plots.last().text());
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

