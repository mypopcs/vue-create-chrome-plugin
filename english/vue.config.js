const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    options: {
      entry: 'src/options/main.js', // 指定选项页面的入口文件
      template: 'public/options.html', // 指定选项页面的 HTML 模板文件
      filename: 'options.html' // 指定生成的 HTML 文件名
    }
  }
})
