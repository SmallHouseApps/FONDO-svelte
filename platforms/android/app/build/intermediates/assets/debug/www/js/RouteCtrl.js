(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.RouteCtrl = factory());
}(this, (function () { 'use strict';

    let navigator = [];

    let hashChangeListener = () => {
        let parts = window.location.hash.split('/'); let location = '';
        if(parts.indexOf('destroy') != -1){
            navigator.pop().destroy();
            parts = parts.filter(part => part != 'destroy');
        }

        for(let i = 0; i < parts.length; i++){
            if(i != parts.length - 1){
                location += parts[i] + '/';
            } else {
                location += parts[i];
            }
        }

        for(let key in RouteCtrl.routes){
            if(location == RouteCtrl.routes[key]){
                requirejs([key+"/"+key+"Component"], function(component) {
                    requirejs([key+"/"+key+"Ctrl"], function(ctrl) {
                        if(navigator.indexOf(ctrl) == -1){
                            navigator.push(ctrl);
                            ctrl.init();
                        }
                    });
                });
            }
        }
    };
    
    let RouteCtrl = {
        routes: {
            Auth: '#auth',
            ApplicList: '#applic/list',
            Menu: '#menu',
            Map: '#map',
            FilterModal: '#modal/filter',
            ApplicModal: '#modal/applic',
            ItemCards: '#modal/applic/items',
            CommentsModal: '#modal/comments'
        },
        init: () => {
            window.addEventListener("hashchange", hashChangeListener, false);
        },
        pop: () => {
            console.log(navigator);
            return navigator.pop();
        }
    }

    return RouteCtrl;
})));