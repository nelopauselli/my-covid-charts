/**
 * Returns a Simple Moving Average
 * 
 * @param {Array} source Source array
 * @param {number} period MA period
 * @returns {Array} sma MA array
 */
function ma(source, period) {
    var sum = 0;
    var sma = new Array(source.length);
    for (var i = 0; i < source.length; i++) {
        if (i >= period) {
            for (var j = 0; j < period - 1; j++) {
                sum = sum + source[i - j];
            }
            sma[i] = Math.round(sum / period);
            sum = 0;
        } else {
            sma[i] = null;
        }
    }
    return sma;
}

export default ma;