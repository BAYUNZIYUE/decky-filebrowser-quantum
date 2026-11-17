const manifest = {"name":"FileBrowser Quantum"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const call = api.call;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaFolderOpen (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"},"child":[]}]})(props);
}

const EMPTY = {
    plugin_version: "",
    installed: false,
    running: false,
    ready: false,
    pid: null,
    version: null,
    latest_version: null,
    latest_prerelease: false,
    update_available: false,
    last_check: null,
    check_error: null,
    url: "",
    port: 8082,
    listen_lan: false,
    source_path: "",
    source_name: "Steam Deck",
    admin_username: "admin",
    admin_password: "",
    no_auth: false,
    auto_start: true,
    channel: "stable",
    busy: null,
    progress: {},
    bin_size: 0,
    sha256: null,
    log_path: "",
    port_free: true,
};
const getState = () => call("get_state");
const formatBytes = (bytes) => {
    if (!bytes)
        return "-";
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
const formatAgo = (ts) => {
    if (!ts)
        return "从未检查";
    const diff = Math.max(0, Date.now() / 1000 - ts);
    if (diff < 60)
        return "刚刚";
    if (diff < 3600)
        return `${Math.floor(diff / 60)} 分钟前`;
    return `${Math.floor(diff / 3600)} 小时前`;
};
const phaseText = (progress) => {
    const map = {
        resolve: "正在读取 GitHub 发行版…",
        download: "正在下载二进制…",
        verify: "正在校验文件…",
        configure: "正在写入配置…",
    };
    const base = map[progress.phase ?? ""] ?? "处理中…";
    if (progress.phase === "download" && progress.percent) {
        return `${base} ${progress.percent}%`;
    }
    return base;
};
const Content = () => {
    const [state, setState] = SP_REACT.useState(EMPTY);
    const [error, setError] = SP_REACT.useState(null);
    const [draft, setDraft] = SP_REACT.useState({
        port: "8082",
        source_path: "",
        source_name: "Steam Deck",
        admin_password: "",
    });
    const [dirty, setDirty] = SP_REACT.useState(false);
    const [showPassword, setShowPassword] = SP_REACT.useState(false);
    const dirtyRef = SP_REACT.useRef(false);
    const apply = (next, notify = true) => {
        setState(next);
        if (!dirtyRef.current) {
            setDraft({
                port: String(next.port),
                source_path: next.source_path,
                source_name: next.source_name,
                admin_password: next.admin_password,
            });
        }
        if (notify && next.message) {
            toaster.toast({
                title: next.ok === false ? "FileBrowser Quantum 出错了" : "FileBrowser Quantum",
                body: next.message,
                critical: next.ok === false,
            });
        }
    };
    const refresh = async () => {
        try {
            const next = await getState();
            setError(null);
            apply(next, false);
        }
        catch (err) {
            setError(String(err));
        }
    };
    SP_REACT.useEffect(() => {
        refresh();
        const timer = setInterval(refresh, 2500);
        return () => clearInterval(timer);
    }, []);
    const act = async (route, ...args) => {
        try {
            const next = await call(route, ...args);
            apply(next);
        }
        catch (err) {
            toaster.toast({
                title: "FileBrowser Quantum 出错了",
                body: String(err),
                critical: true,
            });
        }
    };
    const saveSettings = async () => {
        await act("save_settings", {
            port: draft.port,
            source_path: draft.source_path,
            source_name: draft.source_name,
            admin_password: draft.admin_password,
        });
        dirtyRef.current = false;
        setDirty(false);
    };
    const openWeb = () => {
        const url = state.url;
        try {
            DFL.Navigation.NavigateToExternalWeb(url);
        }
        catch {
            act("open_ui");
        }
    };
    const confirmThen = (title, description, action) => {
        DFL.showModal(SP_JSX.jsx(DFL.ConfirmModal, { strTitle: title, strDescription: description, strOKButtonText: "\u7EE7\u7EED", strCancelButtonText: "\u53D6\u6D88", onOK: action, closeModal: () => true, onCancel: () => true }), undefined, { strTitle: title });
    };
    const openLogs = async () => {
        const res = await call("get_logs", 150);
        DFL.showModal(SP_JSX.jsx(DFL.ModalRoot, { closeModal: () => true, onOK: () => true, onCancel: () => true, strTitle: "\u8FD0\u884C\u65E5\u5FD7", children: SP_JSX.jsx("div", { style: {
                    maxHeight: "45vh",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    padding: "8px",
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: "4px",
                }, children: res.log || "(空)" }) }), undefined, { strTitle: "运行日志" });
    };
    const statusLabel = !state.installed
        ? "未安装"
        : state.running
            ? state.ready
                ? "运行中"
                : "启动中"
            : "已停止";
    return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "FileBrowser Quantum", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u72B6\u6001", description: error
                                ? `后端未响应：${error}`
                                : `${state.running ? state.url : "服务未运行"}${state.running && state.pid ? ` · pid ${state.pid}` : ""}`, children: statusLabel }) }), state.installed && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u7248\u672C", description: `已安装 ${formatBytes(state.bin_size)}`, children: state.version ?? "未知" }) })), state.busy ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ProgressBarItem, { nProgress: state.progress.percent ?? 0, indeterminate: !state.progress.percent, focusable: false }) })) : null, state.busy ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: phaseText(state.progress) }) })) : null, !state.installed && !state.busy ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: () => act("install"), children: "\u4E0B\u8F7D\u5E76\u5B89\u88C5\u6700\u65B0\u7248\uFF08\u7EA6 28 MB\uFF09" }) })) : null, state.installed && !state.busy ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: () => act(state.running ? "stop" : "start"), children: state.running ? "停止服务" : "启动服务" }) })) : null, state.installed ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { disabled: !state.running, onClick: openWeb, description: state.url, children: "\u6253\u5F00\u7F51\u9875\u754C\u9762" }) })) : null, state.installed && !state.busy ? (state.update_available ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs(DFL.ButtonItem, { onClick: () => act("update"), description: `当前 ${state.version} → ${state.latest_version}`, children: ["\u5347\u7EA7\u5230 ", state.latest_version] }) })) : (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: () => act("check_update", true), description: `上次检查：${formatAgo(state.last_check)}${state.check_error ? ` · ${state.check_error}` : ""}`, children: "\u68C0\u67E5\u66F4\u65B0" }) }))) : null, state.installed && state.latest_version && !state.update_available ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs(DFL.Field, { label: "\u6700\u65B0\u7248\u672C", description: formatAgo(state.last_check), children: [state.latest_version, state.latest_prerelease ? " (预发布)" : ""] }) })) : null] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u8BBE\u7F6E", children: [!state.installed ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u5148\u786E\u8BA4\u8FD9\u51E0\u9879", description: "\u7AEF\u53E3\u3001\u5171\u4EAB\u76EE\u5F55\u548C\u7248\u672C\u901A\u9053\u4F1A\u5728\u4E0B\u8F7D\u5B89\u88C5\u65F6\u5199\u8FDB\u914D\u7F6E" }) })) : null, SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u7AEF\u53E3", mustBeNumeric: true, value: draft.port, onChange: (e) => {
                                dirtyRef.current = true;
                                setDirty(true);
                                setDraft({ ...draft, port: e.target.value });
                            }, description: state.port_free ? "改端口会在保存后重启服务" : "该端口已被占用" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u5141\u8BB8\u5C40\u57DF\u7F51\u8BBF\u95EE", description: state.listen_lan
                                ? "监听 0.0.0.0，同网段设备可访问"
                                : "仅监听 127.0.0.1，本机可访问", checked: state.listen_lan, onChange: (checked) => act("save_settings", { listen_lan: checked }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u5171\u4EAB\u76EE\u5F55", value: draft.source_path, onChange: (e) => {
                                dirtyRef.current = true;
                                setDirty(true);
                                setDraft({ ...draft, source_path: e.target.value });
                            }, description: "\u9ED8\u8BA4\u662F deck \u7528\u6237\u4E3B\u76EE\u5F55" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u7AD9\u70B9\u540D\u79F0", value: draft.source_name, onChange: (e) => {
                                dirtyRef.current = true;
                                setDirty(true);
                                setDraft({ ...draft, source_name: e.target.value });
                            } }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u514D\u5BC6\u8BBF\u95EE", description: state.no_auth
                                ? "已关闭登录：任何人打开网页即可读写共享目录"
                                : "关闭后仍使用账号密码登录", checked: state.no_auth, onChange: (checked) => act("save_settings", { no_auth: checked }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u968F Decky \u81EA\u52A8\u542F\u52A8", checked: state.auto_start, onChange: (checked) => act("save_settings", { auto_start: checked }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.DropdownItem, { label: "\u7248\u672C\u901A\u9053", description: state.channel === "stable"
                                ? "只装 tag 带 stable 的正式版，找不到时退回最新正式版"
                                : "始终装 GitHub 上最新的发行版（可能含 beta）", rgOptions: [
                                { label: "稳定版（*stable）", data: "stable" },
                                { label: "最新版（含 beta）", data: "latest" },
                            ], selectedOption: state.channel, onChange: (option) => act("save_settings", { channel: option.data }) }) }), dirty ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: saveSettings, children: "\u4FDD\u5B58\u8BBE\u7F6E" }) })) : null] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u8D26\u53F7", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u7BA1\u7406\u5458\u7528\u6237\u540D", children: state.admin_username }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u7BA1\u7406\u5458\u5BC6\u7801", bIsPassword: !showPassword, value: draft.admin_password, onChange: (e) => {
                                dirtyRef.current = true;
                                setDirty(true);
                                setDraft({ ...draft, admin_password: e.target.value });
                            }, description: "\u7559\u7A7A\u5219\u5B89\u88C5\u65F6\u81EA\u52A8\u751F\u6210\uFF1B\u9996\u6B21\u7F51\u9875\u767B\u5F55\u8FD8\u4F1A\u8981\u6C42\u518D\u6539\u4E00\u6B21" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u663E\u793A\u5BC6\u7801", checked: showPassword, onChange: (checked) => setShowPassword(checked) }) }), state.installed ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: () => confirmThen("重置管理员密码", "会生成一个新密码并重启服务，网页端已登录的会话会失效。", () => act("reset_admin_password")), children: "\u91CD\u7F6E\u7BA1\u7406\u5458\u5BC6\u7801" }) })) : null] }), state.installed ? (SP_JSX.jsxs(DFL.PanelSection, { title: "\u7EF4\u62A4", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: openLogs, description: state.log_path, children: "\u67E5\u770B\u65E5\u5FD7" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { onClick: () => confirmThen("清除数据", "会停止服务并删除数据库、缓存与配置（共享目录里的文件不受影响）。", () => act("clear_data")), children: "\u6E05\u9664\u6570\u636E" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "SHA-256", description: state.sha256 ?? "未记录" }) })] })) : null, SP_JSX.jsxs("div", { className: DFL.staticClasses.PanelSectionTitle, children: ["FileBrowser Quantum \u63D2\u4EF6 v", state.plugin_version || "?"] })] }));
};
var index = definePlugin(() => ({
    name: "FileBrowser Quantum",
    title: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "FileBrowser Quantum" }),
    content: SP_JSX.jsx(Content, {}),
    icon: SP_JSX.jsx(FaFolderOpen, {}),
    onDismiss: () => { },
}));

export { index as default };
//# sourceMappingURL=index.js.map
