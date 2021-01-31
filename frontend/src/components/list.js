import React from "react";
import "./../styles/App.css";
// import onchange from React;

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            editTask: this.props.items.task,
            done: this.props.items.done
        }
        this.setState = this.setState.bind(this);
        this.taskChange = this.taskChange.bind(this);
        this.changeFinish = this.changeFinish.bind(this);
    }
    editModeStart() {
        this.setState({ editMode: this.props.items });
    }
    taskChange(e) {
        this.setState({ editTask: e.target.value });
    }
    changeFinish() {
        this.props.editHandler(this.props.idx, this.state.editTask)
        this.setState({
            editMode: false,
//             editTask: this.props.items
        })
    }
    render() {
        return (
            <div className="list-render"><font style={{fontSize:"25px"}}>{this.props.idx+1}. </font>
                {    this.state.editMode ? null : (<><font style={{fontSize:"25px"}}>{this.props.items.task}</font>
                    {this.state.done === false ? <><button className="edit" onClick={() => this.editModeStart()}>edit</button>
                        <button className="delete" onClick={() => this.props.deleteHandler(this.props.idx)}>delete</button>
                        <button className="done" onClick={() => {this.props.doneTask(this.props.idx);this.setState({done: true})}}>Mark as Done</button></> : <img height="25px" width="25px" alt="task complete" src="https://img.icons8.com/doodle/48/000000/checkmark.png" />}</>)}
                {this.state.editMode ?
                    (<><textarea className="editTask" onChange={this.taskChange} value={this.state.editTask}></textarea>
                        <button className="saveTask" disabled={this.state.editTask.trim().length === 0} onClick={() => this.changeFinish()}>savetask</button>
   
                        </>) : null}
            </div>
        )
    }
}
