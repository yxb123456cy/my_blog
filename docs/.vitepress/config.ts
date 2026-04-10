import { defineConfigWithTheme } from "vitepress";
import { generateSidebar } from "vitepress-sidebar";
import nav from "./layout/nav";
import { VitePressSidebarOptions } from "vitepress-sidebar/dist/types";

/**
 * 侧边栏生成配置选项
 * 使用 vitepress-sidebar 插件自动生成侧边栏
 */
const vitepressSidebarOptions: VitePressSidebarOptions | VitePressSidebarOptions[] | undefined = [
  // {
  //   documentRootPath: "docs",    // 文档根目录路径
  //   scanStartPath: "/views/nav",      // 改为扫描 page 目录
  //   resolvePath: "/views/nav/",      // 解析路径前缀也相应修改
  //   collapsed: true,
  //   useTitleFromFileHeading: true,
  //   useFolderTitleFromIndexFile: true,
  //   useFolderLinkFromIndexFile: true,
  //   rootGroupCollapsed: true,
  // },
];

export default defineConfigWithTheme({
  // 网站基本信息配置
  title: "Leafy_Coding",     // 网站标题，显示在浏览器标签页
  lang: "zh-CN", // 网站语言，影响浏览器行为和搜索引擎
  description: "简单的记录一下秃头过程", // 网站描述，用于SEO

  // Markdown 配置
  markdown: {
    math: true,      // 启用数学公式支持，可使用 KaTeX 语法

  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          // 将一些常见的 HTML 标签标记为自定义元素，避免验证
          return ['link', 'img', 'div', 'span'].includes(tag)
        }
      }
    }
  },

  // 头部标签配置，添加到 HTML <head> 中
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],  // 网站图标
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0a05ed98f94a5486639ae0f97c7b6fff";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    `,  // 百度统计脚本，用于网站访问数据分析
    ],
    ["meta", { name: "keywords", content: "Leafy_Coding's blog" }],  // 网站关键词，用于SEO
  ],

  // 主题配置，定制主题的各种功能和外观
  themeConfig: {
    // 侧边栏配置，使用前面定义的选项生成侧边栏
    sidebar: generateSidebar(vitepressSidebarOptions),
    // 搜索配置
    search: {
      provider: "local",  // 使用本地搜索，无需外部服务
      options: {
        // 自定义搜索结果渲染函数
        _render(src: any, env: any, md: any) {
          const html = md.render(src, env);
          if (env.frontmatter?.title)
            return md.render(`# ${env.frontmatter.title}`) + html;
          return html;
        },
        detailedView: false
      },
    },
    outline: {
      level: 'deep',
      label: '本页目录'  // 可选：自定义侧边栏标题
    },
    // 编辑链接配置
    editLink: {
      pattern:
        "https://github.com/NtoStudy/ufovik-blog",
      text: "帮我优化文章~"  // 编辑链接文本
    },

    // 博客配置
    blog: {
      tagPageLink: "/page/tags",  // 标签页链接
      bgImage: { dark: "/bg_dark.jpg" },  // 暗色模式背景图
      direct: "lft",  // 博客方向（左侧）
      user: {
        name: "Leafy_Coding",  // 用户名
        avatar: "/avatar.jpg",  // 头像
        describe: "简单的记录一下秃头过程",  // 用户描述
      },
    },

    // 首页配置
    home: {
      maxTagsDisplayed: 10,  // 最大显示标签数
      postsPerPage: 8,  // 每页显示的文章数
    },

    // Logo 配置
    logo: {
      dark: "/logo.png",  // 暗色模式 Logo
      light: "/logo_light.png",  // 亮色模式 Logo
    },

    // 最后更新时间配置
    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },
    // 导航栏配置
    nav: nav,
    // 社交链接配置
    socialLinks: [
      { icon: "github", link: "https://github.com/NtoStudy" },
      { icon: "gitee", link: "https://gitee.com/ntostudy" },
    ],
  },
});
