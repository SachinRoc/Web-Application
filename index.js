const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoConatiner = document.querySelector(".user-Info-container");

//initially variable need ?
let currentTab = userTab;
const API_Key = "c0f0db7a73c2b31219037fe450c277f9";
currentTab.classList.add("current-tab");

// ek kamm panding hai ??
getfromSessionStorage();


function switchTab(clickedTab){
    // clicked tab --> newTab
    // currentTab ----> oldTab
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

      
        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible,if yes then make i visible
            userInfoConatiner.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phele search wale tab pr tha , ab your weather tab visible krna hai.
            searchForm.classList.remove("active");
            userInfoConatiner.classList.remove("active");
            // ab main your weather tab mai aagya hu, toh weather bhi display krna padenga , so lets check storage first 
            // for coordinates, if we haved saved them there.
           
            getfromSessionStorage();

        }


    }
}



userTab.addEventListener("click" , ()=>{
    // pass clciked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click" , ()=>{
    // pass clciked tab as input paramter
    switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local coordinates nahi mila
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // Api Call
    try{
        const response =await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoConatiner.classList.add("active");
        renderWeatherInfo(data);


    }
    catch(err){
        loadingScreen.classList.remove("active");
      //H.w
    }


}

function renderWeatherInfo(weatherInfo){
    // firstly, we have to fetch the element.

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]"); 
    const temp = document.querySelector("[data-temp]");

    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

     // fetch value from weatherInfo object and put it UI elements.
     cityName.innerText = weatherInfo?.name
     countryIcon.src =`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText =weatherInfo?.weather?.[0].description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText =`${weatherInfo?.main?.temp} °C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s `;
     humidity.innerText = `${weatherInfo?.main?.humidity} %` ;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPostion);
    }
    else{
        //Hw show an alert for no geolocation support avilable
    }
}

function showPostion(postion){
    const userCoordinates = {
        lat : postion.coords.latitude,
        lon:  postion.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" ,JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener('click' ,getLocation);


let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" ,(e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName ===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoConatiner.classList.remove("active");
    grantAccessContainer.classList.remove("active");

  try{

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`

    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoConatiner.classList.add("active");
    renderWeatherInfo(data);


  }
  catch(err){
    // H.w Handle catch
  }


}