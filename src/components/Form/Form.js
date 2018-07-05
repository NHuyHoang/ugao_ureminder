import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: false,
        }
        this.input = {};
        this.values = {};
        this.clonedChildren = null;
    }

    checkValidity = (id, isValid, value) => {
        this.input[id].valid = isValid;
        this.input[id].value = value;
        if (isValid === false && this.state.validForm === true)
            this.setState({ validForm: false })
        for (key in this.input) {
            if (this.input[key].valid === false || this.input[key].value === "") return;
        }
        this.setState({ validForm: true })
    }

    getInputValue = (id) => {
        return this.input[id].value;
    }

    componentWillMount() {
        React.Children.forEach(this.props.children, (child) => {
            if (child.type.displayName === "Input") {
                this.input[child.props.id] = { valid: false, value: "" };
            }

        })
    }


    render() {
        //clone this.props.children and
        //add checkvalidity prop to Input element only
        this.clonedChildren = React.Children.map(this.props.children, (child) => {
            if(!child.type) return null;
            if (child.type.displayName === "UButton" || child.type.displayName === "FlatButton")
                return React.cloneElement(child, { disabled: !this.state.validForm })
            return React.cloneElement(child, { checkValidity: this.checkValidity })
        })
        return (
            <View style={this.props.style} >
                {this.clonedChildren}
            </View>
        )
    }

}