
## 1.安装
### 1.1 下载安装node
下载网址：http://nodejs.cn/download/

### 1.2 下载安装本软件
下载网址：https://github.com/hulang1024/image_send_app/archive/master.zip  
下载完成之后进入目录，然后点击 `install.bat`

## 2 配置上传图片目录位置
目前该软件只支持手动查看上传了的图片，上传图片目录位置可进行配置，编辑`config.js`，将引号中的替换为你想要的位置。
```js
{
  imagesDir: '/Users/hulang/Documents/my-images'
};
```

## 3 运行
点击 `startup.bat`

## 4 二维码
使用任意二维码生成工具（如 https://cli.im/url ），编码网址 `http://[本机地址]:3000`

## 5 用户访问上传界面
 扫描二维码即可

