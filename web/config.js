//timeDelay is the minimum amount of time, in minutes, that must elapsed between new data for a server is allowed
//default timeDelay is just less than 24hours (so once per day)

//history is how many historical records, per server, to keep

module.exports = {
  mongo: {host: '127.0.0.1', port: 27017, database: 'mongowatch'},
  listen: {port: 3000},
  timeDelay: 1425,
  history: 30
};

