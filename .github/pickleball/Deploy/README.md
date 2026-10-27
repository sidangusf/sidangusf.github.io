# Dedicated GCP VM deployment

Target: project `studio-pickleball`, VM `pickleball-server`, zone `us-west1-a`, Ubuntu 24.04 amd64. Dashboard stays on GitHub Pages. This installer has not yet been exercised on the user's VM; validate each step before enabling booking.

## Architecture and access

The API container uses host networking but binds only 127.0.0.1:8080. A dedicated non-root systemd user runs sandboxed Google Chrome, Xvfb, Openbox, x11vnc and noVNC. Ports 5900, 6080 and 9222 bind only loopback. Caddy exposes TCP 80/443, routes the authenticated API, and protects `/browser/*` with a separate generated password. CDP is not proxied publicly. No browser sandbox-disable flags are used.

`CLUB_ALLOW_LOCAL_BROWSER=true` allows only the exact endpoint `http://127.0.0.1:9222`; all other remote endpoints still require WSS. Only trusted administrators should have local accounts on this dedicated VM because local processes can access loopback ports.

The host invite key controls the schedule; the friends key is shared view-only group access, revoked as a group. Do not share the browser password or host key with viewers. Basic-auth sessions can remain cached until the browser is closed. Chrome password saving and Google browser sign-in are disabled; sign in to Fremont itself in the private browser.

## Install

1. Promote the VM's existing external IP to a regional static IP. Add only `booking-api` A record in Squarespace; leave existing site/email records unchanged.
2. Review `install.sh`, then run from the repository root:

```sh
sudo bash .github/pickleball/Deploy/install.sh
```

The installer uses Ubuntu packages and Google's official Chrome package, builds the API, creates random credentials, and enables services. Initial schedule and policy flags stay disabled. Root-only credentials are saved at `/root/court-club-access.txt`. View them privately with `sudo cat /root/court-club-access.txt`; never paste this output into chat or commit it. Existing credentials and state survive installer reruns. Do not rerun or upgrade during a booking attempt.

3. In GCP Cloud Shell (not the VM's SSH terminal), add the dedicated web tag and firewall rule:

```sh
gcloud compute instances add-tags pickleball-server --project=studio-pickleball --zone=us-west1-a --tags=court-club-web
gcloud compute firewall-rules create court-club-web --project=studio-pickleball --network=default --direction=INGRESS --action=ALLOW --rules=tcp:80,tcp:443 --source-ranges=0.0.0.0/0 --target-tags=court-club-web
```

These commands assume the VM uses the default network; check that before applying. If a rule already exists, inspect it instead of deleting/replacing it. No browser/debugging ports should be opened in GCP. Retain the working SSH access rule. HTTPS issuance can take time after DNS changes.

4. Verify from outside the VM: `/health` returns `{"status":"ok"}`, `/api/status` without an invite key returns 401, `/browser/vnc.html` without browser credentials returns 401, and `/json/version` returns 404. Use HTTPS with valid certificates; never bypass certificate warnings. Open `/browser/vnc.html?autoconnect=true&resize=scale&path=browser/websockify` and sign in with username `host` and the generated browser password. Verify that you can operate Chrome. Enter Fremont credentials only on Fremont's page. An expired session may need a new login each week.

5. Set the static dashboard's `apiOrigin` only after HTTPS and authentication pass. Confirm automation permission, resident eligibility, release time and duration rules before changing the two policy flags in `/etc/court-club/api.env`. Recreate API after changes with `sudo docker compose -f /etc/court-club/compose.yaml up -d api`. Enabling the schedule is a separate dashboard action. No live reservation is made by installation.

## Persistent data and weekly operation

- `/var/lib/court-club`: booking state; owned by API image's non-root UID.
- `/var/lib/court-browser`: Chrome profile and cookies; private to browser user.
- `/etc/court-club`: member hashes, configuration, browser password hash.
- Docker `court-club_caddy_data` volume: HTTPS certificates.
- `/root/court-club-access.txt`: generated plaintext keys; keep private in a password manager and remove this recovery copy only after saving them securely.

Stop the VM normally only after completing checkout and saving the receipt. Keep its persistent boot disk. On startup systemd and Docker restart services; confirm health, browser login and dashboard status Tuesday evening. This deployment does not yet create a GCP start/stop schedule. Do not use `docker compose down -v`, delete the disk, or start a second copy of the API with another state directory.

Run `sudo bash .github/pickleball/Deploy/check.sh` for local checks. Use `sudo journalctl -u court-browser -n 60 --no-pager` for browser errors or `sudo docker compose -f /etc/court-club/compose.yaml logs --tail 60 api gateway`. Review logs for private URLs before sharing. Installer checks do not prove successful Fremont checkout, human handoff, or session persistence; those need validation on the actual VM.

For updates outside booking time, fetch reviewed code, rerun the installer, and restart the browser if its launcher changed (`sudo systemctl restart court-browser`). Check memory with `free -h`; if Chrome is killed for memory, resize the VM rather than disabling its sandbox. Keep Ubuntu and Chrome security updates current.
