"use strict";
(() => {
  const $ = id => document.getElementById(id);
  let key = "", timer, activeJob, shownJob = "", connected = false, epoch = 0, refreshing = false;
  let origin = "";
  try {
    const url = new URL((window.COURT_CLUB_CONFIG || {}).apiOrigin);
    if (url.protocol === "https:" && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash) origin = url.origin;
  } catch {}
  const notify = (text, ok = false) => { $("notice").textContent = text; $("notice").classList.toggle("ok", ok); };
  async function api(path, method = "GET", body) {
    if (!origin) throw new Error("Setup required: the host has not connected a booking service.");
    const requestEpoch = epoch;
    const response = await fetch(origin + path, { method, headers: { Authorization: "Bearer " + key, ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: "no-store", credentials: "omit", redirect: "error", signal: AbortSignal.timeout(15000) });
    let data; try { data = await response.json(); } catch { throw new Error("The booking service returned an invalid response."); }
    if (requestEpoch !== epoch) throw new DOMException("Disconnected", "AbortError");
    if (!response.ok) throw new Error(data.error || "Unable to reach the booking service.");
    return data;
  }
  function action(job) {
    activeJob = job; $("action-message").textContent = job.message;
    const link = $("live-view"); link.hidden = true; link.removeAttribute("href");
    if (job.liveViewUrl) { try { const u = new URL(job.liveViewUrl); if (u.protocol === "https:" && !u.username && !u.password) { link.href = u.href; link.hidden = false; } } catch {} }
    $("resume").hidden = job.status !== "login_required";
    $("receipt-form").hidden = !["review_required", "interrupted", "unverified"].includes(job.status);
    $("receipt").value = "";
    if (!$("action-dialog").open) $("action-dialog").showModal();
  }
  function render(data) {
    connected = true; $("connect-form").hidden = true; $("identity").hidden = false;
    $("member").textContent = "Connected as " + data.member.name;
    $("schedule-state").textContent = data.schedule.enabled ? "Enabled · " + data.schedule.ownerName : "Paused";
    $("next-release").textContent = new Date(data.nextRelease).toLocaleString("en-US", {timeZone:"America/Los_Angeles",month:"short",day:"numeric",hour:"numeric",minute:"2-digit",timeZoneName:"short"});
    $("enable").disabled = !data.canManage || !data.ready || data.schedule.enabled;
    $("pause").disabled = !data.canManage || !data.schedule.enabled; $("refresh").disabled = false;
    notify(data.ready ? (data.schedule.enabled ? "Weekly booking is enabled. Stay available for action requests on release morning." : "Connected. Weekly booking is paused.") : data.blockers.join(" "), data.ready);
    $("jobs").replaceChildren();
    if (!data.jobs.length) { const p=document.createElement("p"); p.className="empty"; p.textContent="No booking attempts yet. Enabling the schedule does not create a reservation immediately."; $("jobs").append(p); }
    for (const job of data.jobs) {
      const row=document.createElement("div"); row.className="job";
      const copy=document.createElement("div"), title=document.createElement("strong"), detail=document.createElement("small");
      title.textContent=job.playDate + " · 7–9 PM" + (job.court ? " · Court " + job.court : "");
      detail.textContent=job.status.replaceAll("_"," ") + " — " + job.message;
      copy.append(title,detail); row.append(copy);
      if(job.canAct) {
        const b=document.createElement("button");b.textContent="Review action";b.addEventListener("click",()=>action(job));row.append(b);
        if (shownJob !== job.id+job.status && !$("action-dialog").open) { shownJob=job.id+job.status; action(job); }
      }
      $("jobs").append(row);
    }
  }
  async function refresh() {
    if (refreshing) return; refreshing = true;
    try { render(await api("/api/status")); }
    catch(e) { if(e.name!=="AbortError"){notify(e.message);$("enable").disabled=true;$("pause").disabled=true;} }
    finally { refreshing=false; }
  }
  $("connect-form").addEventListener("submit",async e=>{
    e.preventDefault(); key=$("invite").value.trim(); $("connect").disabled=true; ++epoch;
    try { render(await api("/api/status")); $("invite").value=""; clearInterval(timer); timer=setInterval(refresh,10000); }
    catch(err) { key=""; notify(err.message); } finally { $("connect").disabled=false; }
  });
  $("disconnect").addEventListener("click",()=>{
    ++epoch; clearInterval(timer); key=""; connected=false; shownJob=""; activeJob=null;
    $("action-dialog").close(); $("live-view").removeAttribute("href"); $("receipt").value="";
    $("identity").hidden=true; $("connect-form").hidden=false; $("member").textContent=""; $("jobs").replaceChildren();
    $("schedule-state").textContent="Not connected"; $("next-release").textContent="—";
    for(const id of ["enable","pause","refresh"])$(id).disabled=true;
    notify("Disconnected from this tab. An enabled server schedule continues until you pause it.");
  });
  async function mutate(path,body) { try { await api(path,"POST",body); await refresh(); } catch(e) { if(e.name!=="AbortError")notify(e.message); } }
  $("enable").addEventListener("click",()=>mutate("/api/schedule",{enabled:true}));
  $("pause").addEventListener("click",()=>mutate("/api/schedule",{enabled:false}));
  $("refresh").addEventListener("click",refresh);
  $("resume").addEventListener("click",async()=>{if(!activeJob)return;const id=activeJob.id;$("action-dialog").close();await mutate("/api/jobs/"+encodeURIComponent(id)+"/resume",{});});
  $("receipt-form").addEventListener("submit",async e=>{e.preventDefault();if(!activeJob)return;const id=activeJob.id,reference=$("receipt").value.trim();if(!reference)return;$("action-dialog").close();await mutate("/api/jobs/"+encodeURIComponent(id)+"/confirmation",{reference});});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&connected)refresh();});
  if (!origin) {$("connect").disabled=true;$("invite").disabled=true;}
})();
