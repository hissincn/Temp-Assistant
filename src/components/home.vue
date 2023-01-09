<script>
import check from "./check.vue"

export default {
    data() {
        return {
            userNum: null,
            recordNum: null
        }
    },
    mounted() {
        fetch(this.apiUrl +'info', { method: 'POST', body: new URLSearchParams({}) })
            .then(response => response.json())
            .then(response => {
                this.userNum = response.userNum,
                    this.recordNum = response.recordNum
            })
            .catch(err => console.error(err));
    },
    components: {
        check: check
    },
    computed: {
        rundays() {

            let s1 = '2022-11-20';
            s1 = new Date(s1.replace(/-/g, "/"));
            let s2 = new Date();
            let days = s2.getTime() - s1.getTime();

            return parseInt(days / (1000 * 60 * 60 * 24));
        }
    }
}
</script>


<template>

    <div tabindex="0" class="collapse group mt-6 mb-10 max-w-3xl mx-auto">
        <div
            class="font-semibold text-blue-500 mb-2 collapse-title bg-white  group-focus:bg-secondary group-focus:text-secondary-content group-focus:rounded-t-lg rounded-lg border dark:border-gray-700">
            通知/公告 «点击查看
        </div>
        <div
            class="collapse-content bg-white text-primary-content group-focus:bg-white group-focus:text-secondary-content group-focus:rounded-lg group-focus:border dark:border-gray-700">
            <p class="text-blue-500 font-bold mt-4">
                # <kbd class="kbd">ctrl</kbd>
                +
                <kbd class="kbd">D</kbd>
                收藏体温助手官网(<a href="https://temp.geekpara.com/">https://temp.geekpara.com/</a>)以备后用。<br />

            </p>

            <p class="text-blue-500 font-bold mt-4"># 分享此服务至微信/QQ/钉钉班级群，独乐乐不如众乐乐。</p>
            <p class="text-blue-500 font-bold mt-4 ">#
                我们定于每日北京时间06:00提交体温打卡，届时您的鑫考云将会弹窗提示“有其他设备在登录”，是必然现象！您可以随时重新登录，无须考虑会与代体温助手打卡服务冲突！同样，出现弹窗也说明您的打卡成功了。</p>
            <p class="text-blue-500 font-bold mt-4">#
                我们只会保存您的账号以及加密后的密码，不会保存其他任何您的个人信息，我们承诺会在假期结束时删除保存的信息，如果下一假期还需要使用，您可以重新注册。</p>



            <div class="mt-4">
                <p class="text-blue-500 font-bold mb-3"># 交流/通知/赞助</p>
                <a class="text-lg pl-3" href="https://jq.qq.com/?_wv=1027&k=IM3hV9rO">
                    <span class="badge badge-secondary badge-outline mr-2">
                        <svg t="1669341648888" class="icon w-4 h-4" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="4127" width="1000" height="1000">
                            <path
                                d="M758.365091 209.454545a79.36 79.36 0 0 1 79.336727 74.752l0.116364 4.51491v485.166545a60.113455 60.113455 0 0 1-60.183273 60.043636 60.136727 60.136727 0 0 1-60.043636-56.087272l-0.139637-3.956364-0.023272-362.938182-475.880728 456.634182a60.276364 60.276364 0 0 1-85.108363-1.629091 59.950545 59.950545 0 0 1-1.326546-81.826909l2.978909-3.095273 470.528-451.490909H272.058182a60.136727 60.136727 0 0 1-60.066909-56.087273l-0.139637-3.956363a60.113455 60.113455 0 0 1 56.250182-59.927273L272.058182 209.454545h486.306909z"
                                p-id="4128" fill="#377CFB"></path>
                        </svg>QQ 305432291
                    </span>
                </a>

            </div>

            <div class="mt-4 flex">
                <!--<div class="mx-2 px-auto">
                    <img src="../assert/wechat.jpg" class="w-20 rounded-md shrink-0 ring-4 ring-blue-200 mx-auto">
                    <p class="text-blue-500 font-semibold dark:text-gray-400 mt-1">微信订阅推送</p>
                </div>-->

                <div class="mx-2">
                    <img src="../assert/reward.png" class="w-20 rounded-md shrink-0 ring-4 ring-blue-200 mx-auto">
                    <p class="text-blue-500 font-semibold dark:text-gray-400 mt-1">微信支付宝赞助</p>

                </div>
            </div>

            <p class="text-blue-500 font-bold mt-4"># 原理</p>
            <div class="mt-2 ml-4 text-gray-700">
                抓取并分析鑫考云数据包，并通过vue+vite实现了前端，部署在vercel上面，使用node.js 实现了后端api和打卡脚本，使用mysql作为数据存储平台。
                我们会调用以下鑫考云官方API：
                https://twsb.xinkaoyun.com:8099/temp/report/studentSaveTemp (提交体温数据)
                https://twsb.xinkaoyun.com:8099/temp/report/getStudentTempInfoHistory (获取历史记录)
                https://usr.xinkaoyun.com/api/HSCPC/Login (PC版登录，获取token和必要信息)
                https://usr.xinkaoyun.com/api/HSCApp/NewLogin_jiami (移动端登录，获取手机版token和必要信息)

            </div>

            <p class="text-blue-500 font-bold mt-4"># 关于</p>
            <div class="mt-2 ml-4 text-gray-700">
                由极客学园paraject项目组开发维护
            </div>

        </div>
    </div>

    <check></check>

    <section class="bg-white">
        <div class="mx-auto max-w-screen-xl px-4 pt-12 sm:px-6 md:py-16 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                    为了无法计算的价值
                </h2>

                <p class="mt-4 text-gray-500 sm:text-xl">
                    体温助手已全量上云,腾讯云云原生Postgre托管数据库，阿里云函数计算托管打卡、通知脚本，WebAPI
                </p>
            </div>

            <div class="mt-8 sm:mt-12">
                <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div class="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt class="order-last text-lg font-medium text-gray-500">
                            用户数
                        </dt>

                        <dd class="text-4xl font-extrabold text-blue-600 md:text-5xl">
                            {{ userNum }}人
                        </dd>
                    </div>

                    <div class="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt class="order-last text-lg font-medium text-gray-500">
                            本假期累计打卡
                        </dt>

                        <dd class="text-4xl font-extrabold text-blue-600 md:text-5xl">{{ recordNum }}次</dd>
                    </div>

                    <div class="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
                        <dt class="order-last text-lg font-medium text-gray-500">
                            累计运营
                        </dt>

                        <dd class="text-4xl font-extrabold text-blue-600 md:text-5xl">{{ rundays }}天</dd>
                    </div>
                </dl>
            </div>
        </div>
    </section>



</template>
