<script>
const handleAdminClick = () => {
	// 跳转到新的管理登录页面
	window.location.href = "/admin/login/";
};
</script>

<button on:click={handleAdminClick} class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" title="网站管理系统">
  <span class="text-[1.25rem]">🛠️</span>
</button>

<style>
  /* 已调整为与导航栏按钮一致的样式，主要通过btn-plain类实现 */
  /* 保留自定义图标大小设置 */
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>