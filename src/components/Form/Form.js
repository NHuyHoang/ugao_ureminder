import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: false,
        }
        this.input = {};
        this.clonedChildren = null;
    }

    checkValidity = (type, value) => {
        console.log(type, value);
        this.input[type] = value;
        console.log(this.input, type);
        if (value === false && this.state.validForm === true)
            this.setState({ validForm: false })
        for (key in this.input) {
            if (this.input[key] === false) return;
        }
        this.setState({ validForm: true })
    }

    componentWillMount() {
        React.Children.forEach(this.props.children, (child) => {
            if (child.type.displayName === "Input")
                this.input[child.props.controlType] = false;
        })
    }

    componentDidMount() {
        React.Children.forEach(this.clonedChildren, child => console.log(child))
    }

    render() {
        //clone this.props.children and
        //add checkvalidity prop to Input element only
        this.clonedChildren = React.Children.map(this.props.children, (child) => {
            if (child.type.displayName === "UButton")
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