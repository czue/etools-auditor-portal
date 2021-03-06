/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const del = require('del');

// Returns a Promise to delete a directory
function clean() {
  return del(
    [
      global.config.build.rootDirectory + '/**',
      '!' + global.config.build.rootDirectory
    ],
    {
      force: true
    }
  );
}

function fullClean() {
  return del(
    [
      global.config.build.rootDirectory + '/**',
      '!' + global.config.build.rootDirectory,
      global.config.build.templateDirectory
    ],
    {
      force: true
    }
  );
}

function cleanBowerInSrc() {
    return del(
        ['./src/bower_components'],
        {force: true}
    );
}

module.exports = {
    build: clean,
    fullBuild: fullClean,
    bowerInSrc: cleanBowerInSrc
};
