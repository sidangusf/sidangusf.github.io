#!/bin/bash
# Run on the dedicated Ubuntu 24.04 VM, from a reviewed checkout.
set -euo pipefail
umask 077
[[ $EUID == 0 ]] || { echo 'Run with sudo bash.' >&2; exit 1; }
# shellcheck source=/dev/null
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_ID" == 24.04 && "$(dpkg --print-architecture)" == amd64 ]] || {
    echo 'This installer targets Ubuntu 24.04 amd64 only.' >&2; exit 1;
}
deploy_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
source_dir=$(dirname -- "$deploy_dir")
command -v docker >/dev/null
docker compose version >/dev/null
# This is a dedicated-server installer. Do not overwrite another deployment.
if [[ -d /etc/court-club && ! -f /etc/court-club/managed-by-court-club ]]; then
    echo '/etc/court-club exists without our ownership marker. Stop and inspect.' >&2; exit 1
fi
apt-get update
apt-get install -y ca-certificates curl jq openssl xvfb xauth x11-utils x11vnc novnc websockify openbox
if ! command -v google-chrome-stable >/dev/null; then
    chrome_deb=$(mktemp --suffix=.deb)
    trap 'rm -f -- "$chrome_deb"' EXIT
    curl --fail --show-error --location --proto '=https' --tlsv1.2 \
        https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o "$chrome_deb"
    chmod 644 "$chrome_deb"
    apt-get install -y "$chrome_deb"
    rm -f -- "$chrome_deb"
    trap - EXIT
fi
install -d -m 755 /usr/local/lib/court-club
install -d -m 700 /etc/court-club
touch /etc/court-club/managed-by-court-club
install -m 755 "$deploy_dir/browser-session.sh" /usr/local/lib/court-club/browser-session.sh
install -m 644 "$deploy_dir/court-browser.service" /etc/systemd/system/court-browser.service
install -d -m 755 /etc/opt/chrome/policies/managed
install -m 644 "$deploy_dir/chrome-policy.json" /etc/opt/chrome/policies/managed/court-club.json
if ! id court-browser >/dev/null 2>&1; then
    useradd --system --user-group --create-home --home-dir /var/lib/court-browser --shell /usr/sbin/nologin court-browser
fi
install -d -m 700 -o court-browser -g court-browser /var/lib/court-browser
docker build -t court-club-api:local -f "$source_dir/Dockerfile" "$source_dir"
api_uid=$(docker run --rm --entrypoint id court-club-api:local -u)
[[ "$api_uid" =~ ^[0-9]+$ && "$api_uid" != 0 ]] || { echo 'Expected a non-root API image.' >&2; exit 1; }
install -d -m 700 -o "$api_uid" -g "$api_uid" /var/lib/court-club
docker pull caddy:2-alpine
if [[ ! -f /etc/court-club/members.json ]]; then
    [[ ! -f /etc/court-club/gateway.env && ! -f /root/court-club-access.txt ]] || {
        echo 'Partial credential setup detected. Stop and inspect; no keys overwritten.' >&2; exit 1;
    }
    host_key=$(openssl rand -hex 32)
    friend_key=$(openssl rand -hex 32)
    browser_password=$(openssl rand -hex 24)
    host_hash=$(printf '%s' "$host_key" | sha256sum | cut -d ' ' -f 1)
    friend_hash=$(printf '%s' "$friend_key" | sha256sum | cut -d ' ' -f 1)
    browser_hash=$(printf '%s\n' "$browser_password" | docker run --rm -i caddy:2-alpine caddy hash-password)
    [[ "$browser_hash" == "\$2"* ]] || { echo 'Password hashing failed.' >&2; exit 1; }
    jq -n --arg host "$host_hash" --arg friend "$friend_hash" \
        '[{id:"host",name:"Host",tokenHash:$host,cdpUrl:"http://127.0.0.1:9222",liveViewUrl:"https://booking-api.995studio.com/browser/vnc.html?autoconnect=true&resize=scale&path=browser/websockify",canManage:true},{id:"friends",name:"Friends",tokenHash:$friend,cdpUrl:"",liveViewUrl:"",canManage:false}]' \
        > /etc/court-club/members.json
    printf "BROWSER_PASSWORD_HASH='%s'\n" "$browser_hash" > /etc/court-club/gateway.env
    printf 'Host invite key: %s\nFriends view-only invite key: %s\nBrowser username: host\nBrowser password: %s\n' \
        "$host_key" "$friend_key" "$browser_password" > /root/court-club-access.txt
    chmod 600 /root/court-club-access.txt /etc/court-club/gateway.env
    unset host_key friend_key browser_password browser_hash host_hash friend_hash
fi
[[ -s /etc/court-club/gateway.env ]] || { echo 'Browser authentication is missing.' >&2; exit 1; }
chown "$api_uid:$api_uid" /etc/court-club/members.json
chmod 400 /etc/court-club/members.json
# Reruns preserve credentials, flags, booking state, browser profile and certificates.
if [[ ! -f /etc/court-club/api.env ]]; then
    install -m 600 "$deploy_dir/api.env.example" /etc/court-club/api.env
fi
install -m 600 "$deploy_dir/compose.yaml" /etc/court-club/compose.yaml
install -m 600 "$deploy_dir/Caddyfile" /etc/court-club/Caddyfile
docker compose -f /etc/court-club/compose.yaml config --quiet
docker compose -f /etc/court-club/compose.yaml run --rm --no-deps gateway \
    caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl daemon-reload
systemctl enable --now docker court-browser
docker compose -f /etc/court-club/compose.yaml up -d
bash "$deploy_dir/check.sh"
printf '\nInstallation finished. Booking is disabled on first installation.\nCredentials are stored in /root/court-club-access.txt; do not paste that file into chat.\nHTTPS also requires correct DNS and GCP ingress on TCP 80/443.\n'
