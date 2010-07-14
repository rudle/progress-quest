/* copyright (c)2002-2010 Eric Fredricksen all rights reserved */


function Roll(stat) {
  stats[stat] = 3 + Random(6) + Random(6) + Random(6);
  $("#"+stat).text(stats[stat]);
  return stats[stat];
}

function Choose(n, k) {
  var result = n;
  var d = 1;
  for (var i = 2; i <= k; ++i) {
    result *= (1+n-i);
    d = d * i;
  }
  return result / d;
}

var stats = {"history":[]};

function RollEm() {
  var Total = $("#Total");
  stats.seed = randseed();
  stats.total = 0;
  var best = -1;
  $.each(K.PrimeStats, function () { 
    stats.total += Roll(this);
    if (best < stats[this]) {
      best = stats[this];
      stats.best = this;
    }
  });
  stats['HP Max'] = Random(8) + stats.CON.div(6);
  stats['MP Max'] = Random(8) + stats.INT.div(6);
  Total.text(stats.total);

  var color = 
    (stats.total >= (63+18)) ? 'red'    :
    (stats.total > (4 * 18)) ? 'yellow' :
    (stats.total <= (63-18)) ? 'grey'   :
    (stats.total < (3 * 18)) ? 'silver' :
    'white';
  Total.css("background-color", color);

  $("#Unroll").attr("disabled", !stats.history.length);
}

function RerollClick() {
  stats.history.push(stats.seed);
  RollEm();
}


function UnrollClick() {
  randseed(stats.history.pop());
  RollEm();
}

function fill(e, a, n) {
  var def = Random(a.length);
  for (var i = 0; i < a.length; ++i) {
    var v = a[i].split("|")[0];
    var check = def == i ? " checked " : " ";
    $("<div><input type=radio id='" + v + "' name=\"" + n + "\" value=\"" + v + "\" " +
      check  +"><label for='" + v + "'>" + v + "</label></div>").appendTo(e);
  }
}

function NewGuyFormLoad() {
  fill("#races", K.Races, "Race");
  fill("#classes", K.Klasses, "Class");

  $("#Reroll").click(RerollClick);
  $("#Unroll").click(UnrollClick);
  $("#RandomName").click(GenClick);
  $('#Sold').click(sold);
  $('#quit').click(cancel);

  //var caption = 'Progress Quest - New Character';
  //if (MainForm.GetHostName != '')
  //  caption = caption + ' [' + MainForm.GetHostName + ']';

  if (!$("#Name").text()) {
    GenClick();
    $("#Name").focus();
    $("#Name").select();
  }

  seed = new Alea();
  RollEm();

  if (window.location.href.indexOf("?sold") > 0)
    sold();  // TODO: cheesy
}


$(document).ready(NewGuyFormLoad);

/* Multiplayer:
function TNewGuyForm_ParseSoldResponse(body) {
  if ((LowerCase(Split(body,0)) == 'ok')) {
    MainForm.SetPasskey(Split(body,1));
    MainForm.SetLogin(GetAccount);
    MainForm.SetPassword(GetPassword);
    ModalResult = mrOk;
  } else {
    ShowMessage(body);
  }
}

function TNewGuyForm_GetAccount() {
  return Account.Visible ? Account.Text : '';
}

function TNewGuyForm_GetPassword() {
  return (Password.Visible) ? Password.Text : '';
}

function TNewGuyForm_SoldClick() {
  if (MainForm.GetHostAddr == '') {
    ModalResult = mrOk;
  } else {
    try {
      Screen.Cursor = crHourglass;
      try {
        if ((MainForm.Label8.Tag && 16) == 0
       ) url = MainForm.GetHostAddr
        else url = 'http://www.progressquest.com/create.php?';
        // url = StringReplace(url, '.com/', '.com/dev/', []);
        if ((GetAccount() != '') || (GetPassword != ''))
          url = StuffString(url, 8, 0, GetAccount() + ':' + GetPassword() + '@');
        args = 'cmd=create' +
                '&name=' + escape(Name.Text) +
                '&realm=' + escape(MainForm.GetHostName) +
                RevString;
        ParseSoldResponse(DownloadString(url + args));
      } catch (EWebError) {
        ShowMessage('Error connecting to server');
      }
    } finally {
      Screen.Cursor = crDefault;
    }
  }
}
*/

function sold() {
  var newguy = {
    Traits: {
      Name: $("#Name").val(),
      Race: $("input:radio[name=Race]:checked").val(),
      Class: $("input:radio[name=Class]:checked").val(),
      Level: 1
    },
    dna: stats.seed,
    seed: stats.seed,
    birthday: ''+new Date(),
    birthstamp: +new Date(),
    Stats: stats,
    beststat: stats.best + " " + stats[stats.best],
    task: "",
    tasks: 0,
    elapsed: 0,
    bestequip: "Sharp Rock",
    Equips: {},
    Inventory: [['Gold', 0]],
    Spells: [],
    act: 0,
    bestplot: "Prologue",
    Quests: [],
    questmonster: "",
    kill: "Loading....",
    ExpBar: { position: 0, max: LevelUpTime(1) },
    EncumBar: { position: 0, max: stats.STR + 10 },
    PlotBar: { position: 0, max: 26 },
    QuestBar: { position: 0, max: 1 },
    TaskBar: { position: 0, max: 2000 },
    queue: [
      'task|10|Experiencing an enigmatic and foreboding night vision',
      "task|6|Much is revealed about that wise old bastard you'd underestimated",
      'task|6|A shocking series of events leaves you alone and bewildered, but resolute',
      'task|4|Drawing upon an unexpected reserve of determination, you set out on a long and dangerous journey',
      'plot|2|Loading'
    ]
  };
  
  newguy.date = newguy.birthday;
  newguy.stamp = newguy.birthstamp;

  $.each(K.Equips, function (i,equip) { newguy.Equips[equip] = ''; });
  newguy.Equips.Weapon = newguy.bestequip;
  newguy.Equips.Hauberk = "-3 Burlap";

  addToRoster(newguy);

  // TODO: cheesy
  var args = (window.location.href.indexOf("?sold") > 0) ? "?quit" : "";

  window.location = "main.html" + args + "#" + newguy.Traits.Name;
}

function cancel() {
  window.location = "roster.html";
}

function GenClick() {
  $("#Name").attr("value", GenerateName());
}

