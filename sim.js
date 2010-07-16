//!/usr/bin/env v8

var window = {
  location: {href: "#Woogle"},

  localStorage: {
    items: null,

    getItem: function(key) {
      if (!this.items) {
        try {
          this.items = JSON.parse(read("local.storage"));
        } catch (e) {
          print(e);
          this.items = {};
        }
      }
      return this.items[key];
    },
  
    setItem: function (key, value) {
      this.items[key] = value;
      write("local.storage", JSON.stringify(this.items));
    },

    removeItem: function (key) {
      delete this.items[key];
      write("local.storage", JSON.stringify(this.items));
    }
  },
};


var location = window.location;

var $ = function () { return null; };
$.isFunction = function (obj) {
  return toString.call(obj) === "[object Function]";
},
$.isArray = function (obj) {
  return toString.call(obj) === "[object Array]";
}
$.each = function (object, callback) {
  var name, i = 0,
    length = object.length,
    isObj = length === undefined || $.isFunction(object);
  
  if (isObj) {
      for (name in object) {
	if (callback.call(object[name], name, object[name]) === false)
	  break;
      }
  } else {
    for (var value = object[0];
	 i < length && callback.call(value, i, value) !== false; 
         value = object[++i]) { }
  }
  return object;
}

var document = null;

if (typeof process !== "undefined") {
  // Node
  var fs = require("fs");
  var sys = require("sys");
  var load = function (filename) {
    var content = fs.readFileSync(filename);
    global.eval.call(global, String(content));
  };
  var print = function () {
    for (var i = 0, len = arguments.length; i < len; ++i) {
      sys.print(arguments[i] + " ");
    }
    sys.puts("");
  };
  var read = function (f) { return fs.readFileSync(f); };
  var write = function (f,c) { fs.writeFileSync(f,c); };

  global.window = window;
  global.document = document;
  global.$ = $;
  print("node");
} else {
  // V8 shell
  global = this;  
  print("v8");
}

var alert = global.alert = function (m) { print("ALERT: " + m); };

var now = 0;
var timers = [{}];
var setInterval  = global.setInterval = function (callback, interval) {
  timers.push({callback:callback, interval:interval});
  return timers.length-1;
}

load("config.js");

var cs = 0;
for (var c in loadRoster())
  cs++;
print(cs, "characters");

load("newguy.js");
NewGuyFormLoad();
sold();

write("local.storage", JSON.stringify(window.localStorage.items));

var guy = window.location.href.split("#")[1];

load("main.js");

var timeGetTime = global.timeGetTime = function () {
  return now;
}

FormCreate();

function charsheet(game) {
  print(game.Traits.Name, 
        game.Traits.Level,
        game.tasks,
        RoughTime(game.elapsed));
}

// It takes 18 sec to simulate 18 hours of play when I just checked (to 
// level 10)

for (var j = 1, t = 0; j < 11; ++j) {
  t += LevelUpTime(j);
  //if (j % 100 == 0)
    print(j, RoughTime(LevelUpTime(j))+",", RoughTime(t));
}

var l = 0;
for (var i = 0; i < 100000000; ++i) {
  if (game.Traits.Level != l) {
    SaveGame();
    charsheet(game);
    l = game.Traits.Level;
    if (l >= 5) break;
  }
  //assert(timers.length == 2);// TODO: this is for simplicity
  now += timers[1].interval;
  timers[1].callback();
}

