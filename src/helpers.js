// A collection of functions that can assist the higher level execution of git.js
const fs = require("fs");

let caseInsensitiveFs = undefined;
// Refer to isCaseInsensitive - added here to cache the results of a file system check

function realpath(unrealPath) {
  try {
    return fs.realpathSync(unrealPath);
  } catch(err) {
    return unrealPath;
  }
}

function isCaseInsensitive() {
  // This is a feature of `fs-plus` used originally within `git-utils`
  // But since we are also wanting to stop usage of fs-plus, this will be implemented here

  // fs-plus originally has some features within this function to cache the results of a
  // file system check. For that we will append to the helpers module
  if (!caseInsensitiveFs) {
    let lowerCaseStat = fs.statSync(process.execPath.toLowerCase());
    let upperCaseStat = fs.statSync(process.execPath.toUpperCase());

    if (lowerCaseStat && upperCaseStat) {
      caseInsensitiveFs = (lowerCaseStat.dev == upperCaseStat.dev) && (lowerCaseStat.ino == upperCaseStat.ino);
      return caseInsensitiveFs;
    } else {
      caseInsensitiveFs = false;
      return caseInsensitiveFs;
    }
  } else {
    return caseInsensitiveFs;
  }
}

function isRootPath(repositoryPath) {
  if (process.platform === 'win32') {
    return /^[a-zA-Z]+:[\\/]$/.test(repositoryPath);
  } else {
    return repositoryPath === path.sep;
  }
}

module.exports = {
  realpath,
  isCaseInsensitive,
  isRootPath,
};
