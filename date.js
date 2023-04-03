//jshint esversion:6
module.exports.getDate = () => {
    var today = new Date();
    var options = {
      weekday: 'long',
      year: 'numeric',
      month:'long'
    };
    let day = today.toLocaleDateString("en-US",options);
    return day;
};