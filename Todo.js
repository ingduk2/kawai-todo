import React from "react";
import{View, Text, TextInput,TouchableOpacity,StyleSheet, Dimensions} from "react-native"
import PropTypes from "prop-types";

const {width, height} = Dimensions.get("window");

export default class ToDo extends React.Component{
    constructor(props){
        super(props);
        this.state = {isEditing:false , toDoValue: props.text}
    };
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        uncompletedToDo: PropTypes.func.isRequired,
        completedToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    };
    state = {
        isEditing: false,
        toDoValue : ""
    };
    render(){
        const {isEditing , toDoValue} = this.state;
        const {text, id, deleteToDo,isCompleted} = this.props;
        return (
        <View style={styles.container}>
            <View style={styles.column}>
            <TouchableOpacity onPressOut={this._toglleComplete}>
                <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]}/>
            </TouchableOpacity>
            {isEditing ? 
                (<TextInput 
                    style={[
                        styles.text,
                        styles.input,
                        isCompleted ? styles.completedText : styles.uncompletedText
                    ]}
                    value={toDoValue}
                    multiline={true}
                    onChangeText={this._controllInput}
                    returnKeyType={"done"}
                    onBlur={this._finishedEditing}
                    underlineColorAndroid={"transparent"}/>
                    )
                :
                (<Text
                    style={[
                        styles.text,
                        isCompleted ? styles.completedText : styles.uncompletedText
                    ]}>{text}</Text>)}
            </View>
            
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._finishedEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>✅</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : 
                (
                    <View style={styles.actions}>
                    <TouchableOpacity onPress={this._startEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>✏️</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={event => {event.stopPropagation; deleteToDo(id)}}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>❌</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                )}
            
        </View>
        );
    }
    _toglleComplete = (event) => {
        // this.setState(prevState => {
        //     return {
        //         isCompleted: !prevState.isCompleted
        //     }
        // })
        event.stopPropagation();
        const {isCompleted, uncompletedToDo, completedToDo, id} = this.props;
        if(isCompleted){
            uncompletedToDo(id);
        }else {
            completedToDo(id);
        }
    }
    _startEditing = (event) => {
        event.stopPropagation();
        const {text} = this.props;
        console.log("startEditing")
        this.setState({
            isEditing: true
        });
    }
    _finishedEditing = (event) =>{
        event.stopPropagation();
        console.log("finishedEditing")
        const {toDoValue} = this.state;
        const {id, updateToDo} = this.props; 
        updateToDo(id, toDoValue);
        this.setState({
            isEditing: false
        })
    }
    _controllInput = (text) => {
        this.setState({
            toDoValue : text
        })
    }
}

const styles = StyleSheet.create({
    container:{
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    circle:{
        width:30,
        height:30,
        borderRadius: 15,
        borderColor: "red",
        borderWidth: 3,
        marginRight:20
    },
    text: {
        fontWeight:"600",
        fontSize: 20,
        marginVertical:20
    },
    completedCircle:{
        borderColor:"#bbb"
    },
    uncompletedCircle:{
        borderColor:"#F23657"
    },
    completedText:{
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText:{
        color: "#353535"
    },
    column:{
        flexDirection:"row",
        alignItems:"center",
        width: width/2,
    },
    actions:{
        flexDirection: "row"
    },
    actionContainer:{
        marginVertical:10,
        marginHorizontal:10,
    },
    input:{
        marginVertical: 15,
        width: width/2,
        paddingBottom: 5
    }
})