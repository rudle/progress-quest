String.prototype.prefix = function(s) {
  return 0 == this.indexOf(s);
}

String.prototype.pluralize = function() {
  if (this.suffixed("y"))   return this.shorten(1) + "ies";
  if (strsuffix(s,"us"))  return shorten(s,2) + "i";
  if (strsuffix(s,"um"))  return shorten(s,2) + "a";
  if (strsuffix(s,"a"))   return shorten(s,2) + "ae";
  if (strsuffix(s,"ch"))  return s + "es";
  if (strsuffix(s,"x"))   return s + "es";
  if (strsuffix(s,"s"))   return s + "es";
  if (strsuffix(s,"f"))   return shorten(s,1) + "ves";
  if (strsuffix(s,"man")) return shorten(s,2) + "en";
  if (strsuffix(s,"Man")) return shorten(s,2) + "en";
  return s + "s";
}

String.prototype.indefinitite = function(qty) {
  if (qty > 1)
    return qty + " " + this.pluralize();
  else if (s.match(/[AEIOUÜaeiouü]/))
    return "an " + this;
  else 
    return "a " + this;
}

String.prototype.definite = function(qty) {
  return "the " + ((qty > 1) ? this.pluralize : this);
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


// actual pq stuff

function get(id) {
  return document.getElementById(id);
}

function level() {
  return get("level").value.toInteger();
}

function equipPrice() {
  // how much things cost
  return (level() * 5) * (level() + 2) + 20;
}
  
function odds(chance,outof) {
  return random(chance) > outof;
}

function winStat() {
  var stat;
  var nstats = get("stats").length;
  if (odds(1,2)) {
    stat = random(nstats);
  }
  else {
    var i, sum = 0;
    for (i = 0; i < nstats; ++i) {
      var t = get("stats",i);
      get += t * t;
    }
    sum = random(sum);
    for (i = 0; i < nstats; ++i) {
      var t = get("stats",i);
      sum -= t * t;
      if (sum <= 0) break;
    }
    stat = i;
  }
  putplus("stats",stat,1);
  updateEncumbrance();
}

function randomLow(below) {
  return min(rand(below), rand(below));
}

function winSpell() {
  var spell;
  if (odds(1,2) && item("spells").count()) {
    // choose from existing spells
    spell = item("spells").pick();
  } 
  else {
    var max = min(kspells.count, stats.WIS + traits.level);
    spell = kspells[randomLow(max)];
  }
  # ...  MainForm.Spells,indexintoSpells
  spells[spell] = roman(arabic(spells[spell]) + 1)
} 

function level() {
  return traits.Level;
}

function winSkills() {
  for {int i = max(1,sqrt(stats.DEX)) + 3; i > 0; --i)
    winSkill();
}

function winSkill() { 
  var max = (level() + 3) / 2;
  var skill = (random(max) + random(max)) / 2;
  if (skill >= skills.count)
    skill = kskills[skill];
  else
    skill = skills[skill];
  skills[skill] = (skills[skill].truncate(-1) + 1) + "%";
}


function winEquip() {
  var posn = Random(Equips.Items.Count);
  Equips.Tag = posn; // remember as the "best item"
  if (posn = 0) {
    var stuff = K.Weapons.Lines;
    var better = K.OffenseAttrib.Lines;
    var worse = K.OffenseBad.Lines;
  } else {
    var better = K.DefenseAttrib.Lines;
    var worse = K.DefenseBad.Lines;
    var stuff = posn = 1 ? K.Shields.Lines : K.Armors.Lines;
  }
  var name = LPick(stuff,GetI(Traits,'Level'));
  var qual = StrToInt(Split(name,1));
  name = Split(name,0);
  var plus = GetI(Traits,'Level') - qual;
  if (plus < 0) better = worse;
  var count = 0;
  for (var count = 0; count < 2; ++count) {
    if (plus == 0) break;
    var modifier = Pick(better);
    qual = StrToInt(Split(modifier, 1));
    modifier = Split(modifier, 0);
    if (Pos(modifier, name) > 0) break; // no repeats
    if (Abs(plus) < Abs(qual)) break; // too much
    name = modifier + ' ' + name;
    plus -= qual;
    ++count;
  }
  if (plus != 0) name = IntToStr(plus) + ' ' + name;
  if (plus > 0) name = '+' + name;

  Put(Equips, posn, name);
}


// Time to level up in seconds
function levelUpTime(level) {
  return level * 20 * 60;  // 20 minutes per level
}



# Give level-up rewards
function levelUp() {
  Add(Traits,'Level',1);
  Add(Stats,'HP Max', GetI(Stats,'CON') div 3 + 1 + Random(4));
  Add(Stats,'MP Max', GetI(Stats,'INT') div 3 + 1 + Random(4));
  WinStat;
  WinStat;
  WinSpell;
  ExpBar.setPosMax(0, LevelUpTime(GetI(Traits,'Level')));
  SaveGame;
  Brag('l');
}

function saveGame() {
  todo()
}

function goBuy() {
  task(5000,'Negotiating purchase of better equipment');
  q(buyEquipment);
}

function buyEquipment () {
  inventory['Gold'] = inventory['Gold'] - equipPrice();
  winEquip();
}

function goSell() {
  task(1000, 'Selling ' + indefinite(inventory[1],inventory[inventory[1]]));
  q("sell()");
}

function sell() {
  var tag = GetI(Inventory,1) * GetI(Traits,'Level');
  if (Pos(' of ',Items[1].Caption) > 0) 
    tag *= (1+RandomLow(10)) * (1+RandomLow(GetI(Traits,'Level')));
  Items[0].MakeVisible(false);
  Items.Delete(1);
  Add(Inventory,'Gold',Tag);

  MainForm.Inventory 1 GET SPLIT # ... item qty
  MainForm.Traits Level BYNAME GET MUL # ... item qty*level
  SWAP ' of ' STRSTR STRLEN {10 @RandomLow 1 ADD MUL
                             MainForm.Traits Level BYNAME GET 1 ADD MUL} IF
  # ... value
  MainForm.Inventory Gold BYNAME PUT+
  1 MainForm.Inventory Delete INVOKE
  @UpdateEncumbrance
}


GoNegotiate {
  (MainForm.Inventory Gold BYNAME GET) @EquipPrice GREATER {
    @GoBuy
    RETURN
  } IF
    
  (MainForm.Inventory Count GET) 1 GREATER {
    @GoSell
    RETURN
  } IF

  @GoToKillingFields
} STORE

GoToKillingFields {
  4000 'Heading to the killing fields' @Task
  {atKillingFields? TRUE STORE} @Q
} STORE

GoToMarket {
  4000 'Heading to market to sell loot' @Task
  {atKillingFields? FALSE STORE} @Q
} STORE

GoDoSomething {
  (atKillingFields? FETCH) {
    @Overburdened? {@GoToMarket} {@GoKillSomething} IFELSE
  }{
    @GoNegotiate
  } IFELSE
} STORE


MonsterBooty { # ... monsterrec => booty
  DUP 2 ELEMENT # ... monsterrec item 
  (DUP * STREQ) {
    DISCARD DISCARD
    @PickSpecialItem 
  } {
    DUP STRLEN NOT {DISCARD 'pelt'} IF # fallback if we screw up
    SWAP HEAD ' ' CONCAT SWAP CONCAT
    @LowerCase
  } IFELSE # ... booty
} STORE


RandSign { 
  2 RANDOM 2 MUL 1 SUB
} STORE


# apply some scattering in proportion to size of the number
Scatter {
  DUP {2 5 @Odds {@RandSign ADD} IF} REPEAT
} STORE


GoKillSomething {
  (MainForm.Traits Level BYNAME GET) 
  @Scatter 1 MAX
  # ... puissance (somewhere near player's level)
  
  DUP @PickEnemy
  # ... puissance monsterrec

  DUP2 @DescribeMonster
  # ... puissance monsterrec monsterdesc

  $gamestyle 2 MUL 
                (MainForm.Traits Level BYNAME GET) MUL
                                     1000 MUL
                                   3 LIFT DIV
  # ... monsterrec monsterdesc msec
  # ... {Beast|5|wallet} {Sick beast} 1000

  # note qty
  1 PEEK DUP ' ' STRPOS TRUNCATE 1 MAX 3 DROP 

  # ... qty monsterrec monsterdesc msec
  'Executing ' 2 LIFT CONCAT @Task

  {@GainXP} @Q

  # ... qty monsterrec
  @MonsterBooty QUOTE SWAP
  "%s MainForm.Inventory %s BYNAME PUT+ @UpdateEncumbrance" STRFORMAT @Q
  
} STORE

SUBSTR? { @@
  STRSTR STRLEN
} STORE


# recursive, so really this is for shit
# ... aN .. a1 fmtstring STRFORMAT => ... formattedstring
STRFORMAT { @@
  {
    DUP "%s" STRPOS NEGATIVE {BREAK} IF
    "%s" 2 LIFT STRREPLACE
  } LOOP
} STORE

GoLevelUp {
  2000 MainForm.Traits Level BYNAME GET
       'Say goodbye to Level %s! Leveling up' STRFORMAT @Task
  {@LevelUp} @Q
} STORE

# ... progbar @Bar% => %complete
Bar% {
  DUP Position GET 100 MUL SWAP Max GET DIV "%" CONCAT
} STORE  

GainXP {
  # move bar and/or level up
  MainForm.ExpBar @BarFull? {
    0 MainForm.ExpBar Position PUT 
    {@GoLevelUp} @Q
  }{
    ((MainForm.TaskBar Max GET) 1000 DIV) MainForm.ExpBar Position PUT+
  } IFELSE
  (MainForm.ExpBar Max GET MainForm.ExpBar Position GET SUB) 
    '%s XP needed for next level' STRFORMAT
    MainForm.ExpBar Hint PUT

  # advance quest
  (MainForm.Plots Count GET) 1 GREATER {
    (MainForm.QuestBar @BarFull?) {
      @OnCompleteQuest
    }{
      MainForm.Quests Count GET POSITIVE {
        (MainForm.TaskBar Max GET 1000 DIV) MainForm.QuestBar Position PUT+
	(MainForm.QuestBar @Bar% ' complete' CONCAT) MainForm.QuestBar Hint PUT
      } IF
    } IFELSE
  } IF

} STORE


Q { # ... script
  MainForm.Queue Append INVOKE
} STORE


Task { # ... msec,caption
  '...' CONCAT MainForm.Kill SimpleText PUT
  0 MainForm.TaskBar Position PUT
  MainForm.TaskBar Max PUT 
} STORE


# ... bar => full?
BarFull? {
  DUP Position GET
  SWAP Max GET
  GREATEROREQUAL
} STORE

TaskDone? { 
  MainForm.TaskBar @BarFull?
} STORE

Overburdened? {
  MainForm.EncumBar @BarFull?
} STORE


UpdateEncumbrance {
  ((MainForm.Stats "STR" BYNAME GET) 10 ADD) MainForm.EncumBar Max PUT
  0
  (MainForm.Inventory Count GET 1 SUB) {
    MainForm.Inventory (COUNTER 1 ADD 1 JOIN) GET
    ADD
  } REPEAT
  DUP MainForm.EncumBar Position PUT
  # ... encumbrance
  (MainForm.EncumBar Max GET) SWAP '%s/%s cubits' STRFORMAT
  MainForm.EncumBar Hint PUT
} STORE


Dequeue {
  {
    @TaskDone? UNLESS

    MainForm.Queue Count GET {
      MainForm.Queue 0 GET
      (0 MainForm.Queue Delete INVOKE)
      EVALUATE
    } {
      @GoDoSomething
      @TaskDone? {'Error in queue' !!} IF
    } IFELSE
  } LOOP
} STORE


# bar => bar.max-bar.pos
Remaining {
  DUP Max GET SWAP Position GET SUB
} STORE


# seconds => approxdescription
RoughTime {
  (DUP 120 LESS)         {' seconds' CONCAT RETURN} IF
  (DUP 60 120 MUL LESS)  {60 DIV ' minutes' CONCAT RETURN} IF
  (DUP 3600 48 MUL LESS) {3600 DIV ' hours' CONCAT RETURN} IF
  3600 24 MUL DIV ' days' CONCAT  
} STORE


OnCompleteAct {
  0 MainForm.PlotBar Position PUT
  (MainForm.Plots Count GET 1 SUB) MainForm.Plots Check INVOKE
  # 1 hr + 5 hrs per act
  (MainForm.Plots Count GET 5 MUL 1 ADD 3600 MUL) MainForm.PlotBar Max PUT
  'Cutscene omitted' MainForm.PlotBar Hint PUT
  'Act ' MainForm.Plots Count GET @Roman CONCAT MainForm.Plots Append INVOKE
  @SaveGame
  #a Game Brag INVOKE
} STORE

MainForm.Timer1.OnTick { 
  (MainForm.TaskBar @BarFull?) {
    @ClearSelections

    # advance the plot
    MainForm.PlotBar @BarFull? {
      @OnCompleteAct
    }{
      (MainForm.TaskBar Max GET 1000 DIV) MainForm.PlotBar Position PUT+
    } IFELSE
    (MainForm.PlotBar @Remaining @RoughTime) ' remaining' CONCAT MainForm.PlotBar Hint PUT

    # fuel the task bar
    @Dequeue
  }{
    # advance the main progress bar
    TIME lasttimertime FETCH SUB # elapsed time
    (MainForm.Timer1 Interval GET) MIN 0 MAX # keep it in bounds
    MainForm.TaskBar Position PUT+
  } IFELSE


  lasttimertime TIME STORE
} STORE


Abs {
  DUP NEGATIVE {NEGATE} IF
} STORE

Closer { # ... goal,n1,n2
  2 PEEK SUB @Abs 2 DROP
  SUB @Abs GREATER
} STORE


Swap2 { # ... a,b,c,d => ... c,d,a,b
  3 LIFT 3 LIFT
} STORE

PickBest { # ... count,valuescript,tries
  0 SWAP 0 SWAP { # ... count,valuescript,besti,valbesti
    3 PEEK RANDOM # ... count,valuescript,besti,valbesti,i
    DUP 4 PEEK EVALUATE # ... count,valuescript,besti,valbesti,i,vali
    ((DUP 3 PEEK GREATER) (COUNTER NOT) OR) {@Swap2} IF 
    DISCARD DISCARD 
  } REPEAT
  DISCARD SWAP DISCARD SWAP DISCARD
} STORE

monsters.pqs INCLUDE

# ... nearlevel tries => monsterrec
PickMonster { 
  SWAP goal LET
  ?|-99999|? best LET
  { 
    KMonsters DUP Count GET RANDOM GET
      goal FETCH
      1 PEEK 1 ELEMENT
      best FETCH 1 ELEMENT 
    @Closer {best LET} {DISCARD} IFELSE
  } REPEAT
  best FETCH
} STORE


OnCompleteQuest {
  # reset quest bar
  0 MainForm.QuestBar Position PUT
  (50 100 RANDOM ADD) MainForm.QuestBar Max PUT

  # complete last quest
  (MainForm.Quests Count GET POSITIVE) {
    # check it off
    ((MainForm.Quests Count GET) 1 SUB) MainForm.Quests Check INVOKE 
    # random reward
    WinSkill WinSpell WinEquip WinStat WinItem 5 5 RANDOM @JumpTable
  } IF

  # limit size of quests thing
  (MainForm.Quests Count GET 99 GREATER) {
    0 MainForm.Quests Delete INVOKE
  } IF

  # add a new quest
  questMonster '' STORE
  { # 4
    (MainForm.Traits Level BYNAME GET) 8 @PickMonster
    questMonster 1 PEEK STORE
    ('Exterminate ' SWAP HEAD 2 @Definite CONCAT) MainForm.Quests Append INVOKE
  } { # 3
    ('Seek ' @PickInterestingItem 1 @Definite CONCAT) MainForm.Quests Append INVOKE
  } { # 2
    ('Deliver this ' @PickBoringItem CONCAT) MainForm.Quests Append INVOKE
  } { # 1
    ('Fetch me ' @PickBoringItem 1 @Indefinite CONCAT) MainForm.Quests Append INVOKE
  } { # 0
    (MainForm.Traits Level BYNAME GET) 2 @PickMonster
    ('Placate ' SWAP HEAD 2 @Definite CONCAT) MainForm.Quests Append INVOKE
  } 5 5 RANDOM @JumpTable

  @SaveGame
} STORE


JumpTable { # ... sN,...,s0,N,I
  1 ADD LIFT SWAP DUP # ... sN,...,s0,sI,N,N
  2 DROP DROP # ... sI,sN,...,s0,N
  (1 SUB) {DISCARD} REPEAT # ... sI
  EVALUATE
} STORE

CheatCashIn {
  @WinEquip @WinItem @WinSpell @WinSkill @WinStat
  100 RANDOM MainForm.Inventory Gold BYNAME PUT+
} STORE

CheatFinishQuest {
  (MainForm.QuestBar Max GET) MainForm.QuestBar Position PUT
  (MainForm.TaskBar Max GET) MainForm.TaskBar Position PUT
} STORE

CheatFinishPlot {
  (MainForm.PlotBar Max GET) MainForm.PlotBar Position PUT
  (MainForm.TaskBar Max GET) MainForm.TaskBar Position PUT
} STORE

ClearBars {
  MARK QuestBar PlotBar TaskBar ExpBar EncumBar COUNT
  { 0 SWAP MainForm. SWAP CONCAT Position PUT } REPEAT
} STORE 

ClearSelections {
    MARK
  Equips
  Spells
  Stats
  Traits
  Inventory
  Plots
  Quests
  Skills
   COUNT
  {MainForm. SWAP CONCAT ClearSelection INVOKE} REPEAT
} STORE

Pick { # ... list
  DUP Count GET RANDOM GET
} STORE

PickBoringItem {
  KBoringItems @Pick
} STORE

PickInterestingItem {
  KItemAttrib @Pick 
  " " CONCAT
  KSpecials @Pick CONCAT
} STORE

PickSpecialItem {
  @PickInterestingItem
  " of " CONCAT
  KItemOfs @Pick CONCAT
} STORE

WinItem {
  1 MainForm.Inventory @PickSpecialItem BYNAME PUT+
  @UpdateEncumbrance
} STORE

MARK { @@
  STACKSIZE _mark SWAP STORE
} STORE

COUNT { @@
  STACKSIZE _mark FETCH SUB
} STORE


egghunt.pqs INCLUDE

ReadNewGuyForm {
  (NewGuyForm.Name Text GET) MainForm.Traits Name BYNAME PUT
  (NewGuyForm.Race (DUP ItemIndex GET) GET) MainForm.Traits Race BYNAME PUT
  (NewGuyForm.Klass (DUP ItemIndex GET) GET) MainForm.Traits Class BYNAME PUT
  MARK "STR" "CON" "DEX" "INT" "WIS" "CHA" 
  COUNT 
    {DUP NewGuyForm. SWAP CONCAT Caption GET SWAP MainForm.Stats SWAP BYNAME PUT} REPEAT
} STORE

ShowFrontForm {
  hostname "" STORE
  hostaddr "" STORE
  login "" STORE
  password "" STORE
  TRUE FrontForm Visible PUT
  FALSE MainForm Visible PUT
} STORE

PickElement {
  DUP LEN RANDOM ELEMENT
} STORE

GenerateName {
  2 {
    br|cr|dr|fr|gr|j|kr|l|m|n|pr||||r|sh|tr|v|wh|x|y|z @PickElement
    a|a|e|e|i|i|o|o|u|u|ae|ie|oo|ou @PickElement
    b|ck|d|g|k|m|n|p|t|v|x|z @PickElement
    CONCAT CONCAT
  } REPEAT
  CONCAT
  @ProperCase
} STORE


InitApp {
  TIME SRAND
  InitApp {NOOP} STORE # make sure this is called but once
  
  ARGC 1 GREATER {
    1 ARGV LoadGame
    #TRUE MainForm Visible PUT
    RETURN
  } IF

  @ShowFrontForm
} STORE

FrontForm.PlaySingle.OnClick {
  @LaunchWizard
} STORE

FrontForm.PlayOnline.OnClick {
  @LaunchServerSelect
} STORE

FrontForm.LoadGame.OnClick {
  MainForm.ShowLoadDialog OnClick INVOKE
  MainForm.Load OnClick INVOKE
} STORE

FrontForm.Exit.OnClick {
  FrontForm Close INVOKE
} STORE

PrepEquips {
  MainForm.Equips Clear INVOKE
  MARK
Weapon
Shield
Helm
Hauberk
Brassairts
Vambraces
Gauntlets
Gambeson
Cuisses
Greaves
Sollerets
  COUNT {0 MainForm.Equips Insert INVOKE} REPEAT
} STORE

InitNewGame {
  Queue MainForm.Panel1 CreateList INVOKE

  @ClearBars
  @PrepGameConstants
  @ReadNewGuyForm

  1 MainForm.Traits Level BYNAME PUT
  
  (8 RANDOM (MainForm.Stats "INT" BYNAME GET) 6 DIV ADD) MainForm.Stats 'HP Max' BYNAME PUT
  (8 RANDOM (MainForm.Stats "CON" BYNAME GET) 6 DIV ADD) MainForm.Stats 'MP Max' BYNAME PUT

  @PrepEquips
  'Sharp Stick' MainForm.Equips Weapon BYNAME PUT
  0 MainForm.Inventory Gold BYNAME PUT
  gamestyle 3 STORE

  @WinSkills

  @ClearSelections

  0 MainForm.ExpBar Position PUT
  (1 @LevelUpTime) MainForm.ExpBar Max PUT

  2000 Loading. @Task # that dot is spotted for later...
  { 10000 "Experiencing an enigmatic and foreboding night vision" @Task } @Q
  {  6000 "Much is revealed about that wise old bastard you'd underestimated" @Task } @Q
  {  6000 "A shocking series of events leaves you alone and bewildered, but resolute" @Task } @Q
  {  4000 "Drawing upon an unexpected reserve of determination, you set out on a long and dangerous journey" @Task } @Q
  {  2000 Loading @Task } @Q

  26 MainForm.PlotBar Max PUT
  "Prologue" MainForm.Plots Append INVOKE
  TRUE MainForm.Timer1 Enabled PUT

  @SaveGame
} STORE


# ... key => ...
OnKey {
  $passkey NOT {DISCARD RETURN} IF
  DUP ^b STREQ {
    'b' @Brag
    @GetHostAddr 'name=' CONCAT MainForm.Traits Name BYNAME GET @UrlEncode CONCAT 
      NAVIGATE
  } IF
  DUP ^m STREQ {
    'Progress Quest' 'Declare you motto!' @GetMottot @InputBox
    @SetMotto
    m @Brag
    @GetHostAddr 'name=' CONCAT MainForm.Traits Name BYNAME GET @UrlEncode CONCAT 
      NAVIGATE
  } IF
  DUP ^g STREQ {
    'Progress Quest' 'Choose a guild,!' @GetGuild @InputBox
    @SetGuild
    m @Guildify
    @GetHostAddr 'name=' CONCAT MainForm.Traits Name BYNAME GET @UrlEncode CONCAT 
      NAVIGATE
  } IF
  DISCARD
} STORE
 
{
www.progressquest.com 80 CONNECT
DUP "GET /hilly.php?c=brag&stuff=etc HTTP/1.0" EOL+ SEND
DUP "User-Agent: pqscript" EOL+ SEND
DUP "" EOL+ SEND
DUP RECEIVEHEADERS 
DISCONNECT
} DISCARD


# ... x => (x << 1) ^ (x >> 31 ^ x >> 5 & 1)
StepLFSR {
  DUP 1 SHL 
  SWAP DUP 5 SHR SWAP 31 SHR BITWISEXOR BITWISEAND
  BITWISEXOR
} STORE

# ... string salt => ... number
RunLFSR {
  {
    1 PEEK STRLEN NOT {SWAP DISCARD BREAK} IF
    @StepLFSR
    SWAP DUP 1 DECAPITIATE 2 DROP
    1 TRUNCATE ORD BITXOR
  } LOOP 
  SWAP DISCARD
  10 {@FeedbackShift} REPEAT
} STORE


GetBestSpell {      
  '' best LET
  MainForm.Spells Count GET 2 SUB {
    MainForm.Spells COUNTER GET CONUNTER JOIN @SpellScore
    best FETCH @SpellScore
    GREATER {MainForm.Spells COUNTER GET COUNTER JOIN best LET} IF
  }
  best FETCH 0|1 ELEMENTS JOIN
} STORE

# ... spell|level|index => greatnessscore
SpellScore {
  1|2 ELEMENTS 1 ADD SWAP @Arabic MUL
} STORE


GetBestStat {
  '' best LET
  MainForm.Stats Count GET {
    MainForm.Stats COUNTER 1 JOIN GET
    best FETCH TAIL
    GREATER {MainForm.Stats COUNTER GET best LET} IF
  }
  best FETCH
} STORE

# ... trigger => ... url
BragURL {
  'cmd=b&t=' SWAP CONCAT
  (MainForm.Traits Count GET) {
    '&' CONCAT
    MainForm.Traits COUNTER 0 JOIN GET 1 TRUNCATE LOWERCASE CONCAT
    '=' CONCAT
    MainForm.Traits COUNTER 1 JOIN GET @UrlEncode CONCAT
  } REPEAT
  '&x=' CONCAT MainForm.ExpBar Position GET CONCAT

  '&i=' CONCAT MainForm.Equips $bestequip 1 JOIN GET @UrlEncode CONCAT
  ($bestequip 1 GREATER) {
    + CONCAT
    MainForm.Equips $bestequip 0 JOIN GET CONCAT
  } IF

  '&z=' CONCAT 
  @GetBestSpell SPLIT '+' SWAP CONCAT CONCAT CONCAT

  '&k=' CONCAT 
  @GetBestStat SPLIT '+' SWAP CONCAT CONCAT CONCAT

  '&a=' CONCAT MainForm.Plots (DUP Count 1 SUB) GET @UrlEncode CONCAT
  '&h=' CONCAT @GetHostName @UrlEncode CONCAT
  @RevString CONCAT
  DUP $passkey @RunLFSR '&p=' SWAP CONCAT CONCAT
  '&m=' CONCAT @GetMotto CONCAT
  @GetHostAddr SWAP CONCAT
} STORE


GuildURL {
  'cmd=guild'
  MainForm.Traits Count GET {
    MainForm.Traits COUNTER GET 0|1 ELEMENTS
    @UrlEncode SWAP @LowerCase
    '&%s=%s' STRFORMAT CONCAT
  } REPEAT
  &h= CONCAT @GetHostName CONCAT
  @GetRevString CONCAT
  &guild= CONCAT GetGuild CONCAT
  DUP $passkey @RunLFSR &p= SWAP CONCAT CONCAT 
  @GetHostAddr SWAP CONCAT
} STORE

Guildify {
  @GuildURL
  login FETCH
  password FETCH
  DOWNLOAD {
    1|0 ELEMENTS
    DUP STRLEN {App Alert INVOKE} {DISCARD} IFELSE
    DUP STRLEN {App Navigate INVOKE} {DISCARD} IFELSE
  } IF
} STORE


*/
