/*global chrome*/
import {observer} from "mobx-react-lite";
import {extension} from "../../../../utils/chrome";
import {settingStore} from "../../../../mobx/setting.store";
import IconCookie from "../../../../icons/cookie";
import IconSetting from "../../../../icons/setting";
import IconStar from "../../../../icons/star";
import IconInfo from "../../../../icons/info";
import GithubIcon from "../../../../icons/github";
import IconDelete from "../../../../icons/delete";
import {PROJECT_URL, AMO_REVIEWS_URL} from "../../../../constants/website";

const Sidebar = () => {
    const themeMode = settingStore.theme_mode;
    const isLightMode = themeMode === "light";
    const iconClass = `w-[20px] h-[20px] ${isLightMode ? "text-gray-800" : "text-white"}`;
    const actionClass = (isActive = false) =>
        `w-[40px] m-[5px] rounded-[3px] p-[10px] cursor-pointer group relative ${
            isLightMode
                ? `${isActive ? "bg-gray-200" : ""} hover:bg-gray-200`
                : `${isActive ? "bg-[#2E3135]" : ""} hover:bg-[#2E3135]`
        }`;

    const handleSelectAction = (action, type = "tab") => {
        if (type === "tab") {
            settingStore.tab = action
        } else {
            settingStore.popup = action;
        }
    }

    return (
        <>
            <div className="w-full relative" style={{height: "calc(100% - 100px)"}}>
                <div className="w-full">
                    <div
                        onClick={() => handleSelectAction("home")}
                        className={actionClass(settingStore.tab === "home")}
                    >
                        <IconCookie cname={iconClass}/>
                        <div
                            style={{zIndex: 51}}
                            className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">Cookie</span>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleSelectAction("clear_data_web")}
                     className={actionClass(settingStore.tab === "clear_data_web")}
                >
                    <IconDelete cname={iconClass} />
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_clear_browser")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => handleSelectAction("setting")}
                    className={actionClass(settingStore.tab === "setting")}
                >
                    <IconSetting cname={iconClass}/>

                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_setting")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => window.open(AMO_REVIEWS_URL, '_blank')}
                    className={actionClass(false)}
                >
                    <IconStar cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_reviews")}
                            </span>
                    </div>
                </div>

                <div
                    onClick={() => window.open(PROJECT_URL, '_blank')}
                    className={actionClass(false)}
                >
                    <GithubIcon cname={iconClass}/>
                    <div
                        style={{zIndex: 51}}
                        className="hidden group-hover:block bg-white absolute right-[50px] top-[50%] translate-y-[-50%] rounded-[5px] p-[5px]">
                            <span className="text-gray-900 whitespace-nowrap">
                                {extension.getLang("sidebar_open_source")}
                            </span>
                    </div>
                </div>
            </div>
            <div className={`w-full`}>
                <div
                    onClick={() => handleSelectAction("about", "popup")}
                    className={actionClass(false)}>
                    <IconInfo cname={iconClass}/>
                </div>
            </div>
        </>
    )
}

export default observer(Sidebar)
