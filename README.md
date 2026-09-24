# Little Steps — Day 1

面向六岁儿童的英语互动课件。React + Vite，纯静态前端，无后端、登录或用户数据收集。

## 本地运行

需要 Node.js 20.19+ 或 22.12+、pnpm 10（也可以使用 npm）。

```sh
pnpm install
pnpm dev
```

打开终端显示的 Local 地址。手机与电脑连接同一 Wi-Fi，打开 Network 地址；需允许开发服务器通过本机防火墙。

```sh
pnpm test
pnpm build
pnpm preview
```

`dist/` 可放到任何静态网站托管服务。不要直接双击 index.html，请通过 HTTP 打开。仓库已包含 GitHub Pages 自动发布流程；推送到 `main` 后会测试、构建并发布。

## 课程与程序分离

- `src/content/day1.js`：指令、图片、音频、题目顺序、字母、小游戏序列与故事。
- `src/content/index.js`：课程注册。新建 day2.js、按同一格式填写数据后导入 courses，使用 `?day=day-2` 打开。五环节程序不需要改写。
- `src/activities.jsx`：五个可复用环节。
- `src/audio.js`：单通道音频播放、切页停止、错误反馈，快速重复点击不会叠音。
- `src/lesson.js`：三选一选项生成。
- `public/images/`、`public/audio/`：可替换的本地素材。

图片暂用一张 2 列 3 行图集，`frame` 指定 CSS background-position。替换为独立图片时改 `image` 并删除 `frame` 即可。音频只需替换 `audio` 路径。S 使用 /s/，A 使用短音 /æ/；不能替换为字母名称 /ɛs/、/eɪ/。正式教学前建议由英语教师审听并换成统一真人录音。音素来源与许可在 `public/credits.html`。

流程：欢迎 → Watch（五个指令）→ Listen（五题）→ Phonics（探索两音与四题辨认）→ Play（依次听音选 S、A）→ Story（三页）→ 完成。仅在听完当前声音后解锁听辨选项；答错自动重播，不扣分、不计时。故事可朗读，不要求孩子独立阅读。Play 只把两个音并列，不将 SA 宣称为英语单词。

所有课程 UI 为英文。进度只在当前页面内存中，刷新重置；不申请麦克风权限，不自动播放、不收集儿童声音。图片和课程音频均本地存放。字体为 Google Fonts，有系统字体后备。

## 边界

- MVP 未实现录音评分、教师后台、账号或云端学习记录。
- 真实 iOS/Android 设备上的扬声器播放仍建议家长试听；本地浏览器的布局与完整流程可用于预验收。
- 可选 WebMCP 仅注册只读 `read_lesson_progress`，不支持的浏览器忽略它。
- 部署平台的访问策略与课件独立；源码自身不包含登录。默认私密预览可能要求所有者登录平台。
