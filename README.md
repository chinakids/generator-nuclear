# Generator-nuclear
一个基于 yeoman 的多语言构建工具

css双预编译器支持{less;sass}，默认引入normalize(css-reset)

[![npm version](https://badge.fury.io/js/engine.io.svg)](http://badge.fury.io/js/engine.io)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

### 1.安装

##### 1.1 环境配置

- 1、基础环境：node、git、yeoman、grunt-cli、bower


##### 1.2 安装
- 1、 `npm install -g yo`

- 2、 `npm install -g generator-nuclear`

- 3、 `yo nuclear [app's name]` or `yo nuclear [app's name] --coffee` (coffee支持)

- 4、 根具提示配置你的项目

- 5、 `npm install`

- 6、 `grunt server`


### 2.备注

-   项目跟进中，边用边改

### 3.涉及技能

- yeoman
- node
- grunt

### 4.缺陷

- 单元测试模块尚未重写

### 5.PR说明
- 欢迎各种PR
- 提交代码一定要说清楚修改哦~

### 6.下阶段开发计划
- 增加多种测试模块
- 可选多种构建环境
- jade 等多模板生成支持
- gulp 脚本支持
- 自动更新支持
- js 模块化支持（将在模块化模式下放弃 bower 自动依赖）
- 移除自动项目创建时的自动依赖（jquery,bootstarp），默认只依赖 normalize 相关 css 库（ 为了方便 js 模块化支持 ）
- ~~考虑恢复sass支持，提供less&sass双预编译器支持~~（目前提供双编译器支持，以及不实用编译器选项）
- ~~可选多种工作方式（1.前后端完全分离；2.配合后台的模板编写）~~（目前支持自动替换模板的资源基质路径）
- ~~加入多语言支持~~  (目前支持中文简体、中文繁体、英文;根据运行平台语言自动选择)

### 7.更新说明
##### V1.2.7(2015-07-01)
- 增加繁体中文
- 可选是否构建模板
- 恢复 sass 支持

##### V1.2.2(2015-06-29)
-  修正了win下路径出错导致无法解析json的问题

##### V1.2.1(2015-06-29)
- 支持多语言(中文、英文),根据运行平台语言自动选择

##### V1.1.0(2015-06-28)
- 发布至NPM,可直接使用名称安装

##### V1.1.0(2015-06-23)
- 项目更名
  generator-web  ->   generator-nuclear

##### V1.0.0(2015-06-23)
- 第一版可用版本发布
