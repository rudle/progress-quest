/* copyright (c)2002-2010 Eric Fredricksen all rights reserved */

function Random(n) {
  return Math.floor(Math.random() * n);
}

function Roll(stat) {
  stat.Tag = 3 + Random(6) + Random(6) + Random(6);
  stat.html(stat.Tag);
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

function RollEm() {
  var STR = $("STR");
  var CON = $("CON");
  var DEX = $("DEX");
  var INT = $("INT");
  var WIS = $("WIS");
  var CHA = $("CHA");
  var Total = $("Total");
  var ReRoll = $("ReRoll");
  //ReRoll.Tag = RandSeed();
  Roll(STR);
  Roll(CON);
  Roll(DEX);
  Roll(INT);
  Roll(WIS);
  Roll(CHA);
  Total.tag = STR.Tag + CON.Tag + DEX.Tag + INT.Tag + WIS.Tag + CHA.Tag;
  Total.html(Total.Tag);
  /*
  if (Total.Tag >= (63+18)) Total.Color = clRed
  else if (Total.Tag > (4 * 18)) Total.Color = clYellow
  else if (Total.Tag <= (63-18)) Total.Color = clGray
  else if (Total.Tag < (3 * 18)) Total.Color = clSilver
  else Total.Color = clWhite;
*/
}

function RerollClick() {
  //OldRolls.Items.Insert(0, IntToStr(ReRoll.Tag));
  //Unroll.Enabled = true;
  RollEm();
  alert("ok");
}


function TNewGuyForm_Go() {
  Tag = 1;
  return mrOk == ShowModal();
}

$(document).ready(function () {
  //$("#Reroll").click(function(){RerollClick();});

  //var caption = 'Progress Quest - New Character';
  //if (MainForm.GetHostName != '')
  //  caption = caption + ' [' + MainForm.GetHostName + ']';
  //Randomize();
  RollEm();
});

function TNewGuyForm_UnrollClick() {
  RandSeed = StrToInt(OldRolls.Items[0]);
  OldRolls.Items.Delete(0);
  Unroll.Enabled = OldRolls.Items.Count > 0;
  RollEm();
}

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

function TNewGuyForm_ApplicationEvents1Minimize() {
  MainForm.MinimizeIt();
}

function GenerateName() {
  var KParts = [
    'br|cr|dr|fr|gr|j|kr|l|m|n|pr||||r|sh|tr|v|wh|x|y|z',
    'a|a|e|e|i|i|o|o|u|u|ae|ie|oo|ou',
    'b|ck|d|g|k|m|n|p|t|v|x|z'];

  function Pick(s) {
    var count = 1;
    for (var i = 0; i <= Length(s)-1; ++i)
      if (s[i] == '|') Inc(count);
    return Split(s, Random(count));
  }

  var result = '';
  for (var i = 0; i <= 5; ++i)
    result += Pick(KParts[i % 3]);
  return UpperCase(Copy(result,1,1)) + Copy(result,2,Length(result));
}

function TNewGuyForm_GenClick() {
  Name.Text = GenerateName();
}

function TNewGuyForm_FormActivate() {
  if (Name.Text == '') {
    GenClick();
    Name.SetFocus();
  }
}

function TNewGuyForm_FormCreate() {
  Race.Items.Clear();
  for (var i = 0; i <= K.Races.Lines.Count-1; ++i)
    Race.Items.Add(Split(K.Races.Lines[i],0));
  Klass.Items.Clear();
  for (var i = 0; i <= K.Klasses.Lines.Count-1; ++i)
    Klass.Items.Add(Split(K.Klasses.Lines[i],0));
}
