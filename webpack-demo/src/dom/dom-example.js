function visitDOM(node, action, enterNodeAction, leaveNodeAction){
    if (typeof enterNodeAction === 'function') {
        enterNodeAction(node);
    }
    action(node);
    if (node.childNodes && node.childNodes.length > 0) {
        [... node.childNodes].forEach( child => visitDOM(child, action, enterNodeAction, leaveNodeAction) );
    }
    if (typeof leaveNodeAction === 'function') {
        leaveNodeAction(node);
    }
}

function buildNodeAction(dotNodeFormat, dotLeafNodeFormat){
    let leafNode = [];
    let branchNode = [];
    let nodeCount = {};
    let workingNode = [];

    let branches = [];
    let textLengthMax = 15;

    let constructNodeId = function(node, count){
        return `${node.nodeName.replace('#','')}_${count}`;
    };

    return {
        enter: function (node) {
            let nodeName = node.nodeName;
            let count =nodeCount[nodeName];
            if (count) {
                count++;
            }else {
                count = 1;
            }
            nodeCount[nodeName] = count;
            workingNode.push( constructNodeId(node,count) );
        },

        action: function(node){
            let nodeType = node.nodeType;
            let dotNode = workingNode[workingNode.length - 1];
            if (nodeType === Node.TEXT_NODE || nodeType === Node.COMMENT_NODE ) {
                let text = node.textContent;
                if (text ) {
                    text = text.trim();
                    if (text.trim().length > textLengthMax) {
                        text = text.trim().substring(0, textLengthMax - 1) + "...";
                    }else if (text.length === 0) {
                        text = "[empty]";
                    }
                }
                leafNode.push( `${dotNode}[label="${text}"]` );
            }else {
                if (nodeType === Node.ELEMENT_NODE) {
                    branchNode.push(`${dotNode}[label="${node.nodeName.toLowerCase()}"]`);
                }else{
                    branchNode.push(`${dotNode}[label="${node.nodeName}(type: ${nodeType})"]`);
                }
            }
        },

        leave: function (node) {
            let curentNode = workingNode.pop();
            if (workingNode.length > 0) {
                let parentNode = workingNode[workingNode.length -1];
                branches.push(`${parentNode}  ->  ${curentNode}`);
            }
        },

        getGraphvizCode: function () {
            return "digraph DOM {\n\t" +
                `${dotNodeFormat};\n\t` +
                branchNode.join(";\n\t") + "\n\n" +
                "\tsubgraph leaf {\n\t" +
                `${dotLeafNodeFormat};\n\t\t` +
                leafNode.join(";\n\t\t") +
                "\n\t}\n\n\t" +
                branches.join(';\n\t') +
                "\n}";
        }
    }
}

var nodeAction = buildNodeAction("node[shape=rectangle, fontname=\"Source Code Pro\", fontsize=12]",
    "node[style=filled, fillcolor=\"#F5FF7F\"]");
visitDOM(document, nodeAction.action, nodeAction.enter, nodeAction.leave);
console.log(nodeAction.getGraphvizCode());