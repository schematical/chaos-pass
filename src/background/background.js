//const ChaosSFTP = require('./chaos-sftp');
import ChaosPass from '../chaos-pass';
let chaosPass = new ChaosPass(chrome);
chaosPass.init();
/*chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });

    var rule1 = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                //pageUrl: {  },
                css: ["input[type='password']"]
            })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
    };

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
        console.log("Rule Added");
    });
    chrome.contextMenus.create({
        title: "ChaosPass",
        id: "ChaosPass",
       /!* onclick:(info, tab)=>{
            console.log("CLICKED")
        }*!/
    },function(){
console.log("Context Menu Created");
    });
    chrome.contextMenus.onClicked.addListener((info, tab)=>{
        console.log("CLICKED", info, tab);
    });
    chrome.runtime.onMessage.addListener(function(req, sender) {
        console.log("Password: ", req, sender);
        if(req.password){
            let p = new Promise((resolve, reject)=>{
                chrome.storage.sync.get("chaos-sftp-creds", function(config) {
                    console.log("The color is green.");
                });
            })
        }

        /!*
        // chrome.pageAction.setPopup({popup: "popup.html", tabId: sender.tab.id});
        chrome.pageAction.show(sender.tab.id);
        // chrome.browserAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id, title: req.text});*!/
    });
});*/
