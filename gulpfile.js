'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

require('./gulpfile-upload-app-package');
require('./gulpfile-deploy-app-package');
require('./gulpfile-upload-to-sharepoint');

build.initialize(gulp);
