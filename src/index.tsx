import { call, definePlugin, toaster } from "@decky/api";
import {
  ButtonItem,
  ConfirmModal,
  DropdownItem,
  Field,
  ModalRoot,
  Navigation,
  PanelSection,
  PanelSectionRow,
  ProgressBarItem,
  TextField,
  ToggleField,
  showModal,
  staticClasses,
} from "@decky/ui";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { FaFolderOpen } from "react-icons/fa";

interface Progress {
  phase?: string;
  percent?: number;
  downloaded?: number;
  total?: number;
}

interface State {
  ok?: boolean;
  message?: string;
  plugin_version: string;
  installed: boolean;
  running: boolean;
  ready: boolean;
  pid: number | null;
  version: string | null;
  latest_version: string | null;
  latest_prerelease: boolean;
  update_available: boolean;
  last_check: number | null;
  check_error: string | null;
  url: string;
  port: number;
  listen_lan: boolean;
  source_path: string;
  source_name: string;
  admin_username: string;
  admin_password: string;
  no_auth: boolean;
  auto_start: boolean;
  channel: string;
  busy: string | null;
  progress: Progress;
  bin_size: number;
  sha256: string | null;
  log_path: string;
  port_free: boolean;
}

const EMPTY: State = {
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

const getState = () => call<[], State>("get_state");

const formatBytes = (bytes: number) => {
  if (!bytes) return "-";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const formatAgo = (ts: number | null) => {
  if (!ts) return "从未检查";
  const diff = Math.max(0, Date.now() / 1000 - ts);
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  return `${Math.floor(diff / 3600)} 小时前`;
};

const phaseText = (progress: Progress) => {
  const map: Record<string, string> = {
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

const Content: FC = () => {
  const [state, setState] = useState<State>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    port: "8082",
    source_path: "",
    source_name: "Steam Deck",
    admin_password: "",
  });
  const [dirty, setDirty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dirtyRef = useRef(false);

  const apply = (next: State, notify = true) => {
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
    } catch (err) {
      setError(String(err));
    }
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 2500);
    return () => clearInterval(timer);
  }, []);

  const act = async (route: string, ...args: unknown[]) => {
    try {
      const next = await call<unknown[], State>(route, ...args);
      apply(next);
    } catch (err) {
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
      Navigation.NavigateToExternalWeb(url);
    } catch {
      act("open_ui");
    }
  };

  const confirmThen = (title: string, description: string, action: () => void) => {
    showModal(
      <ConfirmModal
        strTitle={title}
        strDescription={description}
        strOKButtonText="继续"
        strCancelButtonText="取消"
        onOK={action}
        closeModal={() => true}
        onCancel={() => true}
      />,
      undefined,
      { strTitle: title }
    );
  };

  const openLogs = async () => {
    const res = await call<[number], { ok: boolean; log: string }>("get_logs", 150);
    showModal(
      <ModalRoot
        closeModal={() => true}
        onOK={() => true}
        onCancel={() => true}
        strTitle="运行日志"
      >
        <div
          style={{
            maxHeight: "45vh",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "11px",
            padding: "8px",
            background: "rgba(0,0,0,0.25)",
            borderRadius: "4px",
          }}
        >
          {res.log || "(空)"}
        </div>
      </ModalRoot>,
      undefined,
      { strTitle: "运行日志" }
    );
  };

  const statusLabel = !state.installed
    ? "未安装"
    : state.running
      ? state.ready
        ? "运行中"
        : "启动中"
      : "已停止";

  return (
    <>
      <PanelSection title="FileBrowser Quantum">
        <PanelSectionRow>
          <Field
            label="状态"
            description={
              error
                ? `后端未响应：${error}`
                : `${state.running ? state.url : "服务未运行"}${state.running && state.pid ? ` · pid ${state.pid}` : ""}`
            }
          >
            {statusLabel}
          </Field>
        </PanelSectionRow>

        {state.installed && (
          <PanelSectionRow>
            <Field label="版本" description={`已安装 ${formatBytes(state.bin_size)}`}>
              {state.version ?? "未知"}
            </Field>
          </PanelSectionRow>
        )}

        {state.busy ? (
          <PanelSectionRow>
            <ProgressBarItem
              nProgress={state.progress.percent ?? 0}
              indeterminate={!state.progress.percent}
              focusable={false}
            />
          </PanelSectionRow>
        ) : null}
        {state.busy ? (
          <PanelSectionRow>
            <Field label={phaseText(state.progress)} />
          </PanelSectionRow>
        ) : null}

        {!state.installed && !state.busy ? (
          <PanelSectionRow>
            <ButtonItem onClick={() => act("install")}>
              下载并安装最新版（约 28 MB）
            </ButtonItem>
          </PanelSectionRow>
        ) : null}

        {state.installed && !state.busy ? (
          <PanelSectionRow>
            <ButtonItem onClick={() => act(state.running ? "stop" : "start")}>
              {state.running ? "停止服务" : "启动服务"}
            </ButtonItem>
          </PanelSectionRow>
        ) : null}

        {state.installed ? (
          <PanelSectionRow>
            <ButtonItem
              disabled={!state.running}
              onClick={openWeb}
              description={state.url}
            >
              打开网页界面
            </ButtonItem>
          </PanelSectionRow>
        ) : null}

        {state.installed && !state.busy ? (
          state.update_available ? (
            <PanelSectionRow>
              <ButtonItem
                onClick={() => act("update")}
                description={`当前 ${state.version} → ${state.latest_version}`}
              >
                升级到 {state.latest_version}
              </ButtonItem>
            </PanelSectionRow>
          ) : (
            <PanelSectionRow>
              <ButtonItem
                onClick={() => act("check_update", true)}
                description={`上次检查：${formatAgo(state.last_check)}${state.check_error ? ` · ${state.check_error}` : ""}`}
              >
                检查更新
              </ButtonItem>
            </PanelSectionRow>
          )
        ) : null}

        {state.installed && state.latest_version && !state.update_available ? (
          <PanelSectionRow>
            <Field label="最新版本" description={formatAgo(state.last_check)}>
              {state.latest_version}
              {state.latest_prerelease ? " (预发布)" : ""}
            </Field>
          </PanelSectionRow>
        ) : null}
      </PanelSection>

      <PanelSection title="设置">
        {!state.installed ? (
          <PanelSectionRow>
            <Field
              label="先确认这几项"
              description="端口、共享目录和版本通道会在下载安装时写进配置"
            />
          </PanelSectionRow>
        ) : null}
          <PanelSectionRow>
            <TextField
              label="端口"
              mustBeNumeric
              value={draft.port}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                dirtyRef.current = true;
                setDirty(true);
                setDraft({ ...draft, port: e.target.value });
              }}
              description={state.port_free ? "改端口会在保存后重启服务" : "该端口已被占用"}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label="允许局域网访问"
              description={
                state.listen_lan
                  ? "监听 0.0.0.0，同网段设备可访问"
                  : "仅监听 127.0.0.1，本机可访问"
              }
              checked={state.listen_lan}
              onChange={(checked: boolean) => act("save_settings", { listen_lan: checked })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <TextField
              label="共享目录"
              value={draft.source_path}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                dirtyRef.current = true;
                setDirty(true);
                setDraft({ ...draft, source_path: e.target.value });
              }}
              description="默认是 deck 用户主目录"
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <TextField
              label="站点名称"
              value={draft.source_name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                dirtyRef.current = true;
                setDirty(true);
                setDraft({ ...draft, source_name: e.target.value });
              }}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label="免密访问"
              description={
                state.no_auth
                  ? "已关闭登录：任何人打开网页即可读写共享目录"
                  : "关闭后仍使用账号密码登录"
              }
              checked={state.no_auth}
              onChange={(checked: boolean) => act("save_settings", { no_auth: checked })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label="随 Decky 自动启动"
              checked={state.auto_start}
              onChange={(checked: boolean) => act("save_settings", { auto_start: checked })}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <DropdownItem
              label="版本通道"
              description={
                state.channel === "stable"
                  ? "只装 tag 带 stable 的正式版，找不到时退回最新正式版"
                  : "始终装 GitHub 上最新的发行版（可能含 beta）"
              }
              rgOptions={[
                { label: "稳定版（*stable）", data: "stable" },
                { label: "最新版（含 beta）", data: "latest" },
              ]}
              selectedOption={state.channel}
              onChange={(option) => act("save_settings", { channel: option.data })}
            />
          </PanelSectionRow>
          {dirty ? (
            <PanelSectionRow>
              <ButtonItem onClick={saveSettings}>保存设置</ButtonItem>
            </PanelSectionRow>
          ) : null}
        </PanelSection>

      <PanelSection title="账号">
          <PanelSectionRow>
            <Field label="管理员用户名">{state.admin_username}</Field>
          </PanelSectionRow>
          <PanelSectionRow>
            <TextField
              label="管理员密码"
              bIsPassword={!showPassword}
              value={draft.admin_password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                dirtyRef.current = true;
                setDirty(true);
                setDraft({ ...draft, admin_password: e.target.value });
              }}
              description="留空则安装时自动生成；首次网页登录还会要求再改一次"
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ToggleField
              label="显示密码"
              checked={showPassword}
              onChange={(checked: boolean) => setShowPassword(checked)}
            />
          </PanelSectionRow>
          {state.installed ? (
            <PanelSectionRow>
              <ButtonItem
                onClick={() =>
                  confirmThen(
                    "重置管理员密码",
                    "会生成一个新密码并重启服务，网页端已登录的会话会失效。",
                    () => act("reset_admin_password")
                  )
                }
              >
                重置管理员密码
              </ButtonItem>
            </PanelSectionRow>
          ) : null}
        </PanelSection>

      {state.installed ? (
        <PanelSection title="维护">
          <PanelSectionRow>
            <ButtonItem onClick={openLogs} description={state.log_path}>
              查看日志
            </ButtonItem>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem
              onClick={() =>
                confirmThen(
                  "清除数据",
                  "会停止服务并删除数据库、缓存与配置（共享目录里的文件不受影响）。",
                  () => act("clear_data")
                )
              }
            >
              清除数据
            </ButtonItem>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field
              label="SHA-256"
              description={state.sha256 ?? "未记录"}
            />
          </PanelSectionRow>
        </PanelSection>
      ) : null}

      <div className={staticClasses.PanelSectionTitle}>FileBrowser Quantum 插件 v{state.plugin_version || "?"}</div>
    </>
  );
};

export default definePlugin(() => ({
  name: "FileBrowser Quantum",
  title: <div className={staticClasses.Title}>FileBrowser Quantum</div>,
  content: <Content />,
  icon: <FaFolderOpen />,
  onDismiss: () => {},
}));
