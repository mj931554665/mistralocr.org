(function() {
    // 查找所有包含游戏链接的 blockquote
    const quotes = document.querySelectorAll('blockquote > a[href*="sprunkigame.com"]');
    
    quotes.forEach(link => {
      // 获取原始链接和游戏标题
      const href = link.getAttribute('href')+"?type=embed";
      const title = link.textContent;
      
      // 创建游戏卡片
      const gameCard = document.createElement('div');
      gameCard.className = 'sprunki-game-card';
      console.log('gameCard',gameCard)
      // 构建卡片内容
      gameCard.innerHTML = `
        <div class="game-preview" style="width: 100%;height: 100%; min-height: 400px;">
          <iframe 
            src="${href}"
            style="width: 100%; height: 100%;"
            frameborder="0"
            scrolling="no"
            allowfullscreen
          ></iframe>
        </div>
      `;
      
      // 添加样式
      const style = document.createElement('style');
      style.textContent = `
        .sprunki-game-card {
          width: 100%;
          height: 100%;
        }
        
        .game-preview {
          position: relative;
        }
        
        .game-preview iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `;
      
      // 修改这里：清空 blockquote 内容并添加游戏卡片
      const blockquote = link.parentElement;
      document.head.appendChild(style);
      // blockquote.parentElement.replaceChild(gameCard, blockquote);
      blockquote.innerHTML = ''; // 清空内容
      blockquote.appendChild(gameCard); // 添加新内容
    });
  })();