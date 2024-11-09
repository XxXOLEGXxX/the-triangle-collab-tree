var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)

addNode("blank2", {
    layerShown: false,
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return [["oleg"],["blank2"],["yuki","blank","vivid"]]}]],
    previousTab: "",
    leftTab: true,
})