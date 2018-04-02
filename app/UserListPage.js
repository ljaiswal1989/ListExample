import React from 'react';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ActivityIndicator,
    Platform,
    Image,
    RefreshControl,
    FlatList,
    ScrollView
} from 'react-native';
import {observer,inject} from 'mobx-react/native'
import { SearchBar,Icon } from 'react-native-elements';
import _ from 'lodash';


var _that,filteredArray=[];

@inject('myDataSource')
@observer
export class UserListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localData:[],
            text:'',
            showFilteredList:false
        }
    }

    componentWillMount(){
        _that=this;
        _that.props.screenProps.store.userList= [];
        this.setState({localData:_that.props.screenProps.store.userList})
    }

    componentDidMount(){
        _that.props.screenProps.store.loading=true
        _that.props.screenProps.store.error=false
        _that.fetchUsers()
    }

    fetchUsers(){
            fetch(`https://randomuser.me/api/?results=10`,{
              method: 'get',
              dataType: 'json',
              headers: {
                      'Accept': 'application/json',
                      'Content-Type': ['application/json','charset=utf-8']
              }
            })
            .then((response) => {
                //console.log("response  :",JSON.stringify(response));
                    return response.json()
            })
            .then((responseData) => { // responseData = undefined
              //console.log("response data :",JSON.stringify(responseData));
              _that.parseResponseFromServer(responseData)
            })
            .catch((error) => {
               if(_that.props.screenProps.store.loading==true){
                    _that.props.screenProps.store.loading=false
                    _that.props.screenProps.store.error=true
               }else if(_that.props.screenProps.store.refreshing==true){
                    _that.props.screenProps.store.refreshing=false
                    _that.props.screenProps.store.error=true
               }else if (_that.props.screenProps.store.fetching==true){
                    _that.props.screenProps.store.fetching=false,
                    _that.props.screenProps.store.error=true
               }
            });
    }
    filterUser(){
        if(_that.state.text != ""){
            this.setState({showFilteredList:true});
            filteredArray = _.filter(_that.props.screenProps.store.userList,function(o) { if(o['name']['first'].toLowerCase().startsWith(_that.state.text.toLowerCase())) return true; });    
        }
        else{
            filteredArray =[];
            this.setState({showFilteredList:false});
        }
    }
    parseResponseFromServer(responseJson){
        var tempUserlist = [];
        for(var i=0; i<responseJson.results.length; i++){
            var tempUserData = responseJson.results[i];
          
            var tempName={
                  "title":tempUserData.name.title,
                  "first":tempUserData.name.first,
                  "last":tempUserData.name.last
                  }

            var tempLocation={
                "street":tempUserData.location.street,
                "city":tempUserData.location.city,
                "state":tempUserData.location.state,
                "postcode": tempUserData.location.postcode
            }

            var tempLogin={
              "username":tempUserData.login.username,
              "password":tempUserData.login.password,
              "salt":tempUserData.login.salt,
              "md5": tempUserData.login.md5,
              "sha1": tempUserData.login.sha1,
              "sha256": tempUserData.login.sha256
            }

            var tempId={
              "name":tempUserData.id.name,
              "value":tempUserData.id.value
            }

            var tempPicture={
                "large":tempUserData.picture.large,
                "medium":tempUserData.picture.medium,
                "thumbnail":tempUserData.picture.thumbnail
            }

            tempUserlist.push({
                      key:tempUserData.email,
                      gender: tempUserData.gender,
                      name:tempName,
                      location:tempLocation,
                      email:tempUserData.email,
                      login:tempLogin,
                      dob:tempUserData.dob,
                      registered:tempUserData.registered,
                      phone:tempUserData.phone,
                      cell: tempUserData.cell,
                      id:tempId,
                      picture:tempPicture,
                      nat:tempUserData.nat,
            })   
       }
       if(!_that.props.screenProps.store.fetching==true){
          // alert("Before : "+_that.props.screenProps.store.userList.length);
          _that.props.screenProps.store.userList=tempUserlist
          this.setState({localData:_that.props.screenProps.store.userList})
       }
       //console.log("local User: ",JSON.stringify(_that.props.screenProps.store.userList));
       if(_that.props.screenProps.store.loading==true){
            _that.props.screenProps.store.loading=false
       }else if(_that.props.screenProps.store.refreshing==true){
            _that.props.screenProps.store.refreshing=false
       }else if(_that.props.screenProps.store.fetching==true){
          _that.props.screenProps.store.fetching=false
            var tempData=_that.props.screenProps.store.userList;
          for(var i=0; i<tempUserlist.length;i++){
            tempData.push(tempUserlist[i]);
                if(i==tempUserlist.length-1){
                    //alert("Before : "+tempData.length);
                    _that.props.screenProps.store.userList=tempData;
                    this.setState({localData:_that.props.screenProps.store.userList})
                }
            }
       }
    }

    _onRefresh() {
      _that.props.screenProps.store.refreshing= true
       _that.props.screenProps.store.error=false
      this.fetchUsers()
    }

    capitalizeString(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    retryFetchUser(){
        _that.props.screenProps.store.loading=true
        _that.props.screenProps.store.error=false
        _that.fetchUsers();
    }

    renderItem({ item, index }) {

            return (
                <View key={item.key}>
                    <TouchableWithoutFeedback onPress={(e)=>{e.preventDefault()}}>
                        <View>
                                 <View style={styles.userView}>
                                       {item.picture.thumbnail &&
                                         <Image style={styles.profileView} source={{uri: item.picture.thumbnail}}/>
                                        }
                                       {!item.picture.thumbnail &&
                                         <Image style={styles.profileView} source={require('./assets/profile.png')}/>
                                       }
                                       <View style = {styles.detailView}>
                                           <View style = {styles.nameView}>
                                                <Text style = {styles.profileName}>{_that.capitalizeString(item.name.first)}{"  "}{_that.capitalizeString(item.name.last)}</Text>
                                          </View>
                                           <Text style = {styles.phoneText}>Ph: {item.phone}</Text>
                                           <Text style = {styles.locationText}>{item.location.street}{", "}{item.location.city}</Text>
                                       </View>
                                       <TouchableHighlight style={{flex:0.1, justifyContent:"center",alignItems:"center"}} underlayColor={"transparent"} onPress={(e)=>{e.preventDefault()}}>
                                         <Image style={styles.actionView} source={require('./assets/bin.png')}/>
                                       </TouchableHighlight>
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
           
    }
    render() {
        const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
            const paddingToBottom = 1;
            this.setState({listviewHeight:"auto"})
            return layoutMeasurement.height + contentOffset.y >=
                contentSize.height - paddingToBottom;
            };
        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <View style ={{flexDirection:"row"}}>
                    <Text style={styles.headerText}>BidChat Users</Text>
                    </View>
                </View>
                {_that.props.screenProps.store.loading && 
                    <ActivityIndicator style={{marginTop:10}} size={(Platform.OS === 'ios') ?1:45} color="#6ACE55" />
                }
                {!_that.props.screenProps.store.loading && !_that.props.screenProps.store.refreshing && this.props.screenProps.store.userList.length!=0 &&
                <View style={styles.searchView}>
                    <View style={{alignItems:'flex-end', justifyContent:"center"}}>
                     <SearchBar
                          lightTheme= {true}
                          noIcon={true}
                          placeholder='Search Users'
                          inputStyle = {styles.searchBarInput}
                          containerStyle = {styles.searchBarStyle}
                          onChangeText={(text) => this.setState({text:text},this.filterUser)}
                          underlineColorAndroid = {"transparent"}
                          /> 
                          <View style = {styles.underlineView}/> 
                    </View>
    
                    <ScrollView 
                            contentContainerStyle={{height:this.state.listviewHeight, paddingTop:10,paddingBottom:10}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={_that.props.screenProps.store.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            }
                             onScroll={({nativeEvent}) => {
                                if (isCloseToBottom(nativeEvent)) {
                                    if(!_that.props.screenProps.store.fetching && this.props.screenProps.store.userList.length>=10){
                                        _that.props.screenProps.store.fetching=true
                                        this.fetchUsers()
                                    }
                                }
                            }}>
                            {!this.state.showFilteredList &&
                                <FlatList
                                    extraData={_that.state}
                                    data={_that.props.screenProps.store.userList}  
                                    renderItem={this.renderItem}
                                />
                            }
                            {this.state.showFilteredList &&
                                <FlatList
                                    extraData={_that.state}
                                    data={filteredArray}
                                    renderItem={this.renderItem}
                                />
                            }
                    </ScrollView>
                    {_that.props.screenProps.store.fetching &&
                    <View style={{alignItems: "center",justifyContent: "center",width:window.width,backgroundColor:"#ffffff"}}>
                    <ActivityIndicator
                    animating={true}
                    color="#6ACE55"
                    size="large"
                    style={{marginTop: 5,marginBottom:5,backgroundColor:"transparent"}}
                    />
                </View>
                }
                 </View>   
                }
                {!_that.props.screenProps.store.loading && !_that.props.screenProps.store.error && this.props.screenProps.store.userList.length==0 &&
                        <Text style={styles.emptyMessage}>Users will appear here.</Text>
                }
                {!_that.props.screenProps.store.loading && _that.props.screenProps.store.error &&
                       <View style={{alignItems: "center"}}>
                       <Text style={styles.emptyMessage}>Oops something went wrong</Text>
                       <TouchableWithoutFeedback onPress={(e)=>{e.preventDefault(),_that.retryFetchUser()}}>
                       <Image style={[styles.profileView,{alignItems: "center"}]} source={require('./assets/refresh.png')}/>
                       </TouchableWithoutFeedback>
                      </View>
                } 
            </View>
        )
    }
}

var window = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
        marginTop:(Platform.OS === 'ios') ? 20 : 0,
        flex: 1,
        backgroundColor: "#cccccc",
    },
    searchView: {
        flex: 1,
        backgroundColor: "#cccccc",
    },
    userView:{
        height : 85,
        backgroundColor: "#fff",
        marginBottom:1,
        marginTop:1,
        shadowColor: '#919191',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        flexDirection:"row",
        padding:10,
        paddingLeft:10
    },
    profileView : {
        width : 40,
        height : 40,
        marginTop:7,
        borderColor: '#919191',
        borderRadius: 20,
        borderWidth: 0.2
    },
    detailView : {
       marginLeft: 10,
       flex:0.9
    },
    nameView:{
        flexDirection:"row"
    },
    profileName: {
        fontSize: 14,
        color:"#494846",
        marginTop: 5,
        letterSpacing: 0
    },
    phoneText: {
        color:"#494846",
        letterSpacing: 0,
        fontSize: 10,
        marginTop:3
    },
    locationText: {
        fontSize: 10,
        marginTop:10,
        color: "#494846",
        letterSpacing: 0,
        opacity: 0.5,
        textAlign: "left",
    },
    emptyMessage: {
        textAlign: "center",
        marginTop: 70,
        fontSize: 18,
        color: "#494846",
        letterSpacing: 0
    },
    loading: {
        alignItems: "flex-start",
        paddingHorizontal: 10,
        paddingTop: 10,
        flexDirection: "row",
    },
    headerText:{
        textAlign: "center",
        flex:1,
        color : "#ffffff",
        letterSpacing: 0,
        fontSize:18,
        },
    headerView:{
        backgroundColor:"#6ACE55",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:0
    },
    searchBarStyle :{
        backgroundColor: "#FFFFFF",
        width : window.width*1,
        marginBottom:5
    },
    searchBarInput :{
        color: "#494846",
        letterSpacing: 0,
        backgroundColor: "#FFFFFF",
        textAlign:"center"
    },
    underlineView:{
        height: 1,
        marginLeft:25,  
        backgroundColor: "#D8D8D8",
        alignItems: 'flex-end'
    },
    actionView : {
        alignItems: 'center',
        width : 20,
        height : 20,
    }
});
