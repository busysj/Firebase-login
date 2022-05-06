// 구글인증 관련 내용만 따로 작성한 store 모듈

// 파이어베이스 앱 객체 모듈
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// 라우터 사용을 위한
import router from "@/router";

export default {
  state: {
    oUser: null, // 사용자 정보를 담을 객체
  },
  mutations: {
    // 사용자 객체 저장
    fnSetUser(state, payload) {
      state.oUser = payload;
    },
  },
  getters: {
    // 사용자 객체 반환
    fnGetUser(state) {
      return state.oUser;
    },
    // 사용자 객체값의 유무로 로그인 여부 판단
    fnGetAuthStatus(state) {
      return state.oUser != null;
    },
  },
  actions: {
    // 이메일 회원가입 처리
    fnRegisterUser({ commit }, payload) {
      // firebase에 이메일 회원 생성 및 저장
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.pEmail, payload.pPassword)
        .then((pUserInfo) => {
          // 신규 회원 이메일 정보를 스토어에 저장
          commit("fnSetUser", {
            // 7버전은 fnSetUser.email로 접근할 수 있지만
            // 9버전은 pUserInfo.user.email을 통해 접근한다.
            email: pUserInfo.user.email,
          });
          router.push("/main");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    DoLogin({ commit }, payload) {
      // 파이어베이스에 이메일 회원 로그인 인증처리 요청
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.pEmail, payload.pPassword)
        .then((pUserInfo) => {
          // 로그인이 성공하면 스토어에 계정정보 저장
          commit("fnSetUser", {
            id: pUserInfo.user.uid,
            name: pUserInfo.user.displayName,
            email: pUserInfo.user.email,
            photoURL: pUserInfo.user.photoURL,
          });
          router.push("/main");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    // 구글 계정 회원 로그인 (팝업)
    fnDoGoogleLogin_Popup({ commit }) {
      // firebase에 구글 회원 로그인 인증 처리 요청
      // 로그인 제공자 객체 생성
      const oProvider = new firebase.auth.GoogleAuthProvider();
      // 오픈 계정의 범위(가져오는 값)
      oProvider.addScope("profile");
      oProvider.addScope("email");

      // 로그인 요청
      firebase
        .auth()
        .signInWithPopup(oProvider)
        .then((pUserInfo) => {
          // 로그인이 성공하면 스토어에 계정 정보 저장
          commit("fnSetUser", {
            id: pUserInfo.user.uid,
            name: pUserInfo.user.displayName,
            email: pUserInfo.user.email,
            photoURL: pUserInfo.user.photoURL,
          });
          router.push("/main");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },

    // 로그아웃
    fnDoLogout({ commit }) {
      firebase.auth().signOut();
      commit("fnSetUser", null);
      router.push("/");
    },
  },
};