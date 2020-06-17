var colorList = [
    '#4dc9f6',
    '#e4ac9a',
    '#cb354d',
    '#99357b',
    '#a98bd4',
    '#79b855',
    '#5a0cab',
    '#cf1666',
    '#1e79f5',
    '#b59fd3',
    '#337352',
    '#aed92a',
    '#2fd867',
    '#ea9bc9',
    '#845530',
    '#3eba14',
    '#de378a',
    '#8094c0',
    '#08e7a6',
    '#3bbfae',
    '#07c91d',
    '#798be4'
];
var colorLength = colorList.length;

var colors = function(index){
    return colorList[index % colorLength];
};
export { colors };