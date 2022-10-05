// ==UserScript==
// @author         McBen
// @name           IITC plugin: Cooldown Tweak
// @category       Info
// @version        2.0.0_221005
// @description    Apply current hack cooldown times (01.10.22)
// @id             cooldown_tweak
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    iit
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () { };


    var setup = function () {

        window.HACK_COOLDOWN_FRIENDLY = 3 * 60;
        window.HACK_COOLDOWN_ENEMY = 5 * 60;

        let source = window.getPortalHackDetails.toString();
        source = source.replace("function(d)", "(d)=>");
        const codeOld = /var\s+cooldownTime\s*=\s*.*?;/; // example: "var cooldownTime = xxxx;"
        const codeNew = "var cooldownTime = PLAYER.team.startsWith(d.team) ? HACK_COOLDOWN_FRIENDLY : HACK_COOLDOWN_ENEMY;";
        source = source.replace(codeOld, codeNew);
        window.getPortalHackDetails = eval(source);
    }


    setup.info = plugin_info; //add the script info data to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
