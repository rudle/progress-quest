unit NewGuy;
{ copyright (c)2002 Eric Fredricksen all rights reserved }

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, StdCtrls, ExtCtrls, ComCtrls, AppEvnts, NMURL;

type
  TNewGuyForm = class(TForm)
    Race: TRadioGroup;
    Klass: TRadioGroup;
    Label2: TLabel;
    STR: TPanel;
    Label3: TLabel;
    CON: TPanel;
    Label4: TLabel;
    DEX: TPanel;
    Label5: TLabel;
    INT: TPanel;
    Label6: TLabel;
    WIS: TPanel;
    Label7: TLabel;
    CHA: TPanel;
    Reroll: TButton;
    GroupBox1: TGroupBox;
    Label8: TLabel;
    Total: TPanel;
    Sold: TButton;
    Unroll: TButton;
    Name: TLabeledEdit;
    OldRolls: TListBox;
    Button2: TButton;
    PoorCodeDesign: TNMURL;
    Account: TLabeledEdit;
    Password: TLabeledEdit;
    ApplicationEvents1: TApplicationEvents;
    Gen: TButton;
    procedure RerollClick(Sender: TObject);
    procedure UnrollClick(Sender: TObject);
    procedure SoldClick(Sender: TObject);
    procedure FormShow(Sender: TObject);
    procedure ApplicationEvents1Minimize(Sender: TObject);
    procedure GenClick(Sender: TObject);
    procedure FormActivate(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    procedure RollEm;
    function GetAccount: String;
    function GetPassword: String;
    procedure ParseSoldResponse(body: String);
  public
    function Go: Boolean;
  end;

var
  NewGuyForm: TNewGuyForm;

function UrlEncode(s: string): string;
function GenerateName: string;

implementation

uses Main, SelServ, StrUtils, Web, Config;

{$R *.dfm}

function UrlEncode(s: string): string;
begin
  NewGuyForm.PoorCodeDesign.InputString := s;
  Result := NewGuyForm.PoorCodeDesign.Encode;
end;

procedure Roll(stat: TPanel);
begin
  stat.Tag := 3 + Random(6) + Random(6) + Random(6);
  stat.Caption := IntToStr(stat.Tag);
end;

function Choose(n, k: Integer): Real;
var
  d, i: Longint;
begin
  Result := n;
  d := 1;
  for i := 2 to k do begin
    Result := Result * (1+n-i);
    d := d * i;
  end;
  Result := Result / d;
end;

procedure TNewGuyForm.RollEm;
begin
  ReRoll.Tag := RandSeed;
  Roll(STR);
  Roll(CON);
  Roll(DEX);
  Roll(INT);
  Roll(WIS);
  Roll(CHA);
  Total.tag := STR.Tag + Con.Tag + DEX.Tag + Int.Tag + Wis.Tag + CHA.Tag;
  Total.Caption := IntToStr(Total.Tag);
  if Total.Tag >= (63+18) then Total.Color := clRed
  else if Total.Tag > (4 * 18) then Total.Color := clYellow
  else if Total.Tag <= (63-18) then Total.Color := clGray
  else if Total.Tag < (3 * 18) then Total.Color := clSilver
  else Total.Color := clWhite;
end;

procedure TNewGuyForm.RerollClick(Sender: TObject);
begin
  OldRolls.Items.Insert(0, IntToStr(ReRoll.Tag));
  Unroll.Enabled := true;
  RollEm;
end;

function TNewGuyForm.Go: Boolean;
begin
  Tag := 1;
  Result := mrOk = ShowModal;
end;

procedure TNewGuyForm.FormShow(Sender: TObject);
begin
  if Tag > 0 then begin
    Tag := 0;
    Caption := 'Progress Quest - New Character';
    if MainForm.GetHostName <> '' then
      Caption := Caption + ' [' + MainForm.GetHostName + ']';
    Randomize;
    RollEm;
    with Race do
      ItemIndex := Random(Items.Count);
    with Klass do
      ItemIndex := Random(Items.Count);
  end;
end;

procedure TNewGuyForm.UnrollClick(Sender: TObject);
begin
  RandSeed := StrToInt(OldRolls.Items[0]);
  OldRolls.Items.Delete(0);
  Unroll.Enabled := OldRolls.Items.Count > 0;
  RollEm;
end;

procedure TNewGuyForm.ParseSoldResponse(body: String);
begin
  if (LowerCase(Split(body,0)) = 'ok') then begin
    MainForm.SetPasskey(Split(body,1));
    MainForm.SetLogin(GetAccount);
    MainForm.SetPassword(GetPassword);
    ModalResult := mrOk;
  end else begin
    ShowMessage(body);
  end;
end;

function TNewGuyForm.GetAccount: String;
begin
  Result := '';
  if Account.Visible then Result := Account.Text;
end;

function TNewGuyForm.GetPassword: String;
begin
  Result := '';
  if Password.Visible then Result := Password.Text;
end;

procedure TNewGuyForm.SoldClick(Sender: TObject);
var url, args: String;
begin
  if MainForm.GetHostAddr = ''
  then ModalResult := mrOk
  else begin
    try
      Screen.Cursor := crHourglass;
      try
        if (MainForm.Label8.Tag and 16) = 0
        then url := MainForm.GetHostAddr
        else url := 'http://www.progressquest.com/create.php?';
        // url := StringReplace(url, '.com/', '.com/dev/', []);
        if (GetAccount <> '') or (GetPassword <> '') then
          url := StuffString(url, 8, 0, GetAccount+':'+GetPassword+'@');
        args := 'cmd=create' +
                '&name=' + UrlEncode(Name.Text) +
                '&realm=' + UrlEncode(MainForm.GetHostName) +
                RevString;
        ParseSoldResponse(DownloadString(url + args));
      except
        on EWebError do begin
          ShowMessage('Error connecting to server');
        end;
      end;
    finally
      Screen.Cursor := crDefault;
    end;
  end;
end;

{
procedure TNewGuyForm.ServerAboutToSend(Sender: TObject);
begin
  Server.SendHeader.Values['Content-Type'] := 'text/plain';
  Server.SendHeader.Values['Motto'] := MainForm.GetMotto;
  Server.SendHeader.Values['Guild'] := MainForm.GetGuild;
end;
 }

procedure TNewGuyForm.ApplicationEvents1Minimize(Sender: TObject);
begin
  MainForm.MinimizeIt;
end;

function GenerateName: string;
const
  KParts: array [0..2] of string = (
    'br|cr|dr|fr|gr|j|kr|l|m|n|pr||||r|sh|tr|v|wh|x|y|z',
    'a|a|e|e|i|i|o|o|u|u|ae|ie|oo|ou',
    'b|ck|d|g|k|m|n|p|t|v|x|z');
var
  i: Integer;

  function Pick(s: string): string;
  var
    count, i: Integer;
  begin
    count := 1;
    for i := 0 to Length(s)-1 do
      if s[i] = '|' then Inc(count);
    Result := Split(s, Random(count));
  end;
begin
  for i := 0 to 5 do
    Result := Result + Pick(KParts[i mod 3]);
  Result := UpperCase(Copy(Result,1,1)) + Copy(Result,2,Length(Result));
end;

procedure TNewGuyForm.GenClick(Sender: TObject);
begin
  Name.Text := GenerateName;
end;

procedure TNewGuyForm.FormActivate(Sender: TObject);
begin
  if Name.Text = '' then begin
    GenClick(Sender);
    Name.SetFocus;
  end;
end;

procedure TNewGuyForm.FormCreate(Sender: TObject);
var
  i: Integer;
begin
  Race.Items.Clear;
  for i := 0 to K.Races.Lines.Count-1 do
    Race.Items.Add(Split(K.Races.Lines[i],0));
  Klass.Items.Clear;
  for i := 0 to K.Klasses.Lines.Count-1 do
    Klass.Items.Add(Split(K.Klasses.Lines[i],0));
end;

end.
