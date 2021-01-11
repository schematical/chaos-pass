console.log("Running:", document.location);
let eleInput = jQuery("input[type='password']");
console.log(eleInput);
eleInput.on('change', function (event){
    console.log("CHANGE");
})

$(document).on('change', "input[type='password']", function(event){
    console.log("CHANGE 2");
    chrome.runtime.sendMessage({ text: "Hello from the webpage!"})
})
$( window ).on( "unload", function() {
    console.log("!!!!!!", eleInput.val());
});
