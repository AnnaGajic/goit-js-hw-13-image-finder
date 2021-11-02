import './sass/main.scss';
import 'basiclightbox/dist/basicLightbox.min.css';
import picSearch from './apiService';
import templateCard from './template/card.hbs'
import getRefs from './get-refs';
import * as basicLightbox from 'basiclightbox'
const debounce = require('lodash.debounce');
const picSrch = new picSearch();

const { input, gallery, showMore } = getRefs;

showMore.addEventListener('click', showMoreHandler)

function showMoreHandler(){
    if(picSrch.data.length > 0){
        picSrch.next().then(draw.bind(this))
    }
}

function eventAttach(){
    const photo_cards = gallery.querySelectorAll('.photo-card');
    photo_cards.forEach((element) => { 
        if(element.getAttribute('modal_event') != "1"){
            element.addEventListener('click', clickImageHandler.bind(null, element));
            element.setAttribute('modal_event', '1');
        }
    });
}

function clickImageHandler(obj, evt){
    const id = obj.getAttribute('ed');
    // const { largeImageURL } = picSrch.getDataById(id);
    const { src } = picSrch.getDataById(id);
    
    const instance = basicLightbox.create(`<img src="${src.original}" width="800" height="600">`);
    instance.show()
    
}

const draw = (data) => {
    let g = document.getElementById('gallery');
    if(!picSrch.isNext())
        g.innerHTML = "";

    let scroll = true;
    for (let index = 0; index < data.hits.length; index++) {
        const element = data.hits[index];
        g.insertAdjacentHTML('beforeend', templateCard(element));

        if(scroll){
            g.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end', });
            scroll = false;
        }
    }
    eventAttach();
    
    if(data.total_results > (data.per_page * data.page)){
        showMore.style.display = 'block';
    }
    else{
        showMore.style.display = "none";
    }
}

const searchPictures = () => {
    if(!input.value)
        return;
    picSrch.setSearch(input.value);
    picSrch.fetch().then(draw.bind(this))
}


input.addEventListener('keyup', debounce(searchPictures.bind(this), 700));
