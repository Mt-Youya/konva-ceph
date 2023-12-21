# ceph

医学头影测量分析系统

## Introduction

react-konva 实现加载图片 , 亮度 / 对比度 / 镜像 / 旋转 / 测角 / 测距 以及图片的 缩放 / 拖拽 等功能

UI 没做自适应,这个是医学方向的系统,只做PC端
- public/assets/XRay_default.jpg 文件是默认图片
- canvas内Ctrl加滚轮是缩放(以鼠标为中心)
- canvas上的每个点/线/图片都能拖动
- 多种分析法算法
- 算法表格可以下载

## uses
- [react-konva](https://github.com/konvajs/react-konva/blob/master/README.md) uses [Konva](https://konvajs.org/)
- ant design 
- styled-components
- mockjs
- pnpm
- vite

## Installation

- **Node.js:**  [Home Page](https://nodejs.org)
- **pnpm?:**  [Home Page](https://pnpm.io/zh/)

```bash
npm install -g pnpm
pnpm install
``` 

## Version

- node: >=v16

```bash
node -v 
```

## Run

```bash
pnpm dev
``` 