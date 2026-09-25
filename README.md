# Little Steps

面向六岁英语初学者的连续互动课程。React + Vite，纯静态前端，无后端、登录或儿童数据收集。

## 本地运行

需要 Node.js 20.19+ 或 22.12+、pnpm 10。

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

仓库包含 GitHub Pages 自动发布流程。推送到 `main` 后会先测试和构建，再发布公开网站。网站根目录显示 Lessons 首页；Day 1 使用 query 参数 `?day=day-1` 打开，因此刷新课程页面不会白屏。

## 课程架构

- `src/content/library.js`：跨课程复用的动作和自然拼读素材。
- `src/content/day1.js`、`day2.js`：每一天的目标、环节、顺序、故事与完成奖励。
- `src/content/index.js`：按顺序注册课程并自动计算下一课。
- `src/activities.jsx`：由课程数据驱动的通用活动组件。
- `src/progress.js`：使用 `little-steps-progress-v1` 保存完成课程、最近课程和预留的家长解锁状态。
- `src/audio.js`：单音频通道；重复点击或切页会停止前一个声音，避免叠音。
- `public/images/`、`public/audio/`：可直接替换的本地素材。

新增 Day 3 时，复制一份课程数据文件，填写 `commands`、`phonics` 和可选的 `sections`（例如 `review`、`watch`、`quiz`、`phonics`、`blending`、`story`），再在 `src/content/index.js` 注册。无需复制 App 或重写课程引擎。

## 当前课程

- Day 1：Stand up、Sit down、Come here、Look、Listen；字母 `s` 对应音素 `/s/`，字母 `a` 对应音素 `/æ/`；没有 blending。
- Day 2 暂不进入公开课程路径，等 Day 1 审核确认后再继续开发。

课程 UI 只使用教学所需英语，不讲语法术语，不要求书写或录音。答错会重放原声音，不扣分、不计时。自然拼读 `/s/`、`/æ/`、`/t/` 使用独立录音，不使用浏览器 TTS。

## 待替换素材

当前动作与故事沿用同一只小鸡图集，并用场景色保持故事连续。正式版本建议补充：Day 2 欢迎场景、Day 1 三幅连续故事图、Day 2 四幅连续故事图，以及更清晰的 Come here / Listen 双角色动作图。

以下是占位语音，正式教学前建议由同一位英语教师录制并审听后按原文件名替换：

- `public/audio/day2-hello.wav`
- `public/audio/at.wav`
- `public/audio/sat.wav`
- 现有五个动作句和反馈语音

音素来源和许可见 `public/credits.html`。
