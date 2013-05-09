initialize();

// onTicTacToeLoad
// Loads data and prepares scene
function initialize() {
    // Load TicTactToe endgame dataset
    var endgames = loadTicTacToeData();
}

// loadTicTacToeData
// loads datafile from data/tic-tac-toe.data.txt
//
// @returns endgames [ARRAY of ARRAYS of STRINGS], with each
// subarray containing 10 elements: the first nine configurations
// {x, o, b}, and the final {positive, negative} 
function loadTicTacToeData() {
    // Load data
    var data = [];
    var loadTTT = new XMLHttpRequest();
    loadTTT.onreadystatechange = function() {
        if (loadTTT.readyState === 4) {
        }
    };
    loadTTT.open("GET", "data/tic-tac-toe.data.txt", false);
    loadTTT.send();

    // Parse data except for hanging newline
    var text = loadTTT.responseText.split("\n");
    text.pop();
    for (var row = 0; row < text.length; row++) {
        data.push(text[row].split(","));
    }
    return data;
}
