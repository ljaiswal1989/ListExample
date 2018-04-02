import {observable,action} from 'mobx'

let index = 0

class MyDataSource {

    @observable userList = [];
    @observable loading=false;
    @observable refreshing=false;
    @observable error=false;
    @observable fetching=false;

 }

 const myDataSource = new MyDataSource()
 export default myDataSource