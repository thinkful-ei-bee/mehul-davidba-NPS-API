'use strict';
/* global $ */
// put your own value below!
const apiKey = '659Fq5ZqMx7bgX5sNdDnt0fJ2dKnDw71ccWeLnsn'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  // const queryItems = Object.keys(params)
  //  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  // return queryItems.join('&');

  const queryItems = Object.keys(params).map(function(key) {
    
    if(key === 'stateCode')
    { let stateURL = '';
      for(let x = 0; x<params.stateCode.length;x++)
      {
        stateURL += `stateCode=${params.stateCode[x]}&`;
      }
      
      console.log(stateURL);
      return stateURL;
    }
    else{

      return `${key}=${params[key]}`;
    }
    
  });
  return queryItems.join('');


}

function displayResults(responseJson) {
  // if there are previous results, remove them
 
  $('#results-list').empty();
  // iterate through the items array
  let  allContent = '';
  for (let i = 0; i < responseJson.data.length-1; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    allContent  +=    `<li><h3>${responseJson.data[i].fullName}</h3>
    <p>${responseJson.data[i].description}</p>
    <p>${responseJson.data[i].url} </p> 
    </li>`;
  }

  $('#results-list').html(
    allContent);
  //display the results section  
  $('#results').removeClass('hidden');
}

function getParkDetails(query, maxResults=10) {
  let query_parsed = query.split(' ');
  const params = {
    stateCode: query_parsed,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkDetails(searchTerm, maxResults);
  });
}

$(watchForm);