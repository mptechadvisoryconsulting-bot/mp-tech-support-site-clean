"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { makeShortCode, normalizeUrl } from "../lib/qr";

const types = ["url", "text", "email", "phone", "sms"];

export default function QrEditor({ supabase, user, profile, onSaved }) {
  const canvasRef = useRef(null);
  const [type, setType] = useState("url");
  const [name, setName] = useState("Homepage QR");
  const [destination, setDestination] = useState(profile?.sample_url || "https://mptechnologyconsulting.com");
  const [mode, setMode] = useState("dynamic");
  const [message, setMessage] = useState("");
  const [foreground, setForeground] = useState(profile?.foreground || "#111827");
  const [background, setBackground] = useState(profile?.background || "#ffffff");

  const payload = useMemo(() => {
    if (mode === "dynamic" && typeof window !== "undefined") {
      return `${window.location.origin}/r/preview`;
    }
    if (type === "url") return normalizeUrl(destination);
    if (type === "email") return `mailto:${destination.trim()}`;
    if (type === "phone") return `tel:${destination.replace(/\s+/g, "")}`;
    if (type === "sms") return `sms:${destination.replace(/\s+/g, "")}`;
    return destination.trim();
  }, [destination, mode, type]);

  useEffect(() => {
    async function render() {
      if (!canvasRef.current || !payload) return;
      await QRCode.toCanvas(canvasRef.current, payload, {
        width: 1024,
        margin: 4,
        errorCorrectionLevel: "H",
        color: { dark: foreground, light: background },
      });
    }
    render();
  }, [background, foreground, payload]);

  async function saveQr() {
    const shortCode = makeShortCode();
    const dynamicUrl = `${window.location.origin}/r/${shortCode}`;
    const qrPayload = mode === "dynamic" ? dynamicUrl : payload;
    setMessage("Saving...");

    const { error } = await supabase.from("qr_codes").insert({
      user_id: user.id,
      name,
      type,
      destination_url: type === "url" ? normalizeUrl(destination) : destination,
      payload: qrPayload,
      short_code: mode === "dynamic" ? shortCode : null,
      is_dynamic: mode === "dynamic",
      foreground,
      background,
      logo_url: profile?.logo_url || "/mp-technology-logo.png",
    });

    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Saved");
    onSaved();
  }

  function downloadPng() {
    const anchor = document.createElement("a");
    anchor.href = canvasRef.current.toDataURL("image/png");
    anchor.download = `${name.trim().replace(/[^a-z0-9-_]+/gi, "-") || "qr-code"}.png`;
    anchor.click();
  }

  return (
    <section className="generator-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Create</p>
            <h2>New QR code</h2>
          </div>
          <span className="status">{message || "Ready"}</span>
        </div>
        <div className="type-grid">
          {types.map((item) => (
            <label key={item}>
              <input checked={type === item} name="type" onChange={() => setType(item)} type="radio" />
              <span>{item.toUpperCase()}</span>
            </label>
          ))}
        </div>
        <div className="dynamic-fields">
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>{type === "text" ? "Text" : "Destination"}</span>
            <textarea value={destination} onChange={(event) => setDestination(event.target.value)} />
          </label>
          <div className="two-col">
            <label className="field">
              <span>Mode</span>
              <select value={mode} onChange={(event) => setMode(event.target.value)}>
                <option value="dynamic">Dynamic tracked link</option>
                <option value="static">Static direct QR</option>
              </select>
            </label>
            <label className="field">
              <span>Foreground</span>
              <input value={foreground} onChange={(event) => setForeground(event.target.value)} type="color" />
            </label>
          </div>
          <label className="field">
            <span>Background</span>
            <input value={background} onChange={(event) => setBackground(event.target.value)} type="color" />
          </label>
        </div>
        <div className="export-actions">
          <button className="primary-button" type="button" onClick={saveQr}>Save QR</button>
          <button className="secondary-button" type="button" onClick={downloadPng}>Download PNG</button>
        </div>
      </div>

      <aside className="panel preview-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Preview</p>
            <h2>{mode === "dynamic" ? "Tracked code" : "Static code"}</h2>
          </div>
        </div>
        <div className="qr-stage">
          <canvas ref={canvasRef} id="qr-canvas" width="1024" height="1024" />
        </div>
      </aside>
    </section>
  );
}
