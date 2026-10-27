#!/bin/bash
set -euo pipefail
umask 077
children=()
cleanup() {
    trap - EXIT TERM INT
    if ((${#children[@]})); then
        kill -TERM "${children[@]}" 2>/dev/null || true
        wait "${children[@]}" 2>/dev/null || true
    fi
}
trap cleanup EXIT
trap 'exit 0' TERM INT
touch "$XAUTHORITY"
xauth -f "$XAUTHORITY" add "$DISPLAY" . "$(mcookie)"
Xvfb "$DISPLAY" -screen 0 1280x800x24 -nolisten tcp -auth "$XAUTHORITY" &
children+=("$!")
ready=false
for attempt in {1..30}; do
    if xdpyinfo >/dev/null 2>&1; then ready=true; break; fi
    sleep 1
done
[[ "$ready" == true ]] || { echo 'Virtual display did not start.' >&2; exit 1; }
openbox --sm-disable &
children+=("$!")
# Chrome runs as a dedicated non-root user with its sandbox enabled.
# Never add --no-sandbox or publish the debugging port.
google-chrome-stable --user-data-dir=/var/lib/court-browser/profile \
    --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 \
    --no-first-run --no-default-browser-check --window-size=1280,800 about:blank &
children+=("$!")
x11vnc -display "$DISPLAY" -auth "$XAUTHORITY" -localhost -rfbport 5900 \
    -forever -shared -nopw -noxdamage &
children+=("$!")
websockify --web=/usr/share/novnc/ 127.0.0.1:6080 127.0.0.1:5900 &
children+=("$!")
# Restart the entire group if any required component unexpectedly exits.
wait -n "${children[@]}" || true
exit 1
