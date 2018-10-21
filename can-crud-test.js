import QUnit from 'steal-qunit';
import plugin from './can-crud';

QUnit.module('can-crud');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the can-crud plugin');
});
