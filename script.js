const wrapper =document.querySelector(".wrapper");
const searchInput = document.querySelector("input");
const infoText = wrapper.querySelector(".info-text");
const synonyms = wrapper.querySelector(".synonyms .list");
const examplebar = document.querySelector(".example span");
const volumeIcon = wrapper.querySelector(".word i"),
removeIcon = wrapper.querySelector(".search span");

let audio;

//data function
function data(result,word){

    //if api returns we cant find the word
    if(result.title){
        infoText.innerHTML= `Cannot find the meaning of <span>"${word}"</span>. Please try another`
    }
    else{
        wrapper.classList.add("active");
        console.log(result);
       
       let defcount =0;

        if(result[0].meanings.length>1)
        {


            for(let pl =0; pl< result[0].meanings.length; pl++)
            {
                if(result[0].meanings[pl].definitions[0].example != undefined)
                {
                    defcount = pl;
                    break;
                }
            }

        }


        let definitions = result[0].meanings[defcount].definitions[0];
        let phonetics = `${result[0].meanings[defcount].partOfSpeech} /${result[0].phonetics[0].text}/`;
        let Syno = result[0].meanings[defcount].synonyms;
       
        //lets pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        examplebar.innerText = definitions.example;

        for(let al =0; al< result[0].phonetics.length; al++)
        {
            if(result[0].phonetics[al].audio != undefined &&
                result[0].phonetics[al].audio)
            {
                audio = new Audio( result[0].phonetics[al].audio);
                //console.log( result[0].phonetics[al].audio);
                break;
            }
        }
      
       //creating audio for pronouncitation

        if(definitions.example == undefined)
        {
            examplebar.parentElement.style.display = "none";
        }
        else
        {
            examplebar.parentElement.style.display ="block";
        }


        if(Syno == null || Syno.length<1 || Syno[0]==undefined
        )
            {
                //no symoms hide the list
                synonyms.parentElement.style.display="none";
            }
        else{
            synonyms.parentElement.style.display="block";
            synonyms.innerHTML = "";
        for(let i = 0; i<5; i++)
        { 
            
            //getting al 5 dynoms for now
            if(Syno.length>i){
                //if we have enough
                //now make the synoms clicks
            let tag = `<span onclick=search('${Syno[i]}')>${Syno[i]},</span>`;
            synonyms.insertAdjacentHTML("beforeend",tag);
            }
            //passing all 5 synoms inside the the html element
        }
            }

            infoText.innerHTML = ``;
    }
}

function search(word)
{
   
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML =`Type in a word to get its meaning , synomyms and pronunciation`;
    searchInput.value =word; //the input part
    fecthApi(word);
}
//fecth api function
function fecthApi(word)
{
    wrapper.classList.remove("active");
    //start searching
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching Meaning of <span>"${word}"</span>`;
    let url =`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

   // let urli = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=436c07cb-edbf-4b8c-b953-39991ecf0bf6`;
    //fecthing api responce and returning it with parsing into js obj
    //and
    //in another method callling the data function with passing api response and searched
    //word as an argument
    fetch(url).then(res=> res.json()).then(result => data(result,word));
    //fetch(urli).then(res=> res.json()).then(result => data(result,word));

}

searchInput.addEventListener("keyup", e=>{

    if(e.key === "Enter" && e.target.value)
    {
        fecthApi(e.target.value);
    }

});

volumeIcon.addEventListener("click",()=>{

    audio.play();
});

removeIcon.addEventListener("click", ()=>{
    searchInput.value="";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9a9a9a";
    infoText.innerHTML =`Type in a word to get its meaning , synomyms and pronunciation`;
});