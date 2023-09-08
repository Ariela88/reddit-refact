import { SidebarCategories } from "./sidebar-categories.js";
import { RSSPost } from "./rss-post.js";

export default class RSS extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        
        this.rssList = [
            {
                "name": "Il Secolo XIX - Genova",
                "value": "https://www.ilsecoloxix.it/genova/rss"
            },
            {
                "name": "Il Secolo XIX - Levante",
                "value": "https://www.ilsecoloxix.it/levante/rss"
            },
            {
                "name": "Focus",
                "value": "https://www.focus.it/rss"
            },
            {
                "name": "GialloZafferano",
                "value": "https://www.giallozafferano.it/feed-www"
            }
        ];
        this.selectedRSS = [];
    }

    connectedCallback(){
        if(localStorage.getItem("rss-categories") !== null){
            this.completeCategoryList();
        }
        this.loadSavedRSS();
        this.render();
    }

   
    render(){
        const savedRSS = localStorage.getItem("rss");
        const container = document.getElementById("category-rss-container");
              container.innerHTML = "";
        this.shadowRoot.innerHTML = "";

     
        for (const rss of this.rssList) {
            const inputContainer = document.createElement("div");
            const inputElement = document.createElement("input");
                  inputElement.type = "checkbox";
                  inputElement.value = rss.value;
            if(savedRSS !== null && savedRSS.length > 0 && savedRSS.includes(rss.value)){
                inputElement.checked = true;
            }
            const inputTextElement = document.createElement("span") 
            const inputText = document.createTextNode(rss.name);

             inputElement.addEventListener("click", () =>{
                if(inputElement.checked){
                    this.selectedRSS.push(inputElement.value);
                } else {
                    this.selectedRSS = this.selectedRSS.filter(selectedRSS => selectedRSS !== inputElement.value)
                }
            })

            inputContainer.appendChild(inputElement);
            inputTextElement.appendChild(inputText);
            inputContainer.appendChild(inputTextElement);
            container.appendChild(inputContainer);
        }
        this.saveSelectedRSSIntoLocalStorage();
    }

      addNewCategoryToList(newCategory){
        let newCategoryObject = {
            "name": newCategory,
            "value": newCategory
        };
        this.rssList.push(newCategoryObject);
        localStorage.setItem("rss-categories", JSON.stringify(this.rssList))
        this.render();
    };

     loadSavedRSS(){
        const savedCategories = localStorage.getItem("rss");
        if(savedCategories !== null){
            JSON.parse(savedCategories).map(category => {
                this.selectedRSS.push(category);
                this.loadSavedCategoriesPosts();
                document.getElementById("selection-dialog-container").style.display = "none";
            })
        }
    };

      completeCategoryList(){
        let newCategoriesSlot = localStorage.getItem("rss-categories");
        const newCategoryList = [];
        JSON.parse(newCategoriesSlot).map(newCategory => newCategoryList.push(newCategory));
        this.rss = newCategoryList;
    }

     saveSelectedRSSIntoLocalStorage(){
        const saveButton = document.getElementById("save-button");
        saveButton.addEventListener("click", () => {
            document.getElementById('rss-container').innerHTML = ''
           
                if(this.selectedRSS.length > 0){
                localStorage.setItem("rss", JSON.stringify(this.selectedRSS));
                const container = document.getElementById("selection-dialog-container");
                container.style.display = "none";
                this.loadSavedCategoriesPosts();
            } else {
                
                const allRSS = [];
                for (const rss of this.rssList) {
                    allRSS.push(rss.value);
                }
                localStorage.setItem("rss", JSON.stringify(allRSS));
                const container = document.getElementById("selection-dialog-container");
                container.style.display = "none";
                this.loadSavedCategoriesPosts();
            }
            });
    }

    showRSSInSidebar(){
        const sidebar = new SidebarCategories();
        if(this.selectedRSS <= 0){
            sidebar.renderRSS(this.rssList);
        } else {
            const rssListOfSelected = this.rssList.filter(category => this.selectedRSS.includes(category.value));
            sidebar.renderRSS(rssListOfSelected)
        }
    }

      showRSS(title, link,description){
        const rssPost = new RSSPost();
        rssPost.parseInformation(title, link,description)
     
    }

     async loadSavedCategoriesPosts() {
        const savedRSS = localStorage.getItem("rss");
        JSON.parse(savedRSS).map(rss => {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = async function () {
                if (this.readyState == 4 && this.status == 200) {
                    const rssClass = new RSS();
                    let xmlDoc = this.responseXML;
                    let title = "";
                    let link = "";
                    let description = "";
                    let rawTitle = xmlDoc.getElementsByTagName("title");
                    let rawLink = xmlDoc.getElementsByTagName("link");
                    for (let i = 0; i < rawTitle.length; i++) {
                        title += rawTitle[i].childNodes[0].nodeValue + "<br>";
                    }
                    for (let i = 0; i < rawLink.length; i++) {
                        link += rawLink[i].childNodes[0].nodeValue + "<br>";
                    }
                    rssClass.showRSS(title, link, description);
                }
            };
            console.log(rss)
            xhttp.open("GET", rss, true);
            xhttp.send();
        });

        this.showRSSInSidebar()

         if (this.selectedRSS.length <= 0) {
            localStorage.removeItem("rss");
        }
    }

   

}

customElements.define("add-rss", RSS)