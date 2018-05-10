(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.FilterModalCtrl = factory());
}(this, (function () { 'use strict';
    let modal = document.getElementById('modal');
    let cover = document.getElementById('cover');

    async function onCtrlReady(){
        modal.style.setProperty('width', '100%');
        modal.style.setProperty('background-color', 'rgba(0, 0, 0, 0.5)');
        window.ctrl.header.set({ title: 'Дата', actions: [], type: 'modal', navCategory: false });
    }

    async function preloader(){
        await sleep(50);
        document.getElementById('FilterModalComponent').style.setProperty('transform', 'translate3d(0, 0, 0)');
        FilterModalCtrl.set({
            dateStart: window.ctrl.applicList.get('dateStart'),
            dateEnd: window.ctrl.applicList.get('dateEnd')
        });
    }

    async function predestroyer(){
        var dateStart = FilterModalCtrl.get('dateStart');
        var dateEnd = FilterModalCtrl.get('dateEnd');

        modal.style.setProperty('background-color', 'transparent');
        document.getElementById('FilterModalComponent').style.setProperty('transform', 'translate3d(0, -100%, 0)');
        await sleep(200);
        window.ctrl.header.setStartState(true);
        modal.style.setProperty('width', '0');

        if(dateStart != 'NaN-NaN-NaN' && dateEnd != 'NaN-NaN-NaN'){
            dateStart = dateStart.split('-')[2]+'.'+dateStart.split('-')[1]+'.'+dateStart.split('-')[0];
            dateEnd = dateEnd.split('-')[2]+'.'+dateEnd.split('-')[1]+'.'+dateEnd.split('-')[0];

            console.log(dateStart, window.ctrl.applicList.get('dateStart'));
            if(dateStart != window.ctrl.applicList.get('dateStart') || dateEnd != window.ctrl.applicList.get('dateEnd')){
                window.ctrl.applicList.set({ dateStart: dateStart, dateEnd: dateEnd });
            }
        }
    }

    let FilterModalCtrl = new SvelteController(FilterModalComponent, {
        onCtrlReady: onCtrlReady,
        preloader: preloader,
        data: {
            dateStart: window.ctrl.applicList.get('dateStart'),
            dateEnd: window.ctrl.applicList.get('dateEnd')
        },
        methods: [{
            name: 'close',
            function: window.ctrl.header.component.close
        }],
        observes: [{
            item: 'dateStart',
            function: dateStart => {
                if(FilterModalCtrl.get('dateEnd') < dateStart){
                    FilterModalCtrl.set({ dateEnd: dateStart });
                }
            }
        }, {
            item: 'dateEnd',
            function: dateEnd => {
                if(FilterModalCtrl.get('dateStart') > dateEnd){
                    FilterModalCtrl.set({ dateStart: dateEnd });
                }
            }
        }],
        predestroyer: predestroyer,
        target: document.getElementById('modal-content')
    });

    return FilterModalCtrl;
})));