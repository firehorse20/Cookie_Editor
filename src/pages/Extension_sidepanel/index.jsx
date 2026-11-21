/*global chrome*/
import {useEffect} from "react";
import {observer} from "mobx-react-lite";
import Sidebar from "./components/sidebar";
import AlertComponent from "./components/alert";
import ShowCookie from "./tabs/cookie";
import {googleAnalytics} from "../../utils/google_analytics";
import About from "./components/popup/about";
import {settingStore} from "../../mobx/setting.store";
import ClearData from "./tabs/clear_data";
import Setting from "./tabs/setting";
import PopupDetailCookie from "./components/popup/detail_cookie";
import Loading from "./components/loading";

const ExtensionSidePanel = () => {
    const isSet = settingStore.load_data_setting;
    const lastDayActive = settingStore.day_active;
    const countDayActive = Number(settingStore.count_day_active);
    const themeMode = settingStore.theme_mode;


    useEffect(() => {
        const versionExtension = localStorage.getItem("extension_version");
        if (!versionExtension) {
            settingStore.setDisplayCookie("default");
            settingStore.setFormatCopy("header_string");
            settingStore.setFormatExport("header_string");
            settingStore.setFormatImport("text");
            settingStore.setOptionImport(["reload_page"])
            settingStore.setCustomDisplayCookie([
                "domain",
                "expirationDate",
                "hostOnly",
                "httpOnly",
                "name",
                "path",
                "sameSite",
                "secure",
                "session",
                "storeId",
                "value"
            ])
        }
        const dataConfirmDialog = localStorage.getItem("confirm_dialog");
        if (typeof dataConfirmDialog !== "string") {
            settingStore.setConfirmDialog([
                "copy",
                "delete",
                "delete_all"
            ])
        }

        localStorage.setItem("extension_version", chrome.runtime.getManifest().version);
    }, [])

    useEffect(() => {
        if (isSet) {
            const today = new Date().toDateString();
            if (!lastDayActive || lastDayActive !== today) {
                googleAnalytics({name: "account_active", params: []});
                settingStore.setDayActive(today)
                settingStore.setCountDayActive(String(countDayActive + 1))
            }
        }
    }, [isSet, lastDayActive, countDayActive])

    useEffect(() => {
        googleAnalytics({name: "use_extension", params: []});
        settingStore.setDataSetting();
    }, [])

    return (
        <div className={`w-full h-[100vh] bg-[#282828] ${themeMode === "light" ? "theme-light" : "theme-dark"}`}>
            <div className={"w-full h-full m-auto bg-[#282828] flex justify-center"}>
                <div
                    className="h-full inline-block"
                    style={{width: "calc(100% - 50px)"}}
                >
                    <div className={`w-full h-full p-[10px] pb-[20px] overflow-y-auto relative`}>
                        <ShowCookie/>

                        <Setting/>

                        <ClearData/>

                        <AlertComponent/>

                        <About/>

                        <PopupDetailCookie />

                        <Loading />

                    </div>
                </div>

                <div className={"inline-block w-[50px] h-full bg-[#3C3C3C]"}>
                    <Sidebar/>
                </div>
            </div>
        </div>
    )
}

export default observer(ExtensionSidePanel)