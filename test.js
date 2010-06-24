function test(module) {
  require('./' + module);
  require('sys').puts(module + ' OK');
}

test('config');
test('main');
test('newguy');

require('sys').puts('PASS');