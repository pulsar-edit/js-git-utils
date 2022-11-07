// First lets setup isomorphic-git
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const helpers = require("./helpers.js");

// Now to mirror the API from `https://github.com/pulsar-edit/git-utils`

class Repository {
  constructor() {
    /**
    this.caseInsensitiveFs: true;
    this.submodules: {
      'deps/libgit2': new Repository...
      sub: new Repository...
    };
    this.workingDirectory: 'D:/Personal Documents/Github...';
    */
    this.caseInsensitiveFs = undefined;
    this.submodules = undefined;
    this.workingDirectory = undefined;
  }

  getWorkingDirectory() {
    if (!this.workingDirectory) {
      // TODO: _getWorkingDirectory is not in js of git-utils - Better go find it
      this.workingDirectory = this._getWorkingDirectory();
      if (this.workingDirectory) {
        this.workingDirectory = this.workingDirectory.replace(/\/$/, '');
      }
    }
    return this.workingDirectory;
  }

  getSubmodulePaths() {
    // TODO: getSubmodulePaths is not in js of git-utils...
  }

  getPath() {
    // TODO: getPath is not in js of git-utils - welp where to look I wonder
  }

  release() {
    for (let submodulePath in this.submodules) {
      const submoduleRepo = this.submodules[submodulePath];
      if (submoduleRepo) {
        submoduleRepo.release();
      }
    }
    // TODO: _release() is not in js of git-utils - Where is it??
    return this._release();
  }

  checkoutHead(path) {

  }

  checkoutReference(reference, create) {

  }

  getAheadBehindCount(branch) {

  }

  getCommitCount(fromCommit, toCommit) {

  }

  getConfigValue(key) {

  }

  setConfigValue(key, value) {

  }

  getDiffStats(path) {

  }

  getHeadBlob(path) {

  }

  getHead() {

  }

  getIndexBlob(path) {

  }

  getLineDiffs(path, text, options) {

  }

  getLineDiffDetails(path, text, options) {

  }

  getMergeBase(commit1, commit2) {

  }

  getReferences() {

  }

  getReferenceTarget(ref) {

  }

  getShortHead() {

  }

  getStatus(path) {

  }

  getUpstreamBranch(branch) {

  }

  isIgnored(path) {

  }

  isPathModified(path) {

  }

  isPathNew(path) {

  }

  isPathDeleted(path) {

  }

  isPathStaged(path) {

  }

  isStatusIgnored(status) {

  }

  isStatusModified(status) {

  }

  isStatusNew(status) {

  }

  isStatusDeleted(status) {

  }

  isStatusStaged(status) {

  }

  isSubmodule(path) {

  }

  refreshIndex() {

  }

  relativize(path) {

  }

  isWorkingDirectory(path) {

  }

  submoduleForPath(path) {

  }

  add(path) {
    
  }

  set openedWorkingDirectory(val) {
    // this doesn't seem to exist anywhere.
    // It looks like it may be an optional class variable set, if conditions are write.
  }

}

function openRepository(repositoryPath, search) {
  const symlink = helpers.realpath(repositoryPath) !== repositoryPath;

  if (process.platform === "win32") {
    // TODO: See if this is still required.
    repositoryPath = repositoryPath.replace(/\\/g, '/');
  }
  const repository = new Repository(repositoryPath, search);

  if (repository.exists()) {

    repository.caseInsensitiveFs = helpers.isCaseInsensitive();

    if (symlink) {
      const workingDirectory = repository.getWorkingDirectory();

      while(!helpers.isRootPath(repositoryPath)) {

        if (helpers.realpath(repositoryPath) === workingDirectory) {
          repository.openedWorkingDirectory = repositoryPath;
          break;
        }
        repositoryPath = path.resolve(repositoryPath, '..');
      }
    }
    return repository;

  } else {
    return null;
  }
}

function openSubmodules(repository) {
  repository.submodules = {};

  for (let relativePath of repository.getSubmodulePaths()) {
    if (relativePath) {
      const submodulePath = path.join(repository.getWorkingDirectory(), relativePath);
      const submoduleRepo = openRepository(submodulePath, false);

      if (submoduleRepo) {
        if (submoduleRepo.getPath() === repository.getPath()) {
          submoduleRepo.release();
        } else {
          openSubmodules(submoduleRepo);
          repository.submodules[relativePath] = submoduleRepo;
        }
      }
    }
  }
}

exports.open = function(repositoryPath, search = true) {
  const repository = openRepository(repositoryPath, search);

  if (repository) {
    openSubmodules(repository);
  }

  return repository;
};
