! function(e) {
  "use strict";
  let t = "https://reverse.mubi.tech/v1";
  const o = e.vm;
  e.extensions.register(new class {
      constructor() {
          this.chatHistories = {}, this.model = "gpt-4o", this.reqModels = [{
              text: "Currently requesting models please wait!",
              value: "gpt-3.5-turbo"
          }], this.fetchAndGetReqModels().then((e => {
              this.reqModels = e
          })), this.nextJSON = null
      }
      getInfo() {
          return {
              id: "penguinGPT",
              name: "PenguinAI",
              color1: "#009CCC",
              blocks: [{
                  opcode: "__NOUSEOPCODE",
                  blockType: e.BlockType.LABEL,
                  text: "Reverse Proxy API Blocks"
              }, {
                  opcode: "setApiUrl",
                  blockType: e.BlockType.COMMAND,
                  text: "Set reverse proxy API Base URL to [URL]",
                  arguments: {
                      URL: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "https://reverse.mubi.tech/v1"
                      }
                  }
              }, {
                  opcode: "setModel",
                  blockType: e.BlockType.COMMAND,
                  text: "Set Model to [MODEL]",
                  arguments: {
                      MODEL: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "(select here)",
                          menu: "reqModels"
                      }
                  }
              }, {
                  opcode: "getModel",
                  blockType: e.BlockType.REPORTER,
                  text: "Get current model"
              }, {
                  opcode: "checkApiUrl",
                  blockType: e.BlockType.BOOLEAN,
                  text: "Is reverse proxy working?",
                  disableMonitor: !0
              }, {
                  opcode: "__NOUSEOPCODE",
                  blockType: e.BlockType.LABEL,
                  text: "Message Management"
              }, {
                  opcode: "singlePrompt",
                  blockType: e.BlockType.REPORTER,
                  text: "Generate from text (No Context): [PROMPT]",
                  arguments: {
                      PROMPT: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "How are you?"
                      }
                  }
              }, {
                  opcode: "advancedPrompt",
                  blockType: e.BlockType.REPORTER,
                  text: "Send text [PROMPT] to [chatID]",
                  arguments: {
                      PROMPT: {
                          type: e.ArgumentType.STRING,
                          defaultValue: 'What is "Foo, Bar"?'
                      },
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      }
                  }
              }, {
                  opcode: "addImageToNextRequest",
                  blockType: e.BlockType.COMMAND,
                  text: "Attach Image [URL] to next message",
                  arguments: {
                      URL: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "datauri or url"
                      }
                  }
              }, {
                  opcode: "informChat",
                  blockType: e.BlockType.COMMAND,
                  text: "Inform [chatID] that [inform]",
                  arguments: {
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      },
                      inform: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "You can only speak in meows and other cat noises."
                      }
                  }
              }, {
                  opcode: "__NOUSEOPCODE",
                  blockType: e.BlockType.LABEL,
                  text: "Chatbot Management"
              }, {
                  opcode: "createChat",
                  blockType: e.BlockType.COMMAND,
                  text: "Create chatbot named [chatID]",
                  arguments: {
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      }
                  }
              }, {
                  opcode: "removeChat",
                  blockType: e.BlockType.COMMAND,
                  text: "Delete chatbot [chatID]",
                  arguments: {
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      }
                  }
              }, {
                  opcode: "resetChat",
                  blockType: e.BlockType.COMMAND,
                  text: "Reset chat history of [chatID]",
                  arguments: {
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      }
                  }
              }, {
                  opcode: "exportChat",
                  blockType: e.BlockType.REPORTER,
                  text: "Chat history of [chatID] as Array",
                  arguments: {
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo",
                          disableMonitor: !1
                      }
                  }
              }, {
                  opcode: "importChat",
                  blockType: e.BlockType.COMMAND,
                  text: "Import chat history from [json] as [chatID]",
                  arguments: {
                      json: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Array goes here"
                      },
                      chatID: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Foo"
                      }
                  }
              }, {
                  opcode: "importAll",
                  blockType: e.BlockType.COMMAND,
                  text: "Import chats from [json] and [merge]",
                  arguments: {
                      json: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Array goes here"
                      },
                      merge: {
                          type: e.ArgumentType.STRING,
                          menu: "merge"
                      }
                  }
              }, {
                  opcode: "exportAll",
                  blockType: e.BlockType.REPORTER,
                  text: "All chats as Arrays"
              }, {
                  opcode: "listChats",
                  blockType: e.BlockType.REPORTER,
                  text: "Currently Active chats"
              }, {
                  opcode: "__NOUSEOPCODE",
                  blockType: e.BlockType.LABEL,
                  text: "Image Generation"
              }, {
                  opcode: "generateImage",
                  blockType: e.BlockType.REPORTER,
                  text: "Generate [PROMPT] from [MODEL] and get Response",
                  arguments: {
                      PROMPT: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Penguin in Space"
                      },
                      MODEL: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "(select model)",
                          menu: "igModels"
                      }
                  }
              }, {
                  opcode: "generateImageAndImport",
                  blockType: e.BlockType.COMMAND,
                  text: "Generate [PROMPT] from [MODEL] and import as costume with name [NAME]",
                  arguments: {
                      PROMPT: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Penguin in Space"
                      },
                      MODEL: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "(select model)",
                          menu: "igModels"
                      },
                      NAME: {
                          type: e.ArgumentType.STRING,
                          defaultValue: "Penguin"
                      }
                  }
              }],
              menus: {
                  types: {
                      acceptReporters: !0,
                      items: ["Generated Text", "Request"]
                  },
                  merge: {
                      acceptReporters: !0,
                      items: ["Merge/Update existing chats", "Remove all chatbots and import"]
                  },
                  igModels: {
                      acceptReporters: !0,
                      items: [{
                          text: "DALL-E 3",
                          value: "dall-e-3"
                      }, {
                          text: "Dreamshaper 8",
                          value: "dreamshaper-8"
                      }, {
                          text: "OpenJourney V4",
                          value: "openjourney-v4"
                      }, {
                          text: "I can't believe it's not a photograph",
                          value: "i-cant-believe-its-not-photography-seco"
                      }, {
                          text: "Am i Real V4.1",
                          value: "am-i-real-v4.1"
                      }, {
                          text: "Pastel Mix Anime",
                          value: "pastel-mix-anime"
                      }, {
                          text: "Anything V5",
                          value: "anything-v5"
                      }, {
                          text: "Realistic Vision V5",
                          value: "realistic-vision-v5"
                      }]
                  },
                  reqModels: {
                      acceptReporters: !0,
                      items: "fetchAndGetReqModelsTemp"
                  }
              }
          }
      }
      addImageToNextRequest(e) {
          return this.nextJSON = {
              type: "image_url",
              image_url: {
                  url: e.URL
              }
          }, this.nextJSON
      }
      fetchAndGetReqModelsTemp() {
          return this.reqModels
      }
      fetchAndGetReqModels() {
          return fetch(t + "/models").then((e => {
              if (!e.ok) throw new Error(`Network response was not ok: ${e.status} ${e.statusText}`);
              return e.json()
          })).then((e => {
              let t = [];
              return e.data.forEach((e => {
                  "chat.completions" == e.type && t.push({
                      text: this.formatModelId(e.id),
                      value: e.id
                  })
              })), t
          }))
      }
      getPrompt(e) {
          return "(select a prompt)" !== e.TYPE ? e.TYPE : ""
      }
      setModel(e) {
          this.model = e.MODEL
      }
      getModel() {
          return this.model
      }
      setApiUrl(e) {
          const o = e.URL;
          t = o
      }
      checkApiUrl() {
          return e.fetch(t).then((e => e.status >= 200 && e.status < 300)).catch((() => !1))
      }
      singlePrompt(o) {
          const a = o.PROMPT;
          let r = a;
          if (this.nextJSON) {
              r = [{
                  type: "text",
                  text: a
              }, ...Array.isArray(this.nextJSON) ? this.nextJSON : [this.nextJSON]], this.nextJSON = null
          }
          return e.fetch(`${t}/chat/completions`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Origin: "https://gptcall.net/",
                  Referer: "https://gptcall.net/"
              },
              body: JSON.stringify({
                  model: this.model,
                  messages: [{
                      role: "user",
                      content: r
                  }]
              })
          }).then((e => {
              if (!e.ok) throw new Error(`Network response was not ok: ${e.status} ${e.statusText}`);
              return e.json()
          })).then((e => e.choices[0].message.content)).catch((e => (console.error("Error sending prompt to GPT", e.message), e.message)))
      }
      generateImage(o) {
          const a = o.PROMPT,
              r = o.MODEL;
          return e.fetch(`${t}/images/generations`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  model: r,
                  prompt: a
              })
          }).then((e => {
              if (!e.ok) throw new Error(`Network response was not ok: ${e.status} ${e.statusText}`);
              return e.json()
          })).then((e => e.data[0].url)).catch((e => (console.error("Error sending prompt to Image Generator", e.message), e.message)))
      }
      generateImageAndImport(a, r) {
          const n = a.PROMPT,
              s = a.MODEL,
              i = a.NAME || `AIGenerated_${n}`,
              l = r.target.id;
          return e.fetch(`${t}/images/generations`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  model: s,
                  prompt: n
              })
          }).then((e => {
              if (!e.ok) throw new Error(`Network response was not ok: ${e.status} ${e.statusText}`);
              return e.json()
          })).then((e => {
              let t = e.data[0].url;
              fetch(t).then((e => e.arrayBuffer())).then((e => {
                  const t = o.runtime.storage,
                      a = new t.Asset(t.AssetType.ImageBitmap, null, t.DataFormat.PNG, new Uint8Array(e), !0),
                      r = {
                          md5: a.assetId + "." + a.dataFormat,
                          asset: a,
                          name: i
                      };
                  o.addCostume(r.md5, r, l)
              }))
          })).catch((e => (console.error("Error sending prompt to Image Generator", e.message), e.message)))
      }
      createChat(e) {
          const t = e.chatID;
          t in this.chatHistories || (this.chatHistories[t] = [{
              role: "system",
              content: "Your name is: " + t
          }])
      }
      informChat(e) {
          const t = e.inform,
              o = e.chatID;
          o in this.chatHistories && this.chatHistories[o].push({
              role: "system",
              content: t
          })
      }
      exportChat(e) {
          const t = e.chatID;
          if (void 0 !== this.chatHistories[t]) {
              const e = this.chatHistories[t];
              return JSON.stringify(e)
          }
          return "Error: There is no chat history available for that chatbot."
      }
      listChats() {
          const e = Object.keys(this.chatHistories);
          return JSON.stringify(e)
      }
      importChat(e) {
          const t = e.chatID,
              o = e.json;
          let a;
          try {
              a = JSON.parse(o)
          } catch (e) {
              return void console.error("Error parsing JSON:", e.message)
          }
          Array.isArray(a) ? this.chatHistories[t] = a : console.error("Invalid JSON format. Expected an array.")
      }
      resetChat(e) {
          const t = e.chatID;
          t in this.chatHistories && (this.chatHistories[t] = [{
              role: "system",
              content: "Your name is: " + t
          }])
      }
      removeChat(e) {
          const t = e.chatID;
          if (!(t in this.chatHistories)) return "Error: There is no chat history available for that chatbot.";
          delete this.chatHistories[t]
      }
      advancedPrompt(o) {
          const a = o.PROMPT,
              r = o.chatID;
          if (!(r in this.chatHistories)) return "Error: That chatbot does not exist.";
          const n = this.chatHistories[r] || [];
          let s = a;
          if (this.nextJSON) {
              s = [{
                  type: "text",
                  text: a
              }, ...Array.isArray(this.nextJSON) ? this.nextJSON : [this.nextJSON]], this.nextJSON = null
          }
          return n.push({
              role: "user",
              content: s
          }), e.fetch(`${t}/chat/completions`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Origin: "https://gptcall.net/",
                  Referer: "https://gptcall.net/"
              },
              body: JSON.stringify({
                  model: this.model,
                  messages: n
              })
          }).then((e => {
              if (!e.ok) throw new Error(`Network response was not ok: ${e.status} ${e.statusText}`);
              return e.json()
          })).then((e => {
              const t = e.choices[0].message.content;
              return n.push({
                  role: "assistant",
                  content: t
              }), this.chatHistories[r] = n, t
          })).catch((e => (console.error("Error sending prompt to GPT", e.message), e.message)))
      }
      exportAll() {
          const e = {},
              t = Object.keys(this.chatHistories);
          for (const o of t) e[o] = this.chatHistories[o];
          return JSON.stringify(e)
      }
      importAll(e) {
          const t = e.json,
              o = e.merge.toLowerCase();
          let a;
          try {
              a = JSON.parse(t)
          } catch (e) {
              return void console.error("Error parsing JSON:", e.message)
          }
          if ("object" != typeof a || null === a) return console.error("Invalid JSON format. Expected an object."), "Invalid JSON format. Expected an object.";
          if ("remove all and import" === o) this.chatHistories = a;
          else {
              if ("merge with existing chats" !== o) return console.error('Invalid merge option. Expected "remove all and import" or "merge with existing chats".'), 'Invalid merge option. Expected "remove all and import" or "merge with existing chats".';
              {
                  const e = Object.keys(a);
                  for (const t of e) this.chatHistories[t] = a[t]
              }
          }
      }
      formatModelId(e) {
          return e.split("-").map((e => e.charAt(0).toUpperCase() + e.slice(1))).join(" ")
      }
  })
}(Scratch), unsandboxed;
