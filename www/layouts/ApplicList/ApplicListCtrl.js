var applicListComponent;
var applicListCtrl = {
    init: function(){
        applicListComponent = new ApplicListComponent({
            target: document.getElementById('main'),
            data: {
                applics: [{}]
            }
        });
    },
    new: function() {
        console.log('new');
        applicListComponent.set({ applics: applicListComponent.get('applics').concat([{}]) });
    }
}