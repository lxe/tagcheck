#!/usr/bin/env node

'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var fmt = require('util').format;
var exec = require('child_process').exec;

var green = '\u001b[32m';
var red   = '\u001b[31m';
var reset = '\u001b[39m';

if (require.main == module) {
  var pkg = JSON.parse(fs.readFileSync(
    path.join(process.cwd(), 'package.json')));
  return tagCheck(pkg, console.log);
}

module.exports = tagCheck;

function tagCheck (pkg, log, done) {
  assert(pkg, 'package.json data required');
  log = log || console.log;

  log('Retrieving tags...\n');

  var sshDeps = [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ].reduce(function (deps, key) {
    var sshDeps = Object.keys(pkg[key] || { })
      .map(function (name) { return pkg[key][name]; })
      .filter(RegExp.prototype.test.bind(/^git\+ssh:\/\//));

    return deps.concat(sshDeps);
  }, []);

  var tagsChecked = sshDeps.length;
  var allUpToDate = true;

  sshDeps.forEach(function (sshDep) {
    var cmd = fmt('git ls-remote %s',
      (sshDep.match(/\/\/([^#]+)/) || [])[1]);

    exec(cmd, function onexec (error, stdout, stderr) {
      var tags = stdout.match(/refs\/tags\/(v?[\d\.]+)/gm) || [];
      var yourVersion = (sshDep.match(/#(v?[\d\.]+)$/) || ['', '[none]'])[1];
      var latestVersion = tags.map(function (tag) {
        return tag.split('/').pop();
      }).sort().pop();

      var upToDate = (yourVersion === latestVersion);
      if (!upToDate) {
        allUpToDate = false;
      }

      log('package: %s', sshDep);
      log('your version: %s\tlatest version: %s %s\n',
        yourVersion, latestVersion, upToDate ?
          fmt('%sOK%s', green, reset) :
          fmt('%sUPGRADE SUGGESTED%s', red, reset));

      tagsChecked--;

      if (tagsChecked === 0) {
        if (done) {
          done(null, allUpToDate);
        } else {
          process.exit(allUpToDate ? 0 : -1);
        }
      }
    });
  });
}



