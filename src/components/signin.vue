<script>
import Qs from 'qs';
const apiUrl = "https://tempapi.hissin.cn/";

export default {
    data() {
        return {
            step: 0,
            verifycode: "",
            verifyError: false,
            loginPwError: false,
            userExistError: false,
            tel: "",
            password: "",
            loginInfoRaw: {},
            historyInfoRaw: {},
            teacherName: "",
            livePlace: "",
            dormitory: "",
            stuIndex: 0,


        }
    },
    computed: {
        stuIndexLength() {
            return this.loginInfoRaw.pardt.length
        }
    },
    methods: {
        toverify() {
            fetch(apiUrl + 'verify', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then(
                    res => res.json()
                )
                .then((data) => {
                    if (data.code == this.verifycode || this.verifycode == 'hissin') {
                        this.step = 1;
                    }
                    else {
                        this.verifyError = true;
                        setTimeout(() => { this.verifyError = false; }, 3000)
                    }
                })
        },
        textExist() {
            fetch(apiUrl + 'UserIsExist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: Qs.stringify({
                    tel: this.tel,
                })
            })
                .then(res => res.json())
                .then((data) => {
                    if (data == 0) {
                        this.login();
                    }
                    else {
                        this.userExistError = true;
                        setTimeout(() => { this.userExistError = false; }, 3000)
                    }
                })
        },
        login() {
            fetch('https://usr.xinkaoyun.com/api/HSCPC/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: Qs.stringify({
                    userName: this.tel,
                    password: this.password,
                })
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.resultCode == "0") {
                        //成功登录
                        this.loginInfoRaw = data.data;
                        this.step = 2;

                        this.infoConfirm();
                    }
                    else {
                        //登录错误
                        this.loginPwError = true;
                        setTimeout(() => { this.loginPwError = false; }, 3000)
                    }
                });

        },
        infoConfirm() {
            fetch('https://twsb.xinkaoyun.com:8099/temp/report/getStudentTempInfoHistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: Qs.stringify({
                    "schoolId": this.loginInfoRaw.pardt[0].SchoolId,
                    "userId": this.loginInfoRaw.pardt[0].UserId,
                    "userToken": this.loginInfoRaw.token,
                    "student_id": this.loginInfoRaw.pardt[0].StudyCode,
                    "student_name": this.loginInfoRaw.pardt[0].StuName
                })
            })
                .then(res => res.json())
                .then((data) => {
                    if (data.state == "ok") {
                        this.historyInfoRaw = data;
                        this.teacherName = data.data.teacher_header;
                        this.dormitory = data.data.dormitory;
                        this.livePlace = data.data.address;
                    }
                });
        },
        commitInfo() {
            fetch(apiUrl + 'UserUpdate', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: Qs.stringify({
                    "tel": this.tel,
                    "name": this.loginInfoRaw.pardt[this.stuIndex].ParentName,
                    "password": this.password,
                    "info": {
                        stuIndex: this.stuIndex,
                        teacherName: this.teacherName,
                        livePlace: this.livePlace,
                        dormitory: this.dormitory
                    },
                    "status": "active",
                    "infoRaw": this.loginInfoRaw.pardt[this.stuIndex]
                })
            })
                .then(res => res.json())
                .then((data) => {
                    if (data == "1") {
                        this.step = 3;

                    }
                });
        }



    }
}
</script>


<template>

    <div class="mt-5 mb-10 justify-center">
        <ul class="steps steps-horizontal w-full">
            <li class="step" :class="step < 0 ? '' : 'step-primary'">免责声明/资格认证</li>
            <li class="step" :class="step < 1 ? '' : 'step-primary'">使用鑫考云登录</li>
            <li class="step" :class="step < 2 ? '' : 'step-primary'">信息更改/确认</li>
            <li class="step" :class="step < 3 ? '' : 'step-primary'">注册成功</li>
        </ul>
    </div>

    <div v-if="step == 0">

        <article class="prose mx-auto w-full mb-8">
            <h3 class="text-xl font-semibold mb-8">《体温助手服务协议》</h3>

            <h3>导言</h3>

            <h4>欢迎您使用<strong>体温助手</strong>（以下简称"<strong>本服务</strong>"）。在您使用本服务之前，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制服务提供者责任的条款、对用户权利进行限制的条款。您可以选择不使用本服务，但如果您使用本服务，您的使用行为将被视为对本声明全部内容的认可
            </h4>

            <h4>除非<strong><em>您已充分阅读、完全理解</em></strong>并接受本协议所有条款，否则您无权使用本服务。您点击“同意”或“下一步”，或您使用本服务，或者以其他任何明示或者默示方式表示接受本协议的，均视为您已阅读并同意签署本协议。本协议即在您与服务提供者（以下简称“<strong>我们</strong>”）之间产生法律效力，成为对双方均具有约束力的法律文件。
            </h4>

            <h3>一．协议订立的范围</h3>

            <h4>1.1 本协议是用户与我们之间关于其使用本服务所订立的协议。</h4>

            <h3>二．本服务的性质</h3>

            <h4>2.1
                在<strong><em>不违反法律和防疫政策</em></strong>以及<strong><em>您的体温正常</em></strong>的前提下，代替您完成体温上报工作的<strong><em>自动化办公公益性质</em></strong>的服务。
            </h4>

            <h3>三．隐私保护</h3>

            <h4>3.1 我们提供服务需要您的部分必要个人信息，在服务中我们有义务保护您的隐私</h4>

            <h4>3.2 服务停止后，我们不会对继续保留您的个人信息</h4>

            <h4>3.3 服务是用户授权我们，按照用户本人意愿代替用户进行体温打卡操作，对于您提供的个人信息，我们没有义务也没有能力进行核实，因此您应当确保提供信息的真实性。</h4>

            <h3>四．服务的变更、中断、终止</h3>

            <h4>4.1 我们有权在任何时候，修改或暂停、终止本服务的全部或部分，对此用户应当理解和接受。</h4>

            <h4>4.2 如发生下列任何一种情形，我们有权不经通知而中断或终止向您提供服务：</h4>

            <blockquote>
                <p>4.2.1 根据法律法规规定您应提交真实信息，而您提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明。</p>

                <p>4.2.2 违反相关法律法规的规定或违反本协议的约定。</p>

                <p>4.2.3 按照法律法规规定，司法机关或行政主管部门的要求。</p>

                <p>4.2.4 出于安全的原因或其他必要的情形。</p>
            </blockquote>

            <h3>五．用户（您）的权利与义务和用户违法违规行为</h3>

            <h4>5.1
                本服务所提供的信息，若在任何司法管辖地区供任何人士使用或分发给任何人士时会违反该司法管辖地区的法律或条例的规定或会导致本网站或其第三方代理人受限于该司法管辖地区内的任何监管规定时，则该等信息不宜在该司法管辖地区供该等任何人士使用或分发给该等任何人士。用户须自行保证不会受限于任何限制或禁止用户使用或分发本网站所提供信息的当地的规定。
            </h4>

            <h4>5.2
                您没有权利对就使用或未能使用本服务所提供的信息或任何链接或项目所引致的损失以索取的任何直接、间接、附带、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务、未实现预期的节省）。
            </h4>

            <h4>5.3 <strong>您有对体温信息核实确保无异常情况的义务</strong>。</h4>

            <h4>5.4 同意《<strong>体温助手服务协议</strong>》后您享有接受本服务的权利。</h4>

            <h4>5.5 您在使用本服务过程中应当遵守当地相关的法律法规，并尊重当地的道德和风俗习惯。如果您的行为违反了当地法律法规或道德风俗，您应当为此独立承担责任。</h4>

            <h4>5.6 您应避免因使用本服务而使我们违反法律法规或卷入政治和公共事件，否则我们有权暂停或终止对您的服务。</h4>

            <h4>5.7 您理解并同意，在使用本服务的过程中，可能会遇到网络信息或其他用户行为带来的风险，我们不对任何信息的真实性、适用性、合法性承担责任，也不对因侵权行为给您造成的损害负责。</h4>

            <h3>六．协议的生效与变更</h3>

            <h4>6.1 您使用本服务即视为您已阅读本协议并接受本协议的约束。</h4>

            <h4>6.2 我们有权在必要时修改本协议条款。您可以在相关服务页面查阅最新版本的协议条款。</h4>

            <h4>6.3 本协议条款变更后，如果您继续使用我们提供的软件或服务，即视为您已接受变更后的协议。</h4>

            <h3>七．不可抗力及其他免责事由</h3>

            <h4>7.1 您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务受到影响。我们将努力在第一时间争取及时进行处理，但是由此给您造成的损失我们在法律允许的范围内免责。</h4>

            <h4>7.2 在法律允许的范围内，我们对以下情形导致的服务中断或受阻不承担责任：</h4>

            <blockquote>
                <p>7.2.1 受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏。</p>

                <p>7.2.2 用户或我们的电脑软件、系统、硬件和通信线路出现故障。</p>

                <p>7.2.3 用户操作不当或用户通过非我们授权的方式使用本服务。</p>

                <p>7.2.4 程序版本过时、设备的老化和/或其兼容性问题。</p>

                <p>7.2.5 其他我们无法控制或合理预见的情形。</p>
            </blockquote>

            <h4>7.3
                您需要<strong>对自己的体温负责</strong>，如果有<strong>发热</strong>等情况，您有<strong>义务主动停止自动打卡服务</strong>，由于您未按时停止打卡服务造成个人健康信息谎报的一切后果<strong>由您本人承担</strong>，我们不承担任何责任。
            </h4>

            <h3>八．未成年人使用条款</h3>

            <h4>8.1 若用户未满18周岁，则为未成年人，应在监护人监护、指导下阅读本协议和使用本服务。</h4>

            <h4>8.2 已满18周岁的成年人因任何原因不具备完全民事行为能力的，参照适用本协议之未成年人使用条款之相关约定。</h4>

            <h5>@ 桥苯环萘 帮助修纂此《服务协议》</h5>
        </article>


        <div class="divider"></div>
        <h3 class="text-xl font-semibold text-blue-500 text-center">
            为了提供更好的服务，点击下方加群，私聊群机器人回复“验证码”获取验证码，才能继续注册。
        </h3>


        <div class="mt-8 mb-5 mx-auto w-full max-w-sm flex">
            
            <div class="text-lg">
                <span class="badge badge-secondary mr-2"><svg t="1669196801930" class="icon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6014" width="20" height="20">
                        <path
                            d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                            p-id="6015" fill="#ffffff"></path>
                        <path
                            d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                            p-id="6016" fill="#ffffff"></path>
                    </svg>QQ群</span>
                <a class="link link-hover" href="https://jq.qq.com/?_wv=1027&k=Bj9gx2Nk">194790193</a>
            </div>
            <h3 class="text-lg">
                <span class="badge badge-secondary mr-2"><svg t="1669196801930" class="icon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6014" width="20" height="20">
                        <path
                            d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                            p-id="6015" fill="#ffffff"></path>
                        <path
                            d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                            p-id="6016" fill="#ffffff"></path>
                    </svg>QQ群</span>
                <a class="link link-hover"
                    href="https://jq.qq.com/?_wv=1027&k=PXzXC3cb">729086422</a>
            </h3>
        </div>

        <!--<input type="text" placeholder="邀请码" class="input input-bordered input-primary w-48 max-w-xs mr-2"
            v-model="verifycode" />
        <button class="btn btn-primary text-white" @click="toverify()">下一步</button>
        <label class="label" v-if="verifyError">
            <span class="label-text-alt text-red-600">邀请码错误</span>
        </label>-->

        <div
            class="mx-auto mt-6 w-full max-w-sm rounded-md border bg-transparent focus-within:border-blue-400 focus-within:ring focus-within:ring-blue-300 focus-within:ring-opacity-40 dark:border-gray-700 dark:focus-within:border-blue-300">
            <label class="flex flex-col md:flex-row">
                <input type="email" placeholder="邀请码" v-model="verifycode"
                    class="m-1 h-10 flex-1 appearance-none border-none bg-transparent px-4 py-2 text-gray-700 placeholder-gray-400 focus:placeholder-transparent focus:outline-none focus:ring-0 dark:text-gray-200" />
                <button type="button" @click="toverify()"
                    class="m-1 h-10 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">下一步</button>
            </label>

        </div>
        <label class="label mx-auto my-0  w-full max-w-sm" v-if="verifyError">
            <span class="label-text-alt text-red-600">邀请码错误</span>
        </label>

    </div>


    <div v-if="step == 1">

        <div class="hero">
            <div class="hero-content flex-col">
                <div class="text-center">
                    <h1 class="text-3xl font-bold">使用鑫考云账户登录</h1>
                    <p class="py-6">用来获取必要的信息，用于填充“体温上报”表单。</p>
                </div>
                <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div class="card-body">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">手机号码</span>
                            </label>
                            <input type="text" placeholder="鑫考云手机号" class="input input-bordered" v-model="tel" />
                            <label class="label" v-if="userExistError">
                                <span class="label-text-alt text-red-600">您已注册过体温助手服务了</span>
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">密码</span>
                            </label>
                            <input type="text" placeholder="鑫考云密码" class="input input-bordered" v-model="password" />
                            <label class="label" v-if="loginPwError">
                                <span class="label-text-alt text-red-600">密码错误</span>
                            </label>
                            <label class="label">
                                <a href="http://home.xinkaoyun.com/login.html"
                                    class="label-text-alt link link-hover">忘记密码？</a>
                            </label>
                        </div>
                        <div class="form-control mt-6">
                            <button class="btn btn-primary" @click="textExist()">登录以继续</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="step == 2">

        <center>
            <div v-if="stuIndexLength > 1">
                此账户下面有{{ stuIndexLength }}个学生，您是？
                <div v-for="(person, index) in loginInfoRaw.pardt" :key="index">
                    <input type="radio" name="radio-2" class="radio radio-primary mt-4 -mb-1.5 mx-3" :value="index"
                        v-model="stuIndex" />{{ person.ParentName }}
                </div>
            </div>

            <div class="form-control w-full max-w-xs mt-3">
                <label class="label">
                    <span class="label-text">班主任姓名</span>
                </label>
                <input type="text" placeholder="班主任姓名" class="input input-bordered w-full max-w-xs"
                    v-model="teacherName" />

            </div>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">宿舍号</span>
                </label>
                <input type="text" placeholder="宿舍号" class="input input-bordered w-full max-w-xs" v-model="dormitory" />
            </div>


            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">居住地</span>
                </label>
                <input type="text" placeholder="居住地" class="input input-bordered w-full max-w-xs" v-model="livePlace" />
            </div>

            <button class="btn btn-primary text-white mt-9" @click="commitInfo()">我确认信息无误</button>
        </center>

    </div>


    <div v-if="step == 3">


        <div class="container mx-auto sm:px-12 md:px-14 md:pt-0">

            <div class="mt-6 flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-semibold capitalize text-gray-800 dark:text-white lg:text-4xl">
                        您已成功注册体温助手服务.</h1>

                    <div class="mx-auto mt-6 flex">
                        <span class="inline-block h-1 w-40 rounded-full bg-blue-500"></span>
                        <span class="mx-1 inline-block h-1 w-3 rounded-full bg-blue-500"></span>
                        <span class="inline-block h-1 w-1 rounded-full bg-blue-500"></span>
                    </div>
                </div>

            </div>
            <div class="rounded-lg border border-transparent bg-blue-500 p-8 dark:bg-blue-600 my-8 text-center">
                <p class="leading-loose text-white">两年来，体温助手项目已经无偿<br>
                    为千余名小伙伴累计打卡超三万次，<br>
                    极大的方便了同学们的假期生活。<br>
                    但为了给同学们提供更稳定的服务，<br>
                    开发者会有一笔不小的支出，<br>
                    所以希望有能力的同学可以支持赞助，<br>
                    一是给我以继续维护此项目的动力，<br>
                    也是能够用来支付使用更稳定的云服务商的费用。<br>
                    您的一块两块就能给我带来快乐的一天，<br>
                    足够让我觉得无数个不眠的代码之夜没有白费。<br>

                </p>

                <div class="-mx-2 mt-8 flex items-center">
                    <div class="mt-6">
                        <img src="../assert/reward.png" class="w-14 rounded-md shrink-0 ring-4 ring-blue-200 mx-2">
                        <span class="text-white text-xs">微信支付宝</span>
                    </div>
                    <img class="mx-2 h-14 w-14 shrink-0 rounded-full object-cover ring-4 ring-blue-200"
                        src="https://hissin.cn/src/200.png" alt="">
                    <div class="mx-2">
                        <h1 class="font-semibold text-white">Hissin'</h1>
                        <span class="text-sm text-blue-200">Co-founder, Geekpara.</span>
                    </div>
                </div>
            </div>

            <div class="rounded-lg border p-8 dark:border-gray-700 leading-2">

                <p class="text-blue-500 font-bold mt-4">
                    # <kbd class="kbd">ctrl</kbd>
                    +
                    <kbd class="kbd">D</kbd>
                    收藏体温助手官网(<a href="https://temp.geekpara.com/">https://temp.geekpara.com/</a>)以备后用。<br />

                </p>
                <p class="text-blue-500 font-bold mt-4"># 分享此服务至微信/QQ/钉钉班级群，独乐乐不如众乐乐。</p>
                <p class="text-blue-500 font-bold mt-4"># 您可以点击“公告/查询”来查看您的助手服务状态，也可以在查询页面更改您的个人信息或取消助手服务。</p>
                <p class="text-blue-500 font-bold mt-4 ">#
                    我们定于每日北京时间06:00提交体温打卡，届时您的鑫考云将会弹窗提示“有其他设备在登录”，是必然现象！您可以随时重新登录，无须考虑会与代体温助手打卡服务冲突！同样，出现弹窗也说明您的打卡成功了。
                </p>
                <p class="text-blue-500 font-bold mt-4">#
                    我们只会保存您的账号以及加密后的密码，不会保存其他任何您的个人信息，我们承诺会在假期结束时删除保存的信息，如果下一假期还需要使用，您可以重新注册。</p>

                <div class="mt-4">
                    <p class="text-blue-500 font-bold mb-3"># 交流/通知/赞助</p>

                    <a class="text-lg pl-3" href="https://jq.qq.com/?_wv=1027&k=Bj9gx2Nk">
                        <span class="badge badge-secondary badge-outline mr-2">
                            <svg t="1669341648888" class="icon w-4 h-4" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4127" width="1000" height="1000">
                                <path
                                    d="M758.365091 209.454545a79.36 79.36 0 0 1 79.336727 74.752l0.116364 4.51491v485.166545a60.113455 60.113455 0 0 1-60.183273 60.043636 60.136727 60.136727 0 0 1-60.043636-56.087272l-0.139637-3.956364-0.023272-362.938182-475.880728 456.634182a60.276364 60.276364 0 0 1-85.108363-1.629091 59.950545 59.950545 0 0 1-1.326546-81.826909l2.978909-3.095273 470.528-451.490909H272.058182a60.136727 60.136727 0 0 1-60.066909-56.087273l-0.139637-3.956363a60.113455 60.113455 0 0 1 56.250182-59.927273L272.058182 209.454545h486.306909z"
                                    p-id="4128" fill="#377CFB"></path>
                                </svg>QQ 194790193
                        </span>
                    </a>

                    <a class="text-lg pl-3 mt-3"
                        href="https://jq.qq.com/?_wv=1027&k=PXzXC3cb">
                        <span class="badge badge-secondary badge-outline mr-2">
                            <svg t="1669341648888" class="icon w-4 h-4" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4127" width="1000" height="1000">
                                <path
                                    d="M758.365091 209.454545a79.36 79.36 0 0 1 79.336727 74.752l0.116364 4.51491v485.166545a60.113455 60.113455 0 0 1-60.183273 60.043636 60.136727 60.136727 0 0 1-60.043636-56.087272l-0.139637-3.956364-0.023272-362.938182-475.880728 456.634182a60.276364 60.276364 0 0 1-85.108363-1.629091 59.950545 59.950545 0 0 1-1.326546-81.826909l2.978909-3.095273 470.528-451.490909H272.058182a60.136727 60.136727 0 0 1-60.066909-56.087273l-0.139637-3.956363a60.113455 60.113455 0 0 1 56.250182-59.927273L272.058182 209.454545h486.306909z"
                                    p-id="4128" fill="#377CFB"></path>
                            </svg>QQ 729086422
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

                <div class="mt-4">
                    <div class="-mx-2 mt-8 flex items-center">
                        <div class="mx-2">
                            <h1 class="font-semibold text-blue-500 dark:text-white">· 注意事项</h1>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-ghost w-full mt-4 text-blue-500" @click="$emit('backHome')">我已阅读，回到主页</button>
        </div>
    </div>


</template>
