// ==============
// Helpers
// ==============

const title = function(text) {
    console.log(text.cyan.bold);
}

const info = function(text) {
    text = "==> " + text
    console.log(text.cyan);
}

const simpleInfo = function(text) {
    text = "    " + text
    console.log(text.cyan);
}


module.exports = {
    title,
    info,
    simpleInfo
    
}
