const PortfolioDispatcher = {
  fetchStocks(callback) {
    let data = {
      stocks: [
        {
          name: "AAPL",
        },
        {
          name: "BAC",
        },
      ],
    };

    return callback(data);
  },
}

module.exports = PortfolioDispatcher;
