const challengeMap = require('../fixtures/challengeMap');

/*

challenge: {
  client: images sent to the client side
  server: answers to the challenge
}

*/

module.exports = (collection) => {
  // the "winner" is what the user looks for, so if the the winner is picked and it's the object containing "spongebob", the the user will be asked to identify all images with spongebob
  // "losers" are the objects that were not chosen as winners but are in the same collection as the winner

  // initialize variables in a higher scope
  let allItems = [];
  let losingPathPool = [];
  let images = [];
  let answers = [];

  // retrieve the data about the specified collection, if none is specified get data about a randomly selected collection
  if (collection) {
    allItems = challengeMap.find(item => item.collection === collection).items;
  } else {
    allItems = challengeMap[Math.floor(Math.random() * challengeMap.length)].items;
  }

  // pick the index of the winner
  const winnerIndex = Math.floor(Math.random() * allItems.length);

  // get all the possible image paths from the losers
  allItems.forEach((item, index) => {
    if (index !== winnerIndex)
      losingPathPool = losingPathPool.concat(item.paths);
  });

  // select 9 random losing images (enough to fill a 3x3 square) and save to them to the images and answers arrays
  for (let i = 0; i < 9; i++) {
    let randomLosingPath = losingPathPool[Math.floor(Math.random() * losingPathPool.length)];

    // make sure duplicate images aren't used
    while (images.includes(randomLosingPath)) {
      randomLosingPath = losingPathPool[Math.floor(Math.random() * losingPathPool.length)];
    }

    images[i] = randomLosingPath;
    answers[i] = false;
  }

  // set 3 random indexes in images to winning images and their corresponding answers to true
  for (let i = 0; i < 3; i++) {
    const winningPaths = allItems[winnerIndex].paths;

    // pick a random winning path and a random index to insert said path
    let randomWinningPath = winningPaths[Math.floor(Math.random() * winningPaths.length)];
    let randomWinningIndex = Math.floor(Math.random() * 9);

    // make sure the image isn't a duplicate or that the index we're overwriting isn't already a correct answer
    while (images.includes(randomWinningPath) || answers[randomWinningIndex] === true) {
      randomWinningPath = winningPaths[Math.floor(Math.random() * winningPaths.length)];
      randomWinningIndex = Math.floor(Math.random() * 9);
    }

    images[randomWinningIndex] = randomWinningPath;
    answers[randomWinningIndex] = true;
  }


  return {
    lookingFor: allItems[winnerIndex].is,
    urls: images,
    solution: answers
  };
};