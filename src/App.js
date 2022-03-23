import './App.css';
import { Graph } from "react-d3-graph";
import React from 'react';
import { useState, useEffect, useRef } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';



function App() {
  let [selectedNode, setSelectedNode] = useState(null)
  let [newNode, setNewNode] = useState({})
  let [idArray, setIdArray ] = useState([ 1, 2, 3])
  let [nodes, setNodes] = useState([
    // { id: 1, name: "Bruh" }, 
    // { id: 2, name: "Babe" }, 
    // { id: 3, name: "Dude" }
  ])
  let [links, setLinks] = useState([
    // { source: 1, target: 2 },
    // { source: 1, target: 3 },
  ])

  // graph payload (with minimalist structure)
  let data = {
    nodes: nodes,
    links: links,
  }

  // function to get all initial nodes and links data
  const getAllNodesAndLinks = () => {
    var myHeaders = new Headers();

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      mode: 'cors'
    };

    fetch("http://localhost:8080/allNodes", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("GET ALL NODES RESULT: ", result)
        setNodes(result)
      })
      .catch(error => console.log("GET ALL NODES ERROR: ", error));   

    fetch("http://localhost:8080/allLinks", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("GET ALL LINKS RESULT: ", result)
        setLinks(result)      
      })
      .catch(error => console.log("GET ALL LINKS ERROR: ", error)); 
  }

  const addNewNodeToDB = (nodeToAdd) => {
    var myHeaders = new Headers();
    myHeaders.append("name", nodeToAdd.name)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: nodeToAdd,
      redirect: 'follow',
    };

    fetch("http://localhost:8080/newNode", requestOptions)
      .then(response => response.json())
      .then(data => console.log('NODE ADDED: ', data))
      .catch(error => console.log('ADD NODE ERROR: ', error));
  }

  const addNewLinkToDB = (linkToAdd) => {
    var myHeaders = new Headers();

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: linkToAdd,
      redirect: 'follow'
    };

    fetch("http://localhost:8080/addLink", requestOptions)
      .then(response => response.json())
      .then(data => console.log('LINK ADDED'))
      .catch(error => console.log('ADD LINK ERROR: ', error));
  }

  // the graph configuration, just override the ones you need
  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
      labelProperty: "name"
    },
    link: {
      highlightColor: "lightblue",
    },
  };

  const onClickNode = function (nodeId) {
    // window.alert(`Clicked node ${nodeId}`);

    //Add link
    // if (!selectedNode) {
      setSelectedNode(Number(nodeId))
    // } else {
    //   setLinks([...links, { source: selectedNode, target: Number(nodeId)}])
    // }

    console.log('selectedNode:', selectedNode)
  };

  const onClickLink = function (source, target) {
    window.alert(`Clicked link between ${source} and ${target}`);
    console.log(source)
  };

  const handeNewNodeChange = function (e) {
    let target = e.target;
    let name = target.name;
    setNewNode({[name]: target.value});

    console.log(newNode)
  };

  const newAddNode = function () {

    let newTarget = nodes.length + 1
    // console.log('newId :',newTarget)
    //  setNodes([...nodes, {id: newTarget, ...newNode}])
     console.log('GO F URSELF:', newNode)
     addNewNodeToDB(newNode)
    if (selectedNode) {
      setLinks([...links, { source: selectedNode, target: newTarget}])
    }
  };


  useEffect(() => {
    getAllNodesAndLinks()
    // if (selectedNode) {
    //   selectedNode.color = "#FF0000"
    // }
  }, []);


  return (
    <div className="App">
      <Graph
        id="graph-id" // id is mandatory
        data={data}
        config={myConfig}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
      <TextField
        label="Name"
        name="name"
        defaultValue="Name"
        onChange={handeNewNodeChange} 
      />

      <Button variant="contained" onClick={newAddNode}>New Node</Button>
    </div>
  );
}

export default App;
