// First lets setup isomorphic-git
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const helpers = require("./helpers.js");

// Now to mirror the API from `https://github.com/pulsar-edit/git-utils`

const statusIndexNew = 1 << 0;
const statusIndexModified = 1 << 1;
const statusIndexDeleted = 1 << 2;
const statusIndexRenamed = 1 << 3;
const statusIndexTypeChange = 1 << 4;
const statusWorkingDirNew = 1 << 7;
const statusWorkingDirModified = 1 << 8;
const statusWorkingDirDelete = 1 << 9;
const statusWorkingDirTypeChange = 1 << 10;
const statusIgnored = 1 << 14;

const modifiedStatusFlags =
  statusWorkingDirModified |
  statusIndexModified |
  statusWorkingDirDelete |
  statusIndexDeleted |
  statusWorkingDirTypeChange |
  statusIndexTypeChange;

const newStatusFlags = statusWorkingDirNew | statusIndexNew;

const deletedStatusFlags = statusWorkingDirDelete | statusIndexDeleted;

const indexStatusFlags =
  statusIndexNew |
  statusIndexModified |
  statusIndexDeleted |
  statusIndexRenamed |
  statusIndexTypeChange;

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
    // TODO: no reference
  }

  checkoutReference(reference, create) {
    if (branch.indexOf("refs/heads/") !== 0) {
      branch = `refs/heads/${branch}`;
    }
    return this.checkoutRef(branch, create);
  }

  checkoutRef(branch, create) {
    // TODO: no reference
  }

  // git-utils has an async version of this function which may be helpful.
  // But this async version does not exist on the public docs, so may be ignored.
  getAheadBehindCount(branch = "HEAD") {
    if (branch !== "HEAD" && !branch.startsWith("refs/heads")) {
      branch = `refs/heads/${branch}`;
    }

    const headCommit = this.getReferenceTarget(branch);
    if (!headCommit || headCommit.length === 0) {
      return { ahead: 0, behind: 0 };
    }

    const upstream = this.getUpstreamBranch();
    if (!upstream || upstream.length === 0) {
      return { ahead: 0, behind: 0 };
    }

    const upstreamCommit = this.getReferenceTarget(upstream);
    if (!upstreamCommit || upstreamCommit.length === 0) {
      return { ahead: 0, behind: 0 };
    }

    return this.compareCommits(headCommit, upstreamCommit);
  }

  compareCommits(headCommit, upstreamCommit) {
    // TODO: no reference
  }

  getCommitCount(fromCommit, toCommit) {
    // TODO: no reference
  }

  getConfigValue(key) {
    // TODO: no reference
  }

  setConfigValue(key, value) {
    // TODO: no reference
  }

  getDiffStats(path) {
    // TODO: no reference
  }

  getHeadBlob(path) {
    // TODO: no reference
  }

  getHead() {
    // TODO: no reference
    // Additionally git-utils has an async implementation of this, but that function does
    // not exist on public docs so may be ignored
  }

  getIndexBlob(path) {
    // TODO: no reference
  }

  getLineDiffs(path, text, options) {
    // TODO: no reference
  }

  getLineDiffDetails(path, text, options) {
    // TODO: no reference
  }

  getMergeBase(commit1, commit2) {
    // TODO: no reference
  }

  getReferences() {
    // TODO: no reference
  }

  getReferenceTarget(ref) {
    // TODO: no reference
  }

  getShortHead() {
    const head = this.getHead();
    if (head == null) {
      return head;
    }

    if (head.startsWith("refs/heads/")) {
      return head.substring(11);
    }

    if (head.startsWith("refs/tags/")) {
      return head.substring(10);
    }

    if (head.startsWith("refs/remotes/")) {
      return head.substring(13);
    }

    if (head.match(/[a-fA-F0-9]{40}/)) {
      return head.substring(0, 7);
    }

    return head;
  }

  getStatus(path) {
    // TODO: Maybe go back and fix this nonsense
    if (typeof path === "string") {
      return getStatusForPath.call(this, path);
    } else {
      return getStatus.call(this);
    }
  }

  getStatusForPath() {
    // TODO: no reference
  }

  getUpstreamBranch(branch) {
    if (branch == null) {
      branch = this.getHead();
    }
    if (!branch || !branch.startsWith("refs/heads")) {
      return null;
    }

    const shortBranch = branch.substring(11);

    const branchMerge = this.getConfigValue(`branch.${shortBranch}.merge`);
    if (!branchMerge || !branchMerge.startsWith("refs/heads/")) {
      return null;
    }

    const shortBranchMerge = branchMerge.substring(11);

    const branchRemote = this.getConfigValue(`branch.${shortBranch}.remote`);

    if (!branch || branch.length === 0) {
      return null;
    }

    return `refs/remotes/${branchRemote}/${shortBranchMerge}`;
  }

  isIgnored(path) {
    // TODO: no reference
  }

  isPathModified(path) {
    return this.isStatusModified(this.getStatus(path));
  }

  isPathNew(path) {
    return this.isStatusNew(this.getStatus(path));
  }

  isPathDeleted(path) {
    return this.isStatusDeleted(this.getStatus(path));
  }

  isPathStaged(path) {
    return this.isStatusStaged(this.getStatus(path));
  }

  isStatusIgnored(status = 0) {
    return (status & statusIgnored) > 0;
  }

  isStatusModified(status = 0) {
    return (status & modifiedStatusFlags) > 0;
  }

  isStatusNew(status = 0) {
    return (status & newStatusFlags) > 0;
  }

  isStatusDeleted(status = 0) {
    return (status & deletedStatusFlags) > 0;
  }

  isStatusStaged(status = 0) {
    return (status & indexStatusFlags) > 0;
  }

  isSubmodule(path) {
    // todo: no reference
  }

  refreshIndex() {
    // todo: no reference
  }

  relativize(path) {
    // todo: line 155 of git-utils
  }

  isWorkingDirectory(path) {
    if (!path) {
      return false;
    }

    if (process.platform === "win32") {
      path = path.replace(/\\/g, '/');
    } else {
      if (path[0] !== "/") {
        return false;
      }
    }

    if (this.caseInsensitiveFs) {

      const lowerCasePath = path.toLowerCase();
      const workingDirectory = this.getWorkingDirectory();

      if (workingDirectory && workingDirectory.toLowerCase() === lowerCasePath) {
        return true;
      }
      if (this.openedWorkingDirectory && this.openedWorkingDirectory.toLowerCase() === lowerCasePath) {
        return true;
      }

    } else {
      return path === this.getWorkingDirectory() || path === this.openedWorkingDirectory;
    }

    return false;
  }

  submoduleForPath(path) {
    path = this.relativize(path);

    if (!path) {
      return null;
    }

    for (let submodulePath in this.submodules) {
      const submoduleRepo = this.submodules[submodulePath];
      if (path === submodulePath) {
        return submoduleRepo;
      } else if (path.startsWith(`${submodulePath}/`)) {
        path = path.substring(submodulePath.length + 1);
        return submoduleRepo.submoduleForPath(path) || submoduleRepo;
      }
    }
    return null;
  }

  add(path) {
    // todo: no reference
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
