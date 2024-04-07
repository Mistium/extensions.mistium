(function(Scratch) {
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
                        text: 'get file [PATH] from [USER] / [REPO]',
                        arguments: {
                            PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'path/to/file' },
                            USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'username' },
                            REPO: { type: Scratch.ArgumentType.STRING, defaultValue: 'repository' }
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
                const response = await fetch(url);
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

        async getFileData({ PATH, USER, REPO }) {
            const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${PATH}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch file data.');
                }
                const data = await response.json();
                // Assuming the content is base64 encoded
                return atob(data.content);
            } catch (error) {
                console.error('Error:', error);
                return null;
            }
        }

        async getFolderContents({ TYPE, FOLDER, USER, REPO }) {
            const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;
            try {
                const response = await fetch(url);
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
                return null;
            }
        }
    }

    Scratch.extensions.register(new GitHubAPI());
})(Scratch);
