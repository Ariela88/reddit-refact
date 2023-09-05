const currentRSSPost = []
export class RSSPost extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.remainingPosts = 0;
        this.index = 0;
    };

    connectedCallback() {
    };

    parseInformation(titles, links) {
        const container = document.getElementById("rss-container");
        const titleArray = titles.split("<br>");
        const linkArray = links.split("<br>");
        for (let i = 0; i < titleArray.length; i++) {
            const title = titleArray[i];
            const link = linkArray[i];
            if(title !== "Focus.it" && link !== "https://www.focus.it/rss"){
            const template = `
                    <div class="rss-container">
                        <div class="rss-header">
                            <a href="${link}">${title}</span>
                        </div>
                    </div>
            `;
            
            container.innerHTML += template
            }
        }

    }

    // FUNZIONE CHE RENDERIZZA LA STRUTTURA HTML
    render(posts) {
        // SE NON SONO PRESENTI POST SALVATI IN LOCALE, VENGONO AGGIUNTI ALLA PRIMA CHIAMATA
        if (currentRSSPost.length <= 0) {
            posts.forEach(post => {
                currentRSSPost.push(post)
            });
        }

        console.log(posts)

        const postContainer = document.getElementById("rss-container");
        postContainer.innerHTML = "";

        // LOOP CHE CICLA SULLE INFORMAZIONI, COSTRUENDO UN TEMPLATE HTML CON ESSE ED INSERENDOLE ALL'INTERNO DELL'ELEMENTO CONTAINER
        for (let i = 0; i < 10; i++) {
            const post = posts[i];
                const template = `
                    <div class="post-container">
                        <div class="post-header">
                            <span>${post.subreddit_name_prefixed}</span>
                            <span>${post.author}</span>
                            <span>${this.calcTimeDifference(post.created)}</span>
                        </div>
                        <div class="post-content-image">
                            <span class="title">r/ ${post.title}</span>
                            <img src="${post.preview.images[0].source.url}">
                        </div>
                    </div>
                `;
                postContainer.innerHTML += template;

        }
    };


    // FUNZIONE CHE MOSTRA I 10 POST SEGUENTI 
    nextPost() {
        //modificare funzione
        // if(this.index < (currentPost.length - 1) && this.index + 10 <= currentPost.length - 1){
        //     this.index += 10;
        //     this.remainingPosts -= 10;
        // }
        // this.render(currentPost);
    }

    // FUNZIONE CHE MOSTRA I 10 POST PRECEDENTI
    backPost() {
        // modificare funzione
        // if(this.index > 0){
        //     this.index -= 10;
        //     this.remainingPosts += 10;
        // }
        // this.render(currentPost);
    }

}

customElements.define("rss-post", RSSPost)