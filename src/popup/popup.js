import ChaosPass from "../chaos-pass";
let chaosPass = new ChaosPass(chrome);
chaosPass.hasCreds()
    .then((hasCreds)=>{
        if(!hasCreds){
            $("#divMain").hide();
            $("#setupCredentials").show();
        }
    })
$("#btnSave").click((event)=> {
    event.preventDefault();
    let config = {
        "enc":{
            "pem": $("#txtEncPem").val()
        },

        "sync_hosts": [
            {
                "type": "sftp",
                "host": $("#txtFtpHost").val(),
                "port": $("#txtFtpPort").val(),
                "username": $("#txtUsername").val(),
                "privateKey": $("#txtFtpPem").val()
            }
        ]
    }

    return chaosPass.setCreds($("#txtLocalCredsEncSecret").val(), config)
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

