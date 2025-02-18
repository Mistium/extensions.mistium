// Made By Mistium
// github extension
// v2
// License: MPL-2.0
// This Source Code is subject to the terms of the Mozilla Public License, v2.0,
// If a copy of the MPL was not distributed with this file,
// Then you can obtain one at https://mozilla.org/MPL/2.0/

(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("GitHub API extension must be unsandboxed");
  }

  class GitHubAPI {
    getInfo() {
      return {
        id: 'githubAPI',
        name: 'GitHub API',
        color1: '#6cc644',
        blocks: [
          {
            opcode: 'getRepositoryInfo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get repository [INFO] for [USER] / [REPO]',
            arguments: {
              INFO: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'repositoryInfoOptions',
                defaultValue: 'name'
              },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
            }
          },
          {
            opcode: 'getFileData',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get file [PATH] from [USER] / [REPO] on [BRANCH]',
            arguments: {
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/file' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' },
              BRANCH: { type: Scratch.ArgumentType.STRING, defaultValue: 'main' }
            }
          },
          {
            opcode: 'getFolderContents',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [TYPE] of folder [FOLDER] from [USER] / [REPO]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.DROPDOWN,
                menu: 'folderContentsOptions',
                defaultValue: 'names'
              },
              FOLDER: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/folder' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
            }
          },
          {
            opcode: 'setAuthToken',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set auth token to [TOKEN]',
            arguments: {
              TOKEN: { type: Scratch.ArgumentType.STRING, defaultValue: 'token' }
            }
          },
          {
            opcode: 'createFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create file [PATH] in [USER] / [REPO] with [CONTENT] (auth)',
            arguments: {
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/file' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' },
              CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: 'content' }
            }
          },
          {
            opcode: 'updateFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'update file [PATH] in [USER] / [REPO] with [CONTENT] (auth)',
            arguments: {
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/file' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' },
              CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: 'content' }
            }
          },
          {
            opcode: 'deleteFile',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete file [PATH] from [USER] / [REPO] (auth)',
            arguments: {
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/file' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
            }
          },
          "---",
          {
            opcode: 'getIssues',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get issues from [USER] / [REPO]',
            arguments: {
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
            }
          },
          {
            opcode: 'deleteIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete issue [ISSUE] from [USER] / [REPO] (auth)',
            arguments: {
              ISSUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'issue number' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
            }
          },
          {
            opcode: 'createIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create issue in [USER] / [REPO] with [TITLE] and [BODY] (auth)',
            arguments: {
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'title' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'body' }
            }
          },
          {
            opcode: 'updateIssue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'update issue [ISSUE] in [USER] / [REPO] with [TITLE] and [BODY] (auth)',
            arguments: {
              ISSUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'issue number' },
              USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'title' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'body' }
            }
          }
        ],
        menus: {
          repositoryInfoOptions: [
            { text: 'Name', value: 'name' },
            { text: 'Description', value: 'description' },
            { text: 'Owner', value: 'owner' },
            { text: 'Stars', value: 'stars' },
            { text: 'Watchers', value: 'watchers' },
            { text: 'Forks', value: 'forks' },
            { text: 'Image URL', value: 'image' }
          ],
          folderContentsOptions: [
            { text: 'Names', value: 'names' },
            { text: 'Paths', value: 'paths' }
          ]
        }
      };
    }

    async getRepositoryInfo({ INFO, USER, REPO }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}`;
      try {
        let response;
        if (this.authToken) {
          response = await fetch(url, {
            headers: {
              'Authorization': `token ${this.authToken}`
            }
          });
        } else {
          response = await fetch(url);
        }
        if (!response.ok) {
          throw new Error('Failed to fetch repository info.');
        }
        const data = await response.json();
        switch (INFO) {
          case 'name':
            return data.name;
          case 'description':
            return data.description;
          case 'owner':
            return data.owner.login;
          case 'stars':
            return data.stargazers_count;
          case 'watchers':
            return data.watchers_count;
          case 'forks':
            return data.forks_count;
          case 'image':
            return data.owner.avatar_url;
          default:
            throw new Error('Invalid repository info option.');
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

    async getFileData({ PATH, USER, REPO, BRANCH }) {
      const url = `https://raw.githubusercontent.com/${USER}/${REPO}/${BRANCH}/${PATH}`;
      try {
        let response;
        if (this.authToken) {
          response = await fetch(url, {
            headers: {
              'Authorization': `token ${this.authToken}`
            }
          });
        } else {
          response = await fetch(url);
        }
        if (!response.ok) {
          throw new Error('Failed to fetch file data.');
        }
        // Assuming the content is base64 encoded
        return response.text();
      } catch (error) {
        console.error('Error:', error);
        return "";
      }
    }

    async getFolderContents({ TYPE, FOLDER, USER, REPO }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;
      try {
        let response;
        if (this.authToken) {
          response = await fetch(url, {
            headers: {
              'Authorization': `token ${this.authToken}`
            }
          });
        } else {
          response = await fetch(url);
        }
        if (!response.ok) {
          throw new Error('Failed to fetch folder contents.');
        }
        const data = await response.json();
        if (TYPE === 'names') {
          const names = data.map(item => item.name);
          return JSON.stringify(names);
        } else if (TYPE === 'paths') {
          const paths = data.map(item => item.path);
          return JSON.stringify(paths);
        } else {
          throw new Error('Invalid folder contents type option.');
        }
      } catch (error) {
        console.error('Error:', error);
        return "";
      }
    }

    setAuthToken({ TOKEN }) {
      this.authToken = TOKEN
    }

    async createFile({ PATH, USER, REPO, CONTENT }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${PATH}`;
      const body = {
        message: 'Create file',
        content: btoa(CONTENT),
        owner: USER,
        repo: REPO
      };
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Failed to create file.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }

    async updateFile({ PATH, USER, REPO, CONTENT }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${PATH}`;
      const body = {
        message: 'Update file',
        content: btoa(CONTENT),
        sha: null,
        owner: USER,
        repo: REPO
      };
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch file data.');
        }
        const data = await response.json();
        body.sha = data.sha;
        const updateResponse = await fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (!updateResponse.ok) {
          throw new Error('Failed to update file.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }

    async deleteFile({ PATH, USER, REPO }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${PATH}`;
      const body = {
        message: 'Delete file',
        sha: null
      };
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch file data.');
        }
        const data = await response.json();
        body.sha = data.sha;
        const deleteResponse = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete file.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }

    async getIssues({ USER, REPO }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/issues`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch issues.');
        }
        const data = await response.json();
        return JSON.stringify(data);
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

    async deleteIssue({ ISSUE, USER, REPO }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/issues/${ISSUE}`;
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${this.authToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete issue.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }

    async createIssue({ USER, REPO, TITLE, BODY }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/issues`;
      const body = {
        title: TITLE,
        body: BODY
      };
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Failed to create issue.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }

    async updateIssue({ ISSUE, USER, REPO, TITLE, BODY }) {
      const url = `https://api.github.com/repos/${USER}/${REPO}/issues/${ISSUE}`;
      const body = {
        title: TITLE,
        body: BODY
      };
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Failed to update issue.');
        }
        return true;
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    }
  }

  Scratch.extensions.register(new GitHubAPI());
})(Scratch);
