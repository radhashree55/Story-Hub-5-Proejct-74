import React from 'react';
import { Text, View, StyleSheet, TextInput, FlatList} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import db from '../config.js';

export default class ReadStoryScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      allStories: [],
      dataSource:[],
      search: ''
    }
  }

  componentDidMount(){
    this.retrieveStories()
  }

  updateSearch = (search) => {
    this.setState({ search });
  };

  retrieveStories=()=>{
    var allStories= []
    var stories = db.collection('stories').get().then((querySnapshot)=> {
      querySnapshot.forEach((doc)=> {
        allStories.push(doc.data())
        console.log('These are the Stories...',allStories)
      })
      this.setState({allStories})
    })
  };

  searchFilterFunction = async (text) => {
    const newData = this.state.allStories.filter((item)=>{
      const itemData =  item.title ? item.title.toUppercase() : ''.toUppercase();
      const textData = text.toUppercase();
      return itemData.indexOf(textData) > -1;
    })
      this.setState({
        dataSource: newData,
        search: text
      });
  };

  render() {

    return(
      <View style={styles.container}>
        <View style={styles.searchBar}>
        <TextInput
        style={styles.bar}
        placeholder="Search"
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.search}/>
        <TouchableOpacity 
          style = {styles.searchButton}
          onPress = {()=>{this.searchFilterFunction(this.state.search)}}>
          <Text>Search</Text>
        </TouchableOpacity>
        </View>

        <FlatList
         data = {this.state.search}
         renderItem={({item}) => (
           <View style = {{borderBottomWidth:2}}>
             <Text> {"Title: " + item.title}</Text>
             <Text> {"Author: " + item.author}  </Text>
            </View>
         )}
        keyExtractor = {(item,index) => index.toString()}
        />
      </View>

      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40
    },
    searchBar:{
      flexDirection:'row',
      height:50,
      width:'auto',
      borderWidth:0.7,
      alignItems:'center',
    },
    bar:{
      borderWidth:2,
      height:50,
      width:335,
      paddingLeft:10,
      fontWeight: "bold",
      fontSize: 15,
    },
    searchButton:{
      borderWidth:1,
      height:50,
      width:70,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'lightgreen',
    }
  });