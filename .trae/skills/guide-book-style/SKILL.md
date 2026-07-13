---
name: "guide-book-style"
description: "维护 guide-book 项目的全局样式与组件：修改 assets/css/style.css 和 assets/js/main.js，调整配色、字体、布局、组件、动画。当用户要求调整样式、修改配色、优化布局、调整组件外观、修复显示问题时调用。"
---

# guide-book-style · 样式与组件维护

本 skill 用于维护 guide-book 项目的全局样式文件（`assets/css/style.css`）和脚本文件（`assets/js/main.js`），确保所有改动符合项目既定风格规范。

## 适用场景

- 用户说"调整配色 / 改字体 / 改间距"
- 用户说"优化样式 / 美化界面"
- 用户说"组件显示有问题 / 样式 bug"
- 用户说"加一个新组件样式"
- 用户说"响应式有问题 / 大屏适配"
- 任何涉及 CSS 或 JS 的样式调整

## 硬性约束（不可违反）

### 配色（必须保持）
```css
--bg: #f8f9fb;           /* 主背景 */
--bg-soft: #f1f3f7;       /* 次背景 */
--card: #fff;             /* 卡片 */
--border: #e8ecf1;        /* 边框 */
--text: #1d2939;          /* 主文字 */
--text2: #475467;         /* 次文字 */
--text3: #98a2b3;         /* 淡文字 */
--accent: #2563eb;        /* 主色蓝 */
--accent-2: #7c3aed;      /* 主色紫 */
--code-bg: #1e293b;       /* 代码块深色 */
```

**禁止改为暗色主题。禁止大幅改变配色基调（必须保持清爽亮色蓝紫渐变）。**

### 字体（必须保持）
```css
--font: 'Plus Jakarta Sans', -apple-system, ...;  /* 正文 */
--font-mono: 'JetBrains Mono', ...;               /* 代码 */
```
通过 `@import` 从 Google Fonts 引入。禁止改为 Inter、Roboto、Arial。

### 布局（必须保持）
- 侧边栏固定 `264px`
- `.main` 必须 `display: flex; justify-content: center`
- `.content` 必须 `width: 100%; max-width: 1180px`
- 大屏（1920px+）内容居中，两侧对称留白

### 文件唯一性
- 全局样式只在 `assets/css/style.css`，禁止页面内联 `<style>`
- 全局脚本只在 `assets/js/main.js`，禁止页面内联 `<script>`
- 禁止引入任何 CSS/JS 框架

## 修改流程

### 1. 确认修改范围

先读取 `assets/css/style.css` 或 `assets/js/main.js`，定位要修改的部分。

### 2. 执行修改

用 Edit 工具做精确修改。**只改需要改的部分，不要重写整个文件。**

如果用户要求新增组件样式，在 CSS 中新增类名，命名风格与现有一致（如 `.xxx-item`、`.xxx-grid`）。

### 3. 响应式检查

修改后必须检查：
- 笔记本宽度（约 1440px）正常
- 大屏（1920px+）内容居中、不靠左
- 平板（900px 以下）侧边栏折叠
- 手机（640px 以下）单列布局

如涉及布局改动，需同步检查 `@media` 断点。

### 4. 追加 CHANGELOG

样式调整需在 `CHANGELOG.md` 追加：
```markdown
## v{版本} ({YYYY-MM-DD})
- 更新：{修改内容简述}
```

## 现有组件清单（修改时参考）

### 布局组件
| 类名 | 用途 | 位置 |
|------|------|------|
| `.layout` | 最外层 flex 容器 | - |
| `.sidebar` | 固定侧边栏 | 264px 宽 |
| `.main` | 主内容区 | flex + justify-center |
| `.content` | 内容容器 | max-width 1180px |

### 页面区块
| 类名 | 用途 |
|------|------|
| `.hero` | 首页英雄区 |
| `.hero-eyebrow` | 状态徽章 |
| `.stats-strip` / `.stat-cell` | 统计带 |
| `.page-header` | 内页头部 |
| `.section` | 内容章节 |
| `.site-footer` | 页脚 |

### 内容组件
| 类名 | 用途 |
|------|------|
| `.card-grid` / `.card-item` | 卡片网格 |
| `.flow` / `.flow-step` / `.flow-num` | 流程步骤 |
| `.callout` / `.callout-{color}` | 提示框 |
| `.table-wrap` / `table` | 表格 |
| `.example` / `.example-col` | 正反例对照 |
| `.faq-item` / `.faq-q` / `.faq-a` | FAQ |
| `.arch` / `.arch-box` / `.arch-row` | 架构图 |
| `.decision` / `.decision-row` | 决策树 |
| `.cat-list` | 分类速查 |
| `.badge` / `.badge-{color}` | 徽章 |
| `.phase-tag` / `.phase-now` | 阶段标签 |

### 交互元素
| 类名 | 用途 |
|------|------|
| `.btn` / `.btn-primary` / `.btn-ghost` | 按钮 |
| `.back-top` | 回到顶部 |
| `.sidebar-toggle` / `.sidebar-overlay` | 移动端菜单 |
| `.search-box` | 搜索框 |

### 动画类
| 类名 | 用途 |
|------|------|
| `.reveal` | 滚动揭示（IntersectionObserver 触发 `.visible`） |
| `@keyframes fadeUp` | 页面载入渐入 |
| `@keyframes pulse` | 状态点脉冲 |

## 阴影系统（4 层）

```css
--shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
--shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
--shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
--shadow-md: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
--shadow-lg: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
--shadow-accent: 0 8px 24px -4px rgba(37, 99, 235, 0.25);
```

## JS 交互规范

`assets/js/main.js` 必须包含：
- `toggleSidebar()` — 移动端侧边栏切换
- `updateActiveNav()` — 滚动锚点高亮
- `updateBackTop()` — 回到顶部按钮显隐
- `initReveal()` — IntersectionObserver 滚动揭示
- scroll 事件用 rAF 节流
- `prefers-reduced-motion` 降级（CSS 中处理）

## 常见样式调整指南

### 调整配色
只改 `:root` 中的 CSS 变量，不改组件中的硬编码颜色。

### 调整间距
改 `:root` 中的圆角变量或组件 padding，保持全站一致。

### 新增组件
1. 在 CSS 中新增类名，复用现有变量
2. 命名用 BEM 风格（`.组件名-元素`）
3. 加 hover / transition 保持交互一致
4. 加响应式断点

### 修复大屏适配
检查 `.main` 是否 `display: flex; justify-content: center`，`.content` 是否 `width: 100%; max-width: 1180px`。
