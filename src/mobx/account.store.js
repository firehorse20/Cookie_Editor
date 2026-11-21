/*global chrome*/
import { makeAutoObservable } from 'mobx';
import {settingStore} from "./setting.store";
class AccountStore {
    constructor() {
        makeAutoObservable(this);
    }

    account = {};

    async getAccount() {
        const response = await fetch(`${import.meta.env.VITE_WEBSITE}/auth/info`, {
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        const dataResponse = await response.json();
        if (dataResponse.data.user) {
            this.account = dataResponse.data.user;
            // Ads were removed from this build, so show_ads stays false.
        }
    }

    async logout() {
        await fetch(`${import.meta.env.VITE_WEBSITE}/logout`, {
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });

        this.account = {};
        settingStore.popup = "";
    }

}

export const accountStore = new AccountStore();
