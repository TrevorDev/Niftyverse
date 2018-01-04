console.log("here")

//need to use chrome. instead of browser. because chrome is so shit that they wont update to use browser
chrome.tabs.executeScript({file: "/inject.js"}).then(()=>{console.log("finished")})