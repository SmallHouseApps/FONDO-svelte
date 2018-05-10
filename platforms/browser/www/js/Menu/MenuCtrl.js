(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.MenuCtrl = factory());
}(this, (function () {
    'use strict';
    var modal = document.getElementById('modal'); var timer;
    var cover = document.getElementById('cover'); var startScrollLeft;

    document.getElementById('menu').addEventListener('touchstart', function(e){
        startScrollLeft = e.targetTouches[0].clientX;
    });

    document.getElementById('menu').addEventListener('touchend', function(e){
        if(e.changedTouches[0].clientX < startScrollLeft){
            window.location.href = '#!/destroy';
        } else {
            console.log(document.getElementById('menu').scrollLeft);

            var start = document.getElementById('menu').scrollLeft;
            var interval =setInterval(function(){
                document.getElementById('menu').scrollTo(start, 0);
                start -= 4;
                console.log(start);
                if(start <= 0) clearInterval(interval);
            }, 1);
            
        }
    });

    async function onCtrlReady() {
        cover.style.setProperty('display', 'block');
        await sleep(50);
        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0.5)');
        cover.addEventListener('click', function () {
            window.location.href = '#!/destroy';
        })
    }

    async function preloader() {
        await sleep(50);
        document.querySelector('.sidenav').style.setProperty('transform', 'translate3d(0, 0, 0)');
        
        
        clearInterval(timer);
        function tick(){
            var workTime = new Date(Date.now() - window.ctrl.work.getWorkShift().timestamp_start);

            var h = workTime.getHours() - 3; h = h < 10 ? ( '0' + h ) : h;
            var m = workTime.getMinutes(); m = m < 10 ? ( '0' + m ) : m;
            var s = workTime.getSeconds(); s = s < 10 ? ( '0' + s ) : s;
            
            MenuCtrl.set({ workTime: h + ':' + m + ':' + s });
        }
        tick();
        timer = setInterval(tick, 1000);

        MenuCtrl.set({ workShift: window.ctrl.work.getWorkShift() });
    }

    async function predestroyer() {
        clearInterval(timer);
        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0)');
        document.querySelector('.sidenav').style.setProperty('transform', 'translate3d(-105%, 0, 0)');
        await sleep(200);
        cover.style.setProperty('display', 'none');
    }

    var MenuCtrl = new SvelteController(MenuComponent, {
        globalName: 'menu',
        onCtrlReady: onCtrlReady,
        preloader: preloader,
        data: {
            workShift: window.ctrl.work.getWorkShift(),
            workTime: 0
        },
        methods: [{
            name: 'endWork',
            function: () => {
                window.ctrl.work.end();
                console.log('gasgas', window.ctrl.work.getWorkShift());
            }
        }, {
            name: 'hideNav',
            function: e => {
                if (!startScrollLeft) startScrollLeft = e.target.scrollLeft;
                
            }
        }],
        observes: [{
            item: 'workShift',
            function: workShift => {
                console.log(workShift);
                if(workShift.speedometr_end){
                    clearInterval(timer);
                    MenuCtrl.set({ workTime: null });
                }
            }
        }],
        predestroyer: predestroyer,
        target: document.getElementById('menu')
    });

    return MenuCtrl;
})));