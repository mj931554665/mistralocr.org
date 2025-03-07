// 立即执行函数避免全局变量污染
(function() {
    const headerTemplate = `
        // ... 你的 header HTML 模板 ...
    `;

    function initHeader() {
        const header = document.querySelector('header');
        if (header) {
            header.outerHTML = headerTemplate;
        }

        // 初始化移动端菜单
        const burger = document.querySelector('.burger');
        const mobileNav = document.querySelector('.mobile-nav');
        const body = document.body;

        if (burger && mobileNav) {
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
        }
    }

    // 暴露到全局作用域
    window.initHeader = initHeader;

    // 自动初始化
    document.addEventListener('DOMContentLoaded', initHeader);
})();
