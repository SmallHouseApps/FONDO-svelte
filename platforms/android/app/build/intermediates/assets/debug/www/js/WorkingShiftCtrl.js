(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.WorkingShiftCtrl = factory());
}(this, (function () { 'use strict';
    var workShift = localStorage.getItem('workShift') ? JSON.parse(localStorage.getItem('workShift')) : { open: false };
    
    function getShiftInfo(){
        fetch('http://fondo.ru/api/v1/work/check?token='+window.token).then( r => {
            console.log(r);
            r.json().then( data => {
                console.log(data);
                workShift.user = data.user;
                window.ctrl.header.set({ workShiftNotOpen: !data.waybill });
            })
        });
    }

    var WorkingShiftCtrl = {
        isOpen: localStorage.getItem('workShift') ? JSON.parse(localStorage.getItem('workShift')).open : false,

        init: () => {
            console.log('WorkingShiftCtrl ready');

            if(workShift && workShift.timestamp_start){
                if(new Date(workShift.timestamp_start).getDay() != new Date().getDay()){
                    workShift = { open: false };
                }
            }

            if(navigator.onLine){
                getShiftInfo();
            }
            
            
        },

        start: () => {
            console.log('start');
            function onPrompt(results) {
                if(results.buttonIndex == 1){
                    if(results.input1 == ''){
                        M.toast({ html: 'Ожидается ввод спидометра' });
                    } else {
                        if(parseInt(results.input1)){
                            window.ctrl.changesQueue.push('workStart', {
                                work_shift_open: false,
                                speedometr: parseInt(results.input1)
                            }, 'GET');

                            M.toast({ html: 'Смена открыта', classes: 'green' });

                            window.ctrl.header.set({ workShiftNotOpen: false });

                            workShift = {
                                timestamp_start: Date.now(),
                                speedometr_start: results.input1,
                                open: true
                            };

                            var h = new Date(workShift.timestamp_start).getHours(); h = h < 10 ? ( '0' + h ) : h;
                            var m = new Date(workShift.timestamp_start).getMinutes(); m = m < 10 ? ( '0' + m ) : m;

                            workShift.time_start = h + ':' + m;

                            localStorage.setItem('workShift', JSON.stringify(workShift));

                            WorkingShiftCtrl.isOpen = true;

                            console.log(workShift);
                        } else {
                            M.toast({ html: 'Доступен только цифровой ввод' });
                        }
                    }
                }
            }
            
            navigator.notification.prompt(
                'Введите данные спидометра',  // message
                onPrompt,                  // callback to invoke
                'Старт смены',            // title
                ['ОК','Отмена'],             // buttonLabels
                ''                 // defaultText
            );
        },

        end: () => {
            function onPrompt(results) {
                if(results.buttonIndex == 1){
                    if(results.input1 == ''){
                        M.toast({ html: 'Ожидается ввод спидометра' });
                    } else {
                        if(parseInt(results.input1)){
                            if(parseInt(results.input1) - workShift.speedometr_start < 0){
                                M.toast({ html: 'Ошибка: Конечные показатели спидометра меньше начальных', classes: 'red' });
                                return false;
                            }

                            if(parseInt(results.input1) - workShift.speedometr_start > 1000){
                                M.toast({ html: 'Ошибка: Разница между показателями спидометра более 1000км', classes: 'red' });
                                return false;
                            }

                            window.ctrl.changesQueue.push('workEnd', {
                                work_shift_open: true,
                                speedometr: parseInt(results.input1)
                            }, 'GET');

                            M.toast({ html: 'Смена закрыта', classes: 'green' });
                            
                            workShift.timestamp_end = Date.now();
                            workShift.speedometr_end = results.input1;

                            var h = new Date(workShift.timestamp_end).getHours(); h = h < 10 ? ( '0' + h ) : h;
                            var m = new Date(workShift.timestamp_end).getMinutes(); m = m < 10 ? ( '0' + m ) : m;

                            workShift.time_end = h + ':' + m;

                            localStorage.setItem('workShift', JSON.stringify(workShift));
                            window.ctrl.menu.set({ workShift: workShift });
                            window.ctrl.header.set({ workShiftNotOpen: true });
                        } else {
                            M.toast({ html: 'Доступен только цифровой ввод' });
                        }
                    }
                }
            }
            
            navigator.notification.prompt(
                'Введите данные спидометра',  // message
                onPrompt,                  // callback to invoke
                'Конец смены',            // title
                ['ОК','Отмена'],             // buttonLabels
                workShift.speedometr_start                 // defaultText
            );
        },

        getWorkShift: () => {
            return workShift;
        }
    }

    return WorkingShiftCtrl;
})));