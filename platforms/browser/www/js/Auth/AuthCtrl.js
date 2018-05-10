(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.AuthCtrl = factory());
}(this, (function () {
    'use strict';

    let component = null;
    window.token = localStorage.getItem('token');

    let checkAuth = async () => {
        let bool = true;
        if(navigator.onLine){
            if (!token) {
                bool = false;
            } else {
                const authRequest = await fetch(`http://fondo.ru/api/auth?token=${window.token}`)
                    .then(r => {
                        r.json().then( data => { console.log('auth', data) });
                        if (r.status != 200) bool = false;
                    })
                    .catch(e => {
                        bool = false;
                    });
            }
        } else {
            bool = true;
        }

        return bool;
    }

    let login = async function (email, password) {
        const authRequest = await fetch(`http://fondo.ru/api/auth?email=${email}&password=${password}`, { method: 'POST' })
            .then(r => {
                if (r.status == 200) {
                    r.json().then(data => { window.token = data.token; localStorage.setItem('token', window.token); });
                    window.ctrl.route.pop().destroy();
                    window.location.hash = window.ctrl.route.routes.ApplicList;
                } else {
                    AuthCtrl.set({ progress: false });
                    M.toast({ html: 'Ошибка! Пользователь не найден!', classes: 'red' });
                }
            })
            .catch(e => {
                console.error(e);
            });
    }

    async function onCtrlReady() {
        await checkAuth().then(auth => {
            if (auth) {
                window.location.hash = window.ctrl.route.routes.ApplicList;
                AuthCtrl.break = true;
            }
        });
    }

    let AuthCtrl = new SvelteController(AuthComponent, {
        onCtrlReady: onCtrlReady,
        data: {
            email: "",
            password: "",
            progress: false
        },
        methods: [{
            name: 'login',
            function: () => {
                AuthCtrl.set({ progress: true });
                login(AuthCtrl.get('email'), AuthCtrl.get('password'));
            }
        }]
    });

    return AuthCtrl;
})));