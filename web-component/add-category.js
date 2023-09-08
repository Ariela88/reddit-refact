import { RedditPost } from "./reddit-post.js";
import { SidebarCategories } from "./sidebar-categories.js";


export default class Category extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.selectedCategories = [];
        this.postsList = [];
        this.categoryList = [
            {
                "name": "Gaming",
                "value": "gaming"
            },
            {
                "name": "Animali",
                "value": "animals_and_pets"
            },
            {
                "name": "Crypto",
                "value": "crypto"
            },
            {
                "name": "Televisione",
                "value": "television"
            },
            {
                "name": "Anime",
                "value": "anime"
            },
            {
                "name": "Arte",
                "value": "art"
            },
            {
                "name": "Cibo e Bevande",
                "value": "food_and_drink"
            },
            {
                "name": "Programmazione",
                "value": "programming"
            },
            {
                "name": "Viaggi",
                "value": "travel"
            }
        ];
    };

    connectedCallback() {
        if (localStorage.getItem("reddit-categories") !== null) {
            this.completeCategoryList();
        }
        this.loadSavedCategories();
        this.render();
    };


    render() {
        const savedCategories = localStorage.getItem("categories");
        const container = document.getElementById("category-reddit-container");
        container.innerHTML = "";
        this.shadowRoot.innerHTML = "";


        for (const category of this.categoryList) {
            const inputContainer = document.createElement("div");
            const inputElement = document.createElement("input");
            inputElement.type = "checkbox";
            inputElement.value = category.value;
            if (savedCategories !== null && savedCategories.length > 0 && savedCategories.includes(category.value)) {
                inputElement.checked = true;
            }
            const inputTextElement = document.createElement("span")
            const inputText = document.createTextNode(category.name);

            inputElement.addEventListener("click", () => {
                if (inputElement.checked) {
                    this.selectedCategories.push(inputElement.value);
                } else {
                    this.selectedCategories = this.selectedCategories.filter(selectedCategory => selectedCategory !== inputElement.value)
                }
            })

            inputContainer.appendChild(inputElement);
            inputTextElement.appendChild(inputText);
            inputContainer.appendChild(inputTextElement);
            container.appendChild(inputContainer);
        }
        this.saveSelectedCategoriesIntoLocalStorage();
    };


    addNewCategoryToList(newCategory) {
        let newCategoryObject = {
            "name": newCategory,
            "value": newCategory
        };
        this.categoryList.push(newCategoryObject);
        localStorage.setItem("reddit-categories", JSON.stringify(this.categoryList))
        this.render();
    };


    loadSavedCategories() {
        const savedCategories = localStorage.getItem("categories");
        if (savedCategories !== null) {
            JSON.parse(savedCategories).map(category => {
                this.selectedCategories.push(category);
                this.loadSavedCategoriesPosts();
                document.getElementById("selection-dialog-container").style.display = "none";
            })
        }
    };


    completeCategoryList() {
        let newCategoriesSlot = localStorage.getItem("reddit-categories");
        const newCategoryList = [];
        JSON.parse(newCategoriesSlot).map(newCategory => newCategoryList.push(newCategory));
        this.categoryList = newCategoryList;
    }


    saveSelectedCategoriesIntoLocalStorage() {
        const saveButton = document.getElementById("save-button");
        saveButton.addEventListener("click", () => {

            if (this.selectedCategories.length > 0) {
                localStorage.setItem("categories", JSON.stringify(this.selectedCategories));
                const container = document.getElementById("selection-dialog-container");
                container.style.display = "none";
                this.loadSavedCategoriesPosts();
            } else {
                const allCategories = [];
                for (const category of this.categoryList) {
                    allCategories.push(category.value);
                }
                localStorage.setItem("categories", JSON.stringify(allCategories));
                const container = document.getElementById("selection-dialog-container");
                container.style.display = "none";
                this.loadSavedCategoriesPosts();
            }
        });
    };

    async loadSavedCategoriesPosts() {
        this.postsList = [];
        const promisesList = [];
        const savedCategories = localStorage.getItem("categories");
        JSON.parse(savedCategories).map(category => {
            const promise = fetch(`https://api.reddit.com/search.json?q=${category}=new`).then(resp => resp.json()).then(res => {
                if (res.data && res.data.children) {
                    for (const information of res.data.children) {
                        this.postsList.push(information.data)
                    }
                }
            }).catch(err => console.log("Errore nel recupero dei post per la categoria: ", category));

            promisesList.push(promise);
        });

        this.showCategoriesInSidebar();




        if (this.selectedCategories.length <= 0) {
            localStorage.removeItem("categories");
        }

        Promise.all(promisesList).then(() => this.showPosts());


    };


    showPosts() {
        const redditPost = new RedditPost();
        redditPost.render(this.postsList);
    };


    showCategoriesInSidebar() {
        const sidebar = new SidebarCategories();
        if (this.selectedCategories <= 0) {
            sidebar.renderReddit(this.categoryList);
        } else {
            const categoryListOfSelected = this.categoryList.filter(category => this.selectedCategories.includes(category.value));
            sidebar.renderReddit(categoryListOfSelected)
        }
    }

}

customElements.define("add-category", Category)