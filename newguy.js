/* copyright (c)2002-2010 Eric Fredricksen all rights reserved */


var randseed = Math.floor(Math.random() * 0xFFFFFFFF);

function Random(n) {
  return Rand32Rough() % n;
}


function Rand32Rough() { 
  // http://www.merlyn.demon.co.uk/js-randm.htm#MR
  var T32 = 0x100000000;
  var constant = 134775813;
  var X = constant * randseed + 1;
  return (randseed = X % T32);
}

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
  var ReRoll = $("#ReRoll");
  stats.seed = randseed;
  stats.total = 
    Roll("STR") +
    Roll("CON") +
    Roll("DEX") +
    Roll("INT") +
    Roll("WIS") +
    Roll("CHA");
  Total.text(stats.total);

  var color = (stats.total >= (63+18)) ? 'red' :
    (stats.total > (4 * 18)) ? 'yellow' :
    (stats.total <= (63-18)) ? 'grey'   :
    (stats.total < (3 * 18)) ? 'silver' :
    'white';
  Total.css("background-color", color);
}

function RerollClick() {
  stats.history.push(stats.seed);
  $("#Unroll").attr("disabled", false);
  RollEm();
}


function fill(e, a, n) {
  var def = Random(a.length);
  for (var i = 0; i < a.length; ++i) {
    var v = a[i].split("|")[0];
    var check = def == i ? " checked " : " ";
    $("<div><input type=radio name=\"" + n + "\" value=\"" + v + "\" " +
                      check  +">" + v + "</div>").appendTo(e);
  }
}

$(document).ready(function () {
  fill("#races", K.Races, "Race");
  fill("#classes", K.Klasses, "Class");

  $("#Reroll").click(function(){RerollClick();});
  $("#Unroll").click(function(){UnrollClick();});

  //var caption = 'Progress Quest - New Character';
  //if (MainForm.GetHostName != '')
  //  caption = caption + ' [' + MainForm.GetHostName + ']';
  RollEm();

  $("#RandomName").click(GenClick);
  if ($("#Name").text() == '') {
    GenClick();
    $("#Name")[0].focus();
    $("#Name")[0].select();
  }
});


function UnrollClick() {
  randseed = stats.history.pop();
  $("#Unroll").attr("disabled", stats.history.length == 0);
  RollEm();
}


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


function GenerateName() {
  var KParts = [
    'br|cr|dr|fr|gr|j|kr|l|m|n|pr||||r|sh|tr|v|wh|x|y|z',
    'a|a|e|e|i|i|o|o|u|u|ae|ie|oo|ou',
    'b|ck|d|g|k|m|n|p|t|v|x|z'];

  function Pick(s) {
    var count = 1;
    for (var i = 0; i < s.length; ++i)
      if (s[i] == '|') ++count;
    return s.split("|")[Random(count)];
  }

  var result = '';
  for (var i = 0; i <= 5; ++i)
    result += Pick(KParts[i % 3]);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function GenClick() {
  $("#Name").attr("value", GenerateName());
}

