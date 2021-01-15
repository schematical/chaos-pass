
var pass = '';
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz0123456789@#$';

for (i = 1; i <= 16; i++) {
    var char = Math.floor(Math.random()
        * str.length + 1);

    pass += str.charAt(char)
}
let arrInputs = document.getElementsByTagName("input");

for(let i = 0; i < arrInputs.length; i++){
    let input = arrInputs[i];
    if(input.type == 'password'){
        input.value = pass;
        console.log("FOUND ONE!", input);
    }
}
chrome.runtime.sendMessage({ password: pass })
