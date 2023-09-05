import { SidebarCategories } from "./sidebar-categories.js";
import { RSSPost } from "./rss-post.js";

export default class RSS extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        // ARRAY IN CUI SONO PRESENTI I PRINCIPALI RSS (NOME VISUALIZZATO E VALORE PER LA RICERCA)
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

    // FUNZIONE CHE RENDERIZZA LA STRUTTURA HTML
    render(){
        const savedRSS = localStorage.getItem("rss");
        const container = document.getElementById("category-rss-container");
              container.innerHTML = "";
        this.shadowRoot.innerHTML = "";

        // LOOP CHE CICLA SUGLI RSS SALVATE, CREANDO GLI INPUT PER LA SCELTA DA PARTE DELL'UTENTE
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

            // METODO CHE CONTROLLA LA CHECKBOX QUANDO VIENE CLICCATA; SE E' CHECKATA, PUSHA IL VALORE ALL'INTERNO DELL'ARRAY, ALTRIMENTI LO FILTRA, ELIMINANDO IL VALORE DESELEZIONATO
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

     // FUNZIONE CHE AGGIUNGE ALLA LISTA DI CATEGORIE QUELLA AGGIUNTA DALL'UTENTE
     addNewCategoryToList(newCategory){
        let newCategoryObject = {
            "name": newCategory,
            "value": newCategory
        };
        this.rssList.push(newCategoryObject);
        localStorage.setItem("rss-categories", JSON.stringify(this.rssList))
        this.render();
    };

    // FUNZIONE CHE RECUPERA, SE PRESENTI, GLI RSS SALVATE E LE SOSTITUISCE ALL'ARRAY DI RSS SELEZIONATI
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

     // FUNZIONE CHE RECUPERA LE INFORMAZIONI RIGUARDO ALLA LISTA MODIFICATA DALL'UTENTE, SALVANDOLA AL POSTO DI QUELLA DI DEFEAULT
     completeCategoryList(){
        let newCategoriesSlot = localStorage.getItem("rss-categories");
        const newCategoryList = [];
        JSON.parse(newCategoriesSlot).map(newCategory => newCategoryList.push(newCategory));
        this.rss = newCategoryList;
    }

    // FUNZIONE DEL BUTTON CHE SALVA IN LOCALE GLI RSS SELEZIONATI
    saveSelectedRSSIntoLocalStorage(){
        const saveButton = document.getElementById("save-button");
        saveButton.addEventListener("click", () => {
            document.getElementById('rss-container').innerHTML = ''
            // IL SALVATAGGIO AVVIENE SOLAMENTE SE ALMENO UNA DELLE CATEGORIE E' SELEZIONATA
                if(this.selectedRSS.length > 0){
                localStorage.setItem("rss", JSON.stringify(this.selectedRSS));
                const container = document.getElementById("selection-dialog-container");
                container.style.display = "none";
                this.loadSavedCategoriesPosts();
            } else {
                // ALTRIMENTI, SE NON VIENE SELEZIONATA NESSUNA CATEGORIA, VENGONO SELEZIONATE AUTOMATICAMENTE TUTTE (QUESTO VERRA' ELIMINATO SE ALLA FINE DELLA SESSIONE NON VIENE SELEZIONATA NESSUNA CATEGORIA)
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

    // FUNZIONE CHE ESEGUE LA FETCH PER LE SINGOLE CATEGORIE; QUANDO QUESTE SONO COMPLETE, VIENE CHIAMATA UNA SECONDA FUNZIONE, CHE VISUALIZZA LE INFORMAZIONI ALL'UTENTE
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
                    let rawTitle = xmlDoc.getElementsByTagName("title");
                    let rawLink = xmlDoc.getElementsByTagName("link");
                    for (let i = 0; i < rawTitle.length; i++) {
                        title += rawTitle[i].childNodes[0].nodeValue + "<br>";
                    }
                    for (let i = 0; i < rawLink.length; i++) {
                        link += rawLink[i].childNodes[0].nodeValue + "<br>";
                    }
                    rssClass.showRSS(title, link);
                }
            };
            console.log(rss)
            xhttp.open("GET", rss, true);
            xhttp.send();
        });

        this.showRSSInSidebar()

        // IL LOCAL STORAGE VIENE ELIMINATO SOLO SE NON SONO STATE SELEZIONATE DELLE CATEGORIE
        if (this.selectedRSS.length <= 0) {
            localStorage.removeItem("rss");
        }
    }

    // FUNZIONE CHE, UNA VOLTA ESEGUITO L'USCITA DALLA DIALOG PER LA SELEZIONE, MOSTRA LE CATEGORIE SELEZIONATE OPPURE, IN CASO DI MANCATA SELEZIONE, TUTTI QUELLI PRESENTI DI DEFAULT
    showRSSInSidebar(){
        const sidebar = new SidebarCategories();
        if(this.selectedRSS <= 0){
            sidebar.renderRSS(this.rssList);
        } else {
            const rssListOfSelected = this.rssList.filter(category => this.selectedRSS.includes(category.value));
            sidebar.renderRSS(rssListOfSelected)
        }
    }

    // FUNZIONE CHE, UNA VOLTA RECUPERATI LE INFORMAZIONI, LE MOSTRA SOTTO FORMA DI POST
    showRSS(title, link){
        const rssPost = new RSSPost();
        rssPost.parseInformation(title, link)
        //    console.log("TITOLO", title)
        //    console.log("LINK", link)
    }

}

customElements.define("add-rss", RSS)