"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const defaultImg = {medium: "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"};
let $episodesBtns;


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm( /* term */) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let $searchTerm = $("#searchForm-term").val();

  let searchResult = await axios.get(`http://api.tvmaze.com/search/shows?q=${$searchTerm}`);
  
  if (searchResult.data.length > 0){
    
    let shows = searchResult.data;
    let showArr = [];

    console.log(searchResult);
    console.log(shows);
    for (let show of shows){
      if (show.show.image === null){
        show.show.image = defaultImg;
      }

      showArr.push({id: show.show.id,
            name: show.show.name,
            summary: show.show.summary,
            image: show.show.image.medium});
     }
     return showArr; 
  }
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  if (shows) {
    for (let show of shows) {
    

      console.log(show);
  
      const $show = $(
          `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img 
                src=${show.image} 
                alt="Bletchly Circle San Francisco" 
                class="w-25 mr-3">
             <div class="media-body">
               <h5 class="text-primary">${show.name}</h5>
               <div><small>${show.summary}</small></div>
               <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>  
         </div>
        `);
  
      $showsList.append($show);  }
  }

  $episodesBtns = $(".Show-getEpisodes");
  
}



/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  

  $episodesBtns.on("click", async (evt) => {
    let showID = $(evt.target).closest("div.Show").data("show-id");
    let episodeSearch = await getEpisodesOfShow(showID);
    populateEpisodes(episodeSearch);
  })
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodesOfShow(id) {
  let searchResult = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return searchResult.data;
}

/** Appends episode list from show ID and makes it visible*/

 function populateEpisodes(episodes) { 
  $("#episodesList").empty();
  $("#episodesArea").css("display", "block");
  for(let episode of episodes){
     $("#episodesList").append($(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`));
  }  
 }
