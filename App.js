import 'react-native-get-random-values';
import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView , AsyncStorage} from 'react-native';
import ToDo from "./Todo";
import { AppLoading } from "expo";
import { v1 as uuidv1 } from "uuid";
import { seed } from "./uuidSeed";
const { height, width } = Dimensions.get("window");


export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };
  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    console.log(toDos);
    console.log(Object.values(toDos).map(a => a.text));
    
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"></StatusBar>
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New To Do"}
            value={newToDo}
            onChangeText={this._controllNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={"transparent"}
          ></TextInput>
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
            .sort((a,b) =>
            a.createdAt - b.createdAt)
            .reverse().map(toDo => 
            <ToDo key={toDo.id}  
            deleteToDo={this._deleteToDo}
            uncompletedToDo={this._uncompletedToDo}
            completedToDo={this._completeToDo}
            updateToDo={this._updateToDo}
            {...toDo}
            />)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controllNewToDo = text => {
    this.setState({
      newToDo: text
    })
  };
  _loadToDos = async() => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      console.log("loadToTos " + toDos);
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      })
    } catch(err){
      console.log(err);
    }
    
  };
  _addToDo = () => {
    try{
      console.log("_addTodos");
    const { newToDo } = this.state;
    if (newToDo !== "") {
      this.setState(prevState => {
        console.log("_addTodos1");
        const ID = uuidv1({ random:seed()});
        console.log("_addTodos2");
        console.log(ID);
        const newToDoObject = {
          [ID] :{
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState};
      });   
    }
    } catch (e) {
      console.log(e);
    } 
  }
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos)
      return {...newState};
    });
  }
  _uncompletedToDo = (id) => {
    console.log("_uncompletedToDo");
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }
  _saveToDos = (newToDos) => {
    console.log("=================================");
    console.log(JSON.stringify(newToDos));
    console.log("=================================");
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23567',
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200"
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        evelation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
