const nav = [
  { text: "首页", link: "/" },  // 首页链接
  { text: "开发导航", link: "/views/nav/" },
  {
    text: "博客",  // 演示下拉菜单
    items: [
      { text: "首页", link: "/page/blog" },  // 博客页面链接
      { text: "标签", link: "/page/tags" },  // 标签页面链接
      { text: "归档", link: " /page/archive" },  // 归档页面链接
    ],
  },
];

export default nav;
