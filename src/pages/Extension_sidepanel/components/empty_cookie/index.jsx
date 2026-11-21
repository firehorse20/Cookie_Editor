import {extension} from "../../../../utils/chrome";
import {settingStore} from "../../../../mobx/setting.store";

const EmptyCookie = ({needsPermission = false, onGrant = () => {}}) => {
    const isLightMode = settingStore.theme_mode === "light";

    if (needsPermission) {
        return (
            <div className={`w-full mt-[100px] text-center px-4`}>
                <p className={`${isLightMode ? "text-gray-800" : "text-white"} text-[16px] mb-2`}>
                    {extension.getLang("msg_need_host_permission")}
                </p>
                <p className={`${isLightMode ? "text-gray-600" : "text-gray-200"} mb-5`}>
                    {extension.getLang("msg_need_host_permission_desc")}
                </p>
                <button
                    onClick={onGrant}
                    className={`h-[40px] px-5 rounded-[10px] bg-blue-600 text-white text-[14px] cursor-pointer`}>
                    {extension.getLang("btn_grant_permission")}
                </button>
            </div>
        )
    }

    return (
        <div className={`w-full mt-[100px] text-center`}>
            <p className={`${isLightMode ? "text-gray-800" : "text-white"} text-[16px] mb-2`}>
                {extension.getLang("msg_no_cookies")}
            </p>
            <p className={`${isLightMode ? "text-gray-600" : "text-gray-200"}`}>
                {extension.getLang("no_cookie_description")}.
            </p>
        </div>
    )
}

export default EmptyCookie