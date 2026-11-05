---
title: 欢迎页
layout: false
---
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>欢迎来到我的博客</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{height:100%;overflow:hidden;}
body{background:#101624 url("/img/banner.jpg") no-repeat center/cover fixed;}
 .welcome{
    width:100%;
    height:100vh;
    background-image:url("/img/banner.jpg");
    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;
    position:relative;
    transition: opacity 1.5s ease;
}
.welcome.fade-out{
    opacity:0;
    pointer-events:none;
}
.welcome-inner{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
}
.welcome-text{
    color:#ffffff;
    font-size:34px;
    font-weight:bold;
    letter-spacing:2px;
    text-shadow:0 4px 18px rgba(0,0,0,0.45);
    text-align:center;
}
.welcome-tip{
    display:block;
    margin-top:14px;
    font-size:16px;
    font-weight:normal;
    opacity:0.85;
}
</style>
</head>
<body>

<div class="welcome" id="welcomePage">
    <div class="welcome-inner">
        <div class="welcome-text">
            欢迎来到我的博客
            <span class="welcome-tip">点击任意位置进入</span>
        </div>
    </div>
</div>

<script>
const welcomeDom = document.getElementById('welcomePage');

welcomeDom.addEventListener('click', function(){
    if (welcomeDom.classList.contains('fade-out')) return;

    welcomeDom.classList.add('fade-out');

    setTimeout(function(){
        location.href = '/home';//✅点击欢迎页跳转到主页 /home
    }, 1500);
});
</script>

</body>
</html>
