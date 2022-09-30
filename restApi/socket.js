let io;

module.exports = {
  init: (httpServer, opts) => {
    io = require("socket.io")(httpServer, opts);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket is not defined");
    }
    return io;
  },
};
