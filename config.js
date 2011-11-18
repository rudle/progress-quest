// TODO These code bits don't really belong here, but this is the only 
// shared bit of js

function tabulate(list) {
  var result = '';
  $.each(list, function (index) {
    if (this.length == 2) {
      if (this[1].length)
        result += "   " + this[0] + ": " + this[1] + "\n";
    } else {
      result += "   " + this + "\n";
    }
  });
  return result;
}


String.prototype.escapeHtml = function () {
  return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}


function template(tmpl, data) {
  var brag = tmpl.replace(/\$([_A-Za-z.]+)/g, function (str, p1) {
    var dict = data;
    $.each(p1.split("."), function (i,v) {
      if (!dict) return true;
      if (v == "___") {
        dict = tabulate(dict);
      } else {
        dict = dict[v.replace("_"," ")];
        if (typeof dict == typeof "")
          dict = dict.escapeHtml();
      }
      return null;
    });
    if (dict === undefined) dict = '';
    return dict;
  });
  return brag;
}

// From http://baagoe.com/en/RandomMusings/javascript/
  // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
}


// From http://baagoe.com/en/RandomMusings/javascript/
function Alea() {
  return (function(args) {
    // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;
    
    if (!args.length) {
      args = [+new Date];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');
    
    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    
    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() + 
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    random.state = function (newstate) {
      if (newstate) {
        s0 = newstate[0];
        s1 = newstate[1];
        s2 = newstate[2];
        c = newstate[3];
      }
      return [s0,s1,s2,c];
    };
    return random;
    
  } (Array.prototype.slice.call(arguments)));
}


var seed = new Alea();

function Random(n) {
  return seed.uint32() % n;
}


function randseed(set) {
  return seed.state(set);
}


function Pick(a) {
  return a[Random(a.length)];
}


var KParts = [
  'br|cr|dr|fr|gr|j|kr|l|m|n|pr||||r|sh|tr|v|wh|x|y|z'.split('|'),
  'a|a|e|e|i|i|o|o|u|u|ae|ie|oo|ou'.split('|'),
  'b|ck|d|g|k|m|n|p|t|v|x|z'.split('|')];

function GenerateName() {
  var result = '';
  for (var i = 0; i <= 5; ++i)
    result += Pick(KParts[i % 3]);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function LocalStorage() {
  this.getItem = function (key, callback) {
    var result = window.localStorage.getItem(key);
    if (callback)
      callback(result);
  };

  this.setItem = function (key, value, callback) {
    window.localStorage.setItem(key, value);
    if (callback)
      callback();
  };

  this.removeItem = function (key) {
    window.localStorage.removeItem(key);
  };
}


function CookieStorage() {
  this.getItem = function(key, callback) {
    var result;
    $.each(document.cookie.split(";"), function (i,cook) {
      if (cook.split("=")[0] === key)
        result = unescape(cook.split("=")[1]);
    });
    if (callback)
      setTimeout(function () { callback(result); }, 0);
    return result;
  };
  
  this.setItem = function (key, value, callback) {
    document.cookie = key + "=" + escape(value);
    if (callback)
      setTimeout(callback, 0);
  };

  this.removeItem = function (key) {
    document.cookie = key + "=; expires=Thu, 01-Jan-70 00:00:01 GMT;";
  };
}

function SqlStorage() {
  this.async = true;

  this.db = window.openDatabase("pq", "", "Progress Quest", 2500);

  this.db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS Storage(key TEXT UNIQUE, value TEXT)");
  });

  this.getItem = function(key, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql("SELECT value FROM Storage WHERE key=?", [key], function(tx, rs) {
        if (rs.rows.length) 
          callback(rs.rows.item(0).value);
        else
          callback();
      });
    });
  };
  
  this.setItem = function (key, value, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql("INSERT OR REPLACE INTO Storage (key,value) VALUES (?,?)",
                    [key, value], 
                    callback);
    });
  };
  
  this.removeItem = function (key) {
    this.db.transaction(function (tx) {
      tx.executeSql("DELETE FROM Storage WHERE key=?", [key]);
    });
  };
}

var iPad = navigator.userAgent.match(/iPad/);
var iPod = navigator.userAgent.match(/iPod/);
var iPhone = navigator.userAgent.match(/iPhone/);
var iOS = iPad || iPod || iPhone;

var storage = ((window.localStorage && !iOS) ? new LocalStorage() :
               window.openDatabase ? new SqlStorage() :
               new CookieStorage());
  
storage.loadRoster = function (callback) {
  function gotItem(value) {
    if (value) {
      try {
        value = JSON.parse(value);
      } catch (err) {
        // aight
      }
    }
    storage.games = value || {};
    callback(storage.games);
  }
  this.getItem("roster", gotItem);
}

storage.loadSheet = function (name, callback) {
  return this.loadRoster(function (games) {
    if (callback)
      callback(games[name]);
  });
}


storage.storeRoster = function (roster, callback) {
  this.games = roster;
  try {
    this.setItem("roster", JSON.stringify(roster), callback);
  } catch (err) {
    if (err.toString().indexOf("QUOTA_EXCEEDED_ERR") != -1) {
      alert("This browser lacks storage capacity to save this game. This game can continue but cannot be saved. (Mobile Safari, I'll wager?)");
      this.storeRoster = function (roster, callback) {
        setTimeout(callback, 0);
      };
      setTimeout(callback, 0);
    } else {
      throw err;
    }
  }
}

storage.addToRoster = function (newguy, callback) {
  if (this.games) {
    this.games[newguy.Traits.Name] = newguy;
    this.storeRoster(this.games, callback);
  } else {
    this.loadRoster(function () {
      if (storage.games)  // should always be true
        storage.addToRoster(newguy, callback);
    });
  }
}

Number.prototype.div = function (divisor) {
  var dividend = this / divisor;
  return (dividend < 0 ? Math.ceil : Math.floor)(dividend);
};


function LevelUpTime(level) {  // seconds 
  // 20 minutes per level
  return 20 * level * 60;
}


var K = {};

K.Traits = ["Name", "Race", "Class", "Level"];

K.PrimeStats = ["STR","CON","DEX","INT","WIS","CHA"];
K.Stats = K.PrimeStats.slice(0).concat(["HP Max","MP Max"]);

K.Equips = ["Weapon",
            "Shield",
            "Helm",
            "Hauberk",
            "Brassairts",
            "Vambraces",
            "Gauntlets",
            "Gambeson",
            "Cuisses",
            "Greaves",
            "Sollerets"];

K.Spells = [
  "Slime Finger",
  "Rabbit Punch",
  "Hastiness",
  "Good Move",
  "Sadness",
  "Seasick",
  "Gyp",
  "Shoelaces",
  "Innoculate",
  "Cone of Annoyance",
  "Magnetic Orb",
  "Invisible Hands",
  "Revolting Cloud",
  "Aqueous Humor",
  "Spectral Miasma",
  "Clever Fellow",
  "Lockjaw",
  "History Lesson",
  "Hydrophobia",
  "Big Sister",
  "Cone of Paste",
  "Mulligan",
  "Nestor's Bright Idea",
  "Holy Batpole",
  "Tumor (Benign)",
  "Braingate",
  "Summon a Bitch",
  "Nonplus",
  "Animate Nightstand",
  "Eye of the Troglodyte",
  "Curse Name",
  "Dropsy",
  "Vitreous Humor",
  "Roger's Grand Illusion",
  "Covet",
  "Black Idaho",
  "Astral Miasma",
  "Spectral Oyster",
  "Acrid Hands",
  "Angioplasty",
  "Grognor's Big Day Off",
  "Tumor (Malignant)",
  "Animate Tunic",
  "Ursine Armor",
  "Holy Roller",
  "Tonsilectomy",
  "Curse Family",
  "Infinite Confusion"];

K.OffenseAttrib = [
  "Polished|+1",
  "Serrated|+1",
  "Heavy|+1",
  "Pronged|+2",
  "Steely|+2",
  "Vicious|+3",
  "Venomed|+4",
  "Stabbity|+4",
  "Dancing|+5",
  "Invisible|+6",
  "Vorpal|+7"];

K.DefenseAttrib = [
  "Studded|+1",
  "Banded|+2",
  "Gilded|+2",
  "Festooned|+3",
  "Holy|+4",
  "Cambric|+1",
  "Fine|+4",
  "Impressive|+5",
  "Custom|+3"];

K.Shields = [
  "Parasol|0",
  "Pie Plate|1",
  "Garbage Can Lid|2",
  "Buckler|3",
  "Plexiglass|4",
  "Fender|4",
  "Round Shield|5",
  "Carapace|5",
  "Scutum|6",
  "Propugner|6",
  "Kite Shield|7",
  "Pavise|8",
  "Tower Shield|9",
  "Baroque Shield|11",
  "Aegis|12",
  "Magnetic Field|18"];

K.Armors = [
  "Lace|1",
  "Macrame|2",
  "Burlap|3",
  "Canvas|4",
  "Flannel|5",
  "Chamois|6",
  "Pleathers|7",
  "Leathers|8",
  "Bearskin|9",
  "Ringmail|10",
  "Scale Mail|12",
  "Chainmail|14",
  "Splint Mail|15",
  "Platemail|16",
  "ABS|17",
  "Kevlar|18",
  "Titanium|19",
  "Mithril Mail|20",
  "Diamond Mail|25",
  "Plasma|30"];

K.Weapons = [
  "Stick|0",
  "Broken Bottle|1",
  "Shiv|1",
  "Sprig|1",
  "Oxgoad|1",
  "Eelspear|2",
  "Bowie Knife|2",
  "Claw Hammer|2",
  "Handpeen|2",
  "Andiron|3",
  "Hatchet|3",
  "Tomahawk|3",
  "Hackbarm|3",
  "Crowbar|4",
  "Mace|4",
  "Battleadze|4",
  "Leafmace|5",
  "Shortsword|5",
  "Longiron|5",
  "Poachard|5",
  "Baselard|5",
  "Whinyard|6",
  "Blunderbuss|6",
  "Longsword|6",
  "Crankbow|6",
  "Blibo|7",
  "Broadsword|7",
  "Kreen|7",
  "Warhammer|7",
  "Morning Star|8",
  "Pole-adze|8",
  "Spontoon|8",
  "Bastard Sword|9",
  "Peen-arm|9",
  "Culverin|10",
  "Lance|10",
  "Halberd|11",
  "Poleax|12",
  "Bandyclef|15"];

K.Specials = [
  "Diadem",
  "Festoon",
  "Gemstone",
  "Phial",
  "Tiara",
  "Scabbard",
  "Arrow",
  "Lens",
  "Lamp",
  "Hymnal",
  "Fleece",
  "Laurel",
  "Brooch",
  "Gimlet",
  "Cobble",
  "Albatross",
  "Brazier",
  "Bandolier",
  "Tome",
  "Garnet",
  "Amethyst",
  "Candelabra",
  "Corset",
  "Sphere",
  "Sceptre",
  "Ankh",
  "Talisman",
  "Orb",
  "Gammel",
  "Ornament",
  "Brocade",
  "Galoon",
  "Bijou",
  "Spangle",
  "Gimcrack",
  "Hood",
  "Vulpeculum"];

K.ItemAttrib = [
  "Golden",
  "Gilded",
  "Spectral",
  "Astral",
  "Garlanded",
  "Precious",
  "Crafted",
  "Dual",
  "Filigreed",
  "Cruciate",
  "Arcane",
  "Blessed",
  "Reverential",
  "Lucky",
  "Enchanted",
  "Gleaming",
  "Grandiose",
  "Sacred",
  "Legendary",
  "Mythic",
  "Crystalline",
  "Austere",
  "Ostentatious",
  "One True",
  "Proverbial",
  "Fearsome",
  "Deadly",
  "Benevolent",
  "Unearthly",
  "Magnificent",
  "Iron",
  "Ormolu",
  "Puissant"];

K.ItemOfs = [
  "Foreboding",
  "Foreshadowing",
  "Nervousness",
  "Happiness",
  "Torpor",
  "Danger",
  "Craft",
  "Silence",
  "Invisibility",
  "Rapidity",
  "Pleasure",
  "Practicality",
  "Hurting",
  "Joy",
  "Petulance",
  "Intrusion",
  "Chaos",
  "Suffering",
  "Extroversion",
  "Frenzy",
  "Sisu",
  "Solitude",
  "Punctuality",
  "Efficiency",
  "Comfort",
  "Patience",
  "Internment",
  "Incarceration",
  "Misapprehension",
  "Loyalty",
  "Envy",
  "Acrimony",
  "Worry",
  "Fear",
  "Awe",
  "Guile",
  "Prurience",
  "Fortune",
  "Perspicacity",
  "Domination",
  "Submission",
  "Fealty",
  "Hunger",
  "Despair",
  "Cruelty",
  "Grob",
  "Dignard",
  "Ra",
  "the Bone",
  "Diamonique",
  "Electrum",
  "Hydragyrum"];

K.BoringItems = [
  "nail",
  "lunchpail",
  "sock",
  "I.O.U.",
  "cookie",
  "pint",
  "toothpick",
  "writ",
  "newspaper",
  "letter",
  "plank",
  "hat",
  "egg",
  "coin",
  "needle",
  "bucket",
  "ladder",
  "chicken",
  "twig",
  "dirtclod",
  "counterpane",
  "vest",
  "teratoma",
  "bunny",
  "rock",
  "pole",
  "carrot",
  "canoe",
  "inkwell",
  "hoe",
  "bandage",
  "trowel",
  "towel",
  "planter box",
  "anvil",
  "axle",
  "tuppence",
  "casket",
  "nosegay",
  "trinket",
  "credenza",
  "writ"];

K.Monsters = [
  "Anhkheg|6|chitin",
  "Ant|0|antenna",
  "Ape|4|ass",
  "Baluchitherium|14|ear",
  "Beholder|10|eyestalk",
  "Black Pudding|10|saliva",
  "Blink Dog|4|eyelid",
  "Cub Scout|1|neckerchief",
  "Girl Scout|2|cookie",
  "Boy Scout|3|merit badge",
  "Eagle Scout|4|merit badge",
  "Bugbear|3|skin",
  "Bugboar|3|tusk",
  "Boogie|3|slime",
  "Camel|2|hump",
  "Carrion Crawler|3|egg",
  "Catoblepas|6|neck",
  "Centaur|4|rib",
  "Centipede|0|leg",
  "Cockatrice|5|wattle",
  "Couatl|9|wing",
  "Crayfish|0|antenna",
  "Demogorgon|53|tentacle",
  "Jubilex|17|gel",
  "Manes|1|tooth",
  "Orcus|27|wand",
  "Succubus|6|bra",
  "Vrock|8|neck",
  "Hezrou|9|leg",
  "Glabrezu|10|collar",
  "Nalfeshnee|11|tusk",
  "Marilith|7|arm",
  "Balor|8|whip",
  "Yeenoghu|25|flail",
  "Asmodeus|52|leathers",
  "Baalzebul|43|pants",
  "Barbed Devil|8|flame",
  "Bone Devil|9|hook",
  "Dispater|30|matches",
  "Erinyes|6|thong",
  "Geryon|30|cornucopia",
  "Malebranche|5|fork",
  "Ice Devil|11|snow",
  "Lemure|3|blob",
  "Pit Fiend|13|seed",
  "Anklyosaurus|9|tail",
  "Brontosaurus|30|brain",
  "Diplodocus|24|fin",
  "Elasmosaurus|15|neck",
  "Gorgosaurus|13|arm",
  "Iguanadon|6|thumb",
  "Megalosaurus|12|jaw",
  "Monoclonius|8|horn",
  "Pentasaurus|12|head",
  "Stegosaurus|18|plate",
  "Triceratops|16|horn",
  "Tyranosauraus Rex|18|forearm",
  "Djinn|7|lamp",
  "Doppleganger|4|face",
  "Black Dragon|7|*",
  "Plaid Dragon|7|sporrin",
  "Blue Dragon|9|*",
  "Beige Dragon|9|*",
  "Brass Dragon|7|pole",
  "Tin Dragon|8|*",
  "Bronze Dragon|9|medal",
  "Chromatic Dragon|16|scale",
  "Copper Dragon|8|loafer",
  "Gold Dragon|8|filling",
  "Green Dragon|8|*",
  "Platinum Dragon|21|*",
  "Red Dragon|10|cocktail",
  "Silver Dragon|10|*",
  "White Dragon|6|tooth",
  "Dragon Turtle|13|shell",
  "Dryad|2|acorn",
  "Dwarf|1|drawers",
  "Eel|2|sashimi",
  "Efreet|10|cinder",
  "Sand Elemental|8|glass",
  "Bacon Elemental|10|bit",
  "Porn Elemental|12|lube",
  "Cheese Elemental|14|curd",
  "Hair Elemental|16|follicle",
  "Swamp Elf|1|lilypad",
  "Brown Elf|1|tusk",
  "Sea Elf|1|jerkin",
  "Ettin|10|fur",
  "Frog|0|leg",
  "Violet Fungi|3|spore",
  "Gargoyle|4|gravel",
  "Gelatinous Cube|4|jam",
  "Ghast|4|vomit",
  "Ghost|10|*",
  "Ghoul|2|muscle",
  "Humidity Giant|12|drops",
  "Beef Giant|11|steak",
  "Quartz Giant|10|crystal",
  "Porcelain Giant|9|fixture",
  "Rice Giant|8|grain",
  "Cloud Giant|12|condensation",
  "Fire Giant|11|cigarettes",
  "Frost Giant|10|snowman",
  "Hill Giant|8|corpse",
  "Stone Giant|9|hatchling",
  "Storm Giant|15|barometer",
  "Mini Giant|4|pompadour",
  "Gnoll|2|collar",
  "Gnome|1|hat",
  "Goblin|1|ear",
  "Grid Bug|1|carapace",
  "Jellyrock|9|seedling",
  "Beer Golem|15|foam",
  "Oxygen Golem|17|platelet",
  "Cardboard Golem|14|recycling",
  "Rubber Golem|16|ball",
  "Leather Golem|15|fob",
  "Gorgon|8|testicle",
  "Gray Ooze|3|gravy",
  "Green Slime|2|sample",
  "Griffon|7|nest",
  "Banshee|7|larynx",
  "Harpy|3|mascara",
  "Hell Hound|5|tongue",
  "Hippocampus|4|mane",
  "Hippogriff|3|egg",
  "Hobgoblin|1|patella",
  "Homonculus|2|fluid",
  "Hydra|8|gyrum",
  "Imp|2|tail",
  "Invisible Stalker|8|*",
  "Iron Peasant|3|chaff",
  "Jumpskin|3|shin",
  "Kobold|1|penis",
  "Leprechaun|1|wallet",
  "Leucrotta|6|hoof",
  "Lich|11|crown",
  "Lizard Man|2|tail",
  "Lurker|10|sac",
  "Manticore|6|spike",
  "Mastodon|12|tusk",
  "Medusa|6|eye",
  "Multicell|2|dendrite",
  "Pirate|1|booty",
  "Berserker|1|shirt",
  "Caveman|2|club",
  "Dervish|1|robe",
  "Merman|1|trident",
  "Mermaid|1|gills",
  "Mimic|9|hinge",
  "Mind Flayer|8|tentacle",
  "Minotaur|6|map",
  "Yellow Mold|1|spore",
  "Morkoth|7|teeth",
  "Mummy|6|gauze",
  "Naga|9|rattle",
  "Nebbish|1|belly",
  "Neo-Otyugh|11|organ ",
  "Nixie|1|webbing",
  "Nymph|3|hanky",
  "Ochre Jelly|6|nucleus",
  "Octopus|2|beak",
  "Ogre|4|talon",
  "Ogre Mage|5|apparel",
  "Orc|1|snout",
  "Otyugh|7|organ",
  "Owlbear|5|feather",
  "Pegasus|4|aileron",
  "Peryton|4|antler",
  "Piercer|3|tip",
  "Pixie|1|dust",
  "Man-o-war|3|tentacle",
  "Purple Worm|15|dung",
  "Quasit|3|tail",
  "Rakshasa|7|pajamas",
  "Rat|0|tail",
  "Remorhaz|11|protrusion",
  "Roc|18|wing",
  "Roper|11|twine",
  "Rot Grub|1|eggsac",
  "Rust Monster|5|shavings",
  "Satyr|5|hoof",
  "Sea Hag|3|wart",
  "Silkie|3|fur",
  "Shadow|3|silhouette",
  "Shambling Mound|10|mulch",
  "Shedu|9|hoof",
  "Shrieker|3|stalk",
  "Skeleton|1|clavicle",
  "Spectre|7|vestige",
  "Sphinx|10|paw",
  "Spider|0|web",
  "Sprite|1|can",
  "Stirge|1|proboscis",
  "Stun Bear|5|tooth",
  "Stun Worm|2|trode",
  "Su-monster|5|tail",
  "Sylph|3|thigh",
  "Titan|20|sandal",
  "Trapper|12|shag",
  "Treant|10|acorn",
  "Triton|3|scale",
  "Troglodyte|2|tail",
  "Troll|6|hide",
  "Umber Hulk|8|claw",
  "Unicorn|4|blood",
  "Vampire|8|pancreas",
  "Wight|4|lung",
  "Will-o'-the-Wisp|9|wisp",
  "Wraith|5|finger",
  "Wyvern|7|wing",
  "Xorn|7|jaw",
  "Yeti|4|fur",
  "Zombie|2|forehead",
  "Wasp|0|stinger",
  "Rat|1|tail",
  "Bunny|0|ear",
  "Moth|0|dust",
  "Beagle|0|collar",
  "Midge|0|corpse",
  "Ostrich|1|beak",
  "Billy Goat|1|beard",
  "Bat|1|wing",
  "Koala|2|heart",
  "Wolf|2|paw",
  "Whippet|2|collar",
  "Uruk|2|boot",
  "Poroid|4|node",
  "Moakum|8|frenum",
  "Fly|0|*",
  "Hogbird|3|curl",
  "Wolog|4|lemma"];

K.MonMods = [
  "-4 fœtal *",
  "-4 dying *",
  "-3 crippled *",
  "-3 baby *",
  "-2 adolescent",
  "-2 very sick *",
  "-1 lesser *",
  "-1 undernourished *",
  "+1 greater *",
  "+1 * Elder",
  "+2 war *",
  "+2 Battle-*",
  "+3 Were-*",
  "+3 undead *",
  "+4 giant *",
  "+4 * Rex"];

K.OffenseBad = [
  "Dull|-2",
  "Tarnished|-1",
  "Rusty|-3",
  "Padded|-5",
  "Bent|-4",
  "Mini|-4",
  "Rubber|-6",
  "Nerf|-7",
  "Unbalanced|-2"];

K.DefenseBad = [
  "Holey|-1",
  "Patched|-1",
  "Threadbare|-2",
  "Faded|-1",
  "Rusty|-3",
  "Motheaten|-3",
  "Mildewed|-2",
  "Torn|-3",
  "Dented|-3",
  "Cursed|-5",
  "Plastic|-4",
  "Cracked|-4",
  "Warped|-3",
  "Corroded|-3"];

K.Races = [
  "Half Orc|HP Max",
  "Half Man|CHA",
  "Half Halfling|DEX",
  "Double Hobbit|STR",
  "Hob-Hobbit|DEX,CON",
  "Low Elf|CON",
  "Dung Elf|WIS",
  "Talking Pony|MP Max,INT",
  "Gyrognome|DEX",
  "Lesser Dwarf|CON",
  "Crested Dwarf|CHA",
  "Eel Man|DEX",
  "Panda Man|CON,STR",
  "Trans-Kobold|WIS",
  "Enchanted Motorcycle|MP Max",
  "Will o' the Wisp|WIS",
  "Battle-Finch|DEX,INT",
  "Double Wookiee|STR",
  "Skraeling|WIS",
  "Demicanadian|CON",
  "Land Squid|STR,HP Max"];

K.Klasses = [
  "Ur-Paladin|WIS,CON",
  "Voodoo Princess|INT,CHA",
  "Robot Monk|STR",
  "Mu-Fu Monk|DEX",
  "Mage Illusioner|INT,MP Max",
  "Shiv-Knight|DEX",
  "Inner Mason|CON",
  "Fighter/Organist|CHA,STR",
  "Puma Burgular|DEX",
  "Runeloremaster|WIS",
  "Hunter Strangler|DEX,INT",
  "Battle-Felon|STR",
  "Tickle-Mimic|WIS,INT",
  "Slow Poisoner|CON",
  "Bastard Lunatic|CON",
  "Lowling|WIS",
  "Birdrider|WIS",
  "Vermineer|INT"];

K.Titles = [
  "Mr.",
  "Mrs.",
  "Sir",
  "Sgt.",
  "Ms.",
  "Captain",
  "Chief",
  "Admiral",
  "Saint"];

K.ImpressiveTitles = [
  "King",
  "Queen",
  "Lord",
  "Lady",
  "Viceroy",
  "Mayor",
  "Prince",
  "Princess",
  "Chief",
  "Boss",
  "Archbishop"];

