const currentPost = []
export class RedditPost extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.remainingPosts = 0;
        this.index = 0;
    };

    connectedCallback() {
    };

    // FUNZIONE CHE RENDERIZZA LA STRUTTURA HTML
    render(posts) {
        // SE NON SONO PRESENTI POST SALVATI IN LOCALE, VENGONO AGGIUNTI ALLA PRIMA CHIAMATA
        if (currentPost.length <= 0) {
            posts.forEach(post => {
                currentPost.push(post)
            });
        }

        console.log(posts)

        const postContainer = document.getElementById("post-container");
        postContainer.innerHTML = "";

        // LOOP CHE CICLA SULLE INFORMAZIONI, COSTRUENDO UN TEMPLATE HTML CON ESSE ED INSERENDOLE ALL'INTERNO DELL'ELEMENTO CONTAINER
        for (let i = 0; i < 10; i++) {
            const post = posts[i];
            if (post.preview) {
                const templateWithImage = `
                    <div class="post-container">
                        <div class="post-header">
                            <span>${post.subreddit_name_prefixed}</span>
                            <span>${post.author}</span>
                            <span>${this.calcTimeDifference(post.created)}</span>
                            
                        </div>
                        <div class="post-content-image">
                            <span class="title">${post.title}</span>
                            <img src="${post.preview.images[0].source.url}">
                        </div>
                        <div class="link-span"> <span><a href="${post.url}" target="_blank" rel="noopener noreferrer"> vai al link</a></span></div>
                        
                    </div>
                `;
                postContainer.innerHTML += templateWithImage;
            } else {
                const templateWithoutImage = `
                    <div class="post-container">
                        <div class="post-header">
                            <span>${post.subreddit_name_prefixed}</span>
                            <span>${post.author}</span>
                            <span>${this.calcTimeDifference(post.created)}</span>
                        </div>
                        <div class="post-content-text">
                            <span class="title">${post.title}</span>
                            <span>${post.selftext.slice(0, 200)}...</span>
                            <span><a href="${post.url}" target="_blank" rel="noopener noreferrer"> vai al link</a></span>

                        </div>
                    </div>
                `;
                postContainer.innerHTML += templateWithoutImage;
            }

        }
    };

    // FUNZIONE CHE CALCOLA LA DIFFERENZA DI TEMPO TRA LA CREAZIONE DEL POST E ADESSO
    calcTimeDifference(creationTime) {
        let now = new Date().getTime();
        let hour = 1000 * 60 * 60;
        let difference = now - (creationTime * 1000);
        if (difference < hour) {
            return "alcuni minuti fa";
        } else if (difference === hour) {
            return "1 ora fa";
        } else if (difference > hour) {
            let day = hour * 24;
            if (difference < 24) {
                Math.round(difference / hour) + " ore fa";
            } else if (difference === day) {
                return "1 giorno fa"
            } else if (difference > day) {
                let month = day * 30;
                if (difference < month) {
                    return Math.round(difference / day) + " giorni fa";
                } else if (difference === month) {
                    return "1 mese fa";
                } else if (difference > month) {
                    let year = day * 365;
                    if (difference < year) {
                        return Math.round(difference / month) + " mesi fa";
                    } else if (difference === year) {
                        return "1 anno fa";
                    } else if (difference > year) {
                        return Math.round(difference / year) + " anni fa";
                    }
                }
            }
        }
    }

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

customElements.define("reddit-post", RedditPost)