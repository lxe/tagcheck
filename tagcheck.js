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

  var sshDeps = getSshDeps(pkg);
  var sshDepNames = Object.keys(sshDeps);

  var needToUpdate = null;
  var tagsChecked = sshDepNames.length;

  sshDepNames.forEach(function (sshDepName) {
    var sshDep = sshDeps[sshDepName];

    var cmd = fmt('git ls-remote %s',
      (sshDep.match(/\/\/([^#]+)/) || [])[1]);

    exec(cmd, function onexec (error, stdout, stderr) {
      if (error) {
        log(error.stack);
        if (done) {
          done(error);
        } else {
          process.exit(needToUpdate ? -1 : 0);
        }
      }

      var tags = stdout.match(/refs\/tags\/(v?[\d\.][^\}\{]+)$/gm) || [];
      var yourVersion = (sshDep.match(/#(v?[\d\.].+)$/) || ['', '[none]'])[1];
      var latestVersion = tags.map(function (tag) {
        return tag.split('/').pop();
      }).sort().pop().trim();

      var upToDate = (yourVersion === latestVersion);
      if (!upToDate) {
        var yourTagVersion = '#' + yourVersion;
        var latestTagVersion = '#' + latestVersion;
        var latestUrl = sshDep.replace(yourTagVersion, latestTagVersion);

        needToUpdate = needToUpdate || {};
        needToUpdate[sshDepName] = latestUrl;
      }

      log('package: %s', sshDep);
      log('your version: %s\tlatest version: %s %s\n',
        yourVersion, latestVersion, upToDate ?
          fmt('%sOK%s', green, reset) :
          fmt('%sUPGRADE SUGGESTED%s', red, reset));

      tagsChecked--;

      if (tagsChecked === 0) {
        if (done) {
          done(null, needToUpdate);
        } else {
          process.exit(needToUpdate ? -1 : 0);
        }
      }
    });
  });
}

function getSshDeps(pkg) {
  var pkgDependencyTypes = [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ];

  var dependencies = {};

  pkgDependencyTypes.forEach(function getDependencies(type) {
    var pkgDeps = pkg[type];
    if (!pkgDeps) {
      return;
    }

    var deps = Object.keys(pkgDeps);
    deps.forEach(function buildDependenciesObject(dep) {
      var url = pkgDeps[dep];
      if (/^git\+ssh:\/\//.test(url)) {
        dependencies[dep] = url;
      }
    });
  });

  return dependencies;
}
