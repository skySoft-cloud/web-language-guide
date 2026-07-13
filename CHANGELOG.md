# 更新日志

## v1.2.1 (2026-07-13)
- 更新：内容区改为占满主区域宽度，移除 max-width 1180px 限制与居中约束，消除大屏两侧留白

## v1.2 (2026-07-13)
- 更新：升级全局样式，采用 Plus Jakarta Sans + JetBrains Mono 字体
- 更新：首页新增英雄区与统计带，提升视觉层次
- 更新：阴影系统升级为 4 层（xs/sm/md/lg）+ accent 蓝紫阴影
- 更新：代码块改为深色终端风格，提升可读性
- 更新：大屏内容区居中（max-width 1180px），修复 1920px 靠左问题
- 更新：滚动揭示动画（IntersectionObserver）与 rAF 节流
- 新增：项目级 RULE 与 skill（guide-book-spec、guide-book-style）

## v1.1 (2026-07-08)
- 新增：CHANGELOG.md 变更日志文件
- 清理：删除根目录下重复的 `多语言规范.md` 和 `多语言规范.html`
- 说明：规范内容统一存放在 `specs/{模块名}/index.md` 中，HTML 文件由 AI 自动生成

## v1.0 (2026-06-16)
- 初始版本：发布多语言（i18n）使用规范
- 创建：网站首页 `index.html` 和规范列表页 `specs/index.html`
- 创建：多语言规范页面 `specs/i18n/index.html` 及源文件 `specs/i18n/index.md`
