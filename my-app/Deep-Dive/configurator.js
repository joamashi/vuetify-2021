import 'regenerator-runtime/runtime'
import html from './configurator.html';
import europe from './json/CV_2021_Product_2021322_Europe.json';
import korea from './json/CV_2021_Product_2021322_Korea.json';
import usa from './json/CV_2021_Product_2021322_NorthAmerica.json'
import { BrowserClient } from "@sentry/browser";
import kia from "./css/kia.css";
import lsui from "./css/ls-ui.css";
import reset from "./css/reset.css";
import styles from "./css/styles.css";
import { logStep, logVerbose, reportException } from './js/debug';
import loading from './js/loading';
import { start } from './js/start';
import { host_url } from './js/setting';
import { currentConfig } from './js/setting';

//2021-04-23 (4) : MJ
console.log("KIA Visualizer : 2021-04-23:P3")

let pc = require('./playcanvas-stable.min.js')

pc.script.legacy = false;

let elements = [];
let gtm = null;
let aa = "FALSE";
let _doc;
let _body;
let appId;
let container;
let player;
let shadowRoot;
let app;
let countries = {
    'eu-EU': europe,
    'en-EU': europe,
    'en-WW': europe,
    'de-DE': europe,
    'en-GB': europe,
    'fr-FR': europe,
    'it-IT': europe,
    'es-ES': europe,
    'de-AT': europe,
    'nl-BE': europe,
    'fr-BE': europe,
    'nl-NL': europe,
    'sv-SE': europe,
    'en-US': usa,
    "ko-KR":korea,
    'kr-KR': korea
};

let globalJson;

let jsonWheels;
let jsonBatteries;
let jsonTrims;


let adobeAnalyticsEnabled = false;
let gtmAnalyticsEnabled = false;
let firstRequest = true;

function AnalyticsCall(event, zone, value)
{
    if (firstRequest) {
        firstRequest = false;
        return;
    }
    logStep('AnalyticsCall');
    let _eventAction = event;
    let _eventCategory = zone;
    let _eventLabel = value;
    let _eventValue = '';
    let currentTrim = jsonTrims[currentConfig.name];
    logVerbose('AnalyticsCall', 'currentTrim', currentTrim)
    if (currentTrim != null && currentTrim.optionCode != null)
        _eventValue = currentTrim.optionCode[0]

    let logData = {
        'event' : '3DVisualizerClick',
        'eventCategory' : _eventCategory,
        'eventAction' : _eventAction,
        'eventLabel' : _eventLabel,
        'eventValue' : _eventValue
    }

    logVerbose('AnalyticsCall', 'logData', logData);

    if (adobeAnalyticsEnabled && window._satellite != undefined && window._satellite != null) {
        //AA
        try {
            window._satellite.track(event, {data_click_area: "3D_visualizer|" + zone, data_click_name: value})
            //window._satellite.track(event, logData)
            logVerbose('AnalyticsCall', '_satellite', 'called');
        }catch(e) {
            reportException(e, "_satellite")
        }
    }
    if (gtmAnalyticsEnabled && window.dataLayer != undefined && window.dataLayer != null) {
        //GTM
        try {
            // window.dataLayer.push({
            //     "event": event,
            //     "data_click_area": "3D_visualizer|" + zone,
            //     "data_click_name": value
            // });
            window.dataLayer.push(logData);
            logVerbose('AnalyticsCall', 'dataLayer', 'called');
        }catch(e) {
            reportException(e, "dataLayer")
        }
    }
}
 
export let country;
export let debug = 0;

export function setCountry(v) {
    logStep('setCountry', '국가 코드 설정')
    country = v;
}
export function setDebug(v) {
    logStep('setDebug', '디버그 모드 설정')
    debug = v;
}
export function addScript(el,jsurl, func) {
	var script = document.createElement("script");  
	script.src = jsurl;
	script.setAttribute("crossOrigin", "anonymous");
	if (func != null) script.onload = func;
	el.appendChild(script);
}
function addManifest(el, url) {
    logStep('addManifest', '매니페스트 생성')
    logVerbose('addManifest', 'el', el);
    logVerbose('addManifest', 'url', url);
    try {
        var lnk = document.createElement("link");
        lnk.href = url;
        lnk.rel = "manifest";
        el.appendChild(lnk);
    } catch(e) {
        reportException(e, "addManifest")
    }
}
function loadTemplate() {
    logStep('loadTemplate')

    fetch("https://widget.visualizer.kia.com/embed.html" /*, options */)
    .then((response) => response.text())
    .then((html) => {
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = html;
    })
    .catch((error) => {
        console.warn(error);
        reportException(error, "loadTemplate");
    });
}
export function log(position, msg, obj, lvl) {
    if (lvl <= debug) {
        let sep = "";
        if (obj != null && obj != '') {
            sep = ": ";
            console.log("[" + position + "] " + msg + sep, obj);
        }else{
            console.log("[" + position + "] " + msg);
        }
    }
}
// export function logStep(position, msg='') {
//     log(position, msg, null, 1);
// }
// export function logVerbose(position, msg, obj) {
//     log(" - " + position, msg, obj, 2);
// }
 function  init() {
    logStep('init','초기 정보 세팅.');

    try {
        if (_doc != null) {
            _doc.onload = function () {
                var myapp = _doc.getElementById('application-canvas');
                //doc.getElementById('container3D').appendChild(myapp);
            }
        }
    }catch(e) {
        reportException(e, '초기화 실패');
    }

}
function initApp() {
    return new Promise(function(resolve, reject) {
        let timer = setInterval(
            function() {
                app = pc.Application.getApplication();
                logVerbose('initApp', 'app', app);
                if (app != null) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300
        );
    })
}
// #region ls-ui
async function setUI() {
    logStep("setUI", "화면 구성");
    try {
        let containerDiv = _doc.getElementById('container3D');
        logVerbose('setUI', 'gtm', gtm);
        logVerbose('setUI', 'aa', aa);

        containerDiv.addEventListener('mousedown', () => {
            displayElement("")
        });

        _doc.getElementById("ls-ui-options-row").onmousedown = (e) => {
            e.stopPropagation();
        }
        _doc.getElementById("ls-ui-loader-background").onmousedown = (e) => {
            e.stopPropagation();
        }

        let paintsContainer = _doc.getElementById("ls-ui-paints-ul");
        let wheelsContainer = _doc.getElementById("ls-ui-wheels");
        let batteryContainer = _doc.getElementById("ls-ui-egmp-view-ul");

        //let lsUiContainer = _doc.getElementById("ls-ui-container");

        const paintTemplate = paintsContainer.children[0];
        const wheelTemplate = wheelsContainer.children[0];
        const egmpAWDTemplate = batteryContainer.children[0]; // 4 wheels
        const egmpARDTemplate = batteryContainer.children[1]; // 2 wheels

        function configToString() {
            return currentConfig.name + " " + currentConfig.color + " " + currentConfig.wheel + " " + currentConfig.battery
        }

        parseJson();

        function parseJson() {
            logStep('parseJson', '데이터 로드....')
            try {
                logVerbose('parseJson', 'country', country);
                globalJson = countries[country]
                if (globalJson == null) {
                    globalJson = countries['en-US'];
                }
                logVerbose('parseJson', 'globalJson', globalJson);

                jsonWheels = {};

                globalJson.wheels.forEach((wheel) => {
                    jsonWheels[wheel.code] = wheel;
                })
                logVerbose('parseJson', 'jsonWheels', jsonWheels);

                jsonBatteries = {};

                globalJson.eGMP.forEach((battery) => {
                    jsonBatteries[battery.code] = battery;
                })
                logVerbose('parseJson', 'jsonBatteries', jsonBatteries);

                jsonTrims = {};

                globalJson.regionProducts[0].trims.forEach((trim) => {
                    jsonTrims[trim.name] = trim
                });
                logVerbose('parseJson', 'jsonTrims', jsonTrims);

                generateTrim();

                let timer = setInterval(function () {
                    if (app != null && jsonWheels != null && jsonBatteries != null && jsonTrims != null) {
                        app.on('ondemand:ready', function () {
                            logVerbose('parseJson', 'Object.keys(jsonTrims)', Object.keys(jsonTrims));
                            changeTrim(Object.keys(jsonTrims)[0], false);
                            logVerbose('parseJson', 'Object.keys(jsonTrims)[0]', Object.keys(jsonTrims)[0]);

                        });
                        clearInterval(timer);
                    }
                }, 100);

            } catch (e) {
                reportException(e, 'parseJson');
            }
        }

        function changeTrim(name) {
            logStep('changeTrim')
            logVerbose('changeTrim', 'name', name);
            logVerbose('changeTrim', 'currentConfig', currentConfig);
            try {
                if (name === currentConfig.baseTrim)
                    return;
                if (_doc.getElementById("ls-ui-generated-" + currentConfig.name.replace(/\s/g, '')) !== null) {

                    let el = _doc.getElementById("ls-ui-generated-" + currentConfig.name.replace(/\s/g, ''));
                    if (el != null) el.classList.remove("ls-ui-selected");
                }
                let el = _doc.getElementById("ls-ui-generated-" + name.replace(/\s/g, ''))
                if (el != null) el.classList.add("ls-ui-selected");


                // app.fire("change")
                const currentTrim = jsonTrims[name];
                logVerbose('changeTrim', 'currentTrim', currentTrim)
                logVerbose('changeTrim', 'currentTrim.name', currentTrim.name)
                logVerbose('changeTrim', 'currentTrim.optionCode', currentTrim.optionCode)
                currentConfig.name = currentTrim.name;
                currentConfig.trim = currentTrim.optionCode[0];
                currentConfig.baseTrim = currentTrim.optionCode[0];
                logVerbose('changeTrim', 'ccurrentConfig.name', currentConfig.name)
                logVerbose('changeTrim', 'ccurrentConfig.trim', currentConfig.trim)
                logVerbose('changeTrim', 'ccurrentConfig.baseTrim', currentConfig.baseTrim)

                // add la class ls-ui-selected dans les generate et pas trigger les change

                generateExtPaints(currentTrim["extColor"])
                changePaint(currentTrim["heroExtColor"], false)
                generateWheels(currentTrim["wheel"])
                changeWheel(currentTrim["standardWheel"], false);

                generateEGMP(currentTrim["eGMPoptionCode"].find((option) => option.wheel === currentTrim["standardWheel"])["eGMP"])
                changeBattery(currentTrim["eGMPoptionCode"].find((option) => option.wheel === currentTrim["standardWheel"])["eGMP"][0], false)

                currentConfig.egmpMode = "NONE"
                app.fire("ondemand:updateVehicle", currentConfig);
                AnalyticsCall("link_click", "trim", name);
            } catch (e) {
                reportException(e, 'changeTrim');
            }
        }

        function changePaint(name, call = true) {
            logStep('changePaint', '페인트 변경.')
            logVerbose('changePaint', 'name', name);
            logVerbose('changePaint', 'call', call);
            logVerbose('changePaint', 'currentConfig', currentConfig);
            try {
                if (_doc.getElementById("ls-ui-generated-" + currentConfig.color))
                    _doc.getElementById("ls-ui-generated-" + currentConfig.color).children[0].children[1].classList.remove("ls-ui-selected");
                _doc.getElementById("ls-ui-generated-" + name).children[0].children[1].classList.add("ls-ui-selected");

                currentConfig.color = name;

                if (call) {
                    app.fire("ondemand:updateVehicle", currentConfig)
                    AnalyticsCall("link_click", "exterior_color", name);
                }
            } catch (e) {
                reportException(e, 'changePaint');
            }
        }

        function changeWheel(name, call = true) {
            logStep('changeWheel', '휠 변경.')
            logVerbose('changeWheel', 'name', name);
            logVerbose('changeWheel', 'call', call);
            logVerbose('changeWheel', 'currentConfig', currentConfig);
            try {
                if (_doc.getElementById("ls-ui-generated-" + currentConfig.wheel))
                    _doc.getElementById("ls-ui-generated-" + currentConfig.wheel).children[1].classList.remove("ls-ui-selected");
                _doc.getElementById("ls-ui-generated-" + name).children[1].classList.add("ls-ui-selected");
                currentConfig.wheel = name;

                if (call) {
                    app.fire("ondemand:updateVehicle", currentConfig)
                    AnalyticsCall("link_click", "wheel", name);
                }
                const currentTrim = jsonTrims[currentConfig.name]

                generateEGMP(currentTrim["eGMPoptionCode"].find((option) => option.wheel === name)["eGMP"])            
            } catch (e) {
                reportException(e, 'changeWheel')
            }
        }

        function changeBattery(name, call = true) {
            logStep('changeBattery', '배터리 변경.')
            logVerbose('changeBattery', 'name', name);
            logVerbose('changeBattery', 'call', call);
            logVerbose('changeBattery', 'currentConfig', currentConfig);
            try {
                if (_doc.getElementById("ls-ui-generated-" + currentConfig.battery.replace(/\s/g, '')))
                    _doc.getElementById("ls-ui-generated-" + currentConfig.battery.replace(/\s/g, '')).children[0].classList.remove("ls-ui-selected");

                _doc.getElementById("ls-ui-generated-" + name.replace(/\s/g, '')).children[0].classList.add("ls-ui-selected");

                currentConfig.battery = name;

                if (call) {
                    currentConfig.egmpMode = jsonBatteries[name].mode;
                    currentConfig.trim = name;
                    app.fire("ondemand:updateVehicle", currentConfig)
                    AnalyticsCall("link_click", "egmp", name);
                } else {
                    currentConfig.egmpMode = "NONE"
                }
            } catch (e) {
                reportException(e, 'changeBattery');
            }
        }

        function generateTrim() {
            logStep('generateTrim', "트림 정보 생성...")
            try {
                let trimsContainer = _doc.getElementById("ls-ui-trims");
                let trimTemplate = trimsContainer.children[0];

                logVerbose('generateTrim', 'jsonTrims', jsonTrims);
                Object.values(jsonTrims).forEach((trim) => {
                    logVerbose('generateTrim', 'trim', trim);
                    let tmpTrim = trimTemplate.cloneNode(true);

                    tmpTrim.innerHTML = trim.displayName;
                    tmpTrim.classList.remove("ls-ui-template");
                    tmpTrim.id = "ls-ui-generated-" + trim.name.replace(/\s/g, '');
                    tmpTrim.onclick = () => {
                        logVerbose('generateTrim(onclick)', 'trim', trim);
                        logVerbose('generateTrim(onclick)', 'trim.name', trim.name);
                        changeTrim(trim.name)
                    }
                    logVerbose('generateTrim', 'tmpTrim', tmpTrim);

                    trimsContainer.append(tmpTrim);
                })
            } catch (e) {
                reportException(e, 'generateTrim')
            }
        }

        function generateExtPaints(paints) {
            logStep('generateExtPaints', '페인트 변경.');
            try {
                clearContainer(paintsContainer)

                paints.forEach((paint) => {
                    logVerbose('generateExtPaints', 'paint', paint);
                    let tmpPaint = paintTemplate.cloneNode(true);
                    tmpPaint.children[0].children[0].alt = paint;
                    tmpPaint.children[0].children[0].src = host_url + "icons/" + paint + ".png"
                    tmpPaint.classList.remove("ls-ui-template")
                    tmpPaint.id = "ls-ui-generated-" + paint

                    tmpPaint.onclick = () => {
                        changePaint(paint)
                    }

                    paintsContainer.append(tmpPaint)
                })
            } catch (e) {
                reportException(e, 'generateExtPaints');
            }
        }

        function clearContainer(container, first = 1) {
            logStep('clearContainer', '컨테이너 초기화.');
            logVerbose('clearContainer', 'container', container);
            logVerbose('clearContainer', 'first', first);
            try {
                const tmpLength = container.children.length;
                logVerbose('clearContainer', 'tmpLength', tmpLength);
                for (let i = 0; i < tmpLength - first; i++) {
                    container.removeChild(container.children[first]);
                }
            } catch (e) {
                reportException(e, 'clearContainer');
            }
        }

        function generateWheels(wheels) {
            logStep('generateWheels', '휠 생성.');
            try {
                clearContainer(wheelsContainer)

                wheels.forEach((wheel) => {
                    let tmpWheel = wheelTemplate.cloneNode(true);
                    const fullWheel = jsonWheels[wheel];
                    logVerbose('generateWheels', 'jsonWheels', jsonWheels);
                    logVerbose('generateWheels', 'wheel', wheel);
                    logVerbose('generateWheels', 'fullWheel', fullWheel);
                    logVerbose('generateWheels', 'host_url', host_url);
                    logVerbose('generateWheels', 'fullWheel.icon', fullWheel.icon);
                    logVerbose('generateWheels', 'fullWheel.code', fullWheel.code);
                    tmpWheel.children[0].src = host_url + "icons/" + fullWheel.icon;

                    tmpWheel.children[0].alt = fullWheel.code;
                    tmpWheel.classList.remove("ls-ui-template")
                    tmpWheel.id = "ls-ui-generated-" + fullWheel.code

                    tmpWheel.onclick = () => {
                        changeWheel(wheel)
                    }

                    wheelsContainer.append(tmpWheel)
                })
            } catch (e) {
                reportException(e, 'generateWheels');
            }
        }

        function generateEGMP(batteries) {
            logStep('generateEGMP', 'EGMP 생성.');
            try {
                clearContainer(batteryContainer, 2)

                batteries.forEach((battery) => {
                    let tmpBattery;
                    const fullBattery = jsonBatteries[battery]
                    logVerbose('generateEGMP', 'fullBattery', fullBattery);
                    if (fullBattery.mode === "AWD")
                        tmpBattery = egmpAWDTemplate.cloneNode(true);
                    else
                        tmpBattery = egmpARDTemplate.cloneNode(true);
                    logVerbose('generateEGMP', 'tmpBattery', tmpBattery);

                    tmpBattery.getElementsByClassName("ls-ui-egmp-top")[0].getElementsByTagName("p")[0].innerHTML = fullBattery.battery;
                    tmpBattery.getElementsByClassName("ls-ui-egmp-bottom")[0].getElementsByTagName("p")[0].innerHTML = fullBattery.engine;
                    tmpBattery.id = "ls-ui-generated-" + fullBattery.code.replace(/\s/g, '')
                    tmpBattery.classList.remove("ls-ui-template")
                    tmpBattery.onclick = () => {
                        logVerbose('generateEGMP', 'fullBattery.code', fullBattery.code);
                        changeBattery(fullBattery.code)
                    }

                    batteryContainer.append(tmpBattery)
                })
            } catch (e) {
                reportException(e, 'generateEGMP');
            }
        }

        // setTimeout( () => {
        //     containerDiv.dispatchEvent(custEvent);
        // }, 10)
        let tuto = _doc.getElementById("ls-ui-tuto-desktop");
        tuto.onclick = () => {
            tuto.classList.add("ls-ui-fade-tuto")

            setTimeout(() => {
                tuto.style.display = "none";
            }, 1000)
        }
        window['visualizer'].displayElement = displayElement;
        window['visualizer'].scrollPaint = scrollPaint;
        window['visualizer'].displayView = displayView;
        logVerbose('setUI', 'visualizer', window.visualizer);
        //lsUiContainer.style.justifyContent = "center";
        //lsUiContainer.style.display = "flex";
    } catch (e) {
        reportException(e, 'setUI');
    }

}

let displayedContentID;
let viewSelected = "ls-ui-ext-view";

function displayElement1(elementId) {
    logStep("displayElement")
    logVerbose('displayElement', 'elementId', elementId);

    try {
        if (displayedContentID === elementId && elementId === "ls-ui-egmp-view") {
            return;
        }

        if (elementId === "ls-ui-light") {
            currentConfig.headlights = (currentConfig.headlights === 0) ? 1 : 0;
            AnalyticsCall("link_click", "lightOn&Off", (currentConfig.headlights === 0) ? "off" : "on");
        }


        if (displayedContentID)
        {
            logVerbose('displayElement', 'displayContentID', displayedContentID);
            if (displayedContentID === "ls-ui-paints")
                _doc.getElementById("ls-ui-paint-icon-brush").classList.remove('brush-selected')
    
            if (_doc.getElementById(displayedContentID))
                _doc.getElementById(displayedContentID).classList.add("ls-ui-hidden");
    
            if (displayedContentID != "ls-ui-egmp-view")
                _doc.getElementById(displayedContentID + "-icon").children[0].classList.remove("ls-ui-svg-selected");
    
            if (_doc.getElementById(displayedContentID + "-selected-bar"))
                _doc.getElementById(displayedContentID + "-selected-bar").classList.add("ls-ui-hidden")
    
            if (currentConfig.headlights === 1 && elementId !== "" && !elementId.includes("view") && elementId !== "ls-ui-light")
                _doc.getElementById("ls-ui-light-icon").children[0].classList.add("ls-ui-svg-selected")
        }

        if ((displayedContentID && displayedContentID === elementId) || elementId === "") {
            displayedContentID = undefined;

            if (elementId === "ls-ui-light" || elementId === "") {
                if (elementId === "ls-ui-light")
                    app.fire("ondemand:updateVehicle", currentConfig)
            }
        } else {
            if (elementId === "ls-ui-egmp-view") {
                currentConfig.headlights = 0;
                viewSelected = elementId;
                _doc.getElementById("ls-ui-ext-view-icon").children[0].classList.remove('ls-ui-svg-selected')
                _doc.getElementById("ls-ui-int-view-icon").children[0].classList.remove('ls-ui-svg-selected')
                currentConfig.egmpMode = jsonBatteries[currentConfig.battery].mode;
                currentConfig.trim = currentConfig.battery;
                currentConfig.view = "ext";
    
                AnalyticsCall("link_click", "egmp", currentConfig.battery);
                app.fire("ondemand:updateVehicle", currentConfig)
                _doc.getElementById("ls-ui-light-icon").children[0].classList.remove("ls-ui-svg-selected")
    
                displayView("ls-ui-egmp-view");
            } else {
                if (viewSelected === "ls-ui-int-view" && elementId === "ls-ui-trims") {
                } else {
                    if (currentConfig.egmpMode !== "NONE" || currentConfig.view !== "ext") {
                        currentConfig.trim = currentConfig.baseTrim;
                        currentConfig.view = "ext"
                        currentConfig.egmpMode = "NONE";
                        app.fire("ondemand:updateVehicle", currentConfig)
                    } else if (elementId === "ls-ui-light") {
                        app.fire("ondemand:updateVehicle", currentConfig)
                    }

                    displayView("ls-ui-ext-view")
                }
            }


            if (elementId === "ls-ui-paints")
                _doc.getElementById("ls-ui-paint-icon-brush").classList.add('brush-selected')

            _doc.getElementById(elementId + "-icon").children[0].classList.add("ls-ui-svg-selected")

            if (_doc.getElementById(elementId))
                _doc.getElementById(elementId).classList.remove("ls-ui-hidden")

            if (_doc.getElementById(elementId + "-selected-bar"))
                _doc.getElementById(elementId + "-selected-bar").classList.remove("ls-ui-hidden")

            displayedContentID = elementId
            let el = _doc.getElementById(displayedContentID);
            logVerbose('displayElement', 'el', el);
            logVerbose('displayElement', 'displayedContentID', displayedContentID);
            if (el != null) {
                let style = window.getComputedStyle(el);
                logVerbose('displayElement', 'style', style);
                logVerbose('displayElement', 'left', style.getPropertyValue("left"));
                if (parseFloat(style.getPropertyValue("left").replace('px', '')) < 0) {
                    logVerbose('displayElement', 'changed left','');
                    el.style.left = "6px";
                }
            }
            stayOnScreen();
        }
    }catch(e) {
        reportException(e, 'displayElement');
    }
}

function displayElement(elementId)
{
    logStep("displayElement")
    logVerbose('displayElement', 'elementId', elementId);

    try {

        if (displayedContentID === elementId && elementId === "ls-ui-egmp-view") {
            return;
        }

        if (elementId === "ls-ui-light") {
            currentConfig.headlights = (currentConfig.headlights === 0) ? 1 : 0;

            AnalyticsCall("link_click", "lightOn&Off", (currentConfig.headlights === 0) ? "off" : "on");
        }

        if (displayedContentID)
        {
            if (displayedContentID === "ls-ui-paints")
                _doc.getElementById("ls-ui-paint-icon-brush").classList.remove('brush-selected')

            if (_doc.getElementById(displayedContentID))
                _doc.getElementById(displayedContentID).classList.add("ls-ui-hidden");

            if (displayedContentID != "ls-ui-egmp-view")
                _doc.getElementById(displayedContentID + "-icon").children[0].classList.remove("ls-ui-svg-selected");

            if (_doc.getElementById(displayedContentID + "-selected-bar"))
                _doc.getElementById(displayedContentID + "-selected-bar").classList.add("ls-ui-hidden")

            if (currentConfig.headlights === 1 && elementId !== "" && !elementId.includes("view") && elementId !== "ls-ui-light")
                _doc.getElementById("ls-ui-light-icon").children[0].classList.add("ls-ui-svg-selected")
        }

        if ((displayedContentID && displayedContentID === elementId) || elementId === "") {
            displayedContentID = undefined;

            if (elementId === "ls-ui-light" || elementId === "") {
                if (elementId === "ls-ui-light")
                    app.fire("ondemand:updateVehicle", currentConfig)
            }
        }
        else {
            if (elementId === "ls-ui-egmp-view") {
                currentConfig.headlights = 0;
                viewSelected = elementId;
                _doc.getElementById("ls-ui-ext-view-icon").children[0].classList.remove('ls-ui-svg-selected')
                _doc.getElementById("ls-ui-int-view-icon").children[0].classList.remove('ls-ui-svg-selected')
                currentConfig.egmpMode = jsonBatteries[currentConfig.battery].mode;
                currentConfig.trim = currentConfig.battery;
                currentConfig.view = "ext";
                app.fire("ondemand:updateVehicle", currentConfig)
                _doc.getElementById("ls-ui-light-icon").children[0].classList.remove("ls-ui-svg-selected")

                displayView("ls-ui-egmp-view");
            }
            else {
                if (viewSelected === "ls-ui-int-view" && elementId === "ls-ui-trims") {
                }
                else {
                    if (currentConfig.egmpMode !== "NONE" || currentConfig.view !== "ext") {
                        currentConfig.trim = currentConfig.baseTrim;
                        currentConfig.view = "ext"
                        currentConfig.egmpMode = "NONE";
                        app.fire("ondemand:updateVehicle", currentConfig)
                    }
                    else if (elementId === "ls-ui-light") {
                        app.fire("ondemand:updateVehicle", currentConfig)
                    }

                    displayView("ls-ui-ext-view")
                }
            }

            if (elementId === "ls-ui-paints")
                _doc.getElementById("ls-ui-paint-icon-brush").classList.add('brush-selected')

            _doc.getElementById(elementId + "-icon").children[0].classList.add("ls-ui-svg-selected")

            if (_doc.getElementById(elementId))
                _doc.getElementById(elementId).classList.remove("ls-ui-hidden")

            if (_doc.getElementById(elementId + "-selected-bar"))
                _doc.getElementById(elementId + "-selected-bar").classList.remove("ls-ui-hidden")

            displayedContentID = elementId
            stayOnScreen();
        }
        if (currentConfig.headlights === 0) {
            _doc.getElementById("ls-ui-light-icon").children[0].classList.remove("ls-ui-svg-selected")
        } else {
            _doc.getElementById("ls-ui-light-icon").children[0].classList.add("ls-ui-svg-selected")
        }
    }catch(e) {
        reportException(e, 'displayElement');
    }
}
function displayView(elementId) {
    logStep('displayView');
    logVerbose('displayView', 'elementId', elementId);
    try {
        if (viewSelected === elementId)
            return;

        if (elementId.includes("ext")) {
            currentConfig.view = "ext"
            currentConfig.trim = currentConfig.baseTrim;
            AnalyticsCall("link_click", "rotating_vehicle", "exterior_click");
        } else {
            currentConfig.view = "int"
            currentConfig.headlights = 0;
            AnalyticsCall("link_click", "rotating_vehicle", "interior_click");
        }

        currentConfig.egmpMode = "NONE"

        app.fire("ondemand:updateVehicle", currentConfig)

        _doc.getElementById(viewSelected + "-icon").children[0].classList.remove("ls-ui-svg-selected")
        _doc.getElementById(elementId + "-icon").children[0].classList.add("ls-ui-svg-selected")
        displayElement("");
        viewSelected = elementId
        return false;
    }catch{
        reportException(e, 'displayView');
        return;
    }
}

function stayOnScreen() {
    logStep('stayOnScreen')
    let paintsContainer = _doc.getElementById("ls-ui-paints");
    const paintsIcon = _doc.getElementById("ls-ui-paints-icon").getBoundingClientRect();
    let egmpContainer = _doc.getElementById("ls-ui-egmp-view");
    const egmpIcon = _doc.getElementById("ls-ui-egmp-view-icon").getBoundingClientRect();

    if (window.innerWidth <= 560)  {
        egmpContainer.style.right = "unset";

        let scrollPaintWidth = _doc.getElementById("ls-ui-paints-ul").getBoundingClientRect().width

        let leftArrow = _doc.getElementById("ls-ui-left-arrow");
        let rightArrow = _doc.getElementById("ls-ui-right-arrow");

        if (scrollPaintWidth < paintsContainer.offsetWidth && leftArrow.style.display !== "none") {
            leftArrow.style.display = "none"
            rightArrow.style.display = "none"
        }
        else if (scrollPaintWidth > paintsContainer.offsetWidth && leftArrow.style.display === "none") {
            leftArrow.style.display = ""
            rightArrow.style.display = ""
        }

        if (egmpContainer.children[0].children.length === 3 && egmpContainer.style.justifyContent !== "center")
            egmpContainer.style.justifyContent = "center"
        else if (egmpContainer.style.justifyContent === "center" && egmpContainer.children[0].children.length > 3)
            egmpContainer.style.justifyContent = ""

        paintsContainer.style.left = "0";
        return
    }

    if (egmpContainer.style.justifyContent === "center")
        egmpContainer.style.justifyContent = ""


    if (paintsContainer.style.display !== "none") {
        const paintsCenter = paintsIcon.left + (paintsIcon.width / 2)

        if (paintsCenter < (paintsContainer.offsetWidth + 20) / 2 && paintsContainer.style.left !== "10px") {

            paintsContainer.style.left = "10px";
        }
        else if (paintsCenter > (paintsContainer.offsetWidth + 20) / 2 && paintsContainer.style.left !== "unset") {
            paintsContainer.style.left = "unset";
        }

    }

    if (egmpContainer.style.display !== "none") {
        const egmpCenter = window.innerWidth - (egmpIcon.right + (egmpIcon.width / 2))

        if (egmpCenter < egmpContainer.offsetWidth / 2 && egmpContainer.style.right !== "25px") {
            egmpContainer.style.right = "25px";
        }
        else if (egmpCenter > egmpContainer.offsetWidth / 2 && egmpContainer.style.right !== "unset") {
            egmpContainer.style.right = "unset";
        }
    }
}

function scrollPaint(pos) {
    logStep('scrollPaint', 'Paint 스크롤.')
    logVerbose('scrollPaint', 'pos', pos);
    try {
        _doc.getElementById("ls-ui-scroll-paints").scroll({
            top: 0,
            left: pos,
            behavior: 'smooth'
        })
    }catch(e) {
        reportException(e, 'scrollPaint');
    }
}

let wi = window.innerWidth;
let height = window.innerHeight;
let resizeTimer;


window.addEventListener('orientationchange', () => {
    stayOnScreen()
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            wi = window.innerWidth;
            height = window.innerHeight;
            app.fire("orientationLSChange");
        }, 100);displayElement

})

window.addEventListener('resize', () => {
    stayOnScreen()

    if (wi !== window.innerWidth || height !== window.innerHeight) {
        clearTimeout(resizeTimer);
        wi = window.innerWidth;
        height = window.innerHeight;
        resizeTimer = setTimeout(function() {
            app.fire("orientationLSChange");
        }, 150);
    }

})
// #endregion
function createShadowRoot() {
    return new Promise((resolve, reject) => {
        container = document.getElementById(appId);
        logStep(' > start', "컨테이너 가져오기")

        player = document.createElement('div');
        logStep(' > start', "player 생성")
        shadowRoot = player.attachShadow({mode: 'open'});
        let _styles = document.createElement('style');
        _styles.innerHTML = styles;

        let _reset = document.createElement('style');
        _reset.innerHTML = reset;

        let _lsui = document.createElement('style');
        _lsui.innerHTML = lsui;

        let _kia = document.createElement('style');
        _kia.innerHTML = kia;

        shadowRoot.appendChild(_styles);
        shadowRoot.appendChild(_reset);
        shadowRoot.appendChild(_lsui);
        shadowRoot.appendChild(_kia);
        let _player = document.createElement('div');
        logStep(' > start', "shadow DOM 생성")

        _player.innerHTML = html;
        logStep(' > start', "widget DOM 생성")

        var clone = document.importNode(_player, true);

        logStep(' > start', "widget DOM 삽입")
        if (clone != undefined && clone != "undefined") shadowRoot.appendChild(clone);

        _doc = shadowRoot;
        _body = _doc.querySelector("#containerGlobal");
        addManifest(_doc, host_url + "/manifest.json");

        //append shadowDOM to parent element
        container.appendChild(player);

        resolve();
    });
}

function getApp() {
    logStep('getApp');
    try {
        app = pc.Application.getApplication();
        return app;
    }catch(e) {
        reportException(e, 'getApp');
        return null;
    }
}

export function setGtm(v) {
    logStep('setGtm');
    gtmAnalyticsEnabled = true;

}
export function setAA(v) {
    logStep('setAA');
    adobeAnalyticsEnabled = true;
}

export async function show(id) {
    logStep('show', '위젯 보여줌.')
    logVerbose('show', 'id', id);
    try {
        appId = id;
        window.pc = pc;
        window.appId = appId;
        await createShadowRoot();
        setUI();
        start(_doc, _body);
        init();
        loading(_doc, _body);
        setApp();
    }catch(e){
        reportException(e, 'show');
    }
}
export function setColor(newColor) {
    logStep('setColor','컬러 설정.');
    logVerbose('setColor', 'newColor', newColor);
    try {
        app.fire("color:set", newColor);
    }catch(e) {
        reportException(e, 'setColor');
    }
};
export function setEnv(newEnv) {
    logStep('setEnv','환경 설정.');
    logVerbose('setEnv', 'newEnv', newEnv);
    try {
        app.fire("env:set", newEnv);
    }catch(e) {
        reportException(e, 'setEnv');
    }
};

export function setHeadlights(newHeadlight) {
    logStep('setHeadlights','헤드라이트 설정.');
    logVerbose('setHeadlights', 'newHeadlight', newHeadlight);
    try {
        app.fire("lights:set", newHeadlight);
    }catch(e){
        reportException(e, 'setHeadlights')
    }
};

export function setCamera(newCameraIndex) {
    logStep('setCamera','카메라 설정.');
    logVerbose('setCamera', 'newCameraIndex', newCameraIndex)
    try {
        app.fire("camera:set", newCameraIndex);
    }catch(e) {
        reportException(e, 'setCamera')
    }
};

export function setIntExt(intOrExt) {
    logStep('setIntExt','인테리어/익스테이어 설정.')
    logVerbose('setIntExt', 'intOrExt', intOrExt);
    try {
        if (intOrExt === true)
            app.fire("intext:set", 'int');
        else
            app.fire("intext:set", 'ext');
    }catch(e) {
        reportException(e, 'setIntExt');
    }
};

export function setTrim(newTrim) {
    logStep('setTrim', "트림 변경")
    logVerbose('setTrim', 'newTrim', newTrim);
    try {
        app.fire("trim:set", newTrim);
    }catch(e) {
        reportException(e, 'setTrim');
    }
};
export function setWheel(newWheel) {
    logStep('setWheel', '휠 변경')
    logVerbose('setWheel', 'newWheel', newWheel);
    try {
        app.fire("wheel:set", newWheel);
    }catch(e) {
        reportException(e, 'setWheel');
    }
};
export function setToggleHotspots(toggleValue) {
    logStep('setToggleHotspots', '핫 스팟 변경')
    logVerbose('setToggleHotspots', 'toggleValue', toggleValue);
    try {
        app.fire("hotspots:show", toggleValue);
    }catch(e){
        reportException(e, 'setToggleHotspots');
    }
};

export function showHotSpotContent(hotspotLabel) {
    logStep('showHotSpotContent', '핫 스팟보여주기')
    logVerbose('showHotSpotContent', 'hotspotLabel', hotspotLabel);
    try {
        var ytplayer = doc.getElementById('ytplayer');

        if (hotspotLabel === "RearDoor")
            ytplayer.src = "https://www.youtube.com/embed/BnOtzcEt6D0?autoplay=1";
        if (hotspotLabel === "Lamp")
            ytplayer.src = "https://www.youtube.com/embed/UG54xt56uZo?autoplay=1";
    }catch(e) {
        reportException(e, 'showHotSpotContent');
    }
};
export function setToggleLights(toggleValue) {
    logStep('setToggleLights','조명 점등')
    logVerbose('setToggleLights', 'toggleValue', toggleValue);
    try {
        if (toggleValue === true)
            app.fire("lights:set", 1);
        else
            app.fire("lights:set", 0);
    }catch(e){
        reportException(e, 'setToggleLights');
    }
};
function setApp() {
    logStep('setApp');
    try {
        app = pc.Application.getApplication();
        logVerbose('setApp', 'app', app);
        let appTimer = setInterval(function() {
            app = pc.Application.getApplication();
            if (app != null) {
                clearInterval(appTimer);        
                app.on("start", function () {
                    app.on("hotspot:showContent", function (hotspotLabel) {
                        showHotSpotContent(hotspotLabel);
                    }, this);
                });
            }
        }, 300);
    }catch(e) {
        reportException(e, 'setApp');
    }
}



// WEBPACK FOOTER //
// ./src/views/configurator.js