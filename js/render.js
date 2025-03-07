// 在文件顶部添加变量声明
let hasRendered = false;

// 自动检测环境并设置开发模式
const isLocalEnvironment = 
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('192.168.') || 
    window.location.hostname.includes('127.0.0.1');

const DEBUG = isLocalEnvironment; // 本地环境自动开启调试模式
const DEBUG_DOMAIN = 'sprunkigame.com'; // 设置要测试的域名
// const DEBUG_DOMAIN = 'sprunkiincredibox.com'; // 设置要测试的域名

// 创建新的header内容
const newHeader = `
<header class="bg-gradient-to-r from-green-700 to-blue-600 text-white p-6 shadow-md relative z-50">
    <div class="container mx-auto">
        <nav class="flex justify-between items-center">
            <div class="logo">
                <a href="../" class="flex items-center space-x-4">
                    <img src="../img/android-chrome-192x192.png" alt="Sprunki Game Logo" class="w-10 h-10 rounded-full shadow-sm">
                    <h2 class="text-4xl font-bold tracking-wide">Sprunki Game</h2>
                </a>
            </div>
            <ul class="nav-links hidden md:flex space-x-6 items-end">
                <li><a href="../play/" class="group relative hover:text-yellow-300 transition-all duration-300 font-bold py-2 px-4 rounded-lg hover:bg-white/10">
                    Play Sprunki
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </a></li>
                <li><a href="../mod/" class="group relative hover:text-yellow-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10">
                    Mod
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </a></li>
                <li><a href="../download/" class="group relative hover:text-yellow-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10">
                    Download
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </a></li>
                <li><a href="../sprunki-characters/" class="group relative hover:text-yellow-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10">
                    Characters
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </a></li>
                <li><a href="../sprunki-phase/" class="group relative hover:text-yellow-300 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10">
                    Phase
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
                </a></li>

                <li class="nav-container">
                    <div class="language-dropdown">
                        <button class="language-button">
                            <span>Language</span>
                            <svg class="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        <div class="dropdown-menu">
                            <a href="../" class="dropdown-item">English</a>
                            <a href="../ko/" class="dropdown-item">한국어</a>
                            <a href="../ru/" class="dropdown-item">Русский</a>
                            <a href="../pt/" class="dropdown-item">Português</a>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="burger md:hidden cursor-pointer">
                <div class="line1 bg-white h-0.5 w-6 my-1 transition duration-300"></div>
                <div class="line2 bg-white h-0.5 w-6 my-1 transition duration-300"></div>
                <div class="line3 bg-white h-0.5 w-6 my-1 transition duration-300"></div>
            </div>
        </nav>
    </div>
</header>

<div class="mobile-nav fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-green-700 to-blue-600 z-40 transform -translate-x-full transition duration-300 ease-in-out">
    <ul class="flex flex-col items-center justify-center h-full space-y-8 text-white text-2xl">
        <li><a href="../play/" class="hover:text-yellow-300 transition duration-300">Play Sprunki</a></li>
        <li><a href="../mod/" class="hover:text-yellow-300 transition duration-300">Mod</a></li>
        <li><a href="../download/" class="hover:text-yellow-300 transition duration-300">Download</a></li>
        <li><a href="../sprunki-characters/" class="hover:text-yellow-300 transition duration-300">Characters</a></li>
        <li><a href="../sprunki-phase/" class="hover:text-yellow-300 transition duration-300">Phase</a></li>
    </ul>
</div>
`;

// 渲染头部并初始化移动端菜单
// document.querySelector('header').outerHTML = newHeader;

// 初始化移动端菜单
const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
const body = document.body;

burger.addEventListener('click', () => {
    mobileNav.classList.toggle('-translate-x-full');
    body.classList.toggle('overflow-hidden');
    burger.classList.toggle('active');
    
    burger.children[0].classList.toggle('rotate-45');
    burger.children[0].classList.toggle('translate-y-1.5');
    burger.children[1].classList.toggle('opacity-0');
    burger.children[2].classList.toggle('-rotate-45');
    burger.children[2].classList.toggle('-translate-y-1.5');
});

class GameControls {
    constructor(gameContainerId) {
        this.gameContainer = document.getElementById(gameContainerId);
        this.gameIframe = this.gameContainer.querySelector('iframe');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.restartBtn = document.getElementById('restart-btn');


        // 创建退出全屏按钮
        this.exitBtn = document.createElement('button');
        this.exitBtn.className = 'exit-fullscreen-btn';
        this.exitBtn.innerHTML = '×';
        document.body.appendChild(this.exitBtn);

        this.initStyles();
        this.initEventListeners();


        // 添加 iframe 加载事件监听
        this.gameIframe.addEventListener('load', () => this.handleIframeLoad());

        // 保存原始尺寸
        this.originalWidth = this.gameIframe.style.width;
        this.originalHeight = this.gameIframe.style.height;

        // 添加 iframe 显示状态控制
        // this.gameIframe.style.display = 'none'; // 初始隐藏
        
        // 修改事件监听部分
        document.querySelectorAll('.play-game').forEach(btn => {
            btn.addEventListener('click', () => {
                this.gameIframe.style.display = 'block'; // 显示 iframe
                this.toggleFullscreen();
            });
        });

        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.gameIframe.style.display = 'block'; // 显示 iframe
                this.toggleFullscreen();
            });
        }
    }

    initStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .mobile-fullscreen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: black !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .mobile-fullscreen iframe {
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
            }

            .exit-fullscreen-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                display: none;
            }

            .exit-fullscreen-btn.show {
                display: block;
            }

            @media screen and (orientation: portrait) {
                .mobile-fullscreen iframe {
                    transform: rotate(90deg);
                    width: 100vh !important;
                    height: 100vw !important;
                }
            }

            .mobile-fullscreen #restart-btn,
            .mobile-fullscreen #fullscreen-btn {
                display: none !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    initEventListeners() {

        // 重启按钮点击事件
        this.restartBtn.addEventListener('click', () => this.restartGame());

        // 监听屏幕方向变化

        this.exitBtn.addEventListener('click', () => this.exitFullscreen());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        window.addEventListener('orientationchange', () => this.handleOrientationChange());

        // 添加全屏变化事件监听
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                this.resetIframeSize();
                this.fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            }
        });

        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement) {
                this.resetIframeSize();
                this.fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            }
        });
    }

    exitFullscreen() {
        this.gameContainer.classList.remove('mobile-fullscreen');
        document.body.style.overflow = '';
        this.exitBtn.classList.remove('show');
        this.fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen';
        
        // 退出全屏时隐藏 iframe
        this.gameIframe.style.display = 'none';
        
        // 重置为原始尺寸
        this.resetIframeSize();
    }

    resetIframeSize() {
        // 重置所有可能影响布局的样式
        this.gameIframe.style.width = this.originalWidth || '100%';
        this.gameIframe.style.height = this.originalHeight || '90%';
        this.gameIframe.style.transform = 'none';
        this.gameIframe.style.maxWidth = '100%';
        this.gameIframe.style.maxHeight = '100%';
        this.gameContainer.style.width = '';
        this.gameContainer.style.height = '';

        // 强制重绘
        this.gameContainer.style.display = 'none';
        this.gameContainer.offsetHeight;
        this.gameContainer.style.display = '';
    }

    toggleFullscreen() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            this.toggleMobileFullscreen();
        } else {
            this.toggleDesktopFullscreen();
        }
    }

    toggleMobileFullscreen() {
        if (!this.gameContainer.classList.contains('mobile-fullscreen')) {
            this.gameIframe.style.display = 'block'; // 确保 iframe 显示
            this.gameContainer.classList.add('mobile-fullscreen');
            document.body.style.overflow = 'hidden';
            this.exitBtn.classList.add('show');
            this.fullscreenBtn.querySelector('span:last-child').textContent = 'Exit Fullscreen';
            this.adjustFullscreenSize();
        } else {
            this.exitFullscreen();
        }
    }

    toggleDesktopFullscreen() {
        if (!document.fullscreenElement) {
            if (this.gameContainer.requestFullscreen) {
                this.gameContainer.requestFullscreen();
            } else if (this.gameContainer.webkitRequestFullscreen) {
                this.gameContainer.webkitRequestFullscreen();
            } else if (this.gameContainer.msRequestFullscreen) {
                this.gameContainer.msRequestFullscreen();
            }
            this.fullscreenBtn.querySelector('span:last-child').textContent = 'Exit Fullscreen';
            this.adjustFullscreenSize();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            this.resetIframeSize();
        }
    }


    restartGame() {
        const currentSrc = this.gameIframe.src;
        this.gameIframe.src = currentSrc;
    }

    handleIframeLoad() {
        // 如果已经是全屏状态，重新调整大小
        if (this.gameContainer.classList.contains('mobile-fullscreen') || document.fullscreenElement) {
            this.adjustFullscreenSize();

        }
    }

    adjustFullscreenSize() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            if (window.orientation === 0 || window.orientation === 180) {
                this.gameIframe.style.width = '100vh';
                this.gameIframe.style.height = '100vw';
                this.gameIframe.style.transform = 'rotate(90deg)';
            } else {
                this.gameIframe.style.width = '100vw';
                this.gameIframe.style.height = '100vh';
                this.gameIframe.style.transform = 'none';
            }
        } else {
            this.gameIframe.style.width = '100%';
            this.gameIframe.style.height = '100%';
        }
    }

    handleOrientationChange() {
        if (this.gameContainer.classList.contains('mobile-fullscreen')) {
            setTimeout(() => {
                this.adjustFullscreenSize();
            }, 100);
        }
    }
}

// 添加获取当前域名的函数
function getCurrentDomain() {
    if (DEBUG) {
        // console.log('Running in debug mode with domain:', DEBUG_DOMAIN);
        return DEBUG_DOMAIN;
    }
    return window.location.hostname;
}

// 修改渲染推荐游戏函数
function renderRecommendedGames() {
    if (hasRendered) {
        return;
    }

    const container = document.getElementById('recommended-games-container');
    if (!container) {
        console.error('Recommended games container not found');
        return;
    }

    // 使用getCurrentDomain()替代直接获取hostname
    const currentDomain = getCurrentDomain();

    let exploreJson = isLocalEnvironment ? '/js/explore.json' : 'https://sprunkigame.com/js/explore.json'

    fetch(exploreJson)
        .then(response => response.json())
        .then(data => {
            let html = '';
            
            const filteredGames = data.games.filter(game => {
                if (!Array.isArray(game.excludeDomains)) {
                    return true;
                }
                
                const shouldExclude = game.excludeDomains.some(domain => 
                    currentDomain.toLowerCase().includes(domain.toLowerCase())
                );
                
                // console.log(`Game: ${game.gameName}, Domain: ${currentDomain}, Excluded: ${shouldExclude}`);
                
                return !shouldExclude;
            });


            filteredGames.forEach(game => {
                const gameUrl = game.redirectTo || `https://${currentDomain}${game.gamePath}`;
                html += `
                <a href="${gameUrl}" class="block bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 md:hidden h-[280px]">
                    <div class="relative">
                        <img src="${game.imgSrc}" class="w-full h-36 object-cover" alt="${game.alt}">
                        <p class="absolute bottom-2 right-2 text-white text-xs flex items-center bg-black/50 px-2 py-1 rounded">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${game.onlineDate || 'Coming Soon'}
                        </p>
                    </div>
                    <div class="p-4 flex flex-col h-[calc(280px-144px)]">
                        <div class="font-bold text-white truncate" title="${game.title}">${game.title}</div>
                        <p class="text-gray-400 text-sm mb-2" title="${game.description}">${game.description}</p>
                    </div>
                </a>
                
                <a href="${gameUrl}" class="hidden md:block bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1 h-[180px]">
                    <div class="relative">
                        <img src="${game.imgSrc}" alt="${game.alt}" class="w-full h-24 object-cover">
                        <p class="absolute bottom-2 right-2 text-white text-xs flex items-center bg-black/50 px-2 py-1 rounded">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            ${game.onlineDate || 'Coming Soon'}
                        </p>
                    </div>
                    <div class="p-2 flex flex-col h-[calc(180px-96px)]">
                        <div class="text-sm font-semibold mb-1 text-red-700" title="${game.title}">${game.title}</div>
                        <p class="text-xs text-gray-600 mb-1" title="${game.description}">${game.description}</p>
                    </div>
                </a>
                `;
            });

            container.insertAdjacentHTML('beforeend', html);
            hasRendered = true;
        })
        .catch(error => {
            console.error('Error fetching game data:', error);
            container.innerHTML = '<p class="text-red-500">Failed to load recommended games</p>';
        });
}


// When the DOM is loaded, execute the rendering
document.addEventListener('DOMContentLoaded', renderRecommendedGames);

