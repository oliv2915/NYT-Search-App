const baseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const key = "bYrZkhJdefjDEWQLBdDDWO6F6H7RGqje";
let url;

//SEARCH FORM
const searchTerm = document.querySelector('.search'); // acces searchField on html page
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');

nav.style.display = "none"; // hides the nav element from view

let pageNumber = 0; // this keeps track of what page we are on
let displayNav = false; // should be the nav element be seen

// add event listeners to our elements
searchForm.addEventListener('submit', fetchResults); // listens for a submit event then run fetchResults()
nextBtn.addEventListener('click', nextPage); // listens for a click event then runs nextPage()
previousBtn.addEventListener('click', previousPage); // listens for a click event then runs previousPage()

// eventListener for searchForm
function fetchResults(e) {
    e.preventDefault(); // stops the default submit event that a form has, this allows us to create our own event for this form, also known as an override
    url = `${baseURL}?api-key=${key}&page=${pageNumber}&q=${searchTerm.value}`
    // check to see if a startDate.value has been provided
    if (startDate.value !== "") {
        url += `&begin_date=${startDate.value}`; // add the query parameter to the url string
    }

    // check to see if an endDate.value has been provided
    if (endDate.value !== "") {
        url += `&end_date=${endDate.value}`; // add the query parameter to the url string
    }

    fetch(url) // submits a GET request
        .then((results) => {        // once a reply has been made
            return results.json();  // return a converted JSON to JS object
        })
        .then((json) => {
            displayResults(json); // passes the parsed json data to displayResults()
        })
}

function displayResults(results) {
    
    while (section.firstChild) { // this clears the articles from view when a new search is done
        section.removeChild(section.firstChild); // remove that child element
    }

    let articles = results.response.docs; // placeholder to access the article data
    
    if (articles.length == 10) { // check to see if we have more than 10 articles
        nav.style.display = "block"; // show the nav bar
        
        if (pageNumber === 0) {
            previousBtn.style.display = "none";
        } else if(pageNumber > 0 && articles.length < 10) {
            nextBtn.style.display = "none";
        } else {
            previousBtn.style.display = "block";
            nextBtn.style.display = "block";
        }
    } else {
        nav.style.display = "none"; // hides the nav bar
    }
    
    if (articles.length === 0) {  // check to see if the articles.length is empty
        console.log("No Results");
    } else { // display the results
        articles.forEach((a) => { // a == each article in the articles array
            // console.log(a);
            let article = document.createElement("article");
            let heading = document.createElement("h2");
            let link = document.createElement("a");
            let img = document.createElement("img");
            let para = document.createElement("p");
            let clearfix = document.createElement("div");

            link.setAttribute("target", "_blank"); // opens the article in a new tab
            link.href = a.web_url; // set the link.href to the article web_url
            link.textContent = a.headline.main; // set the link.textContent to the article headline

            para.textContent = "Keywords: ";

            a.keywords.forEach((keyword) => {
                let span = document.createElement("span");
                span.textContent += keyword.value;
                para.appendChild(span);
            })

            if (a.multimedia.length > 0) {
                img.src = `http://www.nytimes.com/${a.multimedia[0].url}`;
                img.alt = a.headline.main;
            }

            clearfix.setAttribute("class", "clearfix");

            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(img);
            article.appendChild(para);
            article.appendChild(clearfix);
            section.appendChild(article);
        })
    }
}

// eventListener for nextBtn
function nextPage(e) {
    pageNumber++;
    fetchResults(e); // call on function to load new results for next page
}

//eventListener for previousPage
function previousPage(e) {
    if (pageNumber > 0) { // checks if page is greater than 0
        pageNumber--; // decrease pageNumber by 1
    } else {
        return; // break out of the check
    }
    fetchResults(e); // call function to load new results for last page
}