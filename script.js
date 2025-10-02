console.log("博客页面加载完成！");

const buttons = document.querySelectorAll("button");
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.style.backgroundColor = "#28a745";
    setTimeout(() => {
      btn.style.backgroundColor = "#007acc";
    }, 200);
  });
});