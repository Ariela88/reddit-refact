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

    parseInformation(titles, links, images) {
        const container = document.getElementById("rss-container");
        const titleArray = titles.split("<br>");
        const linkArray = links.split("<br>");
        //const descriptionArray = descriptions.split("<br>");


        for (let i = 0; i < titleArray.length; i++) {
            const title = titleArray[i];
            const link = linkArray[i];


            if (title !== "Focus.it" && link !== "https://www.focus.it/rss") {
                if (images.length > 0) {
                    let image = images[i].attributes.url;

                    let template = `
                    <div class="rss-container">
                        <div class="rss-header">
                            <a target="_blank" href="${link}">${title}</a>
                        </div>
                        <div class="rss-description">
                           <img src="${image.url} alt="">
                        </div>
                    </div>
                `;
                    container.innerHTML += template;
                } else {

                    let template = `
        <div class="rss-container">
            <div class="rss-header">
                <a target="_blank" href="${link}">${title}</a>
            </div>
           
        </div>`
                    container.innerHTML += template;
                }

            }
        }
    }



    render(posts) {
        if (currentRSSPost.length <= 0) {
            posts.forEach(post => {
                currentRSSPost.push(post)
            });
        }

        console.log(posts)

        const postContainer = document.getElementById("rss-container");
        postContainer.innerHTML = "";
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



    nextPost() {

    }


    backPost() {

    }

}

customElements.define("rss-post", RSSPost)