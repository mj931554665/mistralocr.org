// 在文件顶部添加 URL 参数检查函数
function isEmbedMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type') === 'embed';
}


// 在 DOMContentLoaded 事件中添加嵌入模式处理
document.addEventListener('DOMContentLoaded', () => {
    if (isEmbedMode()) {
        console.log('Embed mode detected');

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            console.error('Game container not found');
            return;
        }

        // 移除 hidden 类名
        gameContainer.classList.remove('hidden');

        const gameIframe = gameContainer.querySelector('iframe');
        if (!gameIframe) {
            console.error('Game iframe not found');
            return;
        }

        // 设置 body 样式以消除滚动条
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0'; // 添加这个以确保没有默认边距

        // 设置固定定位和层级
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.width = '100%';
        gameContainer.style.height = '100%';
        gameContainer.style.zIndex = '9999';

        // 设置 iframe 样式
        gameIframe.style.width = '100%';
        gameIframe.style.height = '100%';
        gameIframe.style.border = 'none';
        gameIframe.style.borderRadius = '0';

        // 隐藏其他元素
        document.querySelector('header')?.remove();
        document.querySelector('.mobile-nav')?.remove();
    } 
});