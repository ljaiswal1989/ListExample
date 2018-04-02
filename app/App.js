import React from 'react';
import {
    StyleSheet, 
    View,
    Dimensions,
    Platform
} from 'react-native';
import { Provider } from 'mobx-react';
import myDataSource from './data/DataStore';
import {UserListPage} from './UserListPage';

var _that;


export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }
    }

    componentWillMount(){
        _that=this;
    }

    componentDidMount(){
       
    }

    
    render() {
        return (
            <Provider myDataSource={myDataSource} >
            <View style={styles.container}>
            <UserListPage screenProps={{store: myDataSource}}/>
            </View>
            </Provider>
        )
    }
}

var window = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cccccc",
    }
});
