// 防止用户直接访问游戏页面，必须通过主站进入
(function () {
    if (window.self === window.top) {
        window.location.href = "https://sprunkigame.com/";
        return;
    }
})();

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
        "sprunkiplaytime.com",
        "lovepawsona.app",
        "192.168.50.66"
    ];

    // Check if the script is running inside an iframe
    const inIframe = window.location !== window.parent.location;
    // console.log(inIframe);

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
    const isAllowed = allowedDomains.some((domain) =>
        referrerDomain.includes(domain)
    );

    // If not in iframe, or referrer domain is allowed, do not display the bar
    if (!inIframe || isAllowed) {
        console.log(
            `Not in iframe or referrer domain is allowed (${referrerDomain}), script will not run.`
        );
        return; // Exit the script
    } else if (inIframe && !isAllowed) {
        // console.log('window.location',window.location)
        // console.log('window.parent.location',window.parent.location)
        // 从URL中提取游戏名称
        const gameUrl = window.location.href;
        const gameNameMatch = gameUrl.match(/game\/(.*?)\/index\.html/);
        const gameName = gameNameMatch ? gameNameMatch[1] : '';
        
        // 格式化游戏名称显示（将连字符替换为空格，首字母大写）
        const formattedGameName = gameName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // 添加时间戳来防止缓存
        const timestamp = new Date().getTime();
        const scriptSrc = `<script async src="https://sprunkigame.com/js/playgame.js?v=${timestamp}" charset="utf-8"></script>`;

        // 创建正确的iframe代码示例
        const correctIframeCode = `<blockquote style="width:100%;height:100%;">
<a href="https://sprunkigame.com/${gameName}/" title="Play ${formattedGameName} Online">Play ${formattedGameName}</a>
</blockquote>
${scriptSrc}`;

        // HTML转义函数
        const escapeHtml = (text) => {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 500px;
            width: 90%;
        `;

        modal.innerHTML = `
            <h3 style="margin-top: 0;color:black;">Please use the correct embed code:</h3>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;color:black;">${escapeHtml(correctIframeCode)}</pre>
            <button id="copyBtn" style="
                background: #fcb70a;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Copy Code</button>
            <button id="closeBtn" style="
                background: #eee;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
            ">Close</button>
        `;

        document.body.appendChild(modal);

        // 添加复制功能
        document.getElementById('copyBtn').addEventListener('click', () => {
            // 创建一个临时文本区域
            const textarea = document.createElement('textarea');
            textarea.value = correctIframeCode;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            try {
                // 选择文本并尝试复制
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                alert('Code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy code. Please try selecting and copying manually.');
            }
        });

        // 添加关闭功能
        document.getElementById('closeBtn').addEventListener('click', () => {
            modal.remove();
        });
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
    const iframeTop =
        window.location !== window.parent.location
            ? document.referrer
            : document.location;
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
