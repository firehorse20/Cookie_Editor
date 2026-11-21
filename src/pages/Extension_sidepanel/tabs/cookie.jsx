/*global chrome*/
import WebsiteInfo from "../components/webiste_info";
import TopAction from "../components/top_action";
import DetailCookie from "../components/detail_cookie";
import {useEffect, useState} from "react";
import {icons} from "../../../constants/icon";
import EmptyCookie from "../components/empty_cookie";
import {observer} from "mobx-react-lite";
import {settingStore} from "../../../mobx/setting.store";
import {hasHostPermissions, requestHostPermissions} from "../../../utils/browser";

const ShowCookie = () => {
    const [tab, setTab] = useState(undefined);
    const [favicon, setFavicon] = useState("");
    const [cookieInfo, setCookieInfo] = useState(undefined);
    // Firefox MV3 host permissions start ungranted: until the user
    // allows website access, cookies.getAll() resolves to [].
    const [needsPermission, setNeedsPermission] = useState(false);

    const handleGrantPermission = async () => {
        const granted = await requestHostPermissions();
        setNeedsPermission(!granted);
        if (granted) {
            await handleGetCookies();
        }
    };

    const handleGetTabCurrent = async () => {
        const [tabCurrent] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        setTab(JSON.parse(JSON.stringify(tabCurrent)));
    }

    const getFavicon = async (url) => {
        if (url.startsWith("chrome://") || url.startsWith("https://chromewebstore.google.com/")) {
            setFavicon(icons.chrome)
        } else {
            const linkFavicon = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`;
            const check = await fetch(linkFavicon);
            if (check.status === 404) {
                setFavicon(icons.chrome)
            } else {
                setFavicon(linkFavicon)
            }
        }
    }

    const isValidCookieUrl = (url) => {
        return typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"));
    };

    const handleGetCookies = async () => {
        if (!isValidCookieUrl(tab?.url)) {
            setCookieInfo([]);
            return;
        }

        if (!(await hasHostPermissions())) {
            setNeedsPermission(true);
            setCookieInfo([]);
            return;
        }
        setNeedsPermission(false);

        const data = await chrome.cookies.getAll({url: tab.url});
        setCookieInfo(JSON.parse(JSON.stringify(data)));
    }

    useEffect(() => {
        if (tab) {
            const handleUpdateCookie = (e) => {
                ["add", "delete", "clear", "edit", "import"].includes(e.detail.action) && handleGetCookies().then()
            }

            document.addEventListener("update_cookie", handleUpdateCookie);

            return () => document.removeEventListener("update_cookie", handleUpdateCookie);
        }
    }, [tab])

    useEffect(() => {
        // Ask for host access on first open (Firefox MV3 does not
        // grant it at install time). If the user dismisses the
        // prompt, the empty view offers a button to ask again.
        hasHostPermissions().then(async (granted) => {
            if (!granted) {
                const ok = await requestHostPermissions();
                setNeedsPermission(!ok);
            }
        });
        handleGetTabCurrent().then();

        chrome.tabs.onActivated.addListener(() => {
            handleGetTabCurrent().then();
        });

        chrome.tabs.onUpdated.addListener(() => {
            handleGetTabCurrent().then();
        });
    }, [])

    useEffect(() => {
        if (tab !== undefined) {
            if (isValidCookieUrl(tab.url)) {
                getFavicon(tab.url).then();
                handleGetCookies().then();
            } else {
                setFavicon(icons.chrome);
                setCookieInfo([]);
            }
        }
    }, [tab]);

    return (
        <>
            {
                settingStore.tab === "home" && (
                    <>
                        <WebsiteInfo
                            tab={tab}
                            favicon={favicon}
                        />

                        {
                            typeof cookieInfo === "object" && (
                                <TopAction
                                    tab={tab}
                                    cookies={cookieInfo}
                                />
                            )
                        }

                        <div className={`w-full mb-3`}>
                            {
                                typeof cookieInfo === "object" && (
                                    <>
                                        {
                                            cookieInfo.length > 0 ? (
                                                <DetailCookie
                                                    cookies={cookieInfo}
                                                />
                                            ) : (
                                                <EmptyCookie
                                                    needsPermission={needsPermission}
                                                    onGrant={handleGrantPermission}
                                                />
                                            )
                                        }
                                    </>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    )
}

export default observer(ShowCookie)