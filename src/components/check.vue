<script>
import Qs from 'qs';
const apiUrl = "https://tempapi.hissin.cn/";

export default {
    data() {
        return {
            checkInput: '',
            userdata: null,
            multiuser: null,
            checkError: false,
            userIndex: null,

        }
    },
    methods: {
        errorBackNormal() {
            setTimeout(() => {
                this.checkError = false;
            }, 2000)
        },
        checking() {

            let inputType = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.checkInput);

            if (inputType) {
                //手机号

                fetch('https://tempapi.hissin.cn/QueryByTel', { method: 'POST', body: new URLSearchParams({ tel: this.checkInput }) })
                    .then(response => response.json())
                    .then(response => {
                        if (response != 0) {
                            this.userdata = response;
                        }
                        else {
                            this.checkError = true;
                            this.errorBackNormal();
                        }
                    })
                    .catch(err => console.error(err));
            }
            else {
                //姓名

                fetch('https://tempapi.hissin.cn/QueryByName', { method: 'POST', body: new URLSearchParams({ name: this.checkInput }) })
                    .then(response => response.json())
                    .then(response => {
                        if (response.length == 1) {
                            this.multiuser = null;

                            fetch('https://tempapi.hissin.cn/QueryByTel', { method: 'POST', body: new URLSearchParams({ tel: response[0].tel }) })
                                .then(response => response.json())
                                .then(response => {
                                    this.userdata = response;
                                })
                                .catch(err => console.error(err));
                        }
                        else if (response.length > 1) {
                            this.multiuser = response;
                        }
                        else if (response == 0) {
                            this.multiuser = null;
                            this.checkError = true;
                            this.errorBackNormal();
                        }
                    })
                    .catch(err => console.error(err));
            }

        }
    },
    watch: {
        userIndex() {
            fetch('https://tempapi.hissin.cn/QueryByTel', { method: 'POST', body: new URLSearchParams({ tel: this.multiuser[this.userIndex].tel }) })
                .then(response => response.json())
                .then(response => {
                    if (response != 0) {
                        this.userdata = response;
                    }
                    else {
                        this.checkError = true;
                        this.errorBackNormal();
                    }
                })
                .catch(err => console.error(err));
        },
        checkInput() {
            this.userdata = null;
            this.multiuser = null;
            this.checkError = false;
            this.userIndex = null;
        }

    },
    computed: {
        userStatus() {
            if (this.userdata) {
                if (this.userdata.status == "active") {
                    return "正常";
                }
                else if (this.userdata.status == "suspend") {
                    return "暂停";
                }
                else if (this.userdata.status == "pwerror") {
                    return "密码错误";
                }
            }



        }
    }

}


</script>


<template>




    <div class="max-w-3xl mx-auto">

        <div class="flex items-center">
            <label for="voice-search" class="sr-only">Search</label>
            <div class="relative w-full">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"></path>
                    </svg>
                </div>
                <input type="text" id="voice-search" v-model="checkInput"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="输入手机号或姓名查询打卡状态" required>

            </div>
            <button @click="checking()"
                class="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg class="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>Search</button>
        </div>

        <p class="mt-5">通过查询您的打卡状态，您可以随时暂停/开启您的打卡服务，也可以随时修改您的信息。如果您忘记密码，那么这里是<a class="text-blue-500 hover:underline"
                href="http://home.xinkaoyun.com/login.html" target="_blank">鑫考云官网</a>。
        </p>


        <div class="flex flex-col mt-4">
            <div v-if="multiuser" class="my-5">
                <div class="text-blue-500 font-bold mb-3">撞名啦，您的手机号是哪一个？</div>
                <div v-for="(person, index) in multiuser" :key="index">
                    <input type="radio" name="radio-2" class="radio radio-primary" v-model='userIndex'
                        :value="index" />{{
                                person.tel
                        }}
                </div>
            </div>
        </div>



        <div class="my-6" v-if="userdata">

            <div class="rounded-md shrink-0 ring-4 ring-blue-200 px-8 py-5 mb-5">
                <strong
                    class="px-4 py-1  text-base rounded-2xl font-medium tracking-wide " :class="userdata.status=='active' ? 'text-green-600  bg-green-200': 'text-red-600  bg-red-200'">
                    {{ userStatus }}
                </strong>

                <div class="mt-8 flex justify-between">
                    <div class="max-w-[35ch]">
                        <h1 class="text-2xl font-bold">
                            {{ userdata.name }}
                        </h1>

                        <p class="mt-0.5 text-sm">{{ userdata.tel }}</p>

                    </div>

                    <p class="text-lg font-bold">{{ userdata.tempHistory[0].status }}</p>
                </div>


                <div class="my-4 prose max-w-none group-open:hidden">
                    <button class="btn btn-primary mr-2">信息更新</button>
                    <button class="btn btn-secondary mr-2">打开服务</button>
                    <button class="btn btn-accent mr-2 text-white font-bold">暂停服务</button>
                </div>


            </div>








            <div class="rounded-md shrink-0 ring-4 ring-blue-200">
                <table class="table w-full">
                    <thead class="">
                        <tr>
                            <th class="font-bold text-white text-lg bg-blue-500 ">日期</th>
                            <th class="font-bold text-white text-lg bg-blue-500">体温/状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="hover:bg-blue-100" v-for="(day, index) in userdata.tempHistory" :key="index">
                            <th class="font-bold text-blue-500 text-base bg-white hover:bg-blue-100">{{ day.createdAt }}
                            </th>
                            <td class="font-bold text-blue-400 text-base bg-white hover:bg-blue-100">{{ day.status }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>










</template>