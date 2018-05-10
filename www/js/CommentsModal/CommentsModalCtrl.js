(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CommentsModalCtrl = factory());
}(this, (function () { 'use strict';
    let modal = document.getElementById('modal'); 
    let cover = document.getElementById('cover'); 

    async function onCtrlReady(){
        cover.style.setProperty('display', 'block');
        await sleep(50);
        modal.classList.add('depth-modal');
        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0.5)');
    }

    async function preloader(){
        await sleep(50);

        if(document.getElementById('head-sticky')){
            document.getElementById('head-sticky').style.setProperty('transform', 'translate3d(0, 0, 0)');
        }

        if(window.store.comments){
            CommentsModalCtrl.set({ comments: window.store.comments, files: [], newComment: '' });
            await sleep(100);
            for(var i=0; i < document.getElementsByClassName('comment').length; i++){
                document.getElementsByClassName('comment')[i].style.setProperty('transform', 'translate3d(0, 0, 0)');
                await sleep(50);
            }
        } else {
            CommentsModalCtrl.set({ files: window.store.files, comments: [] });
            await sleep(100);
            for(var i=0; i < document.getElementsByClassName('file').length; i++){
                document.getElementsByClassName('file')[i].style.setProperty('transform', 'translate3d(0, 30px, 0)');
                await sleep(50);
            }
        }

        CommentsModalCtrl.set({ applicId: window.store.applicId });
    }

    async function predestroyer(){
        if(document.getElementById('head-sticky')){
            document.getElementById('head-sticky').style.setProperty('transform', 'translate3d(0,-'+document.querySelector('#head-sticky').offsetHeight*2+'px, 0)');
        }

        if(document.querySelector('.comment-add')){
            document.querySelector('.comment-add').style.setProperty('transform', 'translate3d(0,'+document.querySelector('.comment-add').offsetHeight+'px, 0');
        }

        if(document.querySelector('.file-add')){
            document.querySelector('.file-add').style.setProperty('transform', 'translate3d(0,'+document.querySelector('.file-add').offsetHeight+'px, 0');
        }

        if(window.store.comments){
            for(var i=document.getElementsByClassName('comment').length - 1; i >= 0; i--){
                document.getElementsByClassName('comment')[i].style.setProperty('transform', 'translate3d(0, 100vh, 0)');
                await sleep(50);
            }
        } else {
            for(var i=document.getElementsByClassName('file').length - 1; i >= 0; i--){
                document.getElementsByClassName('file')[i].style.setProperty('transform', 'translate3d(100vw, 30px, 0)');
                await sleep(50);
            }
        }

        await sleep(200);

        cover.style.setProperty('background-color', 'rgba(0, 0, 0, 0)');
        await sleep(200);
        modal.classList.remove('depth-modal');
        cover.style.setProperty('display', 'none');
    }

    let CommentsModalCtrl = new SvelteController(CommentsModalComponent, {
        globalName: 'applicModal',
        onCtrlReady: onCtrlReady,
        preloader: preloader,
        predestroyer: predestroyer,
        target: document.getElementById('modal-content'),
        data: {
            comments: window.store.comments ? window.store.comments : [],
            files: window.store.files ? window.store.files : [],
            applicId: window.store.applicId
        },
        methods: [{
            name: 'close',
            function: () => {
                window.ctrl.route.pop().destroy();
                window.location.hash = window.ctrl.route.routes.ApplicList;
            }
        }, {
            name: 'downloadFile',
            function: fileId => {
                M.toast({ html: 'downloadFile' });
                function error() {
                    M.toast({ html: 'WRITE_EXTERNAL_STORAGE is not turned on' });
                }
                
                function success( status ) {
                    if( !status.hasPermission ) error();
                    M.toast({ html: 'WRITE_EXTERNAL_STORAGE is turned on' });
                    var fileTransfer = new FileTransfer();
                    var uri = encodeURI('http://fondo.ru/api/v1/dl/'+fileId+'?token='+window.token);
                    var fileURL =  "///storage/emulated/0/DCIM/myFile.xls";

                    fileTransfer.download(
                        uri, fileURL, function(entry) {
                            M.toast({ html: entry.toURL() });
                            cordova.plugins.fileOpener2.open(
                                entry.toURL(),
                                'application/vnd.ms-excel',
                                { 
                                    error : function(e) { 
                                        M.toast({ html: 'Error status: ' + e.status + ' - Error message: ' + e.message });
                                    },
                                    success : function () {
                                        M.toast({ html: 'file opened successfully' });			
                                    }
                                }
                            );
                        },
                            
                        function(error) {
                            M.toast({ html: "download error source " + error.source });
                            M.toast({ html: "download error target " + error.target });
                            M.toast({ html: "download error code" + error.code });
                        },
                            
                        false, {
                            headers: {
                                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                            }
                        }
                    );

                }

                cordova.plugins.permissions.requestPermission(cordova.plugins.permissions.WRITE_EXTERNAL_STORAGE, success, error);

                // downloader.init({folder: "testApp"});

                // var url = 'http://fondo.ru/api/v1/dl/'+fileId+'?token='+window.token;
                // fetch(url).then( r => {
                //     r.blob().then( blob => {
                //         var reader = new FileReader();
                //         reader.onload = function(e){
                //             downloader.get(reader.result);
                //         }
                //         reader.readAsDataURL(blob);
                //         downloader.get(blob);
                //     });
                // });

                // downloader.get(url);
            }
        }, {
            name: 'add',
            function: async type => {
                if(!type){
                    if(CommentsModalCtrl.get('comments').length > 0){
                        CommentsModalCtrl.set({ addComment: true });
                    } else {
                        CommentsModalCtrl.set({ addFile: true });
                    }

                    if(document.querySelector('.comment-add')){
                        document.querySelector('.comment-add').style.setProperty('transform', 'translate3d(0, 0, 0)');;
                    }
                } else if(type == 'comment'){
                    console.log('fsaga');
                    var newComment = CommentsModalCtrl.get('newComment');
                    CommentsModalCtrl.set({ 
                        comments: CommentsModalCtrl.get('comments').concat([{
                            comment: newComment,
                            user: {
                                full_name: 'Вы'
                            },
                            created_at: 'сейчас'
                        }]),
                        newComment: '',
                        addComment: null
                    });
                    
                    document.getElementsByClassName('comment')[document.getElementsByClassName('comment').length - 1].style.setProperty('transform', 'translate3d(0, 0, 0)');
                    
                    window.ctrl.applicList.component.createComment(newComment);
                } else if(type == 'file'){
                    var form = new FormData(document.getElementById('file-form'));
                    console.log(form);
                    fetch("http://fondo.ru/api/v1/tools/upload?token="+window.token, {
                        method: "POST",
                        body: form
                    }).then(r => {
                        console.log(r);
                        console.log(r.json());
                    });
                }
            }
        }]
    });

    return CommentsModalCtrl;
})));