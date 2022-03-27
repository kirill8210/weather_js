const API_KEY = '86f1b43a2e0d3287087f3ac22b5d744b';
const KEY = 'Citys';
const cityOutput = document.getElementById('city_output');
const cityError = document.getElementById('city_error');
const cityInput = document.getElementById('city_input');
const cityForm = document.getElementById('city_form');
const cityLocal = JSON.parse(localStorage.getItem(KEY)) || [];
const cityShow = [];

const oneCity = (cityShow) => {
    const {
        name,
        temp,
        speed,
        humidity,
        description
    } = cityShow;
    const card = document.createElement('div');

    card.insertAdjacentHTML('afterbegin', `    
        <div class="card" data-id="${name}">
            <div class="card_title" >${name}</div>
            <div><span>Температура: </span>${temp} °C</div>
            <div><span>Скорость ветра: </span>${speed} m/s</div>
            <div><span>Влажность: </span>${humidity} %</div>
            <div><span>Состояние: </span>${description}</div>
        </div>    
    `);

    return card;
};

const addCity = (e) => {
    e.preventDefault();
    let cityName = cityInput.value;
    cityInput.value = '';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ru&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            if (cityOutput) {
                cityShow.push({
                    name: data.name,
                    temp: data.main.temp,
                    speed: data.wind.speed,
                    humidity: data.main.humidity,
                    description: data.weather[0].description
                });
                cityOutput.textContent = '';
                const cards = cityShow.map(oneCity);
                cityOutput.append(...cards);
            }
            if(data.name){
                cityLocal.push({
                    id: cityLocal.length + 1,
                    name: data.name,
                });
                localStorage.setItem(KEY, JSON.stringify(cityLocal));
            }
        })
        .catch(function() {
            cityError.textContent = 'Введите город';
            cityInput.style.borderColor = 'crimson';

            setTimeout(() =>{
                cityInput.style.borderColor = '';
                cityError.textContent = '';
            }, 1500)
        });
};

let cityLocalName = cityLocal.map(item => item.name);

const localCity = () =>{
    let requests = cityLocalName.map(city => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=${API_KEY}&units=metric`));

    Promise.all(requests)
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(citys => citys.forEach(city => {
            if (cityOutput) {
                cityShow.push({
                    name: city.name,
                    temp: city.main.temp,
                    speed: city.wind.speed,
                    humidity: city.main.humidity,
                    description: city.weather[0].description
                });
                cityOutput.textContent = '';
                const cards = cityShow.map(oneCity);
                cityOutput.append(...cards);
            }
        }));
};

localCity();

const removeCity = e => {

    if (!e.target.classList.contains('card')) return;
    const id = e.target.dataset.id.toLowerCase();
    const index = cityLocal.findIndex(city => city.name.toLowerCase() === id);
    if (index > -1) cityLocal.splice(index, 1);
    if (index > -1) cityShow.splice(index, 1);
    localStorage.setItem(KEY, JSON.stringify(cityLocal));

    cityOutput.textContent = '';
    const cards = cityShow.map(oneCity);
    cityOutput.append(...cards);
};

cityForm.addEventListener('submit', addCity);
cityOutput.addEventListener("click", removeCity);

