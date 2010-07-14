//!/usr/bin/env v8

function noop() {}
function nada() { return {}; }

var document = {
  addEventListener: noop,
  createElement: function () {
    return {
      style: {},
      getElementsByTagName: nada,
      appendChild: noop,
    };
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
    getItem: function(key) {
      return JSON.stringify({Woogle: {
        Traits: {
          Name: "Woogle"
        }
      }});
    },
  
    setItem: function (key, value) {
      
    },

    removeItem: function (key) {
      
    }
  },
  document: document,
  addEventListener: noop,
};

var location = window.location;

/*
var $ = function () {
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
$.each = function (collection, callback) {
  isArray: function( obj ) {
    return toString.call(obj) === "[object Array]";
  },
};
*/
var navigator = { userAgent: "V8 Shell" };
var alert = function (m) { print("ALERT: " + m); };

function loadSheet(name) {
  return { name: "bob" };
}
var storage = {
  removeItem: function () {}
};
var randseed = function () {};

load("jquery.js");
var $ = window.$;
load("config.js");

load("newguy.js");
//NewGuyFormLoad();

load("main.js");
//FormCreate();

