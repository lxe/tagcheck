var assert = require('assert');
var fmt = require('util').format;
var tagcheck = require('../');

var pkg_out_of_date = {
  "dependencies": {
    "test": "git+ssh://git@github.com:lxe/test-repo.git#v1.0.0",
  },
}

var pkg_up_to_date = {
  "dependencies": {
    "test": "git+ssh://git@github.com:lxe/test-repo.git#v2.0.0",
  }
}

function test(pkg, done) {
  var output = '';
  tagcheck(pkg, function () {
    output += fmt.apply(null, [].slice.call(arguments)) + '\n';
  }, function (err, status) {
    console.log(output);
    done(err, status);
  });
}

test(pkg_out_of_date, function (err, status) {
  assert(status === false, 'should respond with a falsy status if upgrade is suggested');
  test(pkg_up_to_date, function (err, status) {
    assert(status === true, 'should respond with a truthy status if up to date');
    process.exit(0);
  });
});



