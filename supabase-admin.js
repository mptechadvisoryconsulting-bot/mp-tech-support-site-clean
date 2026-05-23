"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QrEditor from "../../components/QrEditor";
import { createBrowserSupabase } from "../../lib/supabase-browser";

export default function DashboardPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }
    setUser(data.user);

    const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
    setProfile(profileRow || { company_name: "Customer", logo_url: "/mp-technology-logo.png" });

    const { data: qrRows } = await supabase
      .from("qr_codes")
      .select("*, qr_scans(count)")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });
    setCodes(qrRows || []);
    setLoading(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <main className="app-shell"><div className="panel">Loading workspace...</div></main>;
  }

  if (!supabase) {
    return (
      <main className="app-shell">
        <section className="workspace">
          <div className="panel">
            <p className="eyebrow">Setup needed</p>
            <h1>Add Supabase environment variables.</h1>
            <p className="lead">
              The SaaS dashboard is built, but customer login needs `NEXT_PUBLIC_SUPABASE_URL`,
              `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <Link className="brand" href="/dashboard">
            <img className="brand-logo" src={profile.logo_url || "/mp-technology-logo.png"} alt="" />
            <span>{profile.brand_name || profile.company_name || "Customer QR"}</span>
          </Link>
          <nav aria-label="Primary">
            <Link href="/">Home</Link>
            <button className="secondary-button" type="button" onClick={signOut}>Sign out</button>
          </nav>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">Customer workspace</p>
            <h1>{profile.company_name || "Your company"} QR dashboard.</h1>
          </div>
          <div className="trust-strip">
            <div>
              <span>{codes.length}</span>
              <small>Codes</small>
            </div>
            <div>
              <span>{codes.filter((code) => code.is_dynamic).length}</span>
              <small>Dynamic</small>
            </div>
            <div>
              <span>{codes.reduce((sum, code) => sum + (code.qr_scans?.[0]?.count || 0), 0)}</span>
              <small>Scans</small>
            </div>
            <div>
              <span>PNG</span>
              <small>Exports</small>
            </div>
          </div>
        </section>

        {user && <QrEditor supabase={supabase} user={user} profile={profile} onSaved={load} />}

        <section className="panel saved-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Saved QR codes</h2>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Mode</th>
                  <th>Destination</th>
                  <th>Scans</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id}>
                    <td>{code.name}</td>
                    <td>{code.type}</td>
                    <td>{code.is_dynamic ? `/r/${code.short_code}` : "Static"}</td>
                    <td>{code.destination_url}</td>
                    <td>{code.qr_scans?.[0]?.count || 0}</td>
                  </tr>
                ))}
                {!codes.length && (
                  <tr><td colSpan="5">No QR codes saved yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
