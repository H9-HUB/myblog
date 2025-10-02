/* 自动扫描 articles 文件夹并生成卡片 */
const articleList = document.getElementById('articleList');

// 手动维护文件列表（按文件名）
const mdFiles = [
  'Site-Intro.md',
  'Malong-Pingpang-Legend.md',
  'Lamelo-Ball-Engine.md'
];

// 从文章末尾读取日期 → 时间戳
function dateToStamp(str) {
  return new Date(str.trim()).getTime();
}

// 批量读取 & 排序
Promise.all(
  mdFiles.map(file =>
    fetch(`articles/${encodeURIComponent(file)}`)
      .then(res => res.text())
      .then(md => {
        // 1. 末尾 date
        const dateMatch = md.match(/^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m);
        const date = dateMatch ? dateMatch[1] : '';

        // 2. 去掉 date 行
        const mdClean = md.replace(/^date:\s*\d{4}-\d{2}-\d{2}$\r?\n?/m, '').trim();

        // 3. 标题
        const titleMatch = mdClean.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].replace(/\.md$/, '') : file.replace(/\.md$/, '');

        return { file, title, date, mtime: date ? dateToStamp(date) : 0 };
      })
      .catch(() => ({ file, title: file.replace(/\.md$/, ''), date: '', mtime: date ? dateToStamp(date) : -8640000000000000 }))
  )
).then(data => {
  // 按日期倒序（新→旧）
  data.sort((a, b) => b.mtime - a.mtime);
  data.forEach(item => makeCard(item.title, item.file, item.date));
});

// 渲染卡片
function makeCard(title, fileName, date) {
  const card = document.createElement('article');
  card.className = 'article-card';
  card.innerHTML = `
    <h3>${title}</h3>
    ${date ? `<span class="article-date">${date}</span>` : ''}
    <button class="btn-read" onclick="location.href='article.html?id=${encodeURIComponent(fileName)}'">阅读更多</button>
  `;
  articleList.appendChild(card);
}