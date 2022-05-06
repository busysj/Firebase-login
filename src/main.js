import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import firebase from "firebase/compat/app";
// 인증 객체 들고 오기
import "@/datasources/firebase";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  created() {
    // 사용자가 로그아웃, 비밀번호 등을 변경했을 때 처리
    // pUserInfo : 유저정보를 담아두는 사용자 정의 객체
    firebase.auth().onAuthStateChanged((pUserInfo) => {
      if (pUserInfo) {
        // 이미 로그인 되어있었는 지 상태를 파악해서 처리
      }
    });
  },
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
