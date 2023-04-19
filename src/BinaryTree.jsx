import React, { useState } from 'react';
import * as d3 from 'd3';

import './BinaryTree.css';

const BinaryTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

  const handleInputChange = (event) => {
    const input = event.target.value;
    const parsedInput = input.split(',').map((val) => parseInt(val.trim()));
    setTreeData(parsedInput);
  };

  const handleClick = (event, node) => {
    event.stopPropagation();
    const highlightedSet = new Set(highlightedNodes);
    highlightedSet.add(node);
    let currentNode = node;
    while (currentNode !== 0) {
      currentNode = Math.floor((currentNode - 1) / 2);
      highlightedSet.add(currentNode);
    }
    setHighlightedNodes(highlightedSet);
  };

  const handleReset = () => {
    setTreeData([]);
    setHighlightedNodes(new Set());
  };

  const treeLayout = d3.tree().size([400, 400]);
  const root = d3.hierarchy(
    treeData.length > 0 ? buildTree(treeData, 0) : {},
    (d) => d.children
  );
  const tree = treeLayout(root);

  const links = tree.links();
  const nodes = tree.descendants();

  function buildTree(arr, index) {
    let node = { val: arr[index], children: [] };
    let leftIndex = 2 * index + 1;
    let rightIndex = 2 * index + 2;
    if (leftIndex < arr.length && arr[leftIndex] !== null) {
      node.children.push(buildTree(arr, leftIndex));
    }
    if (rightIndex < arr.length && arr[rightIndex] !== null) {
      node.children.push(buildTree(arr, rightIndex));
    }
    return node;
  }

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter binary tree as an array"
          onChange={handleInputChange}
        />
        <button onClick={handleReset}>Reset</button>
      </div>
      <svg width="500" height="500">
        <g transform="translate(50, 50)">
          {links.map((link, index) => (
            <line
              key={index}
              className="link"
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
            />
          ))}
          {nodes.map((node, index) => (
            <g
              key={index}
              transform={`translate(${node.x},${node.y})`}
              onClick={(event) => handleClick(event, node.data.val)}
              className={`node ${highlightedNodes.has(node.data.val) ? 'highlighted' : ''}`}
            >
              <text dy="35px">
                {node.data.val}
              </text>
              <circle r="15" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default BinaryTree;
