import React from 'react';

// On importe les styles pour le plateau
import styles from "./case.css";

export default class Case extends React.Component {

    render() {
        //let {etat} = this.props;
        //let etatComponent = <label>{etat || ""}</label>;

        return <div className="case" onClick={() => this.props.onClick()}>
            {/*{etatComponent}*/}
            <label data-player={this.props.state}>{this.props.state}</label>
        </div>;
    }
}