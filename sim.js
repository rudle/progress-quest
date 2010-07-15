//!/usr/bin/env v8

function noop() {}
function nada() { return {}; }

var document = {
  addEventListener: noop,
  createElement: function () {
    var result = {
      style: {},
      getElementsByTagName: nada,
      appendChild: noop,
    };
    result.lastChild = result;
    return result;
  },
  documentElement: {
    insertBefore: noop,
    removeChild: noop,
  },
  getElementById: nada,
  createComment: noop,
  createDocumentFragment: nada,
};

var window = {
  location: {href: "#Woogle"},
  localStorage: {
    items: {},

    getItem: function(key) {
      return this.items[key];
    },
  
    setItem: function (key, value) {
      this.items[key] = value;
    },

    removeItem: function (key) {
      delete this.items[key];
    }
  },
  document: document,
  addEventListener: noop,
};

var location = window.location;

var v8 = true;

var $ = function () {
  return null;
  return {
    click: noop,
    keypress: noop,
    ready: noop,
    unload: noop,
    bind: noop,
    text: noop,
    appendTo: noop,
    attr: noop,
    focus: noop,
    select: noop,
  };
};
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


var navigator = { 
  v8: true,
  userAgent: "V8 Shell" 
};
var alert = function (m) { print("ALERT: " + m); };

var randseed = function () {};
try {
  window.localStorage.items = JSON.parse(read("local.storage"));
} catch (e) {
  print(e);
  window.localStorage.items = {};
}

var now = 0;
var timers = [{}];
function setInterval(callback, interval) {
  timers.push({callback:callback, interval:interval});
  return timers.length-1;
}

//load("jquery.js");
//var $ = window.$;
load("config.js");

load("newguy.js");
NewGuyFormLoad();
sold();

write("local.storage", JSON.stringify(window.localStorage.items));


var guy = window.location.href.split("#")[1];

load("main.js");
FormCreate();

timeGetTime = function () {
  return now;
}

for (var i = 0; i < 1000; ++i) {
  //assert(timers.id == 1);// TODO: this is for simplicity
  now += timers[1].interval;
  timers[1].callback();
}

SaveGame();
print(guy, game.elapsed, game.tasks, game.task);//JSON.stringify(loadSheet(guy)));