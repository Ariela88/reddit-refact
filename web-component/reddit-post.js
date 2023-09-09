const currentPost = []
export class RedditPost extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.remainingPosts = 0;
        this.index = 0;
        this.postsPerPage = 10; 
    this.currentIndex = 0;
    };

    connectedCallback() {
    };

     render(posts) {
       
        if (currentPost.length <= 0) {
            posts.forEach(post => {
                currentPost.push(post)
            });
        }
    
        const postContainer = document.getElementById("post-container");
        postContainer.innerHTML = "";
    
        const startIndex = this.currentIndex;
        const endIndex = Math.min(this.currentIndex + this.postsPerPage, currentPost.length);
    
        for (let i = startIndex; i < endIndex; i++) {
            const post = currentPost[i];
            if (post.preview) {
                const templateWithImage = `
                    <div class="post-container">
                        <div class="post-header">
                           <span> <a href="https://www.reddit.com/${post.subreddit_name_prefixed}/" target="_blank" rel="">${post.subreddit_name_prefixed}</a></span>
                           <span> <a href="https://www.reddit.com/user/${post.author}/" target="_blank" rel="">${post.author}</a></span>
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
    }
    
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

     nextPost() {
        console.log('next')
        if (this.currentIndex + this.postsPerPage < currentPost.length) {
            this.currentIndex += this.postsPerPage;
            this.render(currentPost);
          
            const backButton = document.getElementById("back-post-button");
            backButton.style.display = "block";
          }
    }

    
    
    backPost() {
        if (this.currentIndex >= this.postsPerPage) {
            this.currentIndex -= this.postsPerPage;
            this.render(currentPost);
          } else {
            alert("Nessuna pagina precedente.");
            this.render();
          }
        
         
          if (this.currentIndex === 0) {
            const backButton = document.getElementById("back-post-button");
            backButton.style.display = "none";
          }
    }
    

    async displayMostRecentPost() {
        const postContainer = document.getElementById("post-container");
        postContainer.innerHTML = "";
      
        const subreddit = 'popular';
      
        try {
          const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json`);
          const data = await response.json();
      
          if (data && data.data && data.data.children) {
            const postList = data.data.children.map(child => child.data);
            this.render(postList);
          } else {
            console.error('Dati non validi dalla richiesta API di Reddit.');
          }
        } catch (error) {
          console.error('Errore nella richiesta API di Reddit:', error);
        }
      }
      
      


}

customElements.define("reddit-post", RedditPost)