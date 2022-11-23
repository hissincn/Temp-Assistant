<script>
import Qs from 'qs';
const apiUrl = "http://101.43.184.61:3002/";

export default {
    data() {
        return {
            step: 0,
            verifycode: "",
            verifyError: false,
            loginPwError: false,
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
            fetch(apiUrl+'verify', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then(
                    res => res.json()
                )
                .then((data) => {
                    if (data == this.verifycode) {
                        this.step = 1;
                    }
                    else {
                        this.verifyError = true;
                        setTimeout(() => { this.verifyError = false; }, 3000)
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
            fetch(apiUrl+'UserUpdate', {
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
                    if(data == "1"){
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
        <dl>
            <dt class="mb-8">
                <h3 class="text-xl font-semibold">
                    欢迎您使用体温助手（以下简称"本服务"）。在您使用本服务之前，请您务必仔细阅读并透彻理解本《免责声明》。您可以选择不使用本服务，但如果您使用本服务，您的使用行为将被视为对本声明全部内容的认可。
                </h3>
            </dt>
            <dd class="mb-4">
                <p>
                    在法律允许的范围内，本服务在此声明,不承担用户或任何人士就使用或未能使用本网站所提供的信息或任何链接或项目所引致的任何直接、间接、附带、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务、未实现预期的节省）。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    本服务是用户授权我们，按照用户本人意愿代替用户进行体温打卡操作，对用户提供的住址等个人信息并不知情，用户需自行负责信息的真实性，我们不会储存您的任何个人隐私。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    我们没有义务了解用户实际的体温状况，用户需要对自己的体温负责，如果有发热等情况，用户有义务主动停止自动打卡服务，由于用户未按时停止打卡服务造成个人健康信息谎报的一切后果由用户本人承担，服务提供者没有任何责任。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    本服务所提供的信息，若在任何司法管辖地区供任何人士使用或分发给任何人士时会违反该司法管辖地区的法律或条例的规定或会导致本网站或其第三方代理人受限于该司法管辖地区内的任何监管规定时，则该等信息不宜在该司法管辖地区供该等任何人士使用或分发给该等任何人士。用户须自行保证不会受限于任何限制或禁止用户使用或分发本网站所提供信息的当地的规定。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    本服务可能因合作方或相关电信部门的互联网软硬件设备故障或失灵、或人为操作疏忽而全部或部分中断、延迟、遗漏、误导或造成资料传输或储存上的错误、或遭第三人侵入系统篡改或伪造变造资料造成无法自动打卡等，对此用户同意理解和接受。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    本服务可能因黑客攻击、计算机病毒侵入或发作、政府管制而造成的暂时性关闭，或因前述原因以及与本网站链接的其它网站原因导致个人资料泄露、丢失、被盗用或被篡改等，对此用户同意理解和接受。
                </p>
            </dd>
            <dd class="mb-4">
                <p>
                    本服务有权在任何时候，修改或暂停、终止本平台全部或部分服务，对此用户可以理解和接受。本服务图片，文字之类版权申明，如果侵犯，请及时通知我们，本网站将在第一时间及时删除。
                </p>
            </dd>
            <dt class="mb-8">
                <h3 class="text-xl font-semibold">
                    凡直接、间接使用本服务，视为自愿接受本网站声明的约束。
                </h3>
            </dt>
        </dl>
        <div class="divider"></div>
        <h3 class="text-xl font-semibold">
            为了提供更好的服务，现需要通过以下任意一种方式加群获取邀请码，才能继续注册。
        </h3>


        <div class="my-2">
            <h3 class="text-lg">
                <span class="badge badge-secondary mr-2"><svg t="1669196801930" class="icon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6014" width="20" height="20">
                        <path
                            d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                            p-id="6015" fill="#ffffff"></path>
                        <path
                            d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                            p-id="6016" fill="#ffffff"></path>
                    </svg>QQ一群</span>
                <a class="link link-hover" href="https://jq.qq.com/?_wv=1027&k=FLpEj4b8">756016909</a>
            </h3>
            <h3 class="text-lg">
                <span class="badge badge-secondary mr-2"><svg t="1669196801930" class="icon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6014" width="20" height="20">
                        <path
                            d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                            p-id="6015" fill="#ffffff"></path>
                        <path
                            d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                            p-id="6016" fill="#ffffff"></path>
                    </svg>QQ一群</span>
                <a class="link link-hover" href="https://jq.qq.com/?_wv=1027&k=cPvj2Vft">745731575</a>
            </h3>
            <h3 class="text-lg">
                <span class="badge badge-secondary mr-2"><svg t="1669196801930" class="icon" viewBox="0 0 1024 1024"
                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6014" width="20" height="20">
                        <path
                            d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
                            p-id="6015" fill="#ffffff"></path>
                        <path
                            d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
                            p-id="6016" fill="#ffffff"></path>
                    </svg>钉钉群</span>
                <a class="link link-hover"
                    href="https://qr.dingtalk.com/action/joingroup?code=v1,k1,mQvtrGj2v7QyElRcjOGFciRHyuduanL5u+OlefppD64=&_dt_no_comment=1&origin=11">31846657</a>
            </h3>
        </div>

        <input type="text" placeholder="邀请码" class="input input-bordered input-primary w-48 max-w-xs mr-2"
            v-model="verifycode" />
        <button class="btn btn-primary text-white" @click="toverify()">下一步</button>
        <label class="label" v-if="verifyError">
            <span class="label-text-alt text-red-600">邀请码错误</span>
        </label>

    </div>


    <div v-if="step == 1">

        <div class="hero">
            <div class="hero-content flex-col">
                <div class="text-center">
                    <h1 class="text-5xl font-bold">使用鑫考云账户登录</h1>
                    <p class="py-6">用来获取必要的信息，用于填充“体温上报”表单。</p>
                </div>
                <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <div class="card-body">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">手机号码</span>
                            </label>
                            <input type="text" placeholder="鑫考云手机号" class="input input-bordered" v-model="tel" />
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
                            <button class="btn btn-primary" @click="login()">登录以继续</button>
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


</template>
