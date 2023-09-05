import { RedditPost } from "./reddit-post.js";

export class SidebarCategories extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    };

    connectedCallback() {
    };

    // FUNZIONE CHE RENDERIZZA LA STRUTTURA HTML
    renderReddit(categoriesList) {
        const redditContainer = document.getElementById("sidebar-reddit-category-container");
        redditContainer.innerHTML = "";
        for(const category of categoriesList){
            const categoryButton = document.createElement("button");
            // FUNZIONE AL CLICK CHE PRENDE IL VALORE CORRISPONDENTE E CHIAMA LA FUNZIONE PER RECUPERARE LE INFORMAZIONI CORRISPONDENTI
                  categoryButton.addEventListener("click", () => {
                    this.showSelectedCategoryPosts(category.value);
                  })
            const buttonText = document.createTextNode(category.name);

            categoryButton.appendChild(buttonText);
            redditContainer.appendChild(categoryButton);
        }
    };

    // FUNZIONE CHE RECUPERA LE INFORMAZIONI DELLA CATEGORIA SELEZIONATA E CHIAMA LA FUNZIONE DI RENDER DEI POST
    async showSelectedCategoryPosts(category){
        const postList = [];
        const promisesList = [];
        const promise = fetch(`https://api.reddit.com/search.json?q=${category}=new`).then(resp => resp.json()).then(res => {
            if (res.data && res.data.children) {
                for (const information of res.data.children) {
                    postList.push(information.data)
                }
            }
        }).catch(err => console.log("Errore nel recupero dei post per la categoria: ", category));

        promisesList.push(promise);

        const redditPost = new RedditPost();

        Promise.all(promisesList).then(() => redditPost.render(postList));

        
    };

    // FUNZIONE CHE RENDERIZZA LA STRUTTURA HTML
    renderRSS(categoriesList) {
        const rssContainer = document.getElementById("sidebar-rss-category-container");
        console.log("sidebar rss", categoriesList)
        rssContainer.innerHTML = "";
        for(const category of categoriesList){
            const categoryButton = document.createElement("button");
            // FUNZIONE AL CLICK CHE PRENDE IL VALORE CORRISPONDENTE E CHIAMA LA FUNZIONE PER RECUPERARE LE INFORMAZIONI CORRISPONDENTI
                  categoryButton.addEventListener("click", () => {
                    this.showSelectedRSSPosts(category.value);
                  })
            const buttonText = document.createTextNode(category.name);

            categoryButton.appendChild(buttonText);
            rssContainer.appendChild(categoryButton);
        }
    };

    // FUNZIONE CHE RECUPERA LE INFORMAZIONI DELLA CATEGORIA SELEZIONATA E CHIAMA LA FUNZIONE DI RENDER DEI POST
    async showSelectedRSSPosts(category){
        console.log(category)        
    };


}

customElements.define("sidebar-categories", SidebarCategories)