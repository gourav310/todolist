import React, { useState,useEffect } from "react";
import { Button } from "reactstrap";
import "./../styles/App.css";
// import onchange from React;
import List from "./list"

function App(props) {
    const [listitems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    const valueInText = (e) => {
        setNewItem(e.target.value);
    }
    const addTask = () => {
        ///listitems.push(newItem);
        fetch("https://todo--backend.herokuapp.com/addTodo", {
            method: "POST",
            body: JSON.stringify({ task: newItem }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })
            .then((r) => r.json())
            .then((r) => {
                console.log(r)
                listitems.push(r);
                console.log(listitems)
                setListItems([...listitems]);
                setNewItem("");
            });
    };
   

const deleteHandler = (index) => {
    console.log(index)
    const idToDelete = listitems[index]._id;
    console.log(idToDelete)
    fetch(`https://todo--backend.herokuapp.com/todo/${idToDelete}`, {
      method: "DELETE", credentials: "include"  
    }).then((r) => {
        console.log(r.json())
    listitems.splice(index, 1);
      setListItems([...listitems]);
    });
}
const editHandler = (index, newString) => {
    const id = listitems[index]._id;
    fetch(`https://todo--backend.herokuapp.com/todo/${id}`, {
      method: "PUT",
      body: JSON.stringify({ task: newString }),
      headers: {
        "Content-Type": "application/json",
      },
       credentials: "include"  
    })
      .then((r) => r.json())
      .then((resp) => {
        listitems[index] = resp;
        setListItems([...listitems]);
      });
}
const doneTask=(index)=>{
    const id = listitems[index]._id;
    fetch(`https://todo--backend.herokuapp.com/doneTodo/${id}`, {
      method: "PUT",
      body: JSON.stringify({ done:true  }),
      headers: {
        "Content-Type": "application/json",
      },
       credentials: "include"  
    })
      .then((r) => r.json())
      .then((resp) => {
        listitems[index] = resp;
        setListItems([...listitems]);
      });
}
useEffect(() => {
    fetch("https://todo--backend.herokuapp.com/todo", { credentials: "include"  })
      .then((r) => r.json())
      .then((r) => {
          setListItems([...r])
      });
  }, []);
    



return (
    <div id="mainlist">
        <div style={{display:"flex"}}>
            <h3>Signed in as {props.username}</h3><Button style={{height:"20px",marginTop:"20px"}} onClick={props.logout}>logout</Button>
        </div>
        <div><textarea id="task" onChange={valueInText} value={newItem}></textarea>
            <button id="btn" onClick={addTask} disabled={newItem.trim().length === 0}>Add Task </button></div>
        {listitems.map((item, idx) => (
            <List items={item} key={idx} idx={idx} doneTask={doneTask} editHandler={editHandler} deleteHandler={deleteHandler} />
        ))}

    </div>
    );
}


export default App;
