var slasp = require('slasp');

exports.parallelFromEach = function(startFun, statementFun, callback) {
  slasp.sequence([
    function(callback) {
      startFun(callback);
    },
    function(callback, result) {
      var keys = Object.keys(result);
      if (keys.length === 0) {
        callback(null);
        return;
      }

      var restCount = keys.length;
      var callbackInvoked = false;
      var joinAll = function(err) {
        if (callbackInvoked)
          return;
        if (err) {
          callbackInvoked = true;
          callback(err);
        }
        if (--restCount === 0) {
          callbackInvoked = true;
          callback(null);
        }
      };

      for (var i = 0; i < keys.length; i++)
        statementFun(keys[i], joinAll);
    }
  ], callback)
};
