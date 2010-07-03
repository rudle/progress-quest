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
  var ReRoll = $("#ReRoll");
  stats.seed = randseed();
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

  $("#Unroll").attr("disabled", !stats.history.length);
}

function RerollClick() {
  stats.history.push(stats.seed);
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
  if (!$("#Name").text()) {
    GenClick();
    $("#Name")[0].focus();
    $("#Name")[0].select();
  }
  $('#Sold').click(sold);
  $('#Cancel').click(cancel);
});


function UnrollClick() {
  randseed(stats.history.pop());
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

function sold() {
  var newguy = {
    name: $("#Name").val(),
    race: $("input:radio[name=Race]:checked").val(),
    'class': $("input:radio[name=Class]:checked").val(),
    seed: stats.seed,
  };
  $.each('STR,CON,DEX,INT,WIS,CHA'.split(','), function (index,value) {
      newguy[value] = stats[value];
    });
  addToRoster(newguy);
  window.location = "main.html#" + newguy.name;
}

function cancel() {
  window.location = "roster.html";
}

function GenClick() {
  $("#Name").attr("value", GenerateName());
}

