import ChaosPass from "../chaos-pass";
let chaosPass = new ChaosPass(chrome);
chaosPass.hasCreds()
    .then((config)=>{
        if(!config.creds){
            $("#divMain").hide();
            $("#setupCredentials").show();
        }
    })
$("#btnSuggestPassword").click((event)=> {
    let config = {
        "enc":{
            "pem": $("#txtEncPem").value()
        },

        "sync_hosts": [
            {
                "type": "sftp",
                "host": $("#txtFtpHost").value(),
                "port": $("#txtFtpPort").value(),
                "username": $("#txtUsername").value(),
                "privateKey": $("#txtFtpPem").value()
            }
        ]
    }

    return chaosPass.setCreds($("#txtLocalCredsEncSecret").value(), config)
        .then(()=>{
            $("#divMain").show();
            $("#setupCredentials").hide();
        })
        .catch((err)=>{
            throw err;
        })
});
$("#btnSuggestPassword").click((event)=>{
    chrome.runtime.sendMessage({
        action: "setLocalCredsEncSecret",
        localCredsEncSecret: $("#txtLocalCredsEncSecretMain").value()
    })
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                file: 'src/genPassword.js'
            });

    });
});

