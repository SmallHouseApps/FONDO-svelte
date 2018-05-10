/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var screenWidth, screenHeight, event; let start, scrollTop;
window.ctrl = {}; window.store = {};
let scrollTimer, scrollLeft; let positiveScroll, prevSL, autoScroll = false; 
var scrollStart; var y;

async function scrollEvent(el){
    
    if(window.ctrl.applicList) window.ctrl.applicList.set({ sy: el.scrollTop });
}

function hello1(e){
    console.log(e);
    start = e.targetTouches[0].pageY;
    scrollTop = document.getElementById('pop-up-content').scrollTop;
}

function hello(e){
    document.getElementById('pop-up-content').scrollTo(0, scrollTop + start - e.targetTouches[0].pageY);
}

class SvelteController{
    constructor(ComponentObject, options = {}){ 
        this.ComponentObject = ComponentObject;
        this.options = options;
    }

    async init(){
        console.log('init');
        if(this.options.onCtrlReady) await this.options.onCtrlReady();

        if(!this.break){
            if(!this.ComponentObject) this.ComponentObject = this.start;
            this.component = new this.ComponentObject({
                target: this.options.target ? this.options.target : document.getElementById('main'),
                data: this.options.data ? this.options.data : {}
            });

            if(this.options.startState) {
                this.component.set(this.options.startState);
            }

            if(this.options.data){
                this.options.startState = JSON.parse(JSON.stringify(this.options.data));
            }

            if(this.options.observes){
                for(let i = 0; i < this.options.observes.length; i++){
                    this.component.observe(this.options.observes[i].item, this.options.observes[i].function);
                }
            }

            if(this.options.methods){
                for(let i = 0; i < this.options.methods.length; i++){
                    this.component[this.options.methods[i].name] = this.options.methods[i].function;
                }
            }
            
            if(this.options.globalName) window.ctrl[this.options.globalName] = this;
            if(this.options.preloader) this.options.preloader();
        }
    }

    async set(data, startState = false){
        if(!startState){
            if(this.get('startState')) this.component.set({ startState: false });
        }

        this.component.set(data);
        this.options.data = this.component._state;
    }

    async add(item, data){
        let obj = {};
        obj[item] = this.component.get(item).concat(data);
        this.set(obj);
    }

    get(item){
        return this.component.get(item);
    }

    setStartState(alive = false){
        console.log(this.options.startState);
        if(alive){
            this.set(this.options.startState);
        } else {
            this.options.data = this.options.startState;
        }
        this.options.data.startState = true;
    }

    changeStartState(){
        this.options.startState = this.options.data;
    }

    async destroy(){
        this.setStartState();
        if (this.options.predestroyer) await this.options.predestroyer();
        if (this.component) { 
            this.component.destroy();
            this.component = null;
        }
        if (window.ctrl[this.options.globalName]) delete window.ctrl[this.options.globalName];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const APPLIC_HEIGHT = 150;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;

        // Extending it by replacing and wrapping, in extended.js
        var materializeToast = M.toast;
        M.toast = options => {
            options.activationPercent = 0.2;
            materializeToast(options);
            navigator.vibrate(50);
        }

        // let size = screenWidth+"x"+200;
        // let img = document.getElementById('img-google-map');
        // img.src = "https://maps.googleapis.com/maps/api/staticmap" +
        // "?center=Brooklyn+Bridge,New+York,NY&zoom=13&size="+size+"&scale=2&maptype=roadmap" +
        // "&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318" +
        // "&markers=color:red%7Clabel:C%7C40.718217,-73.998284" +
        // "&key=AIzaSyARD3GTEyAcJd2UT4X_N9rwBG8uyP0mur4";
        // img.width = screenWidth;
        // img.height = 200;

        requirejs(["Header/HeaderComponent"], function(component) {
            requirejs(["Header/HeaderCtrl"], function(ctrl) {
                ctrl.init();
            });
        });

        requirejs(["RouteCtrl", "ChangesQueueCtrl"], function(RouteCtrl, ChangesQueueCtrl) {
            window.ctrl.route = RouteCtrl;
            const event = new Event('hashchange');
            RouteCtrl.init();
            ChangesQueueCtrl.init();
            
            window.location.hash = RouteCtrl.routes.Auth;
            window.dispatchEvent(event);
        });
    },

};

app.initialize();