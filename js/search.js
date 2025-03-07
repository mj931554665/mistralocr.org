// 自动检测环境并设置开发模式
const isLocalEnvironment = 
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('192.168.') || 
    window.location.hostname.includes('127.0.0.1');

const DEBUG = isLocalEnvironment; // 本地环境自动开启调试模式
const DEBUG_DOMAIN = 'sprunkigame.com'; // 设置要测试的域名

// 添加获取当前域名的函数
function getCurrentDomain() {
    if (DEBUG) {
        return DEBUG_DOMAIN;
    }
    return window.location.hostname;
}

// 获取URL参数的函数
function getSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
}

// 搜索过滤函数
function filterGamesBySearch(games, searchTerm) {
    if (!searchTerm) return games;
    
    searchTerm = searchTerm.toLowerCase();
    return games.filter(game => {
        return game.title.toLowerCase().includes(searchTerm) ||
               game.description.toLowerCase().includes(searchTerm) ||
               (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
    });
}

// 渲染搜索结果
function renderSearchResults() {
    const container = document.getElementById('recommended-games-container');
    if (!container) {
        console.error('搜索结果容器未找到');
        return;
    }

    const searchTerm = getSearchParam();
    const currentDomain = getCurrentDomain();
    
    // 更新页面标题显示搜索词
    if (searchTerm) {
        document.title = `搜索结果: ${searchTerm} - Sprunki Game`;
    }

    let exploreJson = isLocalEnvironment ? '/js/explore.json' : 'https://sprunkigame.com/js/explore.json';

    fetch(exploreJson)
        .then(response => response.json())
        .then(data => {
            // 先过滤掉排除的域名
            let filteredGames = data.games.filter(game => {
                if (!Array.isArray(game.excludeDomains)) {
                    return true;
                }
                return !game.excludeDomains.some(domain => 
                    currentDomain.toLowerCase().includes(domain.toLowerCase())
                );
            });

            // 再根据搜索词过滤
            filteredGames = filterGamesBySearch(filteredGames, searchTerm);

            // 更新搜索统计信息
            const statsContainer = document.getElementById('search-stats');
            if (statsContainer) {
                statsContainer.textContent = searchTerm 
                    ? `找到 ${filteredGames.length} 个与 "${searchTerm}" 相关的游戏`
                    : `共有 ${filteredGames.length} 个游戏`;
            }

            // 创建游戏卡片网格容器
            container.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 p-4';

            // 渲染游戏卡片
            let html = '';
            filteredGames.forEach(game => {
                const gameUrl = game.redirectTo || `https://${currentDomain}${game.gamePath}`;
                html += `
                <div class="game-card bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <a href="${gameUrl}" class="block h-full">
                        <div class="relative">
                            <img 
                                src="${game.imgSrc}" 
                                alt="${game.alt}" 
                                class="w-full aspect-square object-cover rounded-t-lg"
                                loading="lazy"
                            >
                            <div class="absolute top-0 right-0 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-bl-lg">
                                ${game.onlineDate || '即将推出'}
                            </div>
                        </div>
                        <div class="p-3">
                            <h3 class="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem]">
                                ${game.title}
                            </h3>
                            <p class="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                ${game.description}
                            </p>
                        </div>
                    </a>
                </div>
                `;
            });

            // 如果没有搜索结果，显示提示信息
            if (filteredGames.length === 0) {
                html = `
                <div class="text-center py-12">
                    <div class="text-gray-400">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <p class="text-xl font-semibold">未找到相关游戏</p>
                        <p class="mt-2">尝试使用其他关键词搜索</p>
                    </div>
                </div>
                `;
            }

            container.innerHTML = html;
        })
        .catch(error => {
            console.error('获取游戏数据时出错:', error);
            container.innerHTML = '<p class="text-red-500">加载搜索结果失败</p>';
        });
}

// 当DOM加载完成时执行搜索
document.addEventListener('DOMContentLoaded', renderSearchResults);
