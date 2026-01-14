import get from "lodash.get";
import { apix } from "../utils/apix";
import api from "../utils/axios";
import { userRoleMe } from "../utils/getAccess";

export const userToken = async () => {
  if (process.env.NEXT_PUBLIC_MODE === "dev") {
    let user = localStorage.getItem("user");
    if (user) {
      try {
        await userRoleMe();
        return true;
      } catch (ex: any) {
        const error = get(ex, "response.data.meta.message") || ex.message;
        if (error === "Request failed with status code 401") {
          await apix({
            port: "public",
            method: "delete",
            path: "/api/destroy-cookies",
          });
          localStorage.removeItem("user");
          user = null;
        }
      }
      if (user) {
        const w = window as any;
        w.user = JSON.parse(user);
      }
      return true;
    } else {
      try {
        let user = await apix({
          port: "portal",
          value: "data.data",
          path: "/api/users/me",
        });
        if (user) {
          let profile = null;
          try {
            const data = await apix({
              port: "recruitment",
              value: "data.data",
              path: "/api/user-profiles/user",
            });
            profile = data;
            delete profile["user"];
            user = {
              ...user,
              profile,
            };
          } catch (ex) {}
          const w = window as any;
          w.user = JSON.parse(user);
          return true;
        }
      } catch (ex: any) {
        return false;
      }
    }
  } else {
    try {
      const res = await apix({
        port: "portal",
        value: "data.data",
        path: "/api/check-jwt-token",
        method: "get",
      });
      const jwt = res;

      await api.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/cookies", {
        token: jwt,
      });
      let user = await apix({
        port: "portal",
        value: "data.data",
        path: "/api/users/me",
      });
      if (user) {
        let profile = null;
        try {
          const data = await apix({
            port: "recruitment",
            value: "data.data",
            path: "/api/user-profiles/user",
          });
          profile = data;
          delete profile["user"];
          user = {
            ...user,
            profile,
          };
        } catch (ex) {}
        localStorage.setItem("user", JSON.stringify(user));
        const w = window as any;
        w.user = JSON.parse(user);
        return true;
      }
    } catch (ex) {
      const user = localStorage.getItem("user");
      if (user) {
        const w = window as any;
        w.user = JSON.parse(user);
        return true;
      }
    }
  }
  return false;
  // const user = localStorage.getItem("user");
  // if (user) {
  //   const w = window as any;
  //   w.user = JSON.parse(user);
  // } else {
  //   try {
  //     const res = await api.get(
  //       `${process.env.NEXT_PUBLIC_API_PORTAL}/api/check-jwt-token`
  //     );
  //     const jwt = res.data.data;
  //     if (!jwt) return navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/login`);
  //     try {
  //       await api.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/cookies", {
  //         token: jwt,
  //       });
  //       const user = await api.get(
  //         `${process.env.NEXT_PUBLIC_API_PORTAL}/api/users/me`
  //       );
  //       const us = user.data.data;
  //       if (us) {
  //         localStorage.setItem("user", JSON.stringify(user.data.data));
  //         const roles = await userRoleMe();
  //       }
  //     } catch (e) {}
  //   } catch (ex) {}
  // }
};

export const checkJWT = async () => {};
