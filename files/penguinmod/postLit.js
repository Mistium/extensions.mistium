// Name: postLit
// ID: jwPostLit
// Description: Sign in, post and read posts on postLit.
// By: jwklong
// Original: https://github.com/PenguinMod/PenguinMod-Vm/tree/9c8e446108b000e6f251d7747931e632bc213d2d/src/extensions/jw_postlit
// Ported to work outside PenguinMod by Mistium
// License: MPL-2.0
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("postLit must run unsandboxed.");
  const BlockType = Scratch.BlockType;
  const ArgumentType = Scratch.ArgumentType;
  const formatMessage = (m) => (typeof m === "string" ? m : m.default);
  const fetch = (...a) => (Scratch.fetch ? Scratch.fetch(...a) : globalThis.fetch(...a));

  const proxy = "https://proxy.jwklong.repl.co"
  const prefix = "https://postlit.dev/"

  /**
   * Class for PostLit blocks
   * @constructor
   */
  class jwPostLit {
      constructor() {
          /**
           * The runtime instantiating this block package.
           * @type {Runtime}
           */
          this.runtime = Scratch.vm.runtime;
      }

      loginData = {
          username: '',
          token: ''
      }

      latestPost = ''

      /**
       * @returns {object} metadata for this extension and its blocks.
       */
      getInfo() {
          return {
              id: 'jwPostLit',
              name: 'postLit',
              //blockIconURI: blockIconURI,
              color2: '#14f789',
              color1: '#0fd173',
              blocks: [
                  {
                      opcode: 'categorySignIn',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.categorySignIn',
                          default: 'Sign In',
                          description: 'Sign in to postLit.'
                      }),
                      blockType: BlockType.LABEL
                  },
                  {
                      opcode: 'signIn',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.signIn',
                          default: 'sign in [USER] [PASS]',
                          description: 'Sign in to postLit.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          USER: {
                              type: ArgumentType.STRING,
                              defaultValue: "username"
                          },
                          PASS: {
                              type: ArgumentType.STRING,
                              defaultValue: "password"
                          }
                      }
                  },
                  {
                      opcode: 'currentUsername',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.currentUsername',
                          default: 'username',
                          description: 'Username for your postLit account.'
                      }),
                      disableMonitor: false,
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'currentToken',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.currentToken',
                          default: 'token',
                          description: 'Token for your postLit account.'
                      }),
                      disableMonitor: false,
                      blockType: BlockType.REPORTER
                  },
                  {
                      opcode: 'isSignedIn',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.isSignedIn',
                          default: 'signed in?',
                          description: 'Checks if you are currently signed into a postLit account.'
                      }),
                      disableMonitor: false,
                      blockType: BlockType.BOOLEAN
                  },
                  "---",
                  {
                      opcode: 'categoryPosts',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.categoryPosts',
                          default: 'Posts',
                          description: 'Blocks to create and get data from posts'
                      }),
                      blockType: BlockType.LABEL
                  },
                  {
                      opcode: 'createPost',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.createPost',
                          default: 'create post [STRING]',
                          description: 'Create a post.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          STRING: {
                              type: ArgumentType.STRING,
                              defaultValue: "post"
                          }
                      }
                  },
                  {
                      opcode: 'getLatestPost',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.getLatestPost',
                          default: 'latest post id',
                          description: 'Gets the ID of the latest post made with the create post block.'
                      }),
                      disableMonitor: false,
                      blockType: BlockType.REPORTER
                  },
                  "---",
                  {
                      opcode: 'getPost',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.getPost',
                          default: 'get post [ID] [WANTS]',
                          description: 'Gets some data from a post.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.REPORTER,
                      arguments: {
                          ID: {
                              type: ArgumentType.STRING,
                              defaultValue: 'id'
                          },
                          WANTS: {
                              type: ArgumentType.STRING,
                              defaultValue: 'json',
                              menu: 'getPostWants'
                          },
                      }
                  },
                  {
                      opcode: 'likePost',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.likePost',
                          default: 'like post [ID]',
                          description: 'Like a post.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          ID: {
                              type: ArgumentType.STRING,
                              defaultValue: 'id'
                          },
                      }
                  },
                  {
                      opcode: 'unlikePost',
                      text: formatMessage({
                          id: 'jwPostLit.blocks.unlikePost',
                          default: 'unlike post [ID]',
                          description: 'Unlike a post.'
                      }),
                      disableMonitor: true,
                      blockType: BlockType.COMMAND,
                      arguments: {
                          ID: {
                              type: ArgumentType.STRING,
                              defaultValue: 'id'
                          },
                      }
                  }
              ],
              menus: {
                  getPostWants: [
                      'json',
                      'author',
                      'content',
                      'time',
                      'comments',
                      'likes',
                      'likers',
                      'reposts'
                  ]
              }
          };
      }

      async signIn(args, util) {
          const username = String(args.USER)
          const password = String(args.PASS)
          var response = await fetch(proxy, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  url: prefix + "signin",
                  method: 'POST',
                  body: {
                      username: username,
                      password: password
                  }
              })
          })
          var data = await response.json()
          if (data.success) {
              this.loginData = {
                  username: username,
                  token: data.token
              }
          }
      }

      currentUsername(args, util) {
          return this.loginData.username
      }

      currentToken(args, util) {
          return this.loginData.token
      }

      isSignedIn(args, util) {
          return this.loginData.token !== ''
      }

      async createPost(args, util) {
          const string = String(args.STRING)
          var response = await fetch(proxy, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  url: prefix + "post",
                  method: 'POST',
                  headers: {
                      cookie: "token="+this.loginData.token
                  },
                  body: {
                      content: string
                  }
              })
          })
          const data = await response.json()
          if (data.success) {
              this.latestPost = data.success.split("/")[2]
          }
      }

      getLatestPost(args, util) {
          return this.latestPost
      }

      async getPost(args, util) {
          const id = String(args.ID)
          const wants = String(args.WANTS)
          const url = prefix + "posts/" + id + "/data/"
          var response = await fetch(proxy, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  url: url,
                  headers: {
                      cookie: "token="+this.loginData.token
                  },
              })
          })
          const data = await response.json()
          switch (wants) {
              case 'json':
                  return JSON.stringify(data)
              case 'author':
                  return data.author
              case 'content':
                  return data.content
              case 'time':
                  return data.time
              case 'comments':
                  return data.comments
              case 'likes':
                  return (data.likes || []).length
              case 'likers':
                  return JSON.stringify(data.likes || [])
              case 'reposts':
                  return data.reposts || 0
              default:
                  return ''
          }
      }
    
      likePost(args, util) {
          const id = String(args.ID)
          fetch(proxy, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: {
                  url: prefix + "like",
                  method: "POST",
                  headers: {
                      cookie: "token="+this.loginData.token
                  },
                  body: {
                      post: id
                  }
              }
          })
      }
    
      unlikePost(args, util) {
          const id = String(args.ID)
          fetch(proxy, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: {
                  url: prefix + "unlike",
                  method: "POST",
                  headers: {
                      cookie: "token="+this.loginData.token
                  },
                  body: {
                      post: id
                  }
              }
          })
      }
  }


  Scratch.extensions.register(new jwPostLit());
})(Scratch);
