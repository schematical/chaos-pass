class ChaosPass{
    constructor(chrome) {
        this.chrome = chrome;
    }
    init(){
        this.chrome.runtime.onInstalled.addListener(this.onInstalled.bind(this))
    }
    onInstalled(){

         this.chrome.declarativeContent.onPageChanged.removeRules(undefined, ()=> {
            this.chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        //pageUrl: {  },
                        css: ["input[type='password']"]
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }]);
            console.log("Rule Added");
        });
        this.chrome.contextMenus.create({
            title: "ChaosPass",
            id: "ChaosPass",
            /* onclick:(info, tab)=>{
                 console.log("CLICKED")
             }*/
        },function(){
            console.log("Context Menu Created");
        });
        this.chrome.contextMenus.onClicked.addListener(this.onContextClicked.bind(this));
        this.chrome.runtime.onMessage.addListener(this.onMessage.bind(this));

    }
    onContextClicked(info, tab){
        console.log("CLICKED", info, tab);
    }
    onMessage(req, sender) {
        if(!req.action){
            throw new Error("Missing `req.message` in `onMessage");
        }
        switch(req.action){
            case('storePassword'):
                this[req.action](req, sender);
            default:
                throw new Error("Invalid `onMessage`: " + req.action);
        }

        /*
        // chrome.pageAction.setPopup({popup: "popup.html", tabId: sender.tab.id});
        chrome.pageAction.show(sender.tab.id);
        // chrome.browserAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id, title: req.text});*/
    }
    storePassword(req, sender){
        console.log("Password: ", req, sender);
        if(!req.password){
            throw new Error("Missing Password!");
        }
        let p = new Promise((resolve, reject)=>{
            this.chrome.storage.sync.get("chaos-sftp-creds", function(config) {
                console.log("Stored Creds: ", config);
            });
        })
    }
}
export default ChaosPass;
