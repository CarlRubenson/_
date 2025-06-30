const boardTemplates = {
    "Basic": [
        [0,0,0,0,0,0,0,0],  
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,2,1,0,0,0],
        [0,0,0,1,2,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ],
    "Octagon": [        
        [ , , ,0,0,0,0,, , ],  
        [ , ,0,0,0,0,0,0, , ],  
        [ ,0,0,0,0,0,0,0,0, ],  
        [0,0,0,0,0,0,0,0,0,0],  
        [0,0,0,0,2,1,0,0,0,0],  
        [0,0,0,0,1,2,0,0,0,0],  
        [0,0,0,0,0,0,0,0,0,0],  
        [ ,0,0,0,0,0,0,0,0, ],  
        [ , ,0,0,0,0,0,0, , ],  
        [ , , ,0,0,0,0, , , ]
    ],
    "Jumbo": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    "H": [
        [0,0,0, , ,0,0,0],  
        [0,0,0, , ,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,2,1,0,0,0],
        [0,0,0,1,2,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0, , ,0,0,0],
        [0,0,0, , ,0,0,0]
    ],
    "X": [
        [0,0,0,0,0,0,0,0],  
        [0, ,0,0,0,0, ,0],
        [0,0, ,0,0, ,0,0],
        [0,0,0,2,1,0,0,0],
        [0,0,0,1,2,0,0,0],
        [0,0, ,0,0, ,0,0],
        [0, ,0,0,0,0, ,0],
        [0,0,0,0,0,0,0,0]
    ],
    "Dotted Edges": [
        [1,2,1,2,1,2,1,2],  
        [2,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,2],
        [2,0,0,2,1,0,0,1],
        [1,0,0,1,2,0,0,2],
        [2,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,2],
        [2,1,2,1,2,1,2,1]
    ],
    "Diamond": [
        [ , ,0,0,0,0, , ],  
        [ ,0,0,0,0,0,0, ],
        [0,0,0,0,0,0,0,0],
        [0,0,0,2,1,0,0,0],
        [0,0,0,1,2,0,0,0],
        [0,0,0,0,0,0,0,0],
        [ ,0,0,0,0,0,0, ],
        [ , ,0,0,0,0, , ],
    ],
    "Mini": [
        [0,0,0,0],
        [0,1,2,0],
        [0,2,1,0],
        [0,0,0,0]
    ],
    "Micro": [
        [0,0,0],
        [0,1,2],
        [0,2,1],
    ],
}


const aiType = {
    "Human": () => { console.log("Beep boop"); },

    // Will just select a random possible move
    "Random": function (possibleCells){
        let move = Math.floor(Math.random() * possibleCells.length);
        return possibleCells[move];
    },

    // Will sort possible moves by attack dimensions and pick a random one of the best ones at the moment
    "Random Edge": function (possibleCells){
        let sortedPossible = possibleCells.map(cell => {
            return [getAttackDimensions(cell), cell];
        });

        sortedPossible.sort((a,b) => {
            if (a[0] == b[0]) return Math.random() - 0.5;
            else return a[0] - b[0];
        })

        return sortedPossible[0][1];
    },

    // Will sort possible moves by attack dimensions and pick a random one of the best ones at the moment
    "Random Center": function (possibleCells){
        let sortedPossible = possibleCells.map(cell => {
            return [getAttackDimensions(cell), cell];
        });

        sortedPossible.sort((a,b) => {
            if (a[0] == b[0]) return Math.random() - 0.5;
            else return b[0] - a[0];
        })

        return sortedPossible[0][1];
    }
}


const boardHistory = [];

const boardFuture = [];