import Immutable from "seamless-immutable";

const DEMARRER_JEU = 'morpion/DEMARRER';
const CLICK_CASE = 'morpion/CLICK_CASE';
const TIME_OUT = 'morpion/TIME_OUT';
const RESET = 'morpion/RESET';
const REJOUER = 'morpion/REJOUER';
const GET_DIMENSION = 'morpion/GET_DIMENSION';

const initialState = {
    cases: Array(9).fill(null),
    xSuivant: true,
    scoreParties: [0, 0],    // X, O
    dimension: 3
};


/*
    const lines = [];
    let n=3;
    for(let i=0; i<n ; i++){
        lines[lines.length] = [i*n, i*n+1, i*n+2];
        lines[lines.length] = [i, n+i, 2*n+i];
    }
    lines[lines.length] = [0, n+1, 2*n+2];
    lines[lines.length] = [n-1, 2*n-2, 3*n-3];

* */

function detecteGagnant(cases, dimension) {
    const lines = [];
    let n= dimension;

    let diagonalL = [];
    let diagonalR = [];
    for(let i=0; i<n ; i++){

           let line = [];
           let column = [];
           for(let j=0; j<n; j++){
            line[line.length] = [i*n+j];
            column[column.length] = [j*n+i];
           }
           lines[lines.length] = line;
           lines[lines.length] = column;

           diagonalL[diagonalL.length] = [i*n+i];
           diagonalR[diagonalR.length] = [(i+1)*n-(i+1)];
    }
    lines[lines.length] = diagonalL;
    lines[lines.length] = diagonalR;

    for (let i = 0; i < lines.length; i++) {
        /*const [a, b, c] = lines[i];
        if (cases[a] && cases[a] === cases[b] && cases[a] === cases[c]) {
            return cases[a];
        }*/
        let win = lines[i].reduce(
            function(acc, curr, index) {
                if(index === 0){
                    if (cases[curr]){
                        return curr;
                    }
                }else if(cases[curr] && cases[acc] === cases[curr]){
                    if(index === (n-1)){
                        return cases[curr];
                    }
                    return curr;
                }
            },
            []
        );
        if (win){
            return win;
        }
    }
    return null;
}

export function monReducer(currentState = Immutable(initialState), action) {
    switch (action.type) {
        case DEMARRER_JEU: {
            // let newState = currentState.set('message',  action.payload.message);
            let newState = Object.assign({}, currentState, { message: action.payload.message});
            return newState;
        }
        case CLICK_CASE: {
                const SYMBOL = currentState.xSuivant ? 'X' : 'O';
                let cases = [...currentState.cases.slice(0,action.payload.caseId), SYMBOL, ...currentState.cases.slice(action.payload.caseId+1)];
                let gagnant = detecteGagnant(cases, currentState.dimension);

                let scoreParties = currentState.scoreParties.slice();
                if(gagnant){
                    if(currentState.xSuivant){
                        scoreParties = [(currentState.scoreParties[0]+1) , currentState.scoreParties[1]];
                    }else{
                        scoreParties = [currentState.scoreParties[0] , (currentState.scoreParties[1]+1)];
                    }
                }
                let newState = Object.assign({}, currentState, { cases: cases,
                                                                xSuivant: !currentState.xSuivant,
                                                                gagnant: gagnant,
                                                                scoreParties: scoreParties
                                                                });
                return newState;
        }
        case TIME_OUT: {
            let gagnant = true;
            let scoreParties = currentState.scoreParties.slice();
            if(gagnant){
                if(!currentState.xSuivant){
                    scoreParties = [(currentState.scoreParties[0]+1) , currentState.scoreParties[1]];
                }else{
                    scoreParties = [currentState.scoreParties[0] , (currentState.scoreParties[1]+1)];
                }
            }
            let newState = Object.assign({}, currentState, { gagnant: gagnant, scoreParties: scoreParties });
            return newState;
        }
        case RESET: {
            let newState = Object.assign({}, initialState);
            return newState;
        }
        case REJOUER: {
            let newState = Object.assign({}, initialState, {scoreParties: currentState.scoreParties});
            return newState;
        }
        case GET_DIMENSION: {
            let dim = action.payload.dimension * action.payload.dimension;
            let cases = Array(dim).fill(null);
            let newState = Object.assign({}, currentState, {dimension: action.payload.dimension,
                                                            cases:  cases
                                                            });
            return newState;
        }
    }

    return currentState;
}

export function demarrerLeJeu() {
    return {
        type: DEMARRER_JEU,
        payload: {
            message: "le jeu a commencé"
        }
    };
}

export function clickCase(id) {
    return {
        type: CLICK_CASE,
        payload: {
            caseId: id
        }
    };
}

export function timeOut() {
    return {
        type: TIME_OUT
    };
}

export function reset() {
    return {
        type: RESET
    };
}
export function restart() {
    return {
        type: REJOUER
    };
}
export function getDimension(dim) {
    return {
        type: GET_DIMENSION,
        payload: {
            dimension: dim
        }
    };
}