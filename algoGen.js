const city = [      // contains the resources to harvest
  {
      "name": 'BORDEAUX',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'LILLE',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'LYON',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'MARSEILLE',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'NANTES',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'PARIS',
      "resources": 0,
      "isHarvested": false
  },
  {
      "name": 'TOULOUSE',
      "resources": 0,
      "isHarvested": false
  }
];
// const distances = {};

const distances = {
  "borbor": 10,    // bordeaux
  "borlil": 806,
  "borlyo": 556,
  "bormar": 645,
  "bornan": 353,
  "borpar": 580,
  "bortou": 245,
  "lillil": 10,    // lille
  "lillyo": 691,
  "lilmar": 1000,
  "lilnan": 600,
  "lilpar": 225,
  "liltou": 894,
  "lyolyo": 10,    // Lyon
  "lyomar": 314,
  "lyonan": 685,
  "lyopar": 491,
  "lyotou": 537,
  "marmar": 10,    // Marseille
  "marnan": 985,
  "marpar": 774,
  "martou": 403,
  "nannan": 10,    // Nantes
  "nanpar": 384,
  "nantou": 586,
  "parpar": 10,    // Paris
  "partou": 679,
  "toutou": 679    // Toulouse
};

const limitKM = 3500;           // malus will apply if overreach
const malusPerHundredKM = 25;   // malus ratio
let error = Infinity;
const arrAvgOldScore = [];
// const randomGenRatio = 1;       // nb of children generated randomly
const maxChromosomeLength = 20;
const minChromosomeLength = 2;
let finalScore = [];
let finalDistance = [];
/* 
const addCity = (newCity, distances) => {
  if(newCity.hasOwnProperty('name') && newCity.hasOwnProperty('resources') && newCity.hasOwnProperty('isHarvested')) {
      if (typeof newCity.name === 'string' && typeof newCity.resources === 'number' && typeof newCity.isHarvested === 'boolean') {
          city.push(newCity);
      }
  }
  console.log(city);
}

const getCities = () => {
  return city.map(a => a.name);
}
*/
const getDistances = () => {
  return distances;
}

const algoGen = (depCity, arrCity, errorThreshold = 0.01, maxIteration = 100, nbChromosome = 15, mutationOdd = 0.1) => {
  const keepParent = Math.round(0.73 * nbChromosome);           // nb of parents to keep at each iteration

  // Filling up cities with resources
  city.forEach(clemence => {
      clemence.resources = Math.floor(Math.random() * 1000);
  });

  // Creation of parent chromosomes - Initialization
  let arrChromosomes = [];

  for (let i = 0; i < keepParent; i++) {
      const trisomie = [];
      const rndLength = minChromosomeLength + Math.random() * (maxChromosomeLength - minChromosomeLength) - 1;
      for (let x = 0; x < rndLength; x++) {
          trisomie.push(Math.floor(Math.random() * city.length));
      }
      trisomie.push(city.findIndex(jpp => jpp.name === arrCity));
      arrChromosomes.push(trisomie);
  }

  let cpt = 0;

  do {
      /*******************************************/
      /** Creation of crossOverGenRatio% clidren */
      /*******************************************/
      const arrChildren = [];
      for (let i = 0; i < nbChromosome - keepParent; i++) {
          const firstParent = Math.floor(Math.random() * arrChromosomes.length);
          const secondParent = Math.floor(Math.random() * arrChromosomes.length);
          let idxFirstParent = Math.floor(Math.random() * (arrChromosomes[firstParent].length - 2));
          let idxSecondParent = Math.floor(Math.random() * (arrChromosomes[secondParent].length - 2));
          do {
              idxFirstParent = Math.floor(Math.random() * (arrChromosomes[firstParent].length - 2));
              idxSecondParent = Math.floor(Math.random() * (arrChromosomes[secondParent].length - 2));
          } while (idxFirstParent + (arrChromosomes[secondParent].length - idxSecondParent + 1) > maxChromosomeLength - 1);

          const childLength = idxFirstParent + arrChromosomes[secondParent].length - idxSecondParent;
          const newChild = [];
          let shift = 0;
          for (let x = 0; x < childLength; x++) {
              if (x < idxFirstParent) {
                  newChild[x] = arrChromosomes[firstParent][x];
              } else {
                  newChild[x] = arrChromosomes[secondParent][idxSecondParent + shift];
                  shift += 1;
              }
          }
          arrChildren.push(newChild);
      }

      /*******************************************/
      /** Generate one clidren totally randomly **/
      /*******************************************/
      // const cocu = [];
      // const rndLength = minChromosomeLength + Math.random() * (maxChromosomeLength - minChromosomeLength) - 1;
      // for (let i = 0; i < rndLength; i++) {
      //     cocu[i] = Math.floor(Math.random() * city.length);
      // }
      // cocu.push(city.findIndex(lea => lea.name === arrCity));
      // arrChildren.push(cocu);

      /*******************************************/
      /************* Mutate children *************/
      /*******************************************/
      arrChildren.forEach(skibidiPahPah => {
          for (let i = 0; i < skibidiPahPah.length - 1; i++) {
              if (Math.random() < mutationOdd) {
                  let newAllele = Math.floor(Math.random() * city.length);
                  while (newAllele === skibidiPahPah[i]) {
                      newAllele = Math.floor(Math.random() * city.length);
                  }
                  skibidiPahPah[i] = newAllele;
              }
          }
      });

      /*******************************************/
      /********* Add children to parents *********/
      /*******************************************/
      arrChildren.forEach(child => arrChromosomes.push(child));

      /*******************************************/
      /****** Compute scores of chromosomes ******/
      /*******************************************/
      const scoreChromosome = [];
      const distanceChromosome = [];

      arrChromosomes.forEach(chromo => {
          let resourceSum = 0;
          let distanceSum = 0;

          // Set resource as 'non-harvested'
          city.forEach(chloe => { chloe.isHarvested = false; });

          // Adding distance and resource for depCity
          resourceSum += city.filter(pauline => pauline.name === depCity)[0].resources;
          distanceSum += 10;

          // Adding the cities resources/distance of the current chromosome 'chromo'
          let prevCity = depCity.toLocaleLowerCase().slice(0, 3);
          chromo.forEach(gene => {
              // Adding resources
              let nextCity = city[gene];

              if (!nextCity.isHarvested) {
                  resourceSum += nextCity.resources;
                  nextCity.isHarvested = true;
              }

              // Adding distance
              nextCity = nextCity.name.toLocaleLowerCase().slice(0, 3);
              let keyDistanceArray = prevCity + nextCity;
              if (!distances[keyDistanceArray]) {
                  keyDistanceArray = nextCity + prevCity;
              }
              distanceSum += distances[keyDistanceArray];

              prevCity = nextCity;
          });

          // Adjusting malus
          const malus = (distanceSum > limitKM) ? (distanceSum - limitKM) / 100 * malusPerHundredKM : 0;
          resourceSum -= malus;
          scoreChromosome.push(resourceSum);
          distanceChromosome.push(distanceSum);
      });

      /*******************************************/
      /* Updating moving avg (last 5 iterations) */
      /*******************************************/
      const avgCurrScore = scoreChromosome.reduce((a, b) => a + b, 0) / scoreChromosome.length;
      if (cpt > 4) {
          const avgOldScore = arrAvgOldScore.reduce((a, b) => a + b, 0) / arrAvgOldScore.length;
          error = Math.abs(avgOldScore - avgCurrScore) / avgOldScore;
      }
      arrAvgOldScore.push(avgCurrScore);
      if (arrAvgOldScore.length > 5) {
          arrAvgOldScore.shift();
      }

      /*******************************************/
      /**** Selection of keepParent% best chr ****/
      /*******************************************/
      const arrBestChrom = [];
      const copyScoreChromosome = scoreChromosome.slice();
      for (let i = 0; i < keepParent; i++) {
          const indexMax = copyScoreChromosome.findIndex(max => max === Math.max(...copyScoreChromosome));
          arrBestChrom.push(arrChromosomes[indexMax]);
          copyScoreChromosome[indexMax] = -Infinity;
      }
      arrChromosomes = arrBestChrom;

      cpt += 1;
      finalScore = scoreChromosome;
      finalDistance = distanceChromosome

  } while (error > errorThreshold && cpt < maxIteration);

  /*******************************************/
  /******* Creation of returned object *******/
  /*******************************************/
  const path = [];
  path.push(depCity);
  arrChromosomes[0].forEach(zerat0r => path.push(city[zerat0r].name));
  const pathScore = finalScore[0];
  const pathDistance = finalDistance[0];

  return { "path": path, "score": pathScore, "distance": pathDistance, "iteration": cpt, "error": error };
}


module.exports = { algoGen, getDistances };