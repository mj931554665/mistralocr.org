// 立即执行函数避免全局变量污染
(function() {
    class GameControls {
        constructor(gameContainerId) {
            // 游戏控制相关初始化
            this.gameContainer = document.getElementById(gameContainerId);
            this.gameIframe = this.gameContainer.querySelector('iframe');
            this.fullscreenBtn = document.getElementById('fullscreen-btn');
            this.restartBtn = document.getElementById('restart-btn');

            // 汉堡按钮相关初始化
            this.burger = document.querySelector('.burger');
            this.mobileNav = document.querySelector('.mobile-nav');
            this.body = document.body;

            // 创建退出全屏按钮
            this.exitBtn = document.createElement('button');
            this.exitBtn.className = 'exit-fullscreen-btn';
            this.exitBtn.innerHTML = '×';
            document.body.appendChild(this.exitBtn);

            // 保存原始尺寸
            this.originalWidth = this.gameIframe.style.width;
            this.originalHeight = this.gameIframe.style.height;

            // 添加 iframe 显示状态控制
            // this.gameIframe.style.display = 'none'; // 初始隐藏

            this.initStyles();
            this.initEventListeners();
            this.initBurgerMenu();
            this.initPlayButtons();
            this.gameIframe.addEventListener('load', () => this.handleIframeLoad());
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

                /* 汉堡按钮样式 */
                .burger.active div:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                .burger.active div:nth-child(2) {
                    opacity: 0;
                }

                .burger.active div:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }

                .mobile-nav {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                }

                .mobile-nav.active {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styleSheet);
        }

        initEventListeners() {
            this.restartBtn.addEventListener('click', () => this.restartGame());
            this.exitBtn.addEventListener('click', () => this.exitFullscreen());
            this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
            window.addEventListener('orientationchange', () => this.handleOrientationChange());

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

        initBurgerMenu() {
            if (this.burger && this.mobileNav) {
                this.burger.addEventListener('click', () => {
                    this.mobileNav.classList.toggle('active');
                    this.body.classList.toggle('overflow-hidden');
                    this.burger.classList.toggle('active');
                });
            }
        }

        initPlayButtons() {
            // 初始化所有 play 按钮
            document.querySelectorAll('.game-cover button, .play-game').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.gameIframe.style.display = 'block'; // 显示 iframe
                    this.toggleFullscreen();
                });
            });

            // 特殊处理 play-btn
            const playBtn = document.getElementById('play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    this.gameIframe.style.display = 'block'; // 显示 iframe
                    this.toggleFullscreen();
                });
            }
        }

        exitFullscreen() {
            this.gameContainer.classList.remove('mobile-fullscreen');
            document.body.style.overflow = '';
            this.exitBtn.classList.remove('show');
            this.fullscreenBtn.querySelector('span:last-child').textContent = 'Fullscreen';
            
            // 退出全屏时隐藏 iframe
            this.gameIframe.style.display = 'none';
            
            this.resetIframeSize();
        }

        resetIframeSize() {
            this.gameIframe.style.width = this.originalWidth || '100%';
            this.gameIframe.style.height = this.originalHeight || '90%';
            this.gameIframe.style.transform = 'none';
            this.gameIframe.style.maxWidth = '100%';
            this.gameIframe.style.maxHeight = '100%';
            this.gameContainer.style.width = '';
            this.gameContainer.style.height = '';

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
                this.gameIframe.style.display = 'block';
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

    // 自动初始化
    document.addEventListener('DOMContentLoaded', function() {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            new GameControls('game-container');
        }
    });

    // 仍然暴露到全局作用域，以防需要手动使用
    window.GameControls = GameControls;
})();
