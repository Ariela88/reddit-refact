import Category from "./web-component/add-category.js";
import RSS from "./web-component/add-rss.js";
import { RedditPost } from "./web-component/reddit-post.js";


const redditCategory = new Category();
let rssCategory = new RSS();
let redditPost = new RedditPost();


// CONTROLLA SE VIENE ESEGUITO IL REFRESH DELLA PAGINA ED ELIMINA IL VALORE ALL'INTENRO DELL'INPUT
if (self.navigator.type == self.navigator.TYPE_RELOAD) {
    document.getElementById("input-new-category").value = "";
  }

// FUNZIONE CHE, QUANDO CHIAMATA, CONTROLLA
document.getElementById("open-dialog-category-container").addEventListener("click", () => {
    document.getElementById("selection-dialog-container").style.display = "flex";
});

// FUNZIONE CHE CONTROLLA L'OPTION SELEZIONATA E SE E' STATO INSERITO UN VALORE ALL'INTERNO DELL'INPUT, AGGIUNGENDO QUEL VALORE ALL'INTERNO DELLA LIST CORRISPONDETE E VISUALIZZANDOLO
document.getElementById("save-new-category-button").addEventListener("click", () => {
    const typeCategorySelected = document.getElementById("category-type-selection");
    const inputCategory = document.getElementById("input-new-category");
    if(typeCategorySelected.value === "reddit" && inputCategory){
        redditCategory.addNewCategoryToList(inputCategory.value);
    } else if (typeCategorySelected.value === "rss" && inputCategory){
        rssCategory.addNewCategoryToList(inputCategory.value);
    }
});

document.getElementById("close-category-dialog-button").addEventListener("click", () => {
    document.getElementById("selection-dialog-container").style.display = "none";
});

// document.getElementById("next-post-button").addEventListener("click", () => {
//     document.getElementById("post-container").innerHTML = "";
//     redditPost.nextPost()
// });

// document.getElementById("back-post-button").addEventListener("click", () => {
//     document.getElementById("post-container").innerHTML = "";
//     redditPost.backPost()
// });