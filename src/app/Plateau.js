import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from "react-redux";

import {demarrerLeJeu, clickCase, timeOut, reset, restart, getDimension} from "./reducers";

// On importe les styles pour le plateau
import styles from "./plateau.css";

import Case from "./Case";




class Plateau extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  timer: null,
            counter: 30,
            equality: false
        };
        this.baseState = this.state;
    }

    componentWillUnmount() {
        this.clearInterval(this.state.timer);
    }

    /* componentWillUpdate(object nextProps, object nextState)
     componentDidUpdate(object prevProps, object prevState)*/
    componentWillUpdate( nextProps,  nextState){
        // if time out the player lose
        if(nextState.counter === 0){
            this.onTimeOut();
        }
    }

    componentWillReceiveProps(nextProps){
        //set off the timer if player won
        if(nextProps.gagnant){
            clearInterval(this.state.timer);
        }

        //test if all cases filled up with no winner -> set off the timer
        function gameEquality() {
            for(let i=0; i < nextProps.cases.length; i++){
                if(nextProps.cases[i] === null){
                    return false;
                }
            }
            return true;
        }

        if(gameEquality()){
            clearInterval(this.state.timer);

            this.setState(prevState => ({
                equality: true
            }));
        }
    }

    //  decrement the counter every second
    tick = () => {
        this.setState(prevState => ({
            counter: prevState.counter - 1
        }));
    }

    onTimeOut(){
        clearInterval(this.state.timer);
        this.setState(prevState => ({
            counter: 30
        }));

        let action = timeOut();
        this.props.dispatch(action);
    }

    onReset = () => {
        let action = reset();
        this.props.dispatch(action);

        clearInterval(this.state.timer);
        this.setState(this.baseState);
    }

    onRestart = () => {
        let action = restart();
        this.props.dispatch(action);

        this.setState(prevState => ({
            equality: false
        }));

        action = getDimension(this.props.dimension);
        this.props.dispatch(action);

        this.start();
    }


    onCaseClick = (id) => {
        if (this.props.gagnant || this.props.cases[id] || !this.props.startMessage) {
            return;
        }
        let action = clickCase(id);
        this.props.dispatch(action);

        //reset the counter on 30s
        this.setState(prevState => ({
            counter: 30
        }));
    }

    start() {
        let action = demarrerLeJeu();
        this.props.dispatch(action);

        //start the timer
        let timer = setInterval(this.tick, 1000);
        this.setState({timer});
    }

    handleDimensionChange(e) {
        this.onReset();

        let action = getDimension(e.target.value);
        this.props.dispatch(action);
    }


    render() {
        let tourne = "";
        if(this.props.gagnant){
             tourne = 'Joueur Gagnant est : ' + (this.props.xSuivant ? 'O' : 'X');
        }else if(this.state.equality){
             tourne = 'égalité.. ';
        }else{
             tourne = 'Joueur Suivant est : ' + (this.props.xSuivant ? 'X' : 'O');
        }

        let states = [];
        states = this.props.cases;

        let n = this.props.dimension;
        const list = [];
        for(let i=0; i<n; i++){
            list.push(i);
        }

        let trs = list.map( (obj) =>{
            let tds = list.map( (o) =>{
                    return  <td key={o}>
                                <Case state={states[obj*n+o]} onClick={() => this.onCaseClick(obj*n+o)}/>
                            </td>
                }
            )
            return  <tr key={obj}>
                        {tds}
                        {/*<td>
                            <Case state={states[obj*n]} onClick={() => this.onCaseClick(obj*n)}/>
                        </td>
                        <td>
                            <Case state={states[(obj*n+1)]} onClick={() => this.onCaseClick((obj*n+1))}/>
                        </td>
                        <td>
                            <Case state={states[(obj*n+2)]} onClick={() => this.onCaseClick((obj*n+2))}/>
                        </td>*/}
                    </tr>
                    }
        )

        return <div>

            <h1>Le super jeu du morpion</h1>
            <form action="">
                <label htmlFor="">Entrez le nombre de lignes/colonnes : </label>
                <select onChange={this.handleDimensionChange.bind(this)}>
                    <option defaultValue value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                </select>
            </form>

            <h2>{ tourne }</h2>
            <div className="container">
                <section>
                    <table className="plateau">
                        <tbody>
                        {trs}
                        </tbody>
                    </table>
                </section>

                <section>
                    {/* Les boutons pour demarrer, recommencer à mettre ICI */}
                    <button onClick={()=>this.start()} disabled={this.props.startMessage}>Demarrer Le Jeu</button>
                    <button onClick={()=>this.onRestart()} disabled={!this.props.gagnant && !this.state.equality}>Rejouer</button>
                    <button onClick={()=>this.onReset()}>Reset Le Jeu</button>
                    {/*<Timer/>*/}
                    <h3>{ this.props.startMessage }</h3>
                    <p>{this.state.counter}</p>

                    <table className="score">
                        <tbody>
                            <tr>
                                <th>X</th>
                                <th>O</th>
                            </tr>
                            <tr>
                                <td>{this.props.scoreParties[0]}</td>
                                <td>{this.props.scoreParties[1]}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>


        </div>;
    }
}

    function mapStateToProps(storeState, props) {
    return {
        startMessage: storeState.message,
        cases: storeState.cases,
        xSuivant: storeState.xSuivant,
        gagnant: storeState.gagnant,
        scoreParties: storeState.scoreParties,
        dimension: storeState.dimension
    };
};

export default connect(
    mapStateToProps
)(Plateau)
