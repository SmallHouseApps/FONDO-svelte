(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MapCtrl = factory());
}(this, (function () {
    'use strict';
    const DELIVERY = 1, TAKEOUT = 2;
    var mapFocus = false;
    var touchstart, animateCamera;
    var main = document.getElementById('main');
    var nav = document.getElementsByClassName('nav-extended')[0];
    var map, onReadyIconsLink;
    var mapApplics;
    var dlMarkers = [], tkMarkers = [];
    var dlCluster, tkCluster; var firstLoad = true;
    var icons = {
        dlLink: null, tkLink: null,
        dlClusterLink: null, tkClusterLink: null
    }

    function refresh() {
        if(dlCluster){
            dlCluster.remove(); dlCluster = null;
        }

        if(tkCluster){
            tkCluster.remove(); tkCluster = null;
        }

        dlMarkers = []; tkMarkers = [];

        if(map) map.clear();
    }

    async function onMapReady() {
        await sleep(200);
        
        map.addEventListener(plugin.google.maps.event.MAP_DRAG_START, function(){
            main.style.setProperty('transform', 'translate3d(0, '+main.offsetHeight+'px, 0)');
            main.style.setProperty('height', '0');
        });

        map.addEventListener(plugin.google.maps.event.MAP_CLICK, function(){
            main.style.setProperty('transform', 'translate3d(0, '+main.offsetHeight+'px, 0)');
            main.style.setProperty('height', '0');
        });

        prepareIcons();
        onReadyIconsLinkListener();
    }

    function onReadyIconsLinkListener() {
        onReadyIconsLink = setInterval(function () {
            if (icons.dlLink && icons.tkLink && icons.dlClusterLink && icons.tkClusterLink) {
                console.log(icons);
                clearInterval(onReadyIconsLink);
                showOnMap(mapApplics);
            }
        }, 300);
    }

    function loadMap() {
        var self = this;

        var mapOptions = {
            camera: {
                target: {
                    lat: 55.752107,
                    lng: 37.622345
                },
                zoom: 10
            }
        };

        map = plugin.google.maps.Map.getMap(document.getElementById('map'), mapOptions);
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
    }

    function showOnMap(applics) {
        refresh();
        var self = this; 
        var bounds, prevOrderId, prevOrderIdDeliveryCoords = {}, polylineCoords = [];

        for (var i = 0; i < applics.length; i++) {
            if(!bounds){
                bounds = {
                    southwest: {
                        lat: parseFloat(applics[i].geo_cord[0]).toFixed(7),
                        lng: parseFloat(applics[i].geo_cord[1]).toFixed(7),
                    },
                    northeast: {
                        lat: parseFloat(applics[i].geo_cord[0]).toFixed(7),
                        lng: parseFloat(applics[i].geo_cord[1]).toFixed(7),
                    },
                    type: 'LatLngBounds'
                }
            } else {
                console.log(applics[i].geo_cord);
                if(parseFloat(applics[i].geo_cord[0]).toFixed(7) >= bounds.northeast.lat){
                    bounds.northeast.lat = parseFloat(applics[i].geo_cord[0]).toFixed(7);
                }

                if(parseFloat(applics[i].geo_cord[1]).toFixed(7) >= bounds.northeast.lng){
                    bounds.northeast.lng = parseFloat(applics[i].geo_cord[1]).toFixed(7);
                }

                if(parseFloat(applics[i].geo_cord[0]).toFixed(7) <= bounds.southwest.lat){
                    bounds.southwest.lat = parseFloat(applics[i].geo_cord[0]).toFixed(7);
                    
                }

                if(parseFloat(applics[i].geo_cord[1]).toFixed(7) <= bounds.southwest.lng){
                    bounds.southwest.lng = parseFloat(applics[i].geo_cord[1]).toFixed(7);
                }
            }

            if(!prevOrderId){
                if(applics[i].type == 1){
                    prevOrderIdDeliveryCoords = { lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) };
                } else {
                    polylineCoords.push({ lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) });
                }
            } else {
                if(applics[i].order_id == prevOrderId){
                    if(applics[i].type == 1){
                        prevOrderIdDeliveryCoords = { lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) };
                        polylineCoords.push(prevOrderIdDeliveryCoords);
                    } else {
                        polylineCoords.push({ lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) });
                    }

                    map.addPolyline({
                        points: polylineCoords,
                        color: 'red',
                        width: 1,
                        geodesic: true
                    });

                    polylineCoords = [prevOrderIdDeliveryCoords];
                } else {
                    polylineCoords = [];
                    if(applics[i].type == 1){
                        prevOrderIdDeliveryCoords = { lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) };
                    } else {
                        polylineCoords.push({ lat: parseFloat(applics[i].geo_cord[0]), lng: parseFloat(applics[i].geo_cord[1]) });
                    }
                }
            }
            
            if (applics[i].type == DELIVERY) {
                dlMarkers.push({
                    orderId: applics[i].order_id,
                    icon: {
                        url: icons.dlLink,
                        size: {
                            width: 76,
                            height: 39
                        },
                        anchor: {
                            x: -1,
                            y: 39
                        }
                    },
                    position: {
                        lat: parseFloat(applics[i].geo_cord[0]),
                        lng: parseFloat(applics[i].geo_cord[1])
                    }
                });
            } else {
                tkMarkers.push({
                    orderId: applics[i].order_id,
                    icon: {
                        url: icons.tkLink,
                        size: {
                            width: 76,
                            height: 39
                        },
                        anchor: {
                            x: 1,
                            y: 39
                        }
                    },
                    position: {
                        lat: parseFloat(applics[i].geo_cord[0]),
                        lng: parseFloat(applics[i].geo_cord[1])
                    }
                });
            }



            if (i == applics.length - 1) {
                bounds.northeast.lat = parseFloat(bounds.northeast.lat) + parseFloat(0.1);
                bounds.northeast.lng = parseFloat(bounds.northeast.lng) + parseFloat(0.05);
                if(dlMarkers.length > 0){
                    map.addMarkerCluster({
                        icons: [
                            { url: icons.dlClusterLink, size: { width: 50, height: 50 }, min: 2, anchor: { x: 24, y: 25 } }
                        ],
                        markers: dlMarkers
                    }, function (markerCluster) {
                        dlCluster = markerCluster;
                        markerCluster.addEventListener(plugin.google.maps.event.MARKER_CLICK, async function (position, marker) {
                            await window.ctrl.applicList.component.filterApplics([marker.get("orderId")]);
                            var height = document.getElementsByClassName('applic-tr')[0].offsetHeight;
                            if(document.getElementsByClassName('applic-tr')[1]) height += document.getElementsByClassName('applic-tr')[1].offsetHeight;
                            main.style.setProperty('transform', 'translate3d(0, 0, 0)');
                            main.style.setProperty('height', height+'px');
                        });

                        animateCamera = setTimeout(function(){
                            clearTimeout(animateCamera);
                            map.animateCamera({
                                target: bounds,
                                duration: 500
                            });
                        }, 200);
                    });
                }

                if(tkMarkers.length > 0){
                    map.addMarkerCluster({
                        icons: [
                            { url: icons.tkClusterLink, size: { width: 50, height: 50 }, min: 2, anchor: { x: 26, y: 25 } }
                        ],
                        markers: tkMarkers
                    }, function (markerCluster) {
                        tkCluster = markerCluster;
                        markerCluster.addEventListener(plugin.google.maps.event.MARKER_CLICK, async function (position, marker) {
                            await window.ctrl.applicList.component.filterApplics([marker.get("orderId")]);
                            var height = document.getElementsByClassName('applic-tr')[0].offsetHeight;
                            if(document.getElementsByClassName('applic-tr')[1]) height += document.getElementsByClassName('applic-tr')[1].offsetHeight;
                            main.style.setProperty('transform', 'translate3d(0, 0, 0)');
                            main.style.setProperty('height', height+'px');
                        });

                        animateCamera = setTimeout(function(){
                            clearTimeout(animateCamera);
                            map.animateCamera({
                                target: bounds,
                                duration: 500
                            });
                        }, 200);
                    });
                }
                // .then(markerCluster => {
                //     markerCluster.on(plugin.google.maps.event.MARKER_CLICK).subscribe((params) => {
                //         var marker = params[1];
                //         //onMarkerClick(marker);
                //     })
                // });

                firstLoad = false;
            }

            prevOrderId = applics[i].order_id;
        }
    }

    function onButtonClick() {

        // Move to the position with animation
        map.animateCamera({
            target: { lat: 37.422359, lng: -122.084344 },
            zoom: 17,
            tilt: 60,
            bearing: 140,
            duration: 5000
        }, function () {

            // Add a maker
            map.addMarker({
                position: { lat: 37.422359, lng: -122.084344 },
                title: "Welecome to \n" +
                    "Cordova GoogleMaps plugin for iOS and Android",
                snippet: "This plugin is awesome!",
                animation: plugin.google.maps.Animation.BOUNCE
            }, function (marker) {

                // Show the info window
                marker.showInfoWindow();

                // Catch the click event
                marker.on(plugin.google.maps.event.INFO_CLICK, function () {

                    // To do something...
                    alert("Hello world!");

                });
            });
        });
    }

    function prepareIcons() {
        preapareMarkerIcon(DELIVERY);
        preapareMarkerIcon(TAKEOUT);

        prepareMarkerClusterIcon(DELIVERY);
        prepareMarkerClusterIcon(TAKEOUT);
    }

    function preapareMarkerIcon(type) {
        var self = this, color, icon, canvas, context, img;

        switch (type) {
            case DELIVERY:
                color = 'darkorange';
                break;
            case TAKEOUT:
                color = 'darkgreen';
                break;
            default:
                color = 'grey';
                break;
        }

        icon = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="' +
            'http://www.w3.org/2000/svg" width="153" height="78" version="1.1">' +
            '<path d="M 3 75 L 25 53 L 125 53 Q 150 53 150 28 Q 150 3 125 3 L 25 3 Q 3 3 3 28 Z" ' +
            'stroke="' + color + '" fill="white" stroke-width="5"/>' +
            '<text x="17" y="35" ><tspan style="font-weight: bold; font-size: 22px;">18:00-00:00</tspan></text>' +
            '</svg>');

        canvas = document.createElement('canvas');
        canvas.width = 153;
        canvas.height = 78;
        context = canvas.getContext('2d');

        img = new Image();
        img.src = icon;
        img.onload = function () {
            context.drawImage(img, 0, 0);
            if (type == DELIVERY) icons.dlLink = canvas.toDataURL(); else icons.tkLink = canvas.toDataURL();
        }
    }

    function prepareMarkerClusterIcon(type) {
        var self = this, color, icon, canvas, context, img;

        switch (type) {
            case DELIVERY:
                color = 'darkorange';
                break;
            case TAKEOUT:
                color = 'darkgreen';
                break;
            default:
                color = 'grey';
                break;
        }

        icon = 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="' +
            'http://www.w3.org/2000/svg" width="200" height="200" version="1.1">' +
            '<circle cx="100" cy="100" r="90" stroke="' + color + '" stroke-width="20" fill="white"></circle></svg>');

        canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        context = canvas.getContext('2d');

        img = new Image();
        img.src = icon;
        img.onload = function () {
            context.drawImage(img, 0, 0);
            if (type == DELIVERY) icons.dlClusterLink = canvas.toDataURL(); else icons.tkClusterLink = canvas.toDataURL();
        }
    }

    var MapCtrl = new SvelteController(MapComponent, {
        globalName: 'map',
        onCtrlReady: async () => {
            window.ctrl.applicList.set({ currentCategory: 'all' });
            mapApplics = window.ctrl.applicList.get('applics');
            window.ctrl.header.set({ title: 'Списком', titleHref: '#applic/list/destroy', currentCategory: 'all' });
            window.ctrl.header.changeStartState();
            main.scrollTo(0, 0);
            main.style.setProperty('transform', 'translate3d(0, 100vh, 0)');
            await sleep(250);
            main.style.setProperty('padding-top', '0');
        },
        preloader: loadMap,
        predestroyer: async () => {
            refresh();
            await window.ctrl.applicList.component.refresh(mapApplics);
            mapApplics = null;

            window.ctrl.header.set({ title: 'На карте', titleHref: '#map', currentCategory: 'all' });
            window.ctrl.header.changeStartState();

            await sleep(50);

            main.scrollTo(0, 0);
            main.style.setProperty('height', '100vh');
            main.style.setProperty('padding-top', '94px');
            main.style.setProperty('transform', 'translate3d(0, 0, 0)');
            await sleep(250);
        },
        data: {
            filter: 'all',
            cluster: null
        },
        methods: [{
            name: 'showOnMap',
            function: showOnMap
        }],
        observes: [{
            item: 'filter',
            function: filter => {
                if(!firstLoad){
                    refresh();
                    if(filter == 'done'){
                        showOnMap( mapApplics.filter(applic => applic.done) );
                    } else if(filter == 'progress'){
                        showOnMap( mapApplics.filter(applic => applic.progress) );
                    } else if(filter == 'takeouts'){
                        showOnMap( mapApplics.filter(applic => applic.type == 2) );
                    } else if(filter == 'deliverys'){
                        showOnMap( mapApplics.filter(applic => applic.type == 1) );
                    } else {
                        showOnMap( mapApplics );
                    }
                }
            }
        }, {
            item: 'cluster',
            function: async cluster => {
                if(cluster){
                    var southwest = cluster.southwest;
                    var northeast = cluster.northeast;
                    if (northeast.lat == southwest.lat && northeast.lng == southwest.lng) {
                        var orderIds = dlMarkers.concat(tkMarkers).filter(function (marker) {
                            if (marker.position.lat == southwest.lat && marker.position.lng == southwest.lng) {
                                return true;
                            }
                            return false;
                        }).map(function (marker) { return marker.orderId; });
                        await window.ctrl.applicList.component.filterApplics(orderIds);
                        main.style.setProperty('transform', 'translate3d(0, 0, 0)');
                        main.style.setProperty('height', '70vh');
                    }
                }
            }
        }],
        target: document.getElementById('mapBlock')
    });

    return MapCtrl;
})));