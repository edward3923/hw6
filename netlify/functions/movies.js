// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  //console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please provide the correct querystring parameters!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }


    for (let i=0; i < moviesFromCsv.length; i++) {

      let selectedMovie = moviesFromCsv[i]
      
      // Create an empty object that will hold the matched movies' details
      let moviesMatched = {}

      // Ignore any results with no genre or movies with no runtime
      if (selectedMovie.genre == "\\N" || selectedMovie.runtimeMinutes == "\\N") {
        // Do nothing if genre or runtimeMinutes is null
      }

      // Check to see if the year and genre matches
      else if (selectedMovie.startYear == year && selectedMovie.genres.includes(genre)) {
        
        // If there is a match, create an object containing the correct details
        moviesMatched = {
            primaryTitle: selectedMovie.primaryTitle,
            startYear: selectedMovie.startYear,
            genres: selectedMovie.genres
        }

      // Push the matched movie object to the return value
      returnValue.movies.push(moviesMatched)

      // Increment the number of results return value
      returnValue.numResults++
      
      }

    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // return resulting JSON which includes two key-value pairs
    }
  }
}