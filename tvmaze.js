"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const defaultImg = {medium: "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"};
let $episodesBtn;


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
    
    let show = searchResult.data[0].show;
      
    console.log(searchResult);

    if (show.image === null){
        show.image = defaultImg;
      }

    return [{id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image.medium}];
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

  $episodesBtn = $(".Show-getEpisodes");
  
}



/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
  
  $episodesBtn.on("click", ()=>getEpisodesOfShow(shows[0].id));
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
  console.log(searchResult.data);
  return searchResult.data;
  }

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) {
  
 }
