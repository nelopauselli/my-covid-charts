var colorList = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba',
    '#7c2512',
    '#f8af65',
    '#415d97',
    '#584ff0',
    '#6240a3',
    '#0d32f3',
    '#e2825e'
];
var colorLength = colorList.length;

var colors = function(index){
    return colorList[index % colorLength];
};
export { colors };