# PenguinMod extensions, working everywhere

PenguinMod bundles these extensions into its own VM, so they can't be loaded anywhere else. These are ports that
run as normal unsandboxed custom extensions in MistWarp, TurboWarp and PenguinMod itself.

- Each keeps PenguinMod's extension ID, block opcodes, arguments and menus, so PenguinMod projects keep working.
  Load the port **before** opening a PenguinMod project that uses it: other editors refuse unknown extension IDs.
- Ported from [PenguinMod-Vm](https://github.com/PenguinMod/PenguinMod-Vm) at commit `9c8e446` (2026-09-20).
  PenguinMod-Vm is MPL-2.0 and so is every port; each file's header credits the original authors and links its source.
- Features that only exist inside PenguinMod's VM (custom block shapes, custom value types saved in variables,
  compiled-only blocks, sprite stretch, PenguinMod's renderer settings) are rebuilt where possible and otherwise do
  nothing. Each file marks these with `PenguinMod-only:` comments.
- Large libraries (three.js, cannon-es, matter-js, math.js, pathfinding) load from jsDelivr on first use.

## Load order

Some extensions build on others, like in PenguinMod. Load these first:

| Extension | Needs |
| --- | --- |
| Targets, Scope, Pointers, Assets, XML (jwXML) | Arrays |
| Psychic | Vector, Arrays, Targets |
| 3D VR, 3D Physics | 3D |

## Ports

| File | ID | From |
| --- | --- | --- |
| 3D.js | jg3d | jg_3d |
| 3D Physics.js | fr3d | fr_3d |
| 3D VR.js | jg3dVr | jg_3dVr |
| Animation.js | jgAnimation | jg_animation |
| Arrays.js | jwArray | jwArray |
| Assets.js | jwStorage | jwStorage |
| Camera.js | pmCamera | pm_camera |
| Censorship.js | profanityAPI | theshovel_profanity |
| Christmas.js | jgChristmas | jg_christmas |
| Clone Communication.js | jgClones | jg_clones |
| Color.js | jwColor | jwColor |
| Colors.js | colors | gsa_colorUtilBlocks |
| Controls Expansion.js | pmControlsExpansion | pm_controlsExpansion |
| Dates.js | jwDate | jwDate |
| Debugging.js | jgDebugging | jg_debugging |
| Easy Save.js | jgEasySave | jg_easySave |
| Encrypt.js | jwEncrypt | jw_encrypt |
| Events Expansion.js | pmEventsExpansion | pm_eventsExpansion |
| Files (legacy).js | jgFiles | jg_files |
| HTML Canvas.js | newCanvas | gsa_canvas |
| HTML Canvas (old).js | canvas | gsa_canvas_old |
| IFrame.js | jgIframe | jg_iframe |
| Infinity.js | jwNum | jwNum |
| Integers.js | jwInt | jwInt |
| Interfaces.js | jgInterfaces | jg_interfaces |
| JavaScript.js | jgJavascript | jg_javascript |
| JSON.js | jgJSON | jg_json |
| Labels.js | jwProto | jw_proto |
| Lambda.js | jwLambda | jwLambda |
| Math.js | blockly2math | blockly-2 |
| Motion Expansion.js | pmMotionExpansion | pm_motionExpansion |
| Multiple Timers.js | jgTimers | jg_timers |
| Odd Messages.js | oddMessage | silvxrcat_oddmessages |
| Operators Expansion.js | pmOperatorsExpansion | pm_operatorsExpansion |
| Packager Applications.js | jgPackagerApplications | jg_packagerApplications |
| Pathfinding.js | jgPathfinding | jg_pathfinding |
| perlin.js | iygPerlin | iyg_perlin_noise |
| Permissions.js | JgPermissionBlocks | jg_permissions |
| Pointers.js | jwPointer | jwPointer |
| postLit.js | jwPostLit | jw_postlit (the postLit service is offline) |
| Prism.js | jgPrism | jg_prism |
| Psychic.js | jwPsychic | jwPsychic |
| Reflex.js | jwReflex | jw_reflex |
| Runtime.js | jgRuntime | jg_runtime |
| Scope.js | jwScope | jwScope |
| Scratch Auth.js | jgScratchAuthenticate | jg_scratchAuth |
| Scripts.js | jgScripts | jg_scripts |
| Sensing Expansion.js | pmSensingExpansion | pm_sensingExpansion |
| Shaders.js | jgShaders | jg_shaders (unfinished in PenguinMod too) |
| Sound Systems.js | jgExtendedAudio | jg_audio |
| Storage.js | jgStorage | jg_storage |
| Structs.js | jwStructs | jw_structs |
| Tailgating.js | jgTailgating | jg_tailgating |
| Targets.js | jwTargets | jwTargets |
| Temporary Variables.js | tempVars | gsa_tempVars |
| Test Extension.js | jgDev | jg_dev |
| Tweening.js | jgTween | jg_tween |
| Unite.js | jwUnite | jw_unite |
| Vector.js | jwVector | jwVector |
| Virtual Reality.js | jgVr | jg_vr |
| Website Requests.js | jgWebsiteRequests | jg_websiteRequests |
| XML.js | jwXml | jw_xml |
| XML (jwXML).js | jwXML | jwXML |

## Not ported

- Already usable outside PenguinMod, from the TurboWarp gallery or their authors' sites: Camera controls
  (dt_cameracontrols), Gamepad, Clipping & Blending, Canvas Effects, Color Picker, Custom Styles, LZ Compress,
  Temporary Variables (lily_tempVars2), Lily's Toolbox, Animated Text, SharkPool's JavaScript V2 and Printing.
- Inline Blocks (pm_inlineblocks): it only unlocks a PenguinMod core block, which would need editor and VM changes.
- gsa_objectVars: PenguinMod never registers it; it's an unused copy of the old HTML Canvas.
- Empty, test or joke extensions: gameutils, jg_nineslices, TEST_EXTENSION, jg_bestextensioin, jg_doodoo.
