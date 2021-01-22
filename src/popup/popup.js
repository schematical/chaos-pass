import ChaosPass from "../chaos-pass";
let chaosPass = new ChaosPass(chrome);
chaosPass.initPupup();
chaosPass.hasCreds()
    .then((hasCreds)=>{
        $("#divMain").hide();
        $('#divCacheLocalCredsEncSecret').hide();
        $("#setupCredentials").hide();
        if(!hasCreds){
            $("#setupCredentials").show();
        }else{
            return chaosPass.getLocalCredsEncSecret()
                .then((localCredsEncSecret)=>{
                    if(!localCredsEncSecret){
                        $('#divCacheLocalCredsEncSecret').show();
                        return;
                    }
                });
        }
    })

$("#btnCacheLocalCredsEncSecret").click((event)=> {
    event.preventDefault();
    return chaosPass.setLocalCredsEncSecret( $("#txtLocalCredsEncSecretMain").val())
    .then(()=> {
        return chaosPass.getCreds();
    })
    .then((config)=>{
        console.log("GetCreds Successfully: ", config);
        $("#divMain").show();
        $('#divCacheLocalCredsEncSecret').hide();
    })
    .catch((err) => {
        console.error("ERROR: ", err);
    })
});
$("#btnClearCreds").click((event)=> {
    event.preventDefault();
    return chaosPass.clearCreds()
        .then(()=>{
            $("#setupCredentials").hide();
            $('#divCacheLocalCredsEncSecret').hide();
        })

});
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
    return chaosPass.setLocalCredsEncSecret($("#txtLocalCredsEncSecret").val())
        .then(()=>{
            return chaosPass.setCreds(config)
        }).then(()=>{
            $("#divMain").show();
            $("#setupCredentials").hide();
        })
        .catch((err)=>{
            throw err;
        })
});
$("#btnSuggestPassword").click((event)=>{
    event.preventDefault();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                file: 'dist/genPassword.js'
            });

    });
});

