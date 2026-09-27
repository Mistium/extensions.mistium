import { blocks } from "./helpers.js";

export function buildGetInfo(ext) {
    return {
      id: "roturEXT",
      name: `RoturV${ext.version}`,
      color1: "#403041",
      blocks: [
        blocks.button("New Update Available", "openUpdate", {
          hideFromPalette: !ext.outdated
        }),
        blocks.command("connectToServer", "connect to server with designation: [DESIGNATION], system: [SYSTEM] and version: [VERSION]", {
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr",
          },
          SYSTEM: {
            menu: "systems",
            defaultValue: "rotur"
          },
          VERSION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "v" + ext.version,
          },
        }),
        blocks.boolean("serverOnline", "account server online"),
        blocks.command("disconnect", "disconnect from server"),
        blocks.boolean("connected", "connected to server"),
        blocks.separator(),
        blocks.event("whenConnected", "when connected to server"),
        blocks.event("whenDisconnected", "when disconnected from server"),
        blocks.separator(),
        blocks.label("Authentication"),
        blocks.command("login_prompt", "open login prompt with style [STYLE_URL]", {
          STYLE_URL: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "https://origin.mistium.com/Resources/auth.css",
          },
        }),
        blocks.reporter("login", "login with username: [USERNAME] and password: [PASSWORD]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test",
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("loginMd5", "login with username: [USERNAME] and password: [PASSWORD] (md5)", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test",
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("loginToken", "login with token: [TOKEN]", {
          TOKEN: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "token",
          },
        }),
        blocks.reporter("register", "register with username: [USERNAME] and password: [PASSWORD]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "test",
          },
          PASSWORD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "password",
          },
        }, { hideFromPalette: true }),
        blocks.command("logout", "logout"),
        blocks.boolean("loggedIn", "authenticated"),
        blocks.boolean("firstLogin", "is this the first login of today?", {}, {
          hideFromPalette: true,
        }),
        blocks.event("whenAuthenticated", "when authenticated"),
        blocks.separator(),
        blocks.label("Account Information"),
        blocks.button("Account Docs", "openAccountDocs"),
        blocks.reporter("getToken", "user token"),
        blocks.reporter("getkey", "get [KEY]", {
          KEY: {
            menu: "keys",
          },
        }),
        blocks.reporter("setkey", "set [KEY] to [VALUE]", {
          KEY: {
            menu: "keys",
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value",
          },
        }),
        blocks.boolean("keyExists", "key [KEY] exists", {
          KEY: {
            menu: "keys",
          },
        }),
        blocks.reporter("getkeys", "get all keys"),
        blocks.reporter("getvalues", "get all values"),
        blocks.reporter("getAccount", "get account object"),
        blocks.event("whenAccountUpdate", "when account updated"),
        blocks.separator(),
        blocks.label("Data Storage"),
        blocks.button("Data Storage Docs", "openStorageDocs"),
        blocks.command("setStorageID", "set storage id to [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "id",
          },
        }),
        blocks.boolean("storageIdExists", "storage id has been set"),
        blocks.reporter("getStorageID", "storage id"),
        blocks.reporter("getStorageKey", "get key from storage [KEY]", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
        }),
        blocks.command("setStorageKey", "set key [KEY] to [VALUE] in storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value",
          },
        }),
        blocks.boolean("existsStorageKey", "key [KEY] exists in storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
        }),
        blocks.command("deleteStorageKey", "delete key [KEY] from storage", {
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
        }),
        blocks.reporter("getStorageKeys", "get all keys from storage"),
        blocks.reporter("getStorageValues", "get all values from storage"),
        blocks.command("clearStorage", "clear storage"),
        blocks.label("Storage Information"),
        blocks.reporter("storageUsage", "storage usage (characters)"),
        blocks.reporter("storageLimit", "storage limit (characters)"),
        blocks.reporter("storageRemaining", "storage remaining (characters)"),
        blocks.reporter("accountStorageUsage", "account storage usage (characters)"),
        blocks.reporter("accountStorageLimit", "account storage limit (characters)"),
        blocks.reporter("accountStorageRemaining", "account storage remaining (characters)"),
        blocks.separator(),
        blocks.label("Messaging"),
        blocks.command("sendMessage", "send message [PAYLOAD] to user [USER] on port: [TARGET] from port: [SOURCE]", {
          PAYLOAD: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Hello",
          },
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "targetUser",
          },
          TARGET: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "port",
          },
          SOURCE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "port",
          },
        }),
        blocks.event("whenMessageReceived", "when message received"),
        blocks.reporter("getPacketsFromTarget", "get packets from port [TARGET]", {
          TARGET: {
            menu: "targets",
          },
        }),
        blocks.reporter("getFirstPacketOnTarget", "first packet on port [TARGET]", {
          TARGET: {
            menu: "targets",
          },
        }),
        blocks.reporter("dataOfFirstPacketOnTarget", "[DATA] of first packet on port [TARGET]", {
          DATA: {
            menu: "packetData",
          },
          TARGET: {
            menu: "targets",
          },
        }),
        blocks.reporter("numberOfPacketsOnTarget", "number of packets on port [TARGET]", {
          TARGET: {
            menu: "targets",
          },
        }),
        blocks.reporter("getAllTargets", "all open targets"),
        blocks.reporter("getAllPackets", "all packets"),
        blocks.reporter("deleteFirstPacketOnTarget", "pop first of port [TARGET]", {
          TARGET: {
            menu: "targets",
          }
        }),
        blocks.command("deletePacketsOnTarget", "delete all packets on port [TARGET]", {
          TARGET: {
            menu: "targets",
          }
        }),
        blocks.command("deleteAllPackets", "delete all packets"),
        blocks.separator(),
        blocks.label("Raw Packet Queue"),
        blocks.reporter("RAWgetAllPackets", "get all raw packets"),
        blocks.reporter("RAWgetFirstPacket", "first raw packet"),
        blocks.command("RAWdeleteFirstPacket", "pop first raw packet"),
        blocks.command("RAWdeleteAllPackets", "delete all raw packets"),
        blocks.separator(),
        blocks.label("Client Information"),
        blocks.reporter("clientIP", "client IP"),
        blocks.reporter("clientUsername", "client username"),
        blocks.reporter("getClient", "my client object"),
        blocks.separator(),
        blocks.label("Users"),
        blocks.reporter("clientUsers", "connected users"),
        blocks.boolean("usernameConnected", "username [USER] connected on any designation", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
        }),
        blocks.boolean("userConnected", "user [USER] connected on designation: [DESIGNATION]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr",
          },
        }),
        blocks.reporter("getUserDesignation", "get all users on designation: [DESIGNATION]", {
          DESIGNATION: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "rtr",
          },
        }),
        blocks.reporter("findID", "find all connections of username: [USER]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
        }),
        blocks.event("onJoin", "when a user connects"),
        blocks.event("onLeave", "when a user disconnects"),
        blocks.reporter("onJoinUser", "last user to join"),
        blocks.reporter("onLeaveUser", "last user to leave"),
        blocks.separator(),
        blocks.label("Synced Variables"),
        blocks.command("setSyncedVariable", "sync variable with [USER] of [KEY] to [VALUE]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
          VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "value",
          },
        }),
        blocks.reporter("getSyncedVariable", "get synced variable with [USER] of [KEY]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
        }),
        blocks.command("deleteSyncedVariable", "delete synced variable with [USER] of [KEY]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "key",
          },
        }),
        blocks.reporter("getSyncedVariables", "get synced variables with [USER]", {
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
        }),
        blocks.separator(),
        blocks.label("rMail"),
        blocks.button("Mail Docs", "openMailDocs"),
        blocks.event("whenMailReceived", "when mail received"),
        blocks.reporter("sendMail", "send mail with subject: [SUBJECT] and message: [MESSAGE] to: [TO]", {
          SUBJECT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Subject",
          },
          MESSAGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "Message",
          },
          TO: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
        }),
        blocks.reporter("getAllMail", "get mail list"),
        blocks.reporter("getMail", "get body of mail at index [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1",
          },
        }),
        blocks.command("deleteMail", "delete mail at index [ID]", {
          ID: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1",
          },
        }),
        blocks.command("deleteAllMail", "delete all mail"),
        blocks.separator(),
        blocks.label("Friends"),
        blocks.button("Friends Docs", "openFriendsDocs"),
        blocks.reporter("getFriendList", "get friend list"),
        blocks.reporter("removeFriend", "remove friend [FRIEND]", {
          FRIEND: {
            menu: "friends",
          },
        }),
        blocks.reporter("acceptFriendRequest", "accept friend request from [FRIEND]", {
          FRIEND: {
            menu: "requests",
          },
        }),
        blocks.reporter("declineFriendRequest", "decline friend request from [FRIEND]", {
          FRIEND: {
            menu: "requests",
          },
        }),
        blocks.reporter("sendFriendRequest", "send friend request to [FRIEND]", {
          FRIEND: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend",
          },
        }),
        blocks.event("whenFriendRequestReceived", "when friend request received"),
        blocks.event("whenFriendRequestAccepted", "when friend request accepted"),
        blocks.reporter("getFriendRequests", "get friend requests"),
        blocks.reporter("getFriendStatus", "get friend status of [FRIEND]", {
          FRIEND: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend",
          },
        }),
        blocks.reporter("getFriendCount", "get friend count"),
        blocks.separator(),
        blocks.label("Currency"),
        blocks.button("Currency Docs", "openCurrencyDocs"),
        blocks.reporter("getBalance", "get balance"),
        blocks.reporter("tranferCurrency", "transfer [AMOUNT] to [USER]", {
          AMOUNT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "0",
          },
          USER: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "user",
          },
        }),
        blocks.event("whenBalanceChanged", "when balance changed"),
        blocks.reporter("getTransactions", "get transactions"),
        blocks.reporter("getTransactionCount", "transaction count"),
        blocks.separator(),
        blocks.label("My Keys"),
        blocks.button("Mange My Keys", "openKeyManager"),
        blocks.reporter("getMyOwnedItems", "my keys"),
        blocks.reporter("itemData", "get key data for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }),
        blocks.reporter("purchaseItem", "purchase key with id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }),
        blocks.reporter("itemInfo", "get key info for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }),
        blocks.boolean("ownsItem", "do I own key of id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }),
        blocks.reporter("getPublicItems", "get public items, page: [PAGE]", {
          PAGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "1",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("getPublicItemPages", "get public item pages", {}, {
          disableMonitor: true,
          hideFromPalette: true
        }),
        blocks.reporter("updateItem", "keys - update [KEY] to [DATA] for id: [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "ID",
          },
          KEY: {
            type: Scratch.ArgumentType.STRING,
            menu: "itemKeys",
          },
          DATA: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "data",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("deleteItem", "keys - delete (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("hideItem", "items - disable purchases on (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }, { hideFromPalette: true }),
        blocks.reporter("showItem", "items - enable purchases on (ID) [ITEM]", {
          ITEM: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "item",
          },
        }, { hideFromPalette: true }),
        blocks.separator(),
        blocks.label("Badges"),
        blocks.button("Badge Docs", "openBadgesDocs"),
        blocks.boolean("gotBadgesSuccessfully", "badges loaded successfully"),
        blocks.reporter("userBadges", "all user badges"),
        blocks.reporter("userBadgeCount", "total badge count"),
        blocks.boolean("hasBadge", "does user have badge: [BADGE]", {
          BADGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "badge",
          },
        }),
        blocks.reporter("badgeInfo", "badge info [BADGE]", {
          BADGE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "badge",
          },
        }),
        blocks.reporter("allBadges", "all badges", {}, { hideFromPalette: true }),
        blocks.command("redownloadBadges", "redownload badges", {}, { hideFromPalette: true }),
        blocks.separator(),
        blocks.label("Voice Calling"),
        blocks.button("Example Project", "openRoturVoiceExample"),
        blocks.button("Get roturVoice", "openRoturVoice"),
        blocks.reporter("callUser", "call user [USERNAME]", {
          USERNAME: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: "friend",
          },
        }),
        blocks.event("whenCallReceived", "when call received"),
        blocks.event("whenCallAccepted", "when my call is accepted"),
        blocks.reporter("callData", "call data"),
        blocks.command("acceptCall", "accept call"),
        blocks.separator(),
        blocks.label("DANGER ZONE"),
        blocks.button("Show Danger Zone", "openDangerZone", {
          hideFromPalette: ext.showDangerous
        }),
        blocks.button("Hide Danger Zone", "closeDangerZone", {
          hideFromPalette: !ext.showDangerous
        }),
        blocks.reporter("deleteAccount", "delete account", {}, {
          hideFromPalette: !ext.showDangerous,
          disableMonitor: true
        }),
      ],
      menus: {
        systems: {
          acceptReporters: true,
          items: "systemsList",
        },
        packetData: {
          acceptReporters: true,
          items: ["origin", "client", "source port", "payload", "timestamp"],
        },
        targets: {
          acceptReporters: true,
          items: "openPorts",
        },
        keys: {
          acceptReporters: true,
          items: "accountKeys",
        },
        friends: {
          acceptReporters: true,
          items: "myFriends",
        },
        requests: {
          acceptReporters: true,
          items: "myRequests",
        },
        itemKeys: {
          acceptReporters: true,
          items: [
            "name",
            "description",
            "price",
            "data",
            "tradable",
            "hidden",
          ],
        },
        callInfo: {
          acceptReporters: true,
          items: [
            "caller",
            "status",
            "duration",
            "timestamp",
          ],
        },
      },
    };
  }