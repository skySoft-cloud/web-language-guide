# 多语言（i18n）统一使用规范

> 适用范围：所有前端项目（PC 端 sinoma-dcc-web、移动端 sinoma-app 及后续项目）
> 维护团队：前端团队
> 更新日期：2026-07-20（v2.0）

---

## 目录

1. [背景与问题说明](#1-背景与问题说明)
2. [整体架构说明](#2-整体架构说明)
3. [KEY 命名规范（跨端统一）](#3-key-命名规范跨端统一)
4. [平台标识与后端管理系统对照](#4-平台标识与后端管理系统对照)
5. [模块命名规范](#5-模块命名规范)
6. [公共词条标准库（cip.cmn）](#6-公共词条标准库cipcmn)
7. [分类约定](#7-分类约定)
8. [移动端专属词条库](#8-移动端专属词条库)
9. [日常开发 SOP](#9-日常开发-sop)
10. [前端代码使用规范](#10-前端代码使用规范)
11. [存量重复词条清单](#11-存量重复词条清单)
12. [存量整理策略](#12-存量整理策略)
13. [历史文件退出计划](#13-历史文件退出计划)
14. [常见问题](#14-常见问题)

---

## 1. 背景与问题说明

项目多语言词条统一在后端管理系统中维护，前端通过 `/internationalMain/assemble` 接口获取后注入 i18n（PC 端使用 Vue i18n，移动端使用 VueI18n for uni-app）。

由于早期缺乏规范，系统中积累了大量**不同 KEY、相同含义**的重复词条：

```
cip.cmn.btn.saveBtn   = "保存"  ← 公共定义
datacenter.form.save  = "保存"  ← PC 数据中台重复
qm.btn.saveBtn        = "保存"  ← PC 质量模块重复
dccApp.public.save    = "保存"  ← 移动端重复
```

统计发现：
- "删除成功"有 9 处定义
- "新增成功"有 8 处
- "导出"有 6 处
- 移动端 `dccApp.public.*` 高频词条使用 500+ 次，与 PC 端大量重复

**根本原因：** 创建词条时没有查重提示，新建比查找更省力。

**本规范目标：**
- 统一 PC 端和移动端命名规范
- 防止新增重复词条
- 统一命名风格，明确分类规则
- 给存量整理提供路径

---

## 2. 整体架构说明

```
后端管理系统  →  统一维护所有词条（中文 / 英文 / 俄文）
                  按平台分类：PC端 / 移动端(APP) / 公共
      ↓  /internationalMain/assemble
PC 端项目     →  src/lang/index.js 注入 Vue i18n
                  组件中通过 $t('KEY') 调用
移动端项目    →  lang/index.js 注入 VueI18n
                  组件中通过 $t('KEY') 调用
```

**重要说明：**
- `src/lang/*.js`（PC）和 `lang/*.js`（移动端）为历史遗留文件
- **新词条一律在后端管理系统创建，不再修改本地文件**
- PC 端接口参数：`platform: '1'`
- 移动端接口参数：`platform: '2'`
- 公共词条：`platform: '0'`

---

## 3. KEY 命名规范（跨端统一）

### 3.1 整体结构

词条归属分为以下层级，根据复用范围和平台判断：

| 层级 | KEY 格式 | 适用场景 |
|---|---|---|
| 跨端公共 | `cip.cmn.{分类}.{词}` | PC 和移动端都能用，含义完全一致 |
| PC 端跨模块 | `cip.cmn.{分类}.{词}` | PC 端所有模块都能用（后端选"PC"平台） |
| PC 端模块内公共 | `cip.{模块}.cmn.{分类}.{词}` | PC 端该模块下多个页面共用 |
| PC 端页面专属 | `cip.{模块}.{页面}.{分类}.{词}` | PC 端该模块下某个具体功能页面专用 |
| 移动端跨模块 | `cip.mobile.cmn.{分类}.{词}` | 移动端所有模块都能用 |
| 移动端模块专属 | `cip.mobile.{模块}.{分类}.{词}` | 移动端某个模块专属（不再细分页面） |

**关键理解：**
- **PC 端不加平台前缀**（如 `cip.qm`），保持向后兼容
- **移动端加 `mobile` 标识**（如 `cip.mobile.repairOrder`），明确区分
- **跨端公共用 `cmn`**（如 `cip.cmn.btn.saveBtn`），对应后端"公共"平台
- **PC 端大模块需要页面层级**：如 `cip.qm.inspection`（质检记录页面）、`cip.qm.plan`（质检计划页面）
- **移动端不使用页面层级**：因为模块本身就是具体功能，新增/编辑/详情共用字段

### 3.2 判断原则（按顺序判断）

**Step 1: PC 和移动端都用，且含义完全一致？**
- ✅ 是 → `cip.cmn.{分类}.{词}`（后端选择"公共"平台）
- ❌ 否 → 进入 Step 2

**Step 2: 是 PC 端还是移动端？**
- PC 端 → 进入 Step 3-PC
- 移动端 → 进入 Step 3-Mobile

**Step 3-PC: PC 端跨模块通用？**
- ✅ 是 → `cip.cmn.{分类}.{词}`（后端选择"PC"平台）
- ❌ 否 → 进入 Step 4-PC

**Step 4-PC: 该模块下多个页面共用？**
- ✅ 是 → `cip.{模块}.cmn.{分类}.{词}`
- ❌ 否 → `cip.{模块}.{页面}.{分类}.{词}`

**Step 3-Mobile: 移动端跨模块通用？**
- ✅ 是 → `cip.mobile.cmn.{分类}.{词}`（后端选择"APP"平台）
- ❌ 否 → `cip.mobile.{模块}.{分类}.{词}`

**重要说明：**
- PC 端大模块（如 qm、pm）下有多个功能页面，需要用页面层级区分
- 页面层级指的是功能页面（如 inspection 质检记录、plan 质检计划），不是操作（新增/编辑/详情）
- 移动端模块本身就是具体功能，不再细分页面层级

### 3.3 命名示例

**跨端公共：**
```
cip.cmn.btn.saveBtn          → 保存
cip.cmn.btn.celBtn           → 取消
cip.cmn.msg.saveSuccess      → 保存成功
```

**PC 端：**
```
cip.cmn.col.serialNumber                → 序号（表格列，PC 专属）
cip.qm.cmn.field.inspectionDate         → 质检日期（质检模块多个页面共用）
cip.qm.inspection.title.addRecord       → 新增质检记录（质检记录页面专用）
cip.qm.inspection.field.conclusion      → 检验结论（质检记录页面专用）
cip.qm.plan.title.monthPlan             → 月度质检计划（质检计划页面专用）
```

**说明：**
- `inspection`、`plan` 是质量管理模块下的具体功能页面
- 不是"新增"、"编辑"、"详情"这种操作层级

**移动端：**
```
cip.mobile.cmn.nav.home                     → 首页（移动端公共）
cip.mobile.repairOrder.title.add            → 新增维修工单
cip.mobile.repairOrder.field.deviceName     → 主设备
cip.mobile.repairOrder.placeholder.selectDevice → 请选择主设备
```

### 3.4 命名风格

- 统一使用 **camelCase** 小驼峰，禁止下划线或全大写
- KEY 层级控制在 **4~5 层**，不要过深
- 具体词要有实际含义，禁止 `btn1`、`text2` 等无意义命名

```
✅ cip.mobile.repairOrder.title.add
✅ cip.cmn.btn.saveBtn
❌ cip.mobile.repair                               （太短，语义不明）
❌ cip.mobile.repair.add.form.field.device.name （超过 5 层）
❌ cip.mobile.repair_order_add                  （下划线，不统一）
```

---

## 4. 平台标识与后端管理系统对照

后端管理系统新建词条时有三个平台选项，与前端 KEY 的对应关系：

| 后端平台选项 | 前端 KEY 前缀 | 说明 | 示例 |
|---|---|---|---|
| **公共** | `cip.cmn` | PC 和移动端都能用的词条 | cip.cmn.btn.saveBtn |
| **PC** | `cip` | 只给 PC 端用（不加平台标识） | cip.cmn.col.serialNumber |
| **APP** | `cip.mobile` | 只给移动端用 | cip.mobile.cmn.nav.home |

**重要提示：**
- 创建词条时**必须选择正确的平台**
- 真正跨端通用的选"公共"，不要在 PC 和 APP 各建一份
- PC 专属词条（如表格列头）选"PC"
- 移动端专属词条（如底部 TabBar）选"APP"
- 后端系统通过 `platform` 参数区分：`0`=公共, `1`=PC, `2`=APP

---

## 5. 模块命名规范

**不允许自造缩写**，新模块接入前联系前端负责人在此表补充后再使用。

### 5.1 PC 端模块

| 缩写 | 含义 | 适用项目 |
|---|---|---|
| `cip.cmn` | 跨模块公共词条 | 所有项目 |
| `cip.plat` | 平台基础（用户、角色、权限、菜单） | 所有项目 |
| `cip.qm` | 质量管理 | sinoma-dcc-web |
| `cip.pm` | 生产管理 | sinoma-dcc-web |
| `cip.dc` | 数据中台 | sinoma-dcc-web |
| `cip.cps` | 配置参数系统 | sinoma-dcc-web |
| `cip.md` | 水分系数 | sinoma-dcc-web |
| `cip.equipment` | 设备管理 | sinoma-dcc-web |
| `cip.phm` | 预测性维护 | sinoma-dcc-web |

### 5.2 移动端模块

**移动端模块命名使用完整英文单词，不强制缩写，保持可读性。**

| 模块标识 | 含义 | 适用项目 |
|---|---|---|
| `cip.mobile.cmn` | 移动端跨模块公共 | 所有移动端项目 |
| `cip.mobile.repairOrder` | 维修工单 | sinoma-app |
| `cip.mobile.equipmentManage` | 设备管理 | sinoma-app |
| `cip.mobile.materialApplication` | 物料申请 | sinoma-app |
| `cip.mobile.warehouseInquiry` | 仓库查询 | sinoma-app |
| `cip.mobile.monitoringRecord` | 监测记录 | sinoma-app |
| `cip.mobile.lubricate` | 润滑管理 | sinoma-app |
| `cip.mobile.shiftHandover` | 交接班 | sinoma-app |
| `cip.mobile.dailyReport` | 日报 | sinoma-app |
| `cip.mobile.alarm` | 报警 | sinoma-app |
| `cip.mobile.defect` | 缺陷 | sinoma-app |
| `cip.mobile.wearRecord` | 磨损记录 | sinoma-app |
| `cip.mobile.seeAlso` | 待办巡检 | sinoma-app |
| `cip.mobile.home` | 首页 | sinoma-app |
| `cip.mobile.mine` | 我的 | sinoma-app |

**注意：** 移动端模块名可根据业务特点选择全称或简称（如 `equipment` 或 `equipmentManage`），但必须在此表登记。

---

## 6. 公共词条标准库（cip.cmn）

**新建词条前必须先查这张表，有就直接用，不要重复创建。**

### 6.1 按钮（cip.cmn.btn）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.btn.saveBtn | 保存 | Save |
| cip.cmn.btn.celBtn | 取消 | Cancel |
| cip.cmn.btn.confirm | 确认 | Confirm |
| cip.cmn.btn.defBtn | 确定 | OK |
| cip.cmn.btn.addBtn | 新增 | Add |
| cip.cmn.btn.editBtn | 编辑 | Edit |
| cip.cmn.btn.delBtn | 删除 | Delete |
| cip.cmn.btn.viewBtn | 查看 | View |
| cip.cmn.btn.submitBtn | 提交 | Submit |
| cip.cmn.btn.exportBtn | 导出 | Export |
| cip.cmn.btn.importBtn | 导入 | Import |
| cip.cmn.btn.clearBtn | 清空 | Clear |
| cip.cmn.btn.refreshBtn | 刷新 | Refresh |
| cip.cmn.btn.searchBtn | 搜索 | Search |

> 完整按钮列表见附录 B1（共 56 个）

### 6.2 成功提示（cip.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.msg.saveSuccess | 保存成功 | Saved successfully |
| cip.cmn.msg.addSuccess | 新增成功 | Added successfully |
| cip.cmn.msg.delSuccess | 删除成功 | Deleted successfully |
| cip.cmn.msg.updataSuccess | 修改成功 | Updated successfully |
| cip.cmn.msg.submitSuccess | 提交成功 | Submitted successfully |
| cip.cmn.msg.operateSuccess | 操作成功 | Operation successful |
| cip.cmn.msg.importSuccess | 导入成功 | Imported successfully |
| cip.cmn.msg.exportSuccess | 导出成功 | Exported successfully |

### 6.3 警告确认（cip.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.msg.delWarning | 确定删除数据？ | Confirm delete? |
| cip.cmn.msg.selectWarning | 请选择数据 | Please select data |
| cip.cmn.msg.noDataYet | 暂无数据 | No data available |

### 6.4 表单校验（cip.cmn.rule）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.rule.inputWarning | 请输入 | Please enter |
| cip.cmn.rule.selectWarning | 请选择 | Please select |
| cip.cmn.rule.noEmptyWarning | 不能为空 | Cannot be empty |

> **说明：** 完整词条列表见附录 B，此处仅列出高频词条。

---

## 7. 分类约定

所有词条必须包含分类层级，以下为统一的分类规范：

| 分类 | 含义 | PC | 移动端 | 典型场景 |
|---|---|---|---|---|
| `btn` | 按钮文字 | ✅ | ✅ | 保存、取消、新增、删除 |
| `title` | 页面/弹窗标题 | ✅ | ✅ | 新增工单、编辑参数 |
| `field` | 表单字段标签 | ✅ | ✅ | 工单编号、创建人、设备名称 |
| `col` | 表格列头 | ✅ | ⚠️ | 序号、状态、操作（移动端少用） |
| `msg` | 操作反馈消息 | ✅ | ✅ | 保存成功、确认删除？、暂无数据 |
| `tip` | 页面内静态说明 | ✅ | ✅ | 表单引导语、字段辅助说明、下拉刷新 |
| `status` | 状态值显示文本 | ✅ | ✅ | 草稿、已提交、已审核 |
| `placeholder` | 输入框占位符 | ✅ | ✅ | 请输入名称、请选择日期 |
| `tab` | Tab 页签文字 | ✅ | ✅ | 基本信息、详情、历史 |
| `rule` | 表单校验提示 | ✅ | ✅ | 不能为空、长度超限 |
| `nav` | 导航/TabBar | ⚠️ | ✅ | 首页、消息、我的（**移动端为主**） |
| `card` | 卡片标题 | ⚠️ | ✅ | 数据看板、快捷菜单（可选） |

**`msg` 与 `tip` 的区别：**

```
msg  →  操作触发的反馈弹窗或 Toast
        PC: this.$message.success(this.$t('cip.cmn.msg.saveSuccess'))
        移动端: uni.showToast({ title: this.$t('cip.cmn.msg.saveSuccess') })

tip  →  页面内始终显示的静态说明文字
        PC: <p class="tip">{{ $t('cip.qm.inspection.tip.remark') }}</p>
        移动端: <view class="tip">{{ $t('cip.mobile.repairOrder.tip.fillGuide') }}</view>
```

**遇到以下写法时统一归并：**

- `form` / `label` → 校验文本用 `rule`，字段标签用 `field`
- `columns` → 统一用 `col`
- `txt` / `info` / `text` → 根据语义归入 `field` 或 `title`

---

## 8. 移动端专属词条库

以下为移动端专属的跨模块公共词条，**PC 端不使用这些词条**。

### 8.1 导航（cip.mobile.cmn.nav）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.mobile.cmn.nav.home | 首页 | Home |
| cip.mobile.cmn.nav.message | 消息 | Message |
| cip.mobile.cmn.nav.mine | 我的 | Mine |
| cip.mobile.cmn.nav.back | 返回 | Back |

### 8.2 按钮（cip.mobile.cmn.btn）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.mobile.cmn.btn.scan | 扫一扫 | Scan |
| cip.mobile.cmn.btn.selectAll | 全选 | Select All |

### 8.3 提示（cip.mobile.cmn.tip）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.mobile.cmn.tip.pullToRefresh | 下拉刷新 | Pull to refresh |
| cip.mobile.cmn.tip.releaseToRefresh | 释放刷新 | Release to refresh |
| cip.mobile.cmn.tip.loadingMore | 加载中... | Loading... |
| cip.mobile.cmn.tip.noMore | 没有更多了 | No more data |

### 8.4 消息（cip.mobile.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.mobile.cmn.msg.loginFirst | 请先登录 | Please login first |
| cip.mobile.cmn.msg.networkError | 网络异常，请稍后重试 | Network error |
| cip.mobile.cmn.msg.selectedCount | 已选择 | Selected |

---

## 9. 日常开发 SOP

新增多语言词条时，严格按以下三步执行：

```
① 查公共表（第 6 节跨端公共、第 8 节移动端专属）
   有 → 直接用，结束

② 去后端系统按中文值搜索
   有 → 直接用，结束

③ 按规范新建
   跨端公共词  →  cip.cmn.{分类}.{词}（后端选"公共"）
   PC 端跨模块  →  cip.cmn.{分类}.{词}（后端选"PC"）
   PC 端模块内公共 →  cip.{模块}.cmn.{分类}.{词}（后端选"PC"）
   PC 端页面专属 →  cip.{模块}.{页面}.{分类}.{词}（后端选"PC"）
   移动端跨模块 →  cip.mobile.cmn.{分类}.{词}（后端选"APP"）
   移动端模块专属 →  cip.mobile.{模块}.{分类}.{词}（后端选"APP"）
   必填：中文、英文；选择对应平台
```

**三步走，先查后建，不跳过。**

---

## 10. 前端代码使用规范

### 10.1 PC 端（Vue 2）

**模板中：**

```vue
<!-- ✅ 跨端公共词条 -->
<el-button>{{ $t('cip.cmn.btn.saveBtn') }}</el-button>

<!-- ✅ PC 端跨模块公共词条 -->
<el-table-column :label="$t('cip.cmn.col.serialNumber')" />

<!-- ✅ PC 端模块内公共词条（多个页面共用） -->
<el-form-item :label="$t('cip.qm.cmn.field.inspectionDate')" />

<!-- ✅ PC 端页面专属词条 -->
<el-form-item :label="$t('cip.qm.inspection.field.conclusion')" />
<el-dialog :title="$t('cip.qm.inspection.title.addRecord')" />

<!-- ❌ 禁止硬编码中文 -->
<el-button>保存</el-button>
```

**脚本中：**

```javascript
// ✅ 操作反馈
this.$message.success(this.$t('cip.cmn.msg.operateSuccess'))

// ✅ 确认弹窗
this.$confirm(this.$t('cip.cmn.msg.delWarning'))

// ✅ 带变量插值
this.$t('cip.cmn.msg.total', { n: this.total })
// 对应词条值：共 {n} 条记录

// ❌ 禁止直接写中文
this.$message.success('操作成功')
```

### 10.2 移动端（uni-app）

**模板中：**

```vue
<!-- ✅ 跨端公共词条 -->
<button>{{ $t('cip.cmn.btn.saveBtn') }}</button>

<!-- ✅ 移动端公共词条 -->
<view>{{ $t('cip.mobile.cmn.nav.home') }}</view>

<!-- ✅ 移动端模块专属 -->
<BaseNavbar :title="$t('cip.mobile.repairOrder.title.add')" />
<u-form-item :label="$t('cip.mobile.repairOrder.field.deviceName')" />
<u-input :placeholder="$t('cip.mobile.repairOrder.placeholder.selectDevice')" />

<!-- ❌ 禁止硬编码中文 -->
<button>保存</button>

<!-- ❌ 禁止硬编码英文 -->
<view>View indicator data</view>
```

**脚本中：**

```javascript
// ✅ 操作反馈
uni.showToast({
  title: this.$t('cip.cmn.msg.saveSuccess'),
  icon: 'success'
})

// ✅ 确认弹窗
uni.showModal({
  content: this.$t('cip.cmn.msg.delWarning'),
  success: (res) => {
    if (res.confirm) {
      // 确认操作
    }
  }
})

// ❌ 禁止直接写中文
uni.showToast({
  title: '请先登录',
  icon: 'none'
})
```

### 10.3 Code Review 检查项

- [ ] 有无用业务 KEY 表达公共含义（保存、取消、删除等）
- [ ] 有无硬编码中文/英文字符串
- [ ] 新 KEY 是否符合命名规范（camelCase、4~5 层、分类正确）
- [ ] 模块命名是否在第 5 节对照表中
- [ ] 后端创建词条时是否选择了正确的平台（公共/PC/APP）
- [ ] 移动端是否误用了 PC 端专属词条（如 `cip.cmn.col.*`）

---

## 11. 存量重复词条清单

以下为已发现的重复词条，整理时优先处理。**标准 KEY** 为应统一使用的目标，旧 KEY 待替换后在后端系统中保留观察一个迭代周期再删除。

### 11.1 PC 端重复词条

| 中文 | 标准 KEY | 待替换的旧 KEY | 所在文件 |
|---|---|---|---|
| 保存成功 | cip.cmn.msg.saveSuccess | datacenter.tips.saveSuccess | datacenter_zh.js |
| 删除成功 | cip.cmn.msg.delSuccess | qm.recordV2.tip.del_success | qm_zh.js |
| 确认 | cip.cmn.btn.confirm | buttons.confirm | datacenter_zh.js |
| 取消 | cip.cmn.btn.celBtn | buttons.cancel | datacenter_zh.js |

> 完整列表见原 PC 规范文档第 8 节，共约 35 处重复。

### 11.2 移动端重复词条

| 中文 | 标准 KEY | 待替换的旧 KEY | 出现次数 |
|---|---|---|---|
| 保存 | cip.cmn.btn.saveBtn | dccApp.public.save | 40+ |
| 确认 | cip.cmn.btn.confirm | dccApp.public.confirm | 50+ |
| 取消 | cip.cmn.btn.celBtn | dccApp.public.cancel | 30+ |
| 删除 | cip.cmn.btn.delBtn | dccApp.public.delete | 20+ |
| 请输入 | cip.cmn.rule.inputWarning | dccApp.public.input | 60+ |
| 请选择 | cip.cmn.rule.selectWarning | dccApp.public.select | 40+ |
| 已选择 | cip.mobile.cmn.msg.selectedCount | dccApp.public.Selected | 30+ |
| 全选 | cip.mobile.cmn.btn.selectAll | dccApp.public.selectAll | 10+ |
| 暂无数据 | cip.cmn.msg.noDataYet | dccApp.public.noData | 20+ |
| 操作成功 | cip.cmn.msg.operateSuccess | dccApp.public.operationSuccessful | 30+ |
| 首页 | cip.mobile.cmn.nav.home | dccApp.login.home.index | 10+ |
| 消息 | cip.mobile.cmn.nav.message | dccApp.login.message.message | 10+ |
| 我的 | cip.mobile.cmn.nav.mine | dccApp.login.mine.mine | 10+ |

> 移动端 `dccApp.*` 词条使用约 1490 次，需逐步替换。

---

## 12. 存量整理策略

**原则：不做大规模迁移，随迭代逐步推进，降低风险。**

### 12.1 整体策略

| 阶段 | 时间 | 内容 |
|---|---|---|
| **阶段 1** | 即刻 | 发布本规范，在后端创建高频公共词条 |
| **阶段 2** | 即刻起 | 所有新词条严格遵守规范 |
| **阶段 3** | 随迭代推进 | 迭代哪个模块，顺带替换该模块内的重复旧 KEY |

### 12.2 PC 端迁移

```bash
# 1. 搜索旧 KEY 的所有引用位置
grep -r "旧KEY路径" src/views/

# 2. 编辑器全局替换为标准 KEY

# 3. 旧词条在后端系统中标记为"待删除"，保留一个迭代周期
#    确认无引用后再从系统中删除
```

### 12.3 移动端迁移优先级

**P0 - 高频跨端公共词条（立即创建并替换）：**

```
cip.cmn.btn.saveBtn           → 保存（40+ 次）
cip.cmn.btn.confirm           → 确认（50+ 次）
cip.cmn.btn.celBtn            → 取消（30+ 次）
cip.cmn.rule.inputWarning     → 请输入（60+ 次）
cip.cmn.msg.operateSuccess    → 操作成功（30+ 次）
cip.cmn.msg.noDataYet         → 暂无数据（20+ 次）
```

**影响：** 替换这 6 个词条，可覆盖约 230 处代码。

**P1 - 移动端公共导航：**

```
cip.mobile.cmn.nav.home       → 首页
cip.mobile.cmn.nav.message    → 消息
cip.mobile.cmn.nav.mine       → 我的
cip.mobile.cmn.btn.selectAll  → 全选
cip.mobile.cmn.btn.scan       → 扫一扫
```

**P2 - 按模块逐步整理：**
1. repairOrder（维修工单）
2. materialApplication（物料申请）
3. equipmentManage（设备管理）
4. 其他模块

---

## 13. 历史文件退出计划

`src/lang/*.js`（PC）和 `lang/*.js`（移动端）为历史遗留文件，当前与后端系统双轨并存，相同 KEY 以后端系统为准。

| 阶段 | 操作 |
|---|---|
| 近期 | 新词条只在后端系统创建，不再动本地文件 |
| 中期 | 本地文件只读，停止维护 |
| 远期 | 本地词条全量导入后端系统，删除本地文件 |

---

## 14. 常见问题

**Q1：文案相同但语境不同，能共用 KEY 吗？**
A：不能。"确认"按钮用 `cip.cmn.btn.confirm`，"确认收货"是业务动作，单独建 `cip.mobile.order.btn.confirmReceipt`。文案必须**完全一致且含义相同**，才共用公共 KEY。

**Q2：PC 和移动端词条如何区分？**
A：在后端管理系统创建词条时，通过平台选项区分：
- 公共（0）：PC 和移动端都用
- PC（1）：只给 PC 端用
- APP（2）：只给移动端用

**Q3：PC 端大模块如何划分页面层级？**
A：页面层级指的是模块下的**具体功能页面**，不是操作（新增/编辑/详情）。例如：
- 质量管理（qm）下有：`inspection`（质检记录）、`plan`（质检计划）、`report`（质检报告）
- 生产管理（pm）下有：`production`（生产执行）、`plan`（生产计划）、`schedule`（排程管理）

同一个功能页面的新增、编辑、详情通常共用字段标签，不需要再细分。

**Q4：移动端为什么不用页面层级？**
A：移动端模块本身就是具体功能单元：
- `cip.mobile.repairOrder` 维修工单
- `cip.mobile.equipmentManage` 设备管理

新增、编辑、详情页共用大部分字段，不需要再细分。统一放在 `cip.mobile.{模块}.{分类}.{词}`。

**Q5：俄文谁来填？**
A：开发者只填中文和英文，俄文留空，由翻译人员定期批量补充。系统已配置 `fallbackLocale`，缺失时回退中文显示，不会显示裸 KEY。

**Q6：新模块用什么缩写/命名？**
A：查第 5 节对照表，没有的联系前端负责人确认后补充，不要自己创建。移动端优先使用完整英文单词。

**Q7：旧 KEY 什么时候可以从系统中删除？**
A：替换代码引用后，旧 KEY 继续保留在后端系统中，观察一个完整迭代周期（约 2 周），确认无任何页面报缺失后再删除。删除前可在系统备注中标记"待删除"。

**Q8：如何确认词条是否已存在？**
A：使用后端管理系统的「按中文值搜索」功能。后续计划在新建词条表单中加自动查重提示。

---

## 附录A：实际案例对比

### A1. 命名规范案例

#### ❌ 错误示例 1：缺少分类层级
```javascript
// 错误：没有分类标识
$t('cip.qm.inspectionDate')
$t('cip.mobile.repairOrder.deviceName')
```

✅ **正确写法：**
```javascript
// 正确：加上分类 field
$t('cip.qm.cmn.field.inspectionDate')
$t('cip.mobile.repairOrder.field.deviceName')
```

#### ❌ 错误示例 2：混淆页面层级和操作
```javascript
// 错误：把"新增"当成页面层级
$t('cip.qm.add.field.conclusion')
$t('cip.qm.edit.field.conclusion')
$t('cip.qm.detail.field.conclusion')
```

✅ **正确写法：**
```javascript
// 方案1：如果多个功能页面共用这个字段
$t('cip.qm.cmn.field.conclusion')

// 方案2：如果只有质检记录页面用
$t('cip.qm.inspection.field.conclusion')

// 标题可以区分操作
$t('cip.qm.inspection.title.addRecord')    // 新增质检记录
$t('cip.qm.inspection.title.editRecord')   // 编辑质检记录
$t('cip.qm.inspection.title.viewRecord')   // 查看质检记录
```

**理解要点：**
- `inspection`、`plan`、`report` 是功能页面（质检记录、质检计划、质检报告）
- `add`、`edit`、`detail` 是操作，不是页面层级
- 字段标签通常在新增/编辑/详情页都一样，应该提到更高层级

#### ❌ 错误示例 3：移动端使用页面层级
```javascript
// 错误：移动端不应该有页面层级
$t('cip.mobile.repairOrder.add.field.deviceName')
$t('cip.mobile.repairOrder.edit.field.deviceName')
```

✅ **正确写法：**
```javascript
// 正确：移动端统一到模块级别
$t('cip.mobile.repairOrder.field.deviceName')

// 标题可以区分
$t('cip.mobile.repairOrder.title.add')     // 新增维修工单
$t('cip.mobile.repairOrder.title.edit')    // 编辑维修工单
$t('cip.mobile.repairOrder.title.detail')  // 维修工单详情
```

#### ❌ 错误示例 4：重复创建已有公共词条
```javascript
// 错误：在模块内创建已有公共词条
$t('cip.qm.btn.save')
$t('cip.pm.btn.cancel')
$t('cip.mobile.repairOrder.btn.confirm')
```

✅ **正确写法：**
```javascript
// 正确：使用跨端公共词条
$t('cip.cmn.btn.saveBtn')
$t('cip.cmn.btn.celBtn')
$t('cip.cmn.btn.confirm')
```

**查找顺序：**
1. 先查第 6 节公共词条标准库
2. 再查第 8 节移动端专属词条库
3. 去后端系统搜索中文值
4. 确认不存在才新建

### A2. 平台选择案例

#### ❌ 错误示例：平台选择不当
```javascript
// 场景1：表格列头"序号"
// 错误：选择"公共"平台
后端创建: cip.cmn.col.serialNumber  平台=公共 ❌

// 正确：选择"PC"平台（移动端很少用表格列头）
后端创建: cip.cmn.col.serialNumber  平台=PC ✅
```

```javascript
// 场景2：底部TabBar"首页"
// 错误：选择"公共"平台
后端创建: cip.mobile.cmn.nav.home  平台=公共 ❌

// 正确：选择"APP"平台（PC端没有TabBar）
后端创建: cip.mobile.cmn.nav.home  平台=APP ✅
```

```javascript
// 场景3：保存按钮
// 错误：在PC和APP分别创建
后端创建: cip.pc.btn.save      平台=PC   ❌
后端创建: cip.mobile.btn.save  平台=APP  ❌

// 正确：创建一个跨端公共词条
后端创建: cip.cmn.btn.saveBtn  平台=公共 ✅
```

### A3. 硬编码问题案例

#### ❌ 错误示例：硬编码中文/英文
```vue
<!-- 错误1：硬编码中文 -->
<el-button>保存</el-button>
<view>首页</view>

<!-- 错误2：硬编码英文 -->
<view class="tip">View indicator data</view>

<!-- 错误3：拼接中文 -->
<u-input :placeholder="'请输入' + fieldName" />
```

✅ **正确写法：**
```vue
<!-- 正确1：使用i18n -->
<el-button>{{ $t('cip.cmn.btn.saveBtn') }}</el-button>
<view>{{ $t('cip.mobile.cmn.nav.home') }}</view>

<!-- 正确2：英文也要i18n -->
<view class="tip">{{ $t('cip.mobile.home.index.tip.viewIndicatorData') }}</view>

<!-- 正确3：使用插值变量 -->
<u-input :placeholder="$t('cip.cmn.rule.inputWarning') + $t('cip.mobile.repairOrder.field.deviceName')" />
<!-- 或在后端创建完整占位符 -->
<u-input :placeholder="$t('cip.mobile.repairOrder.placeholder.inputDeviceName')" />
```

### A4. 命名风格案例

#### ❌ 错误示例：命名不规范
```javascript
// 错误1：使用下划线
cip.qm.inspection_date
cip.mobile.repair_order_add

// 错误2：层级过深
cip.qm.inspection.detail.form.field.item.conclusion

// 错误3：无意义命名
cip.qm.field1
cip.qm.text2
cip.qm.btn_a

// 错误4：全大写或混合大小写
cip.qm.INSPECTION_DATE
cip.qm.InspectionDate
```

✅ **正确写法：**
```javascript
// 正确：camelCase小驼峰
cip.qm.cmn.field.inspectionDate
cip.mobile.repairOrder.title.add

// 正确：控制在4-5层
cip.qm.inspection.field.conclusion

// 正确：有意义的命名
cip.qm.inspection.field.conclusion
cip.qm.inspection.field.inspectionDate
cip.qm.inspection.btn.submitReport

// 正确：统一小驼峰
cip.qm.inspection.field.inspectionDate
cip.qm.inspection.field.inspectionResult
```

### A5. 实际迁移案例

#### 移动端存量迁移示例

**场景：维修工单新增页面**

**迁移前（dccApp 风格）：**
```vue
<template>
  <view>
    <BaseNavbar :title="$t('dccApp.repairOrder.add.addRepair')" />

    <u-form>
      <u-form-item :label="$t('dccApp.repairOrder.add.deviceName')">
        <u-input
          :placeholder="$t('dccApp.repairOrder.add.pleaseSelectDeviceName')"
          v-model="form.deviceName"
        />
      </u-form-item>

      <u-form-item :label="$t('dccApp.repairOrder.detail.repairLocation')">
        <u-input
          :placeholder="$t('dccApp.public.select')"
          v-model="form.location"
        />
      </u-form-item>
    </u-form>

    <u-button @click="save">{{ $t('dccApp.public.save') }}</u-button>
    <u-button @click="cancel">{{ $t('dccApp.public.cancel') }}</u-button>
  </view>
</template>

<script>
export default {
  methods: {
    save() {
      uni.showToast({
        title: this.$t('dccApp.public.saveSuccess')
      })
    }
  }
}
</script>
```

**迁移后（新规范）：**
```vue
<template>
  <view>
    <BaseNavbar :title="$t('cip.mobile.repairOrder.title.add')" />

    <u-form>
      <u-form-item :label="$t('cip.mobile.repairOrder.field.deviceName')">
        <u-input
          :placeholder="$t('cip.mobile.repairOrder.placeholder.selectDevice')"
          v-model="form.deviceName"
        />
      </u-form-item>

      <u-form-item :label="$t('cip.mobile.repairOrder.field.repairLocation')">
        <u-input
          :placeholder="$t('cip.cmn.rule.selectWarning')"
          v-model="form.location"
        />
      </u-form-item>
    </u-form>

    <u-button @click="save">{{ $t('cip.cmn.btn.saveBtn') }}</u-button>
    <u-button @click="cancel">{{ $t('cip.cmn.btn.celBtn') }}</u-button>
  </view>
</template>

<script>
export default {
  methods: {
    save() {
      uni.showToast({
        title: this.$t('cip.cmn.msg.saveSuccess')
      })
    }
  }
}
</script>
```

**改进点：**
1. ✅ 标题加了分类 `title`
2. ✅ 字段加了分类 `field`
3. ✅ 占位符加了分类 `placeholder`
4. ✅ 去掉了 `add` 页面层级（移动端不需要）
5. ✅ 通用按钮改用跨端公共词条 `cip.cmn.btn.*`
6. ✅ 通用提示改用跨端公共词条 `cip.cmn.msg.*`
7. ✅ 通用校验提示改用跨端公共词条 `cip.cmn.rule.*`

---

## 附录B：完整公共词条库

### B1. 按钮（cip.cmn.btn）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.btn.addBtn | 新增 | Add |
| cip.cmn.btn.addChildBtn | 新增子项 | Add Child |
| cip.cmn.btn.saveLineBtn | 新增一行 | Add Row |
| cip.cmn.btn.editBtn | 编辑 | Edit |
| cip.cmn.btn.revBtn | 修改 | Modify |
| cip.cmn.btn.saveBtn | 保存 | Save |
| cip.cmn.btn.saveBackBtn | 保存并返回 | Save & Back |
| cip.cmn.btn.saveAndAddBtn | 保存并新增 | Save & Add |
| cip.cmn.btn.delBtn | 删除 | Delete |
| cip.cmn.btn.viewBtn | 查看 | View |
| cip.cmn.btn.viewDataBtn | 查看详情 | View Detail |
| cip.cmn.btn.detailBtn | 明细 | Detail |
| cip.cmn.btn.celBtn | 取消 | Cancel |
| cip.cmn.btn.defBtn | 确定 | OK |
| cip.cmn.btn.confirm | 确认 | Confirm |
| cip.cmn.btn.clearBtn | 清空 | Clear |
| cip.cmn.btn.submitBtn | 提交 | Submit |
| cip.cmn.btn.unSubmitBtn | 撤回 | Withdraw |
| cip.cmn.btn.backBtn | 取回 | Retrieve |
| cip.cmn.btn.goBackBtn | 返回 | Back |
| cip.cmn.btn.returnLoginBtn | 返回登录页 | Back to Login |
| cip.cmn.btn.exportBtn | 导出 | Export |
| cip.cmn.btn.exportTemplateBtn | 导出模版 | Export Template |
| cip.cmn.btn.importBtn | 导入 | Import |
| cip.cmn.btn.uploadBtn | 上传 | Upload |
| cip.cmn.btn.downloadBtn | 下载 | Download |
| cip.cmn.btn.print | 打印 | Print |
| cip.cmn.btn.copyBtn | 复制 | Copy |
| cip.cmn.btn.enable | 启用 | Enable |
| cip.cmn.btn.disable | 禁用 | Disable |
| cip.cmn.btn.disableBtn | 停用 | Deactivate |
| cip.cmn.btn.invalidBtn | 失效 | Invalid |
| cip.cmn.btn.publishBtn | 发布 | Publish |
| cip.cmn.btn.initiateBtn | 发起 | Initiate |
| cip.cmn.btn.audit | 审核 | Audit |
| cip.cmn.btn.approve | 审批 | Approve |
| cip.cmn.btn.send | 发送 | Send |
| cip.cmn.btn.generateBtn | 生成 | Generate |
| cip.cmn.btn.calBtn | 计算 | Calculate |
| cip.cmn.btn.startBtn | 启动 | Start |
| cip.cmn.btn.stopBtn | 停止 | Stop |
| cip.cmn.btn.refreshBtn | 刷新 | Refresh |
| cip.cmn.btn.configBtn | 配置 | Config |
| cip.cmn.btn.modelEdit | 模板编辑 | Template Edit |
| cip.cmn.btn.dispatchBtn | 调度 | Dispatch |
| cip.cmn.btn.dealBtn | 处理 | Handle |
| cip.cmn.btn.fillingBtn | 填报 | Fill |
| cip.cmn.btn.choice | 选择 | Select |
| cip.cmn.btn.chooseItemBtn | 选择物料 | Select Material |
| cip.cmn.btn.handle | 操作 | Action |
| cip.cmn.btn.historyBtn | 历史记录 | History |
| cip.cmn.btn.viewProcessBtn | 流程查看 | View Process |
| cip.cmn.btn.processBtn | 流程进度 | Process Progress |
| cip.cmn.btn.execute | 执行 | Execute |
| cip.cmn.btn.resetCacheBtn | 重置缓存 | Reset Cache |
| cip.cmn.btn.logout | 注销 | Logout |

> **注意：** `validBtn`（历史遗留）与 `enable` 含义相同，新代码统一使用 `cip.cmn.btn.enable`。

### B2. 成功提示（cip.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.msg.addSuccess | 新增成功 | Added successfully |
| cip.cmn.msg.updataSuccess | 修改成功 | Updated successfully |
| cip.cmn.msg.delSuccess | 删除成功 | Deleted successfully |
| cip.cmn.msg.operateSuccess | 操作成功 | Operation successful |
| cip.cmn.msg.saveSuccess | 保存成功 | Saved successfully |
| cip.cmn.msg.submitSuccess | 提交成功 | Submitted successfully |
| cip.cmn.msg.importSuccess | 导入成功 | Imported successfully |
| cip.cmn.msg.exportSuccess | 导出成功 | Exported successfully |
| cip.cmn.msg.enableSuccess | 启用成功 | Enabled successfully |
| cip.cmn.msg.disableSuccess | 禁用成功 | Disabled successfully |
| cip.cmn.msg.backSuccess | 取回成功 | Retrieved successfully |
| cip.cmn.msg.auditSuccess | 审核成功 | Audited successfully |

### B3. 失败提示（cip.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.msg.addError | 新增失败 | Add failed |
| cip.cmn.msg.updataError | 修改失败 | Update failed |
| cip.cmn.msg.delError | 删除失败 | Delete failed |
| cip.cmn.msg.operateError | 操作失败 | Operation failed |
| cip.cmn.msg.saveError | 保存失败 | Save failed |
| cip.cmn.msg.submitError | 提交失败 | Submit failed |
| cip.cmn.msg.importError | 导入失败 | Import failed |
| cip.cmn.msg.exportError | 导出失败 | Export failed |
| cip.cmn.msg.serviceError | 调用服务异常 | Service call failed |
| cip.cmn.msg.generateError | 数据生成失败 | Generate failed |

### B4. 警告确认（cip.cmn.msg）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.msg.delWarning | 确定删除数据？ | Confirm delete? |
| cip.cmn.msg.updataWarning | 确定修改数据？ | Confirm update? |
| cip.cmn.msg.selectWarning | 请选择数据 | Please select data |
| cip.cmn.msg.selectOneWarning | 只能选择一条数据 | Select only one record |
| cip.cmn.msg.leastOneWarning | 请至少选择一条数据 | Select at least one record |
| cip.cmn.msg.addWarning | 请先保存数据 | Please save first |
| cip.cmn.msg.editWarning | 请选择要编辑的数据 | Please select a record to edit |
| cip.cmn.msg.deleteWarning | 请选择要删除的数据 | Please select a record to delete |
| cip.cmn.msg.submitData | 提交后数据将无法更改，是否继续？ | Data cannot be modified after submission. Continue? |
| cip.cmn.msg.unSubmitData | 确认撤回选择的记录？ | Confirm withdrawal? |
| cip.cmn.msg.validWarning | 是否启用该条数据？ | Enable this record? |
| cip.cmn.msg.invalidWarning | 是否禁用该条数据？ | Disable this record? |
| cip.cmn.msg.generateWarning | 是否生成数据？ | Generate data? |
| cip.cmn.msg.noDataYet | 暂无数据 | No data available |
| cip.cmn.msg.modifiedWarning | 数据未作修改 | No changes made |
| cip.cmn.msg.conflict | 编码已存在 | Code already exists |
| cip.cmn.msg.retWarning | 是否返回列表页面？ | Back to list? |
| cip.cmn.msg.determineDelWarning | 确定将选择数据删除？ | Confirm delete selected? |
| cip.cmn.msg.startusingWarning | 确定将选择数据启用？ | Confirm enable selected? |
| cip.cmn.msg.loseefficacyWarning | 确定将选择数据失效？ | Confirm invalidate selected? |
| cip.cmn.msg.determineUnsubmitWarning | 确定将选择数据撤回？ | Confirm withdraw selected? |
| cip.cmn.msg.hasChildren | 有子项未删除 | Child items exist |

### B5. 表单校验（cip.cmn.rule）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.rule.inputWarning | 请输入 | Please enter |
| cip.cmn.rule.selectWarning | 请选择 | Please select |
| cip.cmn.rule.noEmptyWarning | 不能为空 | Cannot be empty |
| cip.cmn.rule.deleteWarning | 请删除前后空格 | Please remove leading/trailing spaces |
| cip.cmn.rule.nameLength2Warning | 长度不能大于20 | Max length is 20 |
| cip.cmn.rule.nameLength3Warning | 长度不能大于30 | Max length is 30 |
| cip.cmn.rule.nameLength4Warning | 长度不能大于40 | Max length is 40 |
| cip.cmn.rule.nameLength6Warning | 长度不能大于60 | Max length is 60 |
| cip.cmn.rule.number | 请输入数字 | Please enter a number |
| cip.cmn.rule.autoValue | 自动生成 | Auto generated |

### B6. 通用标题（cip.cmn.title）

| KEY | 中文 | 英文 |
|---|---|---|
| cip.cmn.title.add | 新增 | Add |
| cip.cmn.title.edit | 编辑 | Edit |
| cip.cmn.title.view | 查看 | View |
| cip.cmn.title.detail | 详情 | Detail |
| cip.cmn.title.list | 列表 | List |
| cip.cmn.title.import | 导入 | Import |
| cip.cmn.title.export | 导出 | Export |
| cip.cmn.title.config | 配置 | Config |
| cip.cmn.title.promptTitle | 提示 | Tips |
| cip.cmn.title.serialNumber | 序号 | No. |

---

**完整文档版本：v2.0**
**最后更新：2026-07-20**
**维护团队：前端团队**
