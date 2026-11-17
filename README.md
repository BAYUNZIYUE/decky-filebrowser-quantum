# FileBrowser Quantum for Decky

A [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) plugin that installs,
runs and updates [FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser)
on a Steam Deck — no root, no system packages, no manual downloads.

FileBrowser Quantum is a modern web file manager: browse, upload, download, rename,
zip/unzip, preview and share files from any browser on your network.

The plugin is only a manager. The web server itself is the upstream static binary,
pulled straight from GitHub releases, so it keeps working independently of the
plugin UI and never depends on SteamOS packages.

## Features

- **Install in one tap** — downloads `linux-amd64-filebrowser` from the upstream
  GitHub releases (28 MB single static binary, works on any SteamOS version).
- **Updates from GitHub** — checks the release feed, and upgrades in place:
  stop → replace binary → restart. A `filebrowser.old` copy is kept for rollback.
- **Version channel** — `stable` (tags containing `stable`, e.g. `v2.0.2-stable`)
  or `latest` (newest release, may be a beta).
- **Service control** — start / stop / restart, live status and port health check,
  clear error messages when the port is taken.
- **Settings in the Quick Access Menu** — port, listen address, shared folder,
  site name, password login or no-auth, autostart.
- **Account bootstrap** — creates the admin account through the binary's own CLI
  and shows the generated password in the panel. The first web login asks for a
  new password, and that one persists.
- **Logs in the panel** — last lines of the server log without leaving game mode.
- **Data stays local** — database, cache and config live in the plugin's runtime
  folder; your shared files are never touched, not even by "clear data".

## Install

From the store (after acceptance): Decky → plugin store → *FileBrowser Quantum*.

Manual, for development:

```bash
git clone https://github.com/BAYUNZIYUE/decky-filebrowser-quantum \
  ~/homebrew/plugins/decky-filebrowser-quantum
sudo systemctl restart plugin_loader.service
```

## First run

1. Open the Quick Access Menu → **FileBrowser Quantum**.
2. Check the port and shared folder, then **下载并安装最新版**.
3. Press **打开网页界面**. Username `admin`, password as shown under *账号*
   (tap *显示密码* to reveal). The first login forces you to pick a new password.

The bundled server has no `ffmpeg` on SteamOS, so video thumbnails are disabled;
everything else works. Images, PDFs, text and archives preview fine.

## Where things live

| Path | Contents |
| --- | --- |
| `~/homebrew/data/decky-filebrowser-quantum/bin/` | `filebrowser` binary (+ `.old` after an update) |
| `~/homebrew/data/decky-filebrowser-quantum/data/` | `filebrowser.sqlite` database |
| `~/homebrew/data/decky-filebrowser-quantum/config.yaml` | generated config (**overwritten on every start**) |
| `~/homebrew/data/decky-filebrowser-quantum/filebrowser.log` | server log |
| `~/homebrew/settings/decky-filebrowser-quantum/settings.json` | plugin settings (mode 600) |

`config.yaml` is generated from the plugin settings, so edit the panel rather than
the file. The config lives outside the plugin directory, so reinstalling or
updating the plugin keeps your database, users and shares.

Decky runs plugin backends as root. When that is the case the plugin drops
privileges for the server process and re-owns its runtime folders to the `deck`
user, so files created from the web UI belong to you, not to root.

## Updating

Tap **检查更新**; when a newer release exists the button becomes **升级到 vX**.
The upgrade stops the server, swaps the binary and starts it again with the same
config and database. Settings → 版本通道 switches between stable and latest.

## Uninstall

Removing the plugin stops the server and deletes the binary and cache. The
database folder is kept on purpose; delete
`~/homebrew/data/decky-filebrowser-quantum/` to remove everything.

## Development

```bash
npm install
npm run build      # -> dist/index.js, committed to the repo
```

Backend is plain Python 3 (`main.py`, `asyncio`, stdlib only). `FBQ_HOME`,
`FBQ_SETTINGS` and `FBQ_USER_HOME` environment variables let you run the backend
outside Decky against a scratch directory.

## Credits

- [FileBrowser Quantum](https://github.com/gtsteffaniak/filebrowser) by Graham Steffaniak (Apache-2.0).
- Layout inspired by [heydemoura/decky-filebrowser-plugin](https://github.com/heydemoura/decky-filebrowser-plugin).
- This plugin: MIT.

## 中文速览

插件只做三件事：从 GitHub 下载 Quantum 二进制、按面板设置生成 `config.yaml`、
拉起/停止/升级这个服务。首次登录用户 `admin`，密码在面板「账号」里（点“显示密码”），
首次网页登录会要求改一次密码。数据、配置、日志都在
`~/homebrew/data/decky-filebrowser-quantum/`，升级或重装插件都不会丢。
