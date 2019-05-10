import QUnit from 'steal-qunit';
import plugin from './can-crud';

QUnit.module('can-crud');

QUnit.test('Initialized the plugin', function(assert) {
  assert.equal(typeof plugin, 'function');
  assert.equal(plugin(), 'This is the can-crud plugin');
});
