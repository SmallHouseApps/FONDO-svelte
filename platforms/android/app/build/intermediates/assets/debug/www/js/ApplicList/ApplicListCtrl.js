(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.ApplicListCtrl = factory());
}(this, (function () {
    'use strict';
    const DENIAL = [42, 43, 47, 48]; const CANCELED = [35, 44, 49];
    var equalSignSY = 0; var negativeSY = 0, positiveSY = 0;
    var main = document.getElementById('main'); var dateChange;

    var nav = document.getElementsByClassName('nav-extended')[0]; var delay;
    var popUp = document.getElementById('pop-up'); var currentApplicId, currentOrderId;
    var notFilterApplics; var headerOffsetTop = 0; var loader = 1;
    var applicsCount = {
        all: 0,
        done: 0,
        progress: 0,
        tk: 0,
        dl: 0,
        points: 0
    };
    var points = [], prevPoint;
    var self = this; var tempStorageApplics = []; var startStateApplics;
    var storageApplics = JSON.parse(localStorage.getItem('applics')); var prevOrderId = null;
    var preloader = null; var prevSY = null; var sydif = 0; var sydifrepeat = 0;
    var applicCount = 0;
    var now = new Date();

    var day = now.getDate();
    if (day.toString().length == 1) day = '0' + day;

    var month = now.getMonth() + 1;
    if (month.toString().length == 1) month = '0' + month;

    var today = day + "." + month + "." + now.getFullYear();

    console.log(storageApplics);
    
    function getDecimal(num) {
        var str = "" + num;
        var zeroPos = str.indexOf(".");
        if (zeroPos == -1) return 0;
        str = str.slice(zeroPos);
        return +str;
    }

    function updateVisible() {
        // var applics = window.ctrl.applicList.get('applics'); var beforeOrderId;
        // for (var i = 0; i < applics.length; i++) {
        //     if (!beforeOrderId) beforeOrderId = applics[i].order_id;
        //     if (beforeOrderId != applics[i].order_id) {
        //         document.getElementById('applic-row-' + applics[i].id).classList.add('order-start');
        //         beforeOrderId = applics[i].order_id;
        //     }
        // }
    }

    function refresh(applics = null, filter = true) {
        applicCount = 0;
        prevOrderId = null;
        applicsCount = {
            all: 0,
            done: 0,
            progress: 0,
            tk: 0,
            dl: 0,
            points: 0
        };
        window.ctrl.applicList.set({ applics: [] });
        if (applics) {
            applics = applics.map(function (applic) {
                applicCount++;
                applic.offsetTop = APPLIC_HEIGHT * applicCount + 5 * applicCount;

                if (!prevOrderId) {
                    prevOrderId = applic.order_id;
                }

                if (prevOrderId != applic.order_id) {
                    applic.orderStart = true;
                    prevOrderId = applic.order_id;
                } else {
                    applic.orderStart = false;
                }

                return applic;
            });
            window.ctrl.applicList.set({ applics: applics });
        }

        if(filter){
            main.scrollTo(0, 0);
            nav.style.setProperty('transform', 'translate3d(0, 0, 0)');
        }
    }

    function* preloadApplics(lastPage) {
        for (var i = 2; i <= lastPage; i++) {
            yield getApplics(i);
        }
    }

    async function predestroyer() {
        console.log(screenHeight);
        TweenLite.to(document.getElementById('main'), 0.6, { y: screenHeight });
        await sleep(600);
    }

    async function getApplics(page = 1) {
        if (navigator.onLine) {
            if (page == 1) tempStorageApplics = [];
            window.ctrl.header.set({ loader: loader });
            fetch(`http://fondo.ru/api/v1/application/list?token=${window.token}&page=${page}&date_start=${window.ctrl.applicList.get('dateStart')}&date_end=${window.ctrl.applicList.get('dateEnd')}`)
                .then(r => {
                    if (r.status == 200) {
                        r.json().then(data => {
                            if (!preloader) {
                                preloader = preloadApplics(data.last_page);
                            }
                            loader += 100 / data.last_page;

                            var step = preloader.next();
                            var applics = data.data.map(function (applic, index) {
                                applicCount++; applicsCount.all++;

                                if(applicCount < 7){
                                    applic.isLoad = true;
                                } else {
                                    applic.isLoad = false;
                                }

                                if(points.length == 0 || points.indexOf(JSON.stringify(applic.geo_cord)) == -1){
                                    applicsCount.points++;
                                    points.push(JSON.stringify(applic.geo_cord));
                                }

                                if (DENIAL.indexOf(applic.status_id) != -1) {
                                    applic.denial = true;
                                } else {
                                    applic.denial = false;
                                }

                                if (CANCELED.indexOf(applic.status_id) != -1) {
                                    applic.canceled = true;
                                } else {
                                    applic.canceled = false;
                                }

                                if (applic.weight) {
                                    applic.weight = Math.round(applic.weight * 100) / 100
                                } else {
                                    if(applic.order.weight_id == 1){
                                        applic.weight = '0-3';
                                    } else if(applic.order.weight_id == 2){
                                        applic.weight = '3-5';
                                    } else if(applic.order.weight_id == 3){
                                        applic.weight = '5-10';
                                    } else if(applic.order.weight_id == 4){
                                        applic.weight = '10-15';
                                    } else if(applic.order.weight_id == 5){
                                        applic.weight = '15-20';
                                    } else if(applic.order.weight_id == 6){
                                        applic.weight = '20-25';
                                    } else if(applic.order.weight_id == 7){
                                        applic.weight = '25-30';
                                    } else if(applic.order.weight_id == 8){
                                        applic.weight = '30-50';
                                    } else if(applic.order.weight_id == 9){
                                        applic.weight = '50-80';
                                    } else {
                                        applic.weight = '>80';
                                    }
                                }

                                applic.actions = false;
                                applic.sum = Math.round(applic.sum * 100) / 100;
                                applic.int = Math.ceil(applic.sum);
                                applic.decimal = getDecimal(applic.sum) * 100;
                                applic.offsetTop = APPLIC_HEIGHT * applicCount + 5 * applicCount;
                                applic.dropdown = false;
                                if (!prevOrderId) {
                                    prevOrderId = applic.order_id;
                                }

                                if (prevOrderId != applic.order_id) {
                                    applic.orderStart = true;
                                    prevOrderId = applic.order_id;
                                } else {
                                    applic.orderStart = false;
                                }

                                if (applic.done) applicsCount.done++;
                                else {
                                    applic.progress = true;
                                    applicsCount.progress++;
                                }

                                if (applic.type == 1) applicsCount.dl++;
                                else applicsCount.tk++;

                                applic.time_start = applic.time_start.split(':')[0] + ':' + applic.time_start.split(':')[1];
                                applic.time_end = applic.time_end.split(':')[0] + ':' + applic.time_end.split(':')[1];

                                prevPoint = applic.geo_cord;

                                return applic;
                            });

                            window.ctrl.header.set({ applicsCount: applicsCount });
                            window.ctrl.header.set({ loader: loader });

                            // if (!storageApplics) {
                            //     window.ctrl.applicList.add('applics', applics);
                            //     updateVisible();
                            // } else {
                            //     tempStorageApplics = tempStorageApplics.concat(applics);
                            //     console.log(tempStorageApplics);
                            // }
                            if (!storageApplics || ApplicListCtrl.get('dateStart') != ApplicListCtrl.get('dateEnd')) {
                                ApplicListCtrl.add('applics', applics);
                            } else {
                                tempStorageApplics = tempStorageApplics.concat(applics);
                            }

                            if (step.done) {
                                // if (storageApplics) {
                                //     storageApplics = tempStorageApplics;
                                //     window.ctrl.applicList.set({ applics: storageApplics });
                                //     updateVisible();
                                // } else {
                                //     storageApplics = window.ctrl.applicList.get('applics');
                                // }

                                if (!storageApplics) {
                                    storageApplics = ApplicListCtrl.get('applics');
                                } else if(ApplicListCtrl.get('dateStart') == ApplicListCtrl.get('dateEnd')) {
                                    console.log(tempStorageApplics);
                                    refresh(tempStorageApplics, false);
                                    storageApplics = tempStorageApplics;
                                }

                                if (ApplicListCtrl.get('dateStart') == ApplicListCtrl.get('dateEnd')) {
                                    localStorage.setItem('applics', JSON.stringify(storageApplics));
                                }

                                preloader = null;
                                loader = null;

                                if(window.ctrl.map){
                                    window.ctrl.map.component.showOnMap(ApplicListCtrl.get('applics'));
                                }

                                setTimeout(function () {
                                    window.ctrl.header.set({ loader: loader });
                                    window.ctrl.header.changeStartState();
                                }, 200);
                                
                                notFilterApplics = ApplicListCtrl.get('applics');
                            }
                        });
                    } else {
                        window.location.hash = window.routeCtrl.routes.Auth;
                    }
                })
                .catch(e => {
                    window.location.hash = window.routeCtrl.routes.Auth;
                })
        } else {
            if (storageApplics) {
                storageApplics.map(function (applic, index) {
                    applicCount++; applicsCount.all++; applicsCount.points++;

                    if (applic.done) applicsCount.done++;
                    else applicsCount.progress++;

                    if (applic.type == 1) applicsCount.dl++;
                    else applicsCount.tk++;

                    return applic;
                });
                
                notFilterApplics = storageApplics;
                window.ctrl.header.set({ applicsCount: applicsCount });
            }
        }
    }

    document.addEventListener("resume", function(){
        getApplics();
        window.ctrl.header.set({ currentCategory: 'all' });
    }, false);

    var ApplicListCtrl = new SvelteController(ApplicListComponent, {
        globalName: 'applicList',
        predestroyer: predestroyer,
        preloader: function () {
            requirejs(["WorkingShiftCtrl"], function(WorkingShiftCtrl) {
                WorkingShiftCtrl.init();
                window.ctrl.work = WorkingShiftCtrl;
            });
            updateVisible();
            getApplics();
        },
        data: {
            dateStart: today,
            dateEnd: today,
            blockHeight: APPLIC_HEIGHT,
            screenHeight: screenHeight,
            applics: storageApplics ? storageApplics : [],
            currentCategory: 'all',
            sy: 0
        },
        observes: [{
            item: 'dateStart',
            function: dateStart => {
                if(window.ctrl.applicList && !dateChange){
                    dateChange = true;
                    setTimeout(function(){
                        dateChange = false;
                    });
                    refresh();
                    getApplics();
                }
            }
        }, {
            item: 'dateEnd',
            function: dateEnd => {
                if(window.ctrl.applicList && !dateChange){
                    dateChange = true;
                    setTimeout(function(){
                        dateChange = false;
                    });
                    refresh();
                    getApplics();
                }
            }
        }, {
            item: 'sy',
            function: sy => {
                if (!window.ctrl.map) {
                    if (!prevSY) {
                        prevSY = sy;
                    } else {
                        if (sy > prevSY) {
                            delay = true;
                            setTimeout(function(){
                                delay = false;
                            }, 20);
                            if (negativeSY != 0) negativeSY = 0;
                            if (positiveSY == 3) {
                                nav.style.setProperty('transform', 'translate3d(0, -56px, 0)');
                            } else {
                                positiveSY++;
                            }
                        } else {
                            if (positiveSY != 0) positiveSY = 0;
                            if (negativeSY == 3) {
                                nav.style.setProperty('transform', 'translate3d(0, 0, 0)');
                            } else {
                                negativeSY++;
                            }

                            if (delay && !ApplicListCtrl.get('touched')) {
                                main.scrollTo(0, sy + 20);
                            }
                        }
                        prevSY = sy;
                    }
                }
            }
        }, {
            item: 'currentCategory',
            function: currentCategory => {
                if (window.ctrl.applicList) {
                    currentCategory = currentCategory;
                    var applics = ApplicListCtrl.get('applics');

                    if (notFilterApplics) {
                        if (currentCategory == 'done') {
                            applics = notFilterApplics.filter(applic => applic.done);
                        } else if (currentCategory == 'progress') {
                            applics = notFilterApplics.filter(applic => applic.progress);
                        } else if (currentCategory == 'takeouts') {
                            applics = notFilterApplics.filter(applic => applic.type == 2);
                        } else if (currentCategory == 'deliverys') {
                            applics = notFilterApplics.filter(applic => applic.type == 1);
                        } else if (currentCategory == 'all' || currentCategory == 'points') {
                            applics = notFilterApplics;
                        }

                        refresh(applics);
                    }
                }
            }
        }],
        methods: [{
            name: 'initDropdown',
            function: async (el, applicId) => {
                var data = ApplicListCtrl.get('applics').map(function (applic) {
                    if (applic.id == applicId) applic.dropdown = true;
                    return applic;
                });
                ApplicListCtrl.set({ applics: data });

                M.Dropdown.init(el, {
                    inDuration: 100,
                    outDuration: 100
                });
            }
        }, {
            name: 'getApplics',
            function: getApplics
        }, {
            name: 'search',
            function: (searchText, global) => {
                searchText = searchText.toLowerCase();
                var applics = notFilterApplics.map(function(applic){
                    if(applic.id.toString().toLowerCase().search(searchText) != -1){
                        return applic;
                    }

                    if(applic.applications_name.toString().toLowerCase().search(searchText) != -1){
                        return applic;
                    }

                    if(applic.address.toString().toLowerCase().search(searchText) != -1){
                        return applic;
                    }

                    if(applic.phone.toString().toLowerCase().search(searchText) != -1){
                        return applic;
                    }

                    if(applic.name.toString().toLowerCase().search(searchText) != -1){
                        return applic;
                    }
                }).filter(applic => applic);

                refresh(applics);
            }
        }, {
            name: 'filterApplics',
            function: async orderIds => {
                var applics = notFilterApplics.filter(applic => orderIds.indexOf(applic.order_id) != -1);
                refresh(applics);
            }
        }, {
            name: 'showApplic',
            function: applicId => {
                nav.style.setProperty('transform', 'translate3d(0, 0, 0)');
                window.store.applic = ApplicListCtrl.get('applics').filter(applic => applic.id == applicId)[0];
                window.location.hash = '#modal/applic';
            }
        }, {
            name: 'showActions',
            function: async (applicId) => {
                var data = ApplicListCtrl.get('applics').map(function (applic) {
                    if (applic.id == applicId) applic.actions = true;
                    return applic;
                });
                ApplicListCtrl.set({ applics: data });
            }
        }, {
            name: 'setRowHeight',
            function: el => {
                console.log(el);
            }
        }, {
            name: 'showItemCards',
            function: async (applicId, e, fromApplic = false) => {
                console.log(e);
                var applic = ApplicListCtrl.get('applics').filter(applic => applic.id == applicId)[0];
                
                if (!applic.done) {
                    if (applic.type == 1 && applic.items.length == 0) {
                        M.toast({ html: 'Требуется выполнение забора', classes: 'delivery' });
                    } else {
                        if(fromApplic){
                            await window.ctrl.route.pop().destroy();
                        }
    
                        document.getElementById('material-cover').style.setProperty('transform-origin', e.pageX + 'px ' + (e.pageY - screenHeight * 0.3) + 'px');
                        
                        if (applic.type == 1) {
                            document.getElementById('material-cover').style.setProperty('background-color', 'darkorange');
                        } else {
                            document.getElementById('material-cover').style.setProperty('background-color', 'darkgreen');
                        }

                        currentApplicId = applic.id;
                        currentOrderId = applic.order_id;
                        window.ctrl.tempData = applic.items;
                        window.location.hash = window.ctrl.route.routes.ItemCards;
                    }
                } else {
                    if (applic.type == 1) {
                        M.toast({ html: 'Доставка уже выполнена', classes: 'delivery' });
                    } else {
                        M.toast({ html: 'Забор уже выполнен', classes: 'takeout' });
                    }
                }
            }
        }, {
            name: 'showItemsCarousel',
            function: () => {
                requirejs(["ItemsCarouselCtrl", "ItemsCarouselComponent"], function (util) {
                    document.getElementById('modal').style.setProperty('display', 'block');
                    itemsCarouselCtrl.init();
                });
            }
        }, {
            name: 'showMessages',
            function: async (applicId, type) => {
                var applic = ApplicListCtrl.get('applics').filter(applic => applic.id == applicId)[0];
                window.store.applicId = applic.id;
                currentApplicId = applic.id;
                if (type == 'comments') {
                    window.store.files = null;
                    window.store.comments = applic.comments;
                } else {
                    if(applic.order.files.length == 0){
                        function onConfirm(buttonIndex) {
                            console.log(buttonIndex);
                            if(buttonIndex == 2){
                                window.ctrl.applicModal.component.close();
                            } else {
                                window.ctrl.applicModal.set({ addFile: true, addComment: false });
                            }
                        }
                        
                        navigator.notification.confirm(
                            'Нет прикрепленных файлов', // message
                            onConfirm,            // callback to invoke with index of button pressed
                            'Заявка №'+applic.id,           // title
                            ['Прикрепить новый файл', 'Отмена']     // buttonLabels
                        );
                    }

                    window.store.comments = null;
                    window.store.files = applic.order.files;
                }
            }
        }, {
            name: 'closeMessages',
            function: async (applicId, el) => {
                var messageEl = document.getElementById('applic-messages' + applicId);
                var content = document.getElementById('applic-messages-content' + applicId);
                TweenLite.to(messageEl, 0.6, { width: '0', height: '0' });

                await sleep(300);
                content.style.setProperty('width', '0');
                var data = ApplicListCtrl.get('applics').map(function (applic) {
                    if (applic.id == applicId) applic.detail = false;
                    return applic;
                });
                ApplicListCtrl.set({ applics: data });
            }
        }, {
            name: 'refresh',
            function: refresh
        }, {
            name: 'compvare',
            function: (items, weight, comment) => {
                var serverChange = {};
                var itemsIssuedCount = 0;
                serverChange.applicId = currentApplicId;
                serverChange.items = [];
                serverChange.weight = weight;
                serverChange.comment = comment;

                var currentApplic = ApplicListCtrl.get('applics').filter(applic => applic.id == currentApplicId)[0];
                if (currentApplic.type == 2) {

                    items = items.filter(item => item.change);
                    items = items.map(function (item) {
                        item.quantity = item.issuedPartQuantity ? item.issuedPartQuantity : item.quantity;
                        item.received = item.issued ? 'Y' : 'N';
                        item.sum = parseFloat(item.price) * parseInt(item.quantity);

                        serverChange.items.push({
                            id: item.id,
                            received: item.received,
                            quantity: item.quantity
                        })

                        if(item.issued) itemsIssuedCount++;

                        delete item.change;
                        delete item.issued;
                        delete item.issuedPartQuantity;
                        delete item.issuedPart;
                        return item;
                    }).filter(applic => applic.received == 'Y');
                } else {
                    items = items.filter(item => item.change);
                    items = items.map(function (item) {
                        item.quantity = item.issuedPartQuantity ? item.issuedPartQuantity : item.quantity;

                        serverChange.items.push({
                            id: item.id,
                            implemented: item.issued ? 'Y' : 'N',
                            quantity: item.quantity
                        })

                        if(item.issued) itemsIssuedCount++;

                        delete item.change;
                        delete item.issued;
                        delete item.issuedPartQuantity;
                        delete item.issuedPart;
                        return item;
                    })
                }

                var tempApplicsCount = window.ctrl.header.get('applicsCount');
                tempApplicsCount.done++; tempApplicsCount.progress--;
                window.ctrl.header.set({ applicsCount: tempApplicsCount });
                
                var data = ApplicListCtrl.get('applics').map(function (applic) {
                    if (applic.id == currentApplicId) {
                        applic.items = [];
                        applic.done = true;
                        applic.progress = false;
                        applic.denial = itemsIssuedCount == 0 ? true : false;
                        applic.canceled = false;
                        currentApplic = applic;
                    } else if (applic.order_id == currentOrderId && applic.type == 1) {
                        applic.items = items;
                        for(var key in items){
                            applic.sum += parseFloat(items[key].sum);
                        }
                        applic.sum = Math.round(applic.sum * 100) / 100;
                        applic.int = Math.ceil(applic.sum);
                        applic.decimal = getDecimal(applic.sum) * 100;
                        applic.done = itemsIssuedCount == 0 ? true : false;
                        applic.canceled = itemsIssuedCount == 0 ? true : false;
                    }

                    return applic;
                });
                ApplicListCtrl.set({ applics: data });
                localStorage.setItem('applics', JSON.stringify(data));

                window.ctrl.changesQueue.push('items', serverChange);

                var category = ApplicListCtrl.get('currentCategory');
                ApplicListCtrl.set({ currentCategory: 'all' });
                ApplicListCtrl.set({ currentCategory: category });

            }
        }, {
            name: 'createComment',
            function: comment => {
                var data = ApplicListCtrl.get('applics').map(function (applic) {
                    if (applic.id == currentApplicId) {
                        applic.comments.push({
                            comment: comment,
                            user: {
                                full_name: 'Вы'
                            },
                            created_at: 'сейчас'
                        });
                    }
                    return applic;
                });
                ApplicListCtrl.set({ applics: data });
                localStorage.setItem('applics', JSON.stringify(data));

                var serverChange = {
                    comment: {
                        text: comment,
                        type: 3
                    },
                    applicId: currentApplicId
                }

                window.ctrl.changesQueue.push('comments', serverChange);
            }
        }]
    });

    return ApplicListCtrl;
})));