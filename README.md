# WebGL-Universe

一个使用原生 WebGL 制作的太阳系动态模型。模型包含了太阳、八大行星及月球。

各星球大小、轨道半径、自转和公转周期等数据均来自维基百科，贴图来自 [planet-texture-maps](https://planet-texture-maps.fandom.com/wiki/Planet_Texture_Maps_Wiki)。

这个项目也是东南大学图形学课程的结课作业。

- 项目地址：[github.com/WCY-dt/WebGL-Universe](https://github.com/WCY-dt/WebGL-Universe)
- 项目 Demo：[ch3nyang.top/WebGL-Universe](https://ch3nyang.top/WebGL-Universe)

## 使用方法

- 你可以克隆本项目

  ```shell
  git clone https://github.com/WCY-dt/WebGL-Universe.git
  ```

  然后打开 `index.html`。你可能需要处理一下跨域的问题。

- 我也提供了托管在 Github Pages 上的[站点](https://ch3nyang.top/WebGL-Universe)。

进入后，使用鼠标拖动旋转，使用鼠标滚轮缩放。

页面上也提供了一些可调选项，包括：

- 球体精度
- 行星比例
- 太阳比例
- 轨道比例
- 自转与公转速度

## 技术细节

项目使用了教程 [webgl2fundamentals](https://webgl2fundamentals.org/) 提供的 [twgl](https://twgljs.org/)，省去 WebGL 中大量重复的代码，如缓冲区绑定、节点位置设置等，但保留了 WebGL 中的所有关键流程。

主要技术细节如下：

- **光照**：在太阳中心处设置点光源提供光照。考虑到现实中星球间隔很远，所以不需要处理阴影的问题。
- **特殊处理太阳**：太阳本身是发光的，因此向在片段着色器传入一个全局变量 `u_isSun` 用于标记是否是太阳。如果是太阳，则不计算光照，直接贴上纹理。
- **场景图**：月球绕着地球转，而地球绕着太阳转，这里使用了具有层级结构的场景图来实现这一点。项目将星球、轨道全部放置在场景图下，后期添加星球更加方便。
- **轨迹球**：使用轨迹球实现鼠标拖动。
- **GLSL 文件**：GLSL 程序独立于 JavaScript 文件，这样可以更好地组织代码，也方便调试。
- **可调选项**：使用滑动控件，直接在页面上调整可调选项。

## TODO

- **纹理加载 BUG**: 调整可调参数后，纹理异步加载需要一段时间。
- **材质**：将星球的材质修改得更趋近于现实。
- **天空盒**：添加宇宙背景。
