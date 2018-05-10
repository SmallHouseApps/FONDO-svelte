(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ItemModalCtrl = factory());
}(this, (function () { 'use strict';
    var modal = document.getElementById('modal'); var issuedCount = 0;
    var cover = document.getElementById('cover'); 
    var mainEl;
    var instance;
    var startClientX = null;
    var tempData = JSON.parse(JSON.stringify(window.ctrl.tempData));

    async function preloader(){
        tempData = JSON.parse(JSON.stringify(window.ctrl.tempData)).map(function(item){ item.change = true; return item; });
        if(ItemModalCtrl) ItemModalCtrl.set({ items: tempData }, true);
        console.log(event);
        issuedCount = 0;
        cover.style.setProperty('display', 'block');
        await sleep(50);
        modal.classList.add('depth-modal');
        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0.5)');
        document.getElementById('material-cover').style.setProperty('transform', 'scale(1, 1)');

        await sleep(200);
        for(var i=0; i < document.getElementsByClassName('card-panel').length; i++){
            document.getElementsByClassName('card-panel')[i].style.setProperty('transform','translate3d(0, 15vh, 0)');
            await sleep(50);
        }
        
        mainEl = document.getElementById('ItemsCardsComponent');
    }

    async function predestroyer(){
        for(var i=document.getElementsByClassName('card-panel').length - 1; i >= 0; i--){
            document.getElementsByClassName('card-panel')[i].style.setProperty('transform','translate3d(0, 100vh, 0)');
        }
        await sleep(200);
        document.getElementById('material-cover').style.setProperty('transform', 'scale(0, 0)');
        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0)');
        await sleep(200);
        modal.classList.remove('depth-modal');
        cover.style.setProperty('display', 'none');
    }

    var ItemModalCtrl = new SvelteController(ItemCardsComponent, {
        preloader: preloader,
        predestroyer: predestroyer,
        target: document.getElementById('modal-content'),
        data: {
            sx: 0,
            items: tempData ? tempData.map(function(item){ item.change = true; return item; }) : [],
            currentItem: 0,
            extra: {
                issued: false,
                weight: '',
                comment: 'Притензий нет!'
            }
        },
        methods:[{
            name: 'issued',
            function: async (itemId, index) => {
                if(itemId){
                    var currentItem;
                    var extra = ItemModalCtrl.get('extra');
                    var items = ItemModalCtrl.get('items').map(function(item){
                        if(item.id == itemId) {
                            if(typeof(item.issued) == 'undefined' || ItemModalCtrl.get('startState')){
                                issuedCount++
                            }
                            item.issued = true;
                            currentItem = item;
                            if(item.quantity > 1 && !item.issuedPartQuantity){
                                item.issuedPartQuantity = item.quantity;
                            } else if (item.issuedPartQuantity >= 0){
                                item.issuedPart = true;
                            }
                        }
                        return item;
                    });
                    ItemModalCtrl.set({items: items});

                    console.log(issuedCount);

                    document.getElementById('card'+index).classList.remove('red');
                    document.getElementById('card'+index).classList.add('green');

                    if(currentItem.quantity == 1 || currentItem.issuedPart){
                        if(issuedCount == items.length && extra.issued){
                            if(extra.weight != '' && extra.comment != ''){
                                window.ctrl.route.pop().destroy();
                                window.location.hash = window.ctrl.route.routes.ApplicList;
                                window.ctrl.applicList.component.compvare(items, extra.weight, extra.comment);
                                M.toast({ html: 'Заказ выполнен', classes: 'green' });
                            } else if(extra.weight == ''){
                                M.toast({ html: 'Не введен вес!', classes: 'red' });
                            } else if(extra.comment == ''){
                                M.toast({ html: 'Не введен комментарий!', classes: 'red' });
                            }
                        } else {
                            var firstItemOffsetLeft = document.getElementsByClassName('card-panel')[0].offsetLeft - 5;
                            await sleep(250);
                            for(var i=mainEl.scrollLeft; i<document.getElementById('card'+(index+1)).offsetLeft-firstItemOffsetLeft; i+=6){
                                mainEl.scrollLeft = i;
                                await sleep(1);
                            }
                        }
                    }
                } else {
                    var items = ItemModalCtrl.get('items');
                    

                    if(issuedCount == items.length){
                        var extra = ItemModalCtrl.get('extra');
                        if(extra.weight != '' && extra.comment != ''){
                            ItemModalCtrl.set({extra: {
                                issued: true,
                                weight: extra.weight,
                                comment: extra.comment
                            }});

                            document.getElementById('card'+index).classList.remove('red');
                            document.getElementById('card'+index).classList.add('green');

                            window.ctrl.route.pop().destroy();
                            window.location.hash = window.ctrl.route.routes.ApplicList;
                            window.ctrl.applicList.component.compvare(items, extra.weight, extra.comment);
                            M.toast({ html: 'Заказ выполнен', classes: 'green' });
                        } else if(extra.weight == ''){
                            M.toast({ html: 'Не введен вес!', classes: 'red' });
                        } else if(extra.comment == ''){
                            M.toast({ html: 'Не введен комментарий!', classes: 'red' });
                        }
                    } else {
                        M.toast({ html: 'Не все товары приняты!', classes: 'red' });
                    }
                }
            }
        },{
            name: 'notIssued',
            function: async (itemId, index) => {
                console.log(itemId);
                var extra = ItemModalCtrl.get('extra');
                var items = ItemModalCtrl.get('items').map(function(item){
                    if(item.id == itemId){ 
                        if(typeof(item.issued) == 'undefined' || ItemModalCtrl.get('startState')){
                            issuedCount++
                        }
                        item.issued = false;
                    }
                    return item;
                });
                ItemModalCtrl.set({items: items});

                console.log(issuedCount);

                document.getElementById('card'+index).classList.remove('green');
                document.getElementById('card'+index).classList.add('red');

                if(issuedCount == items.length && extra.issued){
                    if(extra.weight != '' && extra.comment != ''){
                        window.ctrl.route.pop().destroy();
                        window.location.hash = window.ctrl.route.routes.ApplicList;
                        window.ctrl.applicList.component.compvare(items, extra.weight, extra.comment);
                        M.toast({ html: 'Заказ выполнен', classes: 'green' });
                    } else if(extra.weight == ''){
                        M.toast({ html: 'Не введен вес!', classes: 'red' });
                    } else if(extra.comment == ''){
                        M.toast({ html: 'Не введен комментарий!', classes: 'red' });
                    }
                } else {
                    var firstItemOffsetLeft = document.getElementsByClassName('card-panel')[0].offsetLeft - 5;
                    await sleep(250);
                    for(var i=mainEl.scrollLeft; i<document.getElementById('card'+(index+1)).offsetLeft-firstItemOffsetLeft; i+=6){
                        mainEl.scrollLeft = i;
                        await sleep(1);
                    }
                }
            }
        }, {
            name: 'close',
            function: () => {
                window.ctrl.route.pop().destroy();
                window.location.hash = window.ctrl.route.routes.ApplicList;
            }
        }, {
            name: 'issuedPartQuantityChange',
            function: (itemId, action) => {
                var items;
                if(action == 'plus'){
                    items = ItemModalCtrl.get('items').map(function(item){
                        if(item.id == itemId && item.issuedPartQuantity < item.quantity) item.issuedPartQuantity += 1;
                        return item;
                    });
                } else {
                    items = ItemModalCtrl.get('items').map(function(item){
                        if(item.id == itemId && item.issuedPartQuantity > 1) item.issuedPartQuantity -= 1;
                        return item;
                    });
                }
                ItemModalCtrl.set({items: items});
            }
        }, {
            name: 'showDenialBtns',
            function: () => {
                var el = document.getElementById('denial-block');
                TweenLite.to(el, 0.15, {bottom: '0'});
            }
        }]
    });

    return ItemModalCtrl;
})));