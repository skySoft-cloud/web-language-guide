---
name: "guide-book-spec"
description: "为 guide-book 项目新增规范模块：生成 index.md 内容源 + index.html 渲染页 + 同步全站导航与统计带 + 追加 CHANGELOG。当用户要求新增规范模块、添加规范文档、创建新模块时调用。"
---

# guide-book-spec · 新增规范模块

本 skill 用于为 sinoma-dcc-web 前端规范指南（guide-book）项目新增规范模块，确保目录结构、页面结构、导航、统计带、变更日志全部同步。

## 适用场景

- 用户说"新增 XX 规范模块"
- 用户说"添加一个 XX 规范页面"
- 用户要求创建新的规范文档
- 用户要求把某份 Markdown 加入规范站点

## 执行步骤（必须按顺序）

### 1. 确认模块信息

向用户确认以下信息（如用户已提供则跳过）：
- 模块英文名（用作目录名，如 `code-style`、`api-design`）
- 模块中文名（如"代码风格规范"）
- 模块图标（emoji，如 `🎨`、`🔌`）
- 模块内容（Markdown 源，或由用户提供，或由 AI 起草）

### 2. 创建模块目录与内容源

在 `specs/{模块英文名}/` 下创建：

**`index.md`** — 内容源，格式参考 `specs/i18n/index.md`：
```markdown
# {模块中文名}

> 适用项目：sinoma-dcc-web 及关联前端项目
> 维护团队：前端团队
> 更新日期：{YYYY-MM-DD}（v1.0）

***

## 目录

1. [章节一](#1-章节一)
2. [章节二](#2-章节二)
...

***

## 1. 章节一
内容...
```

### 3. 生成 index.html

在 `specs/{模块英文名}/index.html` 创建渲染页面，**必须**遵循以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{模块中文名} - 开发规范指南</title>
<link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>

<div class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle menu">&#9776;</div>
<div class="sidebar-overlay" onclick="toggleSidebar()"></div>

<div class="layout">

  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>开发规范指南</h1>
      <div class="version">v1.0 &middot; {日期}</div>
      <div class="tagline">统一标准 · 高效协作</div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-group">站点</div>
      <a href="../../index.html"><span class="icon">🏠</span>首页</a>
      <a href="../index.html"><span class="icon">📋</span>规范列表</a>
      <div class="nav-group">规范模块</div>
      <a href="../i18n/index.html"><span class="icon">🌐</span>多语言规范</a>
      <a href="index.html" class="active"><span class="icon">{图标}</span>{模块中文名}</a>
      <!-- 锚点导航 -->
      <div class="nav-group">{分组}</div>
      <a href="#s1">1. 章节标题</a>
      <a href="#s1-1" class="sub">1.1 子章节</a>
    </nav>
    <div class="sidebar-footer">sinoma-dcc-web &middot; 前端团队</div>
  </aside>

  <div class="main">
    <div class="content">

      <div class="page-header">
        <h2>{模块中文名}</h2>
        <div class="meta">
          <span><span class="dot"></span>sinoma-dcc-web 及关联前端项目</span>
          <span><span class="dot"></span>维护团队：前端团队</span>
          <span><span class="dot"></span>更新日期：{日期}</span>
        </div>
      </div>

      <!-- 每个 Markdown 章节转为一个 section -->
      <div class="section reveal" id="s1">
        <h2><span class="num">1</span>章节标题</h2>
        <!-- 内容 -->
      </div>

      <div class="site-footer">
        <p>© 2026 sinoma-dcc-web 前端团队 · 开发规范指南</p>
      </div>

    </div>
  </div>

</div>

<button class="back-top" id="backTop" onclick="window.scrollTo({top:0})" aria-label="Back to top">&#8593;</button>

<script src="../../assets/js/main.js"></script>
</body>
</html>
```

**关键规则：**
- section 必须加 `reveal` 类
- h2 的 num 用纯数字（不带点）
- 代码块用 `<pre><code>`，表格用 `<div class="table-wrap"><table>`
- 提示框用 `<div class="callout callout-blue">`
- 流程用 `<div class="flow">` 结构
- 正反例用 `<div class="example">` 结构
- 引用 `../../assets/css/style.css` 和 `../../assets/js/main.js`

### 4. 同步全站导航

**必须更新以下文件的侧边栏导航：**
- `index.html`（首页）— 在"规范模块"组下新增链接
- `specs/index.html`（规范列表页）— 新增卡片
- `specs/i18n/index.html`（其他模块页）— 侧边栏新增链接

新增导航链接格式：
```html
<a href="specs/{模块}/index.html"><span class="icon">{图标}</span>{模块中文名}</a>
```

### 5. 更新规范列表页

在 `specs/index.html` 的"已发布规范"或"规划中"区域新增卡片：
```html
<a href="{模块}/index.html" class="card-item">
  <div class="card-icon">{图标}</div>
  <div class="card-title">{模块中文名}</div>
  <div class="card-desc">{简要描述}</div>
  <div class="card-meta">
    <span>📅 {日期}</span>
    <span>🏷️ {分类}</span>
  </div>
</a>
```

### 6. 更新首页统计带

修改 `index.html` 中 `stats-strip` 的数字：
- "已发布规范"数量 +1
- 其他相关数字按实际情况调整

### 7. 追加 CHANGELOG

在 `CHANGELOG.md` 顶部追加：
```markdown
## v{版本} ({YYYY-MM-DD})
- 新增：{模块中文名}规范模块（specs/{模块}/）
```

### 8. 验证清单

完成后逐项检查：
- [ ] `specs/{模块}/index.md` 存在且内容完整
- [ ] `specs/{模块}/index.html` 存在且引用全局 CSS/JS
- [ ] 首页 `index.html` 侧边栏有新模块链接
- [ ] 规范列表页 `specs/index.html` 有新模块卡片
- [ ] 其他模块页侧边栏有新模块链接
- [ ] 首页统计带数字已更新
- [ ] `CHANGELOG.md` 已追加记录
- [ ] 页面在浏览器中可正常访问

## 设计风格约束

- 配色：蓝紫渐变（#2563eb → #7c3aed）+ 亮色底
- 字体：Plus Jakarta Sans + JetBrains Mono
- 内容区 max-width: 1180px，居中
- 组件类名必须使用全局 CSS 已定义的（参见 project_memory.md 第四节）
- 禁止内联样式和脚本
- 禁止引入框架
