(function () {
    // Define the list of allowed domains
    const allowedDomains = [
        "sprunkigame.com",
        "s.sprunkigame.com",
        "sprunkiretake.app",
        "spunky.im",
        "sprunkiincredibox.com",
        "s.sprunkiincredibox.com",
        "abgerny.im",
        "sprunk.io",
        "sprunked.im",
        "sprunksters.im",
        "sprunkiphase.im",
        // "192.168.50.66"
    ];

    // Check if the script is running inside an iframe
    const inIframe = (window.location !== window.parent.location);

    // Extract the referrer domain
    const referrer = document.referrer;
    let referrerDomain = "";

    if (referrer) {
        try {
            const url = new URL(referrer);
            referrerDomain = url.hostname;
        } catch (e) {
            console.warn("Invalid referrer URL:", referrer);
        }
    }

    // Check if the referrer domain is in the allowed list
    const isAllowed = allowedDomains.some(domain => referrerDomain.includes(domain));

    // If not in iframe, or referrer domain is allowed, do not display the bar
    if (!inIframe || isAllowed) {
        // console.log(`Not in iframe or referrer domain is allowed (${referrerDomain}), script will not run.`);
        return; // Exit the script
    }

    // Add the CSS dynamically
    const style = document.createElement("style");
    style.textContent = `
        .bottom-bar {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 0;
            z-index: 2;
            width: 100%;
            font-family: sans-serif;
        }

        .bottom-bar-container {
            display: flex;
            align-items: center;
            background: rgb(33, 34, 51);
            height: 45px;
            padding: 0 16px;
            box-sizing: border-box;
            gap: 20px;
        }

    #app, #loading, #error, #launch {
      height: calc(100% - 45px) !important;
    }

        .logo-container {
            display: flex;
            align-items: center;
        }

        .logo-link {
            display: flex;
            align-items: center;
            text-decoration: none;
        }

        .logo-icon svg {
            fill: rgb(252 183 10);
            width: 23px;
            height: 26px;
        }

        .more-games-container {
            display: flex;
            align-items: center;
        }

        .more-games-link {
            display: flex;
            align-items: center;
            font-size: 1rem;
            font-weight: bold;
            color: white;
            text-decoration: none;
            white-space: nowrap;
        }

        .highlighted-text {
            color: rgb(252 183 10);
            margin-left: 5px;
        }

        .arrow-icon {
            fill: rgb(252 183 10);
            margin-left: 5px;
            margin-bottom: -4px;
        }

       .more-games-container img {
        margin-left: 5px;
        margin-bottom: -4px;
        }

       .logo-icon img {
         width: 23px;
         height: 26px;
        }

        .more-games-link:hover .highlighted-text,
        .more-games-link:hover .arrow-icon {
            color: white;
            fill: white;
        }
    `;
    document.head.appendChild(style);

    // Add the HTML structure
    const iframeTop = (window.location !== window.parent.location) ? document.referrer : document.location;
    const bottomBar = document.createElement("div");
    bottomBar.className = "bottom-bar";
    bottomBar.innerHTML = `
        <div class="bottom-bar-container">
            <div class="logo-container">
                <a href="https://sprunkigame.com/?utm_source=${iframeTop}" 
                   target="_blank" class="logo-link">
                    <div class="logo-icon">
                        <img src="https://sprunkigame.com/img/android-chrome-192x192.png" alt="Logo">
                    </div>
                </a>
            </div>
            <div class="more-games-container">
                <a href="https://sprunkigame.com/?from=${iframeTop}/" 
                   target="_blank" class="more-games-link">
                    <span>More Sprunki Games on</span>
                    <span class="highlighted-text">Sprunkigame.com</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" width="18" height="18">
<path d="M10 15.0657V8.93426C10 8.53491 10.4451 8.29671 10.7773 8.51823L15.376 11.584C15.6728 11.7819 15.6728 12.2181 15.376 12.416L10.7774 15.4818C10.4451 15.7033 10 15.4651 10 15.0657Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 15.0657V8.93426C9.5 8.13556 10.3901 7.65917 11.0547 8.10221L15.6533 11.1679C16.247 11.5638 16.247 12.4362 15.6533 12.8321L11.0547 15.8978C10.3901 16.3408 9.5 15.8644 9.5 15.0657ZM10 8.93426V15.0657C10 15.4651 10.4451 15.7033 10.7774 15.4818L15.376 12.416C15.6728 12.2181 15.6728 11.7819 15.376 11.584L10.7773 8.51823C10.4451 8.29671 10 8.53491 10 8.93426Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                </svg>
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(bottomBar);
})();