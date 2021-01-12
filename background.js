chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
        console.log("The color is green.");
    });

    var rule1 = {
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {  },
                css: ["input[type='password']"]
            })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
    };

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
        console.log("Rule Added");
    });
    chrome.runtime.onMessage.addListener(function(req, sender) {
        console.log("Message: ", req, sender);
        // chrome.pageAction.setPopup({popup: "popup.html", tabId: sender.tab.id});
        chrome.pageAction.show(sender.tab.id);
        // chrome.browserAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id, title: req.text});
    });
});
