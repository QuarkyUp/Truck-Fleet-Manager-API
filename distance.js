const distance = require('google-distance');

const cityGraph = {
  BORDEAUX: {
    BORDEAUX: 0,
    LILLE: 0,
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  LILLE: {
    LILLE: 0,
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  LYON: {
    LYON: 0,
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  MARSEILLE: {
    MARSEILLE: 0,
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  NANTES: {
    NANTES: 0,
    PARIS: 0,
    TOULOUSE: 0
  },
  PARIS: {
    PARIS: 0,
    TOULOUSE: 0
  },
  TOULOUSE: {
    TOULOUSE: 0
  },
};

const generateDistance = () => {
  for (let cityOutter in cityGraph) {
    let obj = cityGraph[cityOutter];
    for (let cityInner in obj) {
      distance.get(
        {
          origin: cityOutter.toString(),
          destination: cityInner.toString()
        },
        function (err, data) {
          if (err) return console.log(err);
          // console.log(data.distanceValue);
          cityGraph[cityOutter.toString()][cityInner.toString()] = Math.floor(data.distanceValue / 1000);
          console.log(cityGraph[cityOutter.toString()][cityInner.toString()]);
        });
    }
  }
};

const getCityDistance = (origin, destination) => {
  return cityGraph[origin.toString()][destination.toString()];
};

module.exports = { generateDistance, getCityDistance };