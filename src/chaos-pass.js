import Cryptr from 'cryptr';
import ChaosSFTP from "./chaos-sftp";
const MODES = {
    BACKGROUND:"BACKGROUND",
    POPUP: "POPUP"
}
class ChaosPass{
    constructor(chrome) {
        this._p = {};
        this._pCount = 0;
        this.chrome = chrome;
    }
    initBackground(){
        if(this._mode){
            throw new Error("Mode already set: " + this._mode);
        }
        this._mode = MODES.BACKGROUND;
        this._localCredsEncSecret = null;
        this.chrome.runtime.onInstalled.addListener(this.onInstalled.bind(this))
    }
    initPupup(){
        if(this._mode){
            throw new Error("Mode already set: " + this._mode);
        }
        this._mode = MODES.POPUP;

        this.chrome.runtime.onMessage.addListener(
            this.onMessage.bind(this)
        );
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
        if(req.pId) {
            req.respond = (data) => {
                chrome.runtime.sendMessage(
                    sender.id,
                    {
                        action: 'onMessageResponse',
                        pId: req.pId,
                        data: data
                    },
                    (response)=>{
                        console.log("RESPONSE: ", response);
                    }
                );
            }
        }
        if(!this[req.action]){
            throw new Error("onMessage - No ChaosPass method named: " + req.action);
        }
        switch(req.action){
            case('onMessageResponse'):
            case('storePassword'):
            case('setLocalCredsEncSecret'):
            case('requestLocalCredsEncSecret'):

                this[req.action](req, sender);
                break;
            case('serverSetLocalCredsEncSecret'):
                if(this._mode !== MODES.BACKGROUND){
                    throw new Error("Invalid mode `" + this._mode + "` calling BACKEND function: " + req.action);
                }
                this[req.action](req, sender);
                break;
            default:
                throw new Error("Invalid `onMessage`: " + req.action);
        }

        /*
        // chrome.pageAction.setPopup({popup: "popup.html", tabId: sender.tab.id});
        chrome.pageAction.show(sender.tab.id);
        // chrome.browserAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id, title: req.text});*/
    }
    sendMessageWithResponse(data){
        if(this._mode === MODES.BACKGROUND){
            throw new Error("Background should not be calling this. Invalid mode: " + this._mode);
        }
        this._pCount += 1;
        let pId = this._pCount;
        data.pId = pId;
        return new Promise((resolve, reject)=>{
            this._p[pId] = {
                resolve: resolve,
                reject: reject
            }
            this.chrome.runtime.sendMessage(data);
        })
    }

    onMessageResponse(req, sender){
        if(!req.pId){
            throw new Error("Missing `pId`");
        }
        if(!this._p[req.pId]){
            throw new Error("Missing `pId`: " + req.pId);
        }
        this._p[req.pId].resolve(req.data);
        delete(this._p[req.pId]);
    }
    requestLocalCredsEncSecret(req, sender){
        if(this._mode !== MODES.BACKGROUND){
            throw new Error("Background function called while setup in an invalid mode: " + this._mode);
        }
        req.respond(this._localCredsEncSecret);
    }


    setLocalCredsEncSecret(localCredsEncSecret){
        if(this._mode === MODES.BACKGROUND){
            return Promise.resolve(this._localCredsEncSecret);
        }
        return this.sendMessageWithResponse({
            action:'serverSetLocalCredsEncSecret',
            localCredsEncSecret: localCredsEncSecret
        })
    }
    serverSetLocalCredsEncSecret(req, sender){
        if(this._mode !== MODES.BACKGROUND){
            throw new Error("Invalid `mode`: " + this._mode);
        }
        if(!req.localCredsEncSecret){
            throw new Error("Missing `localCredsEncSecret`!");
        }
        this._localCredsEncSecret = req.localCredsEncSecret;
        return req.respond({"success":true});
    }
    getLocalCredsEncSecret(){
        if(this._mode === MODES.BACKGROUND){
            return Promise.resolve(this._localCredsEncSecret);
        }
        return this.sendMessageWithResponse({
            action:'requestLocalCredsEncSecret'
        })
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
        let p = this.getCreds()
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
            this.chrome.storage.local.get("chaos-sftp-creds",  (config) => {
                return resolve(config["chaos-sftp-creds"] ? true : false);
            });
        });
    }
    getCreds(){
        return this.getLocalCredsEncSecret()
            .then((localCredsEncSecret)=> {
                return new Promise((resolve, reject) => {
                    if(!localCredsEncSecret){
                        return reject("`localCredsEncSecret` has not yet been set. MODE: " + this._mode);
                    }
                    this.chrome.storage.local.get("chaos-sftp-creds", (config) => {
                        console.log("Stored Creds: ", config);
                        if (!config["chaos-sftp-creds"]) {
                            return reject(new Error("No Creds Found"));
                        }
                        const decrypted = this.getCrytper(localCredsEncSecret).decrypt(config["chaos-sftp-creds"]);
                        try {
                            return resolve(JSON.parse(decrypted));
                        } catch (err) {
                            return reject(err);
                        }
                    });
                });
            });
    }
    setCreds(config){
        return this.getLocalCredsEncSecret()
            .then((localCredsEncSecret)=> {
                return new Promise((resolve, reject)=> {
                    const encrypted = this.getCrytper(localCredsEncSecret).encrypt(JSON.stringify(config));
                    this.chrome.storage.local.set(
                        { "chaos-sftp-creds": encrypted },
                        (response) => {
                            try {
                                return resolve(response);
                            }catch(err){
                                return reject(err);
                            }
                        }
                    );
                });
            });
    }
    clearCreds(){

        return new Promise((resolve, reject)=> {

            this.chrome.storage.local.set(
                { "chaos-sftp-creds": null },
                (response) => {
                    try {
                        return resolve(response);
                    }catch(err){
                        return reject(err);
                    }
                }
            );
        });
    }
    savePassword(req, sender){
        console.log("TODO: Send FTP");
    }
    getCrytper(secret){
        return new Cryptr(secret);
    }

}
export default ChaosPass;
