/* 读取 URL 参数 */
const params = new URLSearchParams(window.location.search);
let fileName = params.get('id');        // 取出转义后的文件名
if (!fileName) fileName = '网站介绍.md'; // 默认文章

/* 加载对应 Markdown */
fetch(`articles/${encodeURIComponent(fileName)}`)
  .then(res => {
    if (!res.ok) throw new Error('文章未找到');
    return res.text();
  })
  .then(md => {
    // 自动提取第一行 # 标题
    const title = (md.match(/^#\s+(.+)$/m) || ['', fileName])[1];
    document.getElementById('article-title').textContent = title;
    document.getElementById('article-content').innerHTML = marked.parse(md);
    Prism.highlightAll();
  })
  .catch(err => {
    document.getElementById('article-title').textContent = '文章未找到';
    document.getElementById('article-content').innerHTML = `<p>${err.message}</p>`;
  });

/* 评论区 */
const commentList = document.getElementById('commentList');  // 展示所有评论的容器
const commentForm = document.getElementById('commentForm');  // 提交评论的form元素

/* 页面加载完成后，读取本地存储并渲染历史评论 */
window.addEventListener('DOMContentLoaded', () => {
  // 以当前页面文件名作为 key，取出本地存储中的评论数组（若无则默认为空数组）
  const saved = JSON.parse(localStorage.getItem('comments_' + fileName) || '[]');
  // 逐条渲染到页面
  saved.forEach(c => renderComment(c.nick, c.txt, c.time));
});

function addComment() {
  const nick = document.getElementById('nickname').value.trim(); // 昵称
  const txt  = document.getElementById('commentText').value.trim(); // 评论内容
  if (!nick || !txt) return false; // 检测不为空
 
  const time = new Date().toLocaleString(); //当前评时间
  renderComment(nick, txt, time);  //渲染到页面

   /* 读取本地存储中的历史评论，将新评论插到数组最前面，再写回本地存储 */
  const comments = JSON.parse(localStorage.getItem('comments_' + fileName) || '[]');
  comments.unshift({ nick, txt, time });
  localStorage.setItem('comments_' + fileName, JSON.stringify(comments));

  commentForm.reset();
  return false;
}

function renderComment(nick, txt, time) {
  const li = document.createElement('li');
  li.innerHTML = `
    <div class="comment-header">
      <strong>${nick}</strong>
      <span>${time}</span>
    </div>
    <div class="comment-body">${txt}</div>
  `;
  commentList.prepend(li);
}