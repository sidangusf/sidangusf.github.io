#!/bin/bash
set -euo pipefail
[[ $EUID == 0 ]] || { echo 'Run with sudo bash.' >&2; exit 1; }
systemctl is-active --quiet court-browser
ready=false
for _attempt in {1..30}; do
    if curl -fsS --max-time 2 http://127.0.0.1:8080/health >/dev/null 2>&1 &&
       curl -fsS --max-time 2 http://127.0.0.1:9222/json/version >/dev/null 2>&1 &&
       curl -fsS --max-time 2 http://127.0.0.1:6080/vnc.html >/dev/null 2>&1; then
        ready=true; break
    fi
    sleep 2
done
[[ "$ready" == true ]] || { echo 'A local component is not ready. Check service logs.' >&2; exit 1; }
[[ "$(curl -sS --max-time 5 -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/api/status)" == 401 ]] || {
    echo 'API authentication check failed.' >&2; exit 1;
}
# Only the gateway may bind public interfaces. Check the sensitive TCP ports.
if ss -ltnH | awk '$4 ~ /:(5900|6080|8080|9222)$/ && $4 !~ /^(127\.0\.0\.1|\[::1\]|::1):/ {bad=1} END {exit !bad}'; then
    echo 'A private component is listening outside loopback. Stop services and inspect.' >&2
    exit 1
fi
printf 'PASS: browser desktop, browser control, API health, API authentication and loopback bindings.\n'
printf 'Browser: '
curl -fsS --max-time 5 http://127.0.0.1:9222/json/version | jq -r '.Browser'
docker compose -f /etc/court-club/compose.yaml ps
