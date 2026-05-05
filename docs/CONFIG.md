# 配置

open-design 将配置存储在 `~/.config/open-design/config.toml` 的 TOML 文件中
（如果设置了 `$XDG_CONFIG_HOME/open-design/config.toml`，则使用该路径）。该文件在首次
成功完成引导时创建，是提供商、模型和密钥引用的唯一真实来源。真实 API 密钥存储在
操作系统钥匙串中，不写入该 TOML 文件。

## 布局

```toml
version = 1
provider = "anthropic"
modelPrimary = "claude-sonnet-4-6"
modelFast = "claude-haiku-3"

[secrets.anthropic]
backend = "system-keychain"
service = "open-design"
account = "provider:anthropic:api-key"
```

## 密钥

| 密钥                         | 类型   | 必填           | 默认值            | 描述                                                             |
| ---------------------------- | ------ | -------------- | ----------------- | ---------------------------------------------------------------- |
| `version`                    | 整数   | 是             | `1`               | 架构版本。在 v0.1 中必须为 `1`。                                 |
| `provider`                   | string | 是             | —                 | 活跃提供商 ID。一级提供商：`anthropic`、`openai`、`openrouter`。 |
| `modelPrimary`               | string | 是             | —                 | 主要设计模型 ID（特定于提供商）。                                |
| `modelFast`                  | string | 是             | —                 | 快速完成模型 ID（特定于提供商）。                                |
| `secrets.<provider>.backend` | string | 活跃提供商必填 | `system-keychain` | 密钥存储后端。v0.1 仅支持 `system-keychain`。                    |
| `secrets.<provider>.service` | string | 活跃提供商必填 | `open-design`     | 操作系统钥匙串中的服务名。                                       |
| `secrets.<provider>.account` | string | 活跃提供商必填 | —                 | 操作系统钥匙串中的账户名，格式为 `provider:<provider>:api-key`。 |

## 安全模型

- API 密钥**绝不会写入 `config.toml`**。渲染进程粘贴密钥后，Tauri 受限命令将其写入
  操作系统钥匙串，`config.toml` 仅保存 `backend` / `service` / `account` 引用。
- `system-keychain` 映射到 macOS Keychain、Windows Credential Manager，以及 Linux 上可用的
  Secret Service / KWallet / GNOME Keyring。若当前系统没有可用钥匙串，应用必须显示可操作错误，
  不得静默降级为明文文件。
- 密钥与操作系统用户账户绑定。将 `config.toml` 复制到另一台机器上**不会**复制真实密钥——
  用户必须重新注册。
- 在 POSIX 系统上，文件权限设置为 `0600`。

## 首次运行时的行为

如果文件不存在，渲染器会显示三步引导向导
（欢迎 → 粘贴 API 密钥 → 选择模型）。完成后文件会被写入，
后续启动时将跳过该向导。

如果文件存在但格式错误，解析会抛出 `CONFIG_PARSE_FAILED` 错误。
`CONFIG_SCHEMA_INVALID` 且应用会在界面中显示该错误——不会
**静默回退**到默认值。

## 添加新的提供商

第一层级硬编码了 `anthropic`、`openai`、`openrouter`。其他提供商
由模式解析（因此未来的配置文件若包含 `provider = "google"` 不会
被直接拒绝），但引导向导会拒绝这些配置，并提示
`PROVIDER_NOT_SUPPORTED`。更广泛的提供商支持将在 0.3 阶段推出。

## 重置

删除文件会重置非敏感配置：

```bash
rm ~/.config/open-design/config.toml
```

下次启动时将返回至引导向导。若要完全清除凭证，还需要从系统钥匙串中删除
`service = "open-design"`、`account = "provider:<provider>:api-key"` 对应的条目。
