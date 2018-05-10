(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ApplicModalCtrl = factory());
}(this, (function () { 'use strict';
    let stateinfoOptions;
    let infoOptions = localStorage.getItem('infoOptions') ? JSON.parse(localStorage.getItem('infoOptions')) : [{
        label: 'Адрес',
        key: 'address',
        preview: true
    }, {
        label: 'Время',
        key: 'time',
        preview: true
    }, {
        label: 'Контактное лицо',
        key: 'name',
        preview: true
    }, {
        label: 'Телефон',
        key: 'phone',
        preview: true
    }, {
        label: 'Тип заявки',
        key: 'type',
        preview: false
    }, {
        label: 'Дата',
        key: 'date',
        preview: false
    }, {
        label: 'Заказчик',
        key: 'account_full_name',
        preview: false
    }, {
        label: 'Номер заказчика',
        key: 'applications_name',
        preview: false
    }, {
        label: 'Стоимость',
        key: 'sum',
        preview: false
    }, {
        label: 'Тип оплаты',
        key: 'pay_type',
        preview: false
    }, {
        label: 'Контрагент',
        key: 'c_name',
        preview: false
    }, {
        label: 'Статус',
        key: 'status_text',
        preview: false
    }, {
        label: 'Вес заказчика',
        key: 'order_weight',
        preview: false
    }, {
        label: 'Вес факт',
        key: 'weight',
        preview: false
    }];

    async function onCtrlReady(){
        stateinfoOptions = null;
        if(localStorage.getItem('infoOptions')){
            infoOptions = JSON.parse(localStorage.getItem('infoOptions'));
        }

        modal.style.setProperty('width', '100%');
        modal.style.setProperty('z-index', '9999');

        infoOptions = infoOptions.map(function(option){
            if(option.key == 'time'){
                option.data = 'c '+window.store.applic.time_start+' до '+window.store.applic.time_end
            } else if(option.key == 'type'){
                if(window.store.applic.type == 1){
                    option.data = 'Доставка';
                } else {
                    option.data = 'Забор';
                }
            } else if(option.key == 'account_full_name'){
                option.data = window.store.applic.order.account.full_name;
            } else if(option.key == 'pay_type'){
                if(window.store.applic.order.pay_type == 'cashpay'){
                    option.data = 'Наличными';
                } else if(window.store.applic.order.pay_type == 'cardpay'){
                    option.data = 'Картой';
                } else {
                    option.data = 'Предоплата';
                }
            } else if(option.key == 'status_text'){
                option.data = window.store.applic.status.text;
            } else if(option.key == 'order_weight'){
                if(window.store.applic.order.weight_id == 1){
                    option.data = 'до 2.99 кг';
                } else if(window.store.applic.order.weight_id == 2){
                    option.data = '3 - 4.99 кг';
                } else if(window.store.applic.order.weight_id == 3){
                    option.data = '5 - 9.99 кг';
                } else if(window.store.applic.order.weight_id == 4){
                    option.data = '10 - 14.99 кг';
                } else if(window.store.applic.order.weight_id == 5){
                    option.data = '15 - 19.99 кг';
                } else if(window.store.applic.order.weight_id == 6){
                    option.data = '20 - 24.99 кг';
                } else if(window.store.applic.order.weight_id == 7){
                    option.data = '25 - 29.99 кг';
                } else if(window.store.applic.order.weight_id == 8){
                    option.data = '30 - 49.99 кг';
                } else if(window.store.applic.order.weight_id == 9){
                    option.data = '50 - 79.99 кг';
                } else {
                    option.data = 'Более 80 кг';
                }
            } else {
                option.data = window.store.applic[option.key];
            }

            return option;
        });
    }

    async function preloader(){
        await sleep(50);
        ApplicModalCtrl.set({ type: window.store.applic.type });

        window.ctrl.header.set({ 
            title: (window.store.applic.type == 1 ? 'Доставка ' : 'Забор ') + window.store.applic.id, 
            actions: [
                { html: '<a href="tel:8'+window.store.applic.phone+'" class="mdi mdi-phone" style="padding-left: 10px; padding-right: 10px"/>' },
                { html: '<a href="geo:'+window.store.applic.geo_cord[0]+','+window.store.applic.geo_cord[1]+'" class="mdi mdi-navigation" style="padding-left: 10px; padding-right: 10px"/>' },
                { html: '<a onclick="window.ctrl.applicList.component.showItemCards('+window.store.applic.id+', event, true)" class="mdi mdi-check" style="padding-left: 10px; padding-right: 10px"/>' }
            ],
            color: window.store.applic.type == 1 ? 'delivery' : 'takeout',
            type: 'modal', 
            search: false,
            navCategory: false
        });
        
        document.getElementById('ApplicModalComponent').style.setProperty('transform', 'translate3d(0, 0, 0)');
        await sleep(150);

        ApplicModalCtrl.set({ 
            isLoad: true,
            infoOptions: infoOptions,
            items: window.store.applic.items,
            comments: window.store.applic.comments,
            files: window.store.applic.order.files
        });

        let dotsSpan = document.getElementsByClassName('option-data');
        for(var i = 0; i < dotsSpan.length; i++){
            dotsSpan[i].parentNode.parentNode.style.setProperty('height', (dotsSpan[i].clientHeight - 21)+'px');
        }

        let cards = document.getElementById('ApplicModalComponent').querySelectorAll('.card');
        for(var i = 0; i < cards.length; i++){
            cards[i].style.setProperty('transform', 'translate3d(0, 0, 0)');
            await sleep(50);
        }
    }

    async function predestroyer(){
        document.getElementById('ApplicModalComponent').querySelector('.scroll-content').scrollTo(0, 0);

        let cards = document.getElementById('ApplicModalComponent').querySelectorAll('.card');
        for(var i = cards.length - 1; i >= 0; i--){
            cards[i].style.setProperty('transform', 'translate3d(0, 100vh, 0)');
            await sleep(50);
        }
        await sleep(150);
        ApplicModalCtrl.set({ isLoad: false });
        document.getElementById('ApplicModalComponent').style.setProperty('transform', 'translate3d(0, 100%, 0)');
        window.ctrl.header.setStartState(true);
        await sleep(200);
        modal.style.setProperty('z-index', '99');
        modal.style.setProperty('width', '0');
    }

    let ApplicModalCtrl = new SvelteController(ApplicModalComponent, {
        onCtrlReady: onCtrlReady,
        preloader: preloader,
        data: {
            isLoad: false,
            infoSettings: false,
            infoOptions: infoOptions,
            comments: [],
            files: [],
            items: [],
            type: window.store.applic.type
        },
        methods: [{
            name: 'showSettings',
            function: () => {
                stateinfoOptions = ApplicModalCtrl.get('infoOptions');
                ApplicModalCtrl.set({ infoSettings: true });

                requirejs(['slip'], function(){
                    var list = document.querySelector('.slippylist');
        
                    function reorder(e){
                        let movedItem = stateinfoOptions[e.detail.originalIndex - 1];

                        stateinfoOptions.splice(e.detail.originalIndex - 1, 1);
                        stateinfoOptions.splice(e.detail.spliceIndex - 1, 0, movedItem);

                        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
                        return false;
                    }
                    
                    list.removeEventListener('slip:reorder', reorder, false);
                    list.addEventListener('slip:reorder', reorder, false);

                    list.removeEventListener('slip:beforeswipe', function(e) {
                        e.preventDefault();
                    }, false);
                    list.addEventListener('slip:beforeswipe', function(e) {
                        e.preventDefault();
                    }, false);
                    
                    new Slip(list);
                })
            }
        }, {
            name: 'saveInfoOptions',
            function: async () => {
                console.log('saveInfoOptions');
                M.toast({ html: 'Настройки сохранены', classes: 'green' });
                localStorage.setItem('infoOptions', JSON.stringify(stateinfoOptions));
                ApplicModalCtrl.set({ infoOptions: stateinfoOptions });
                ApplicModalCtrl.set({ infoSettings: false });

                let dotsSpan = document.getElementsByClassName('option-data');
                for(var i = 0; i < dotsSpan.length; i++){
                    dotsSpan[i].parentNode.parentNode.style.setProperty('height', (dotsSpan[i].clientHeight - 21)+'px');
                }
            }
        }, {
            name: 'showContent',
            function: async el => {
                if(el.parentNode.querySelector('.content-to-show').offsetHeight > 0){
                    el.parentNode.querySelector('.mdi-chevron-down').style.setProperty('transform', 'rotate(0)');
                    el.parentNode.querySelector('.content-to-show').style.setProperty('height', '0');
                } else {
                    let height = el.parentNode.querySelector('.content-to-show').querySelector('.hiden-content').offsetHeight + 20;
                    if(el.parentNode.querySelector('.content-to-show').querySelector('.comment')){
                        ApplicModalCtrl.set({ commentsIsLoad: true });
                        height = el.parentNode.querySelector('.content-to-show').querySelector('.hiden-content').offsetHeight + 20;
                        ApplicModalCtrl.set({ commentsIsLoad: false });
                    }

                    el.parentNode.querySelector('.mdi-chevron-down').style.setProperty('transform', 'rotate(180deg)');
                    el.parentNode.querySelector('.content-to-show').style.setProperty('height', height+'px');
                    await sleep(200);
                    
                    if(el.parentNode.querySelector('.content-to-show').querySelector('.comment')){
                        ApplicModalCtrl.set({ commentsIsLoad: true });
                    }
                }
            }
        }, {
            name: 'insetHeader',
            function: el => {
                if (el.scrollTop > 15){
                    modal.style.setProperty('z-index', '99');
                } else {
                    modal.style.setProperty('z-index', '9999');
                }
            }
        }],
        predestroyer: predestroyer,
        target: document.getElementById('modal-content')
    });

    return ApplicModalCtrl;
})));