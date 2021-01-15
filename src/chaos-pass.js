const Cryptr = require('cryptr');
import ChaosSFTP from "./chaos-sftp";
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
            case('setLocalCredsEncSecret'):
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
    setLocalCredsEncSecret(req, sender){
        if(!req.localCredsEncSecret){
            throw new Error("Missing `localCredsEncSecret`!");
        }
        this.localCredsEncSecret = req.localCredsEncSecret;
    }
    storePassword(req, sender){

        if(!req.password){
            throw new Error("Missing Password!");
        }
        if(!req.host){
            throw new Error("Missing `host`!");
        }
        if(!this.localCredsEncSecret){
            throw new Error("`localCredsEncSecret` has not been set yet");
        }
        let p = this.getCreds(this.localCredsEncSecret)
            .then((creds)=>{
                //Send creds to sftp
                let chaosSftp = new ChaosSFTP(creds);
                return chaosSftp.put(pass, req.host);
            })
            .then((results)=>{
                console.log("Save Success: ", results);
            })
    }
    hasCreds(){
        return new Promise((resolve, reject)=> {
            this.chrome.storage.sync.get("chaos-sftp-creds",  (config) => {
                return resolve(config.creds);
            });
        });
    }
    getCreds(secret){
        return new Promise((resolve, reject)=> {
            this.chrome.storage.sync.get("chaos-sftp-creds",  (config) => {
                console.log("Stored Creds: ", config);
                if(!config.creds){
                    return reject(new Error("No Creds Found"));
                }
                const decrypted = this.getCrytper(secret).decrypt(config.creds)
                try {
                    return resolve(JSON.parse(decrypted));
                }catch(err){
                    return reject(err);
                }
            });
        });
    }
    getCrytper(secret){
        return new Cryptr(secret);
    }

}
export default ChaosPass;
