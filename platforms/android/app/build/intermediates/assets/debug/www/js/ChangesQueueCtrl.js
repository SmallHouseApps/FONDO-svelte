(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.changesQueue = factory());
}(this, (function () { 'use strict';
    var queu = localStorage.getItem('ChangesQueue') ? JSON.parse(localStorage.getItem('ChangesQueue')) : [];

    async function request(url, data = null, method = 'POST'){
        var requestData = '';

        if(data){
            requestData = '?';
            for(var key in data){
                if(requestData == '?'){
                    requestData += key + '=' + data[key];
                } else {
                    requestData += '&' + key + '=' + data[key];
                }
            }
        }

        await fetch(url+requestData, { method: method }).then(r => {
            localStorage.setItem('ChangesQueue', queu);
        }).catch(e => {
            localStorage.setItem('ChangesQueue', queu);
        });
    }

    var checkConnection = setInterval(function(){
        if(queu.length > 0){
            if(navigator.onLine){
                var change = queu.shift();
                var requestData = {}; var url;
                requestData.token = window.token;

                switch (change.type){
                    case 'items':
                        url = 'http://fondo.ru/api/v1/application/list/'+change.applicId+'/items/action';
                        requestData.items = JSON.stringify(change.items);
                        requestData.weight = change.weight;
                        requestData.comment = change.comment;
                        break;
                    case 'comments':
                        url = 'http://fondo.ru/api/v1/application/list/'+change.applicId+'/comment';
                        requestData.comment = change.comment.text;
                        requestData.type = change.comment.type;
                    case 'workStart':
                        url = 'http://fondo.ru/api/v1/work/start';
                        requestData.speedometr = change.speedometr;
                        requestData.work_shift_open = change.work_shift_open;
                        break;
                    case 'workEnd':
                        url = 'http://fondo.ru/api/v1/work/end';
                        requestData.speedometr = change.speedometr;
                        requestData.work_shift_open = change.work_shift_open;
                        break;
                    default:
                        break;
                }

                request(url, requestData, change.method);
            }
        }
    }, 1000);

    var changesQueue = {
        init: () => {
            console.log('changesQueue ready');
        },
        push: (type, changeObj, method = 'POST') => {
            changeObj.method = method;
            changeObj.type = type;
            queu.push(changeObj);
            localStorage.setItem('ChangesQueue', JSON.stringify(queu));
        }
    }

    window.ctrl.changesQueue = changesQueue;

    return changesQueue;
})));