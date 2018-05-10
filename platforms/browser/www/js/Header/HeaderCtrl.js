(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.HeaderCtrl = factory());
}(this, (function () { 'use strict';

    var HeaderCtrl = new SvelteController(HeaderComponent, {
        globalName: 'header',
        target: document.getElementById('header'),
        data: {
            title: 'На карте',
            titleHref: '#map',
            color: 'blue',
            type: 'menu',
            searchText: '',
            searchGlobal: false,
            offsetTop: 0,
            navCategory: true,
            actions: [
                { html: '<a class="mdi mdi-magnify" onclick="window.ctrl.header.component.activeSearch()" style="padding-left: 10px; padding-right: 10px"/>' },
                { html: '<a href="#modal/filter" class="mdi mdi-calendar-edit" style="padding-left: 10px; padding-right: 10px"/>' }
            ],
            applicsCount: {
                all: 0,
                done: 0,
                progress: 0,
                tk: 0,
                dl: 0,
                points: 0
            },
            currentCategory: 'all',
            loader: null
        },
        methods: [{
                name: 'close',
                function: function(){
                    window.ctrl.route.pop().destroy();
                    window.location.hash = window.ctrl.route.routes.ApplicList;
                }
        }, {
            name: 'startWork',
            function: () => {
                window.ctrl.work.start();
            }
        }, {
            name: 'chooseCategory',
            function: name => {
                if(!HeaderCtrl.get('loader')){
                    HeaderCtrl.set({ currentCategory: name });
                    if(!window.ctrl.map){
                        window.ctrl.applicList.set({ currentCategory: name });
                    } else {
                        window.ctrl.map.set({ filter: name });
                    }
                    HeaderCtrl.changeStartState();
                } else {
                    M.toast({ html: 'Идет подгрузка заявок! Подождите...' });
                }
            }
        }, {
            name: 'activeSearch',
            function: () => {
                console.log('sgaga');
                HeaderCtrl.set({ search: true, navCategory: false });
            }
        }, {
            name: 'help',
            function: type => {
                if (type == 'search') {
                    function alertDismissed() {
                        // do something
                    }
                    
                    navigator.notification.alert(
                        'Помощь по блоку "Поиск"\n\n• Поиск осуществляется по следующим полям:'+
                        '\n-Номер заявки\n-Номер поставщика\n-Имя клиента\n-Адрес\n-Номер телефона'+
                        '\n\n• Локальный поиск осуществляется за выбранный период'+
                        '\n\n• Глобальный поиск требует подключение к интернету, ищет за все время, максимальная выдача: 50 заявок',  // message
                        alertDismissed,         // callback
                        'Помощь',            // title
                        'ОК'                  // buttonName
                    );
                }
            }
        }],
        observes: [{
            item: 'search',
            function: search => {
                if(!search){
                    if(window.ctrl.applicList) window.ctrl.applicList.component.search('');
                }
            }
        }]
    });

    return HeaderCtrl;
})));