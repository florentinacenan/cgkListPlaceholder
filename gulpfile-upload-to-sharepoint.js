'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const spsync = require('gulp-spsync-creds').sync;

const environmentInfo = {
  "username": "florentina@cenandevmsdn.onmicrosoft.com",
  "password": "Flopo10g",
  "tenant": "cenandevmsdn",
  "site": "https://cenandevmsdn.sharepoint.com",
  "libraryPath": "CDN/cgkListPlaceHolder",
};

build.task('upload-to-sharepoint', { 
    execute: (config) => {
        return new Promise((resolve, reject) => {
            const deployFolder = require('./config/copy-assets.json');
            const folderLocation = `./${deployFolder.deployCdnPath}/**/*.*`;
            return gulp.src(folderLocation)
            .pipe(spsync({
                "username": environmentInfo.username,
                "password": environmentInfo.password,
                "site": environmentInfo.site,
                "libraryPath":environmentInfo.libraryPath,
                "publish": true
            }))
            .on('finish', resolve);
        });
    }
});
