import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  PieChart,
  ChevronDown,
  Menu,
  X,
  Wallet,
  TrendingDown,
  SlidersHorizontal,
  Activity,
  Layers,
} from 'lucide-react';
import { BrandWordmark } from '../components/branding/BrandWordmark';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDiscover = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7F3EA] text-[#251D16] overflow-x-hidden selection:bg-[#C6A568]/30 selection:text-[#111111]">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP NAVIGATION — OBSIDIAN BLACK LUXURY HEADER (#111111)    */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full px-6 sm:px-12 md:px-16 py-4 flex items-center justify-between bg-[#111111] border-b border-[#C6A568]/20 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
        {/* Left: Official Sanskrit / Devanagari Wordmark: धनलेख DHANLEKHA */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <BrandWordmark variant="navbar" />
        </div>

        {/* Center: EXPERIENCE | PHILOSOPHY | FEATURES (Warm Ivory) */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-[0.24em] text-[#F7F3EA] uppercase font-semibold">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#C6A568] transition-colors py-1"
          >
            EXPERIENCE
          </button>
          <span className="text-[#C6A568]/30 select-none">|</span>
          <button
            onClick={() => scrollToSection('philosophy')}
            className="hover:text-[#C6A568] transition-colors py-1"
          >
            PHILOSOPHY
          </button>
          <span className="text-[#C6A568]/30 select-none">|</span>
          <button
            onClick={() => scrollToSection('intelligence')}
            className="hover:text-[#C6A568] transition-colors py-1"
          >
            FEATURES
          </button>
        </nav>

        {/* Right: SIGN IN / DASHBOARD */}
        <div className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-lg bg-[#C6A568] hover:bg-[#E5D2A9] text-[#111111] text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-[0_2px_15px_rgba(198,165,104,0.35)]"
            >
              SIGN IN
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-lg bg-[#C6A568] text-[#111111] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#E5D2A9] transition-all shadow-sm"
            >
              DASHBOARD
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#F7F3EA] hover:text-[#C6A568] border border-[#C6A568]/25 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] z-40 bg-[#111111]/98 border-b border-[#C6A568]/30 backdrop-blur-xl p-6 space-y-4 shadow-2xl animate-fadeIn text-left">
          <nav className="flex flex-col space-y-3 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-lg text-[#F7F3EA] hover:text-[#C6A568] hover:bg-[#251D16] transition-all text-left"
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection('philosophy')}
              className="py-2.5 px-3 rounded-lg text-[#F7F3EA] hover:text-[#C6A568] hover:bg-[#251D16] transition-all text-left"
            >
              Philosophy
            </button>
            <button
              onClick={() => scrollToSection('intelligence')}
              className="py-2.5 px-3 rounded-lg text-[#F7F3EA] hover:text-[#C6A568] hover:bg-[#251D16] transition-all text-left"
            >
              Features
            </button>
          </nav>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. THE HERO — WARM IVORY ARCHITECTURAL GALLERY ENVIRONMENT    */}
      {/* Clean, spacious #F7F3EA base. Artwork is small (350-420px).   */}
      {/* Headline is the primary visual focus.                         */}
      {/* ------------------------------------------------------------- */}
      <section className="relative z-10 w-full min-h-[calc(100vh-75px)] flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 lg:py-8 bg-[#F7F3EA]">
        {/* Subtle architectural ambient tone — NO orange, NO heavy yellow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[340px] bg-[radial-gradient(ellipse_at_top,rgba(237,226,204,0.45)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Brand Narrative (Primary Visual Focus — 58% Width) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 text-left z-10">
            {/* Small Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EDE2CC]/75 border border-[#C6A568]/40 text-[10px] font-mono tracking-[0.26em] text-[#80613F] uppercase w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A9874F]" />
              <span>PERSONAL FINANCE / INDIA</span>
            </div>

            {/* Main Headline: Cormorant Garamond (Authoritative, Bold, Deep Espresso) */}
            <div className="space-y-1">
              <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-bold tracking-tight leading-[0.92] text-[#251D16]">
                <span>YOUR MONEY.</span> <br />
                <span className="text-[#A9874F] italic font-normal">
                  YOUR MOVEMENT.
                </span>
              </h1>
            </div>

            {/* Supporting Tagline */}
            <p className="font-editorial text-2xl sm:text-3xl text-[#80613F] italic tracking-wide font-normal">
              Every rupee has a story.
            </p>

            {/* Refined Description */}
            <p className="font-sans text-base text-[#251D16]/80 max-w-lg leading-relaxed font-normal">
              A more thoughtful way to understand, organise and take control of your financial world.
            </p>

            {/* Two Sophisticated CTA Buttons with Restrained Borders */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Primary CTA: DISCOVER DHANLEKHA */}
              <button
                onClick={handleDiscover}
                className="group relative px-8 py-3.5 rounded-lg bg-[#251D16] hover:bg-[#111111] text-[#F7F3EA] text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 border border-[#C6A568]/40 hover:border-[#C6A568] shadow-sm hover:shadow-md"
              >
                <span>DISCOVER DHANLEKHA</span>
                <ArrowRight className="w-4 h-4 text-[#C6A568] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA: EXPLORE THE EXPERIENCE */}
              <button
                onClick={() => scrollToSection('philosophy')}
                className="px-7 py-3.5 rounded-lg border border-[#80613F]/35 hover:border-[#251D16] bg-white/50 hover:bg-white/80 text-xs font-mono tracking-widest uppercase text-[#251D16] transition-all text-center flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <span>EXPLORE THE EXPERIENCE</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#80613F]" />
              </button>
            </div>

            {/* Subtle Brand Statement */}
            <div className="pt-2 flex items-center gap-2.5 text-xs font-mono text-[#80613F]/75">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A568]" />
              <span>Every rupee has a story.</span>
            </div>
          </div>

          {/* Right Column: Small, Refined Architectural Hero Artwork (42% Width, Height: ~360-390px) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative w-full py-4">
            <div className="relative w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[420px] rounded-2xl overflow-hidden border border-[#C6A568]/25 shadow-[0_16px_40px_rgba(37,29,22,0.08)] bg-[#EDE2CC]/30 transition-all duration-700 hover:shadow-[0_20px_56px_rgba(37,29,22,0.12)]">
              {/* Controlled Height Artwork (Target: 350-420px) */}
              <img
                src="/hero-sculpture.jpg"
                alt="DHANLEKHA Contemporary Architectural Sculpture"
                className="w-full h-[320px] sm:h-[350px] lg:h-[380px] object-cover object-center"
                loading="eager"
              />

              {/* Subtle Natural Gallery Vignette & Border */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#111111]/20 via-transparent to-transparent" />
              <div className="absolute inset-0 pointer-events-none border border-[#C6A568]/15 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION 01 — THE PHILOSOPHY (DEEP ESPRESSO CONTRAST)       */}
      {/* High-contrast architectural rhythm: Deep espresso (#251D16)   */}
      {/* ------------------------------------------------------------- */}
      <section
        id="philosophy"
        className="relative z-10 w-full py-28 px-6 sm:px-12 md:px-16 border-t border-[#C6A568]/20 bg-[#251D16] text-[#F7F3EA]"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C6A568]">
              <Compass className="w-4 h-4 text-[#A9874F]" />
              <span>01 / THE PHILOSOPHY</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#F7F3EA]">
              YOUR MONEY DESERVES CLARITY.
            </h2>
            <p className="text-base text-[#EDE2CC]/85 leading-relaxed font-sans">
              Traditional finance tools encourage mindless consumption through frictionless digital spending.
              DHANLEKHA restores conscious intention and intellectual sovereignty to personal capital stewardship.
            </p>
          </div>

          {/* Editorial Dual Pillars (Not Generic Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left border-t border-[#C6A568]/20 pt-10">
            {/* Pillar 1: Dhan */}
            <div className="space-y-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-[#C6A568]/15 pb-8 md:pb-0">
              <div className="text-5xl font-devanagari font-black text-[#C6A568]/30">
                धन
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#F7F3EA]">
                DHAN — Wealth & Life Energy
              </h3>
              <p className="text-sm text-[#EDE2CC]/80 leading-relaxed font-sans">
                The stored fruit of your labour, talent, and finite hours. Every rupee earned embodies an hour of your
                existence expended. It demands conscious stewardship rather than passive, frictionless digital depletion.
              </p>
            </div>

            {/* Pillar 2: Lekha */}
            <div className="space-y-4 pl-0 md:pl-6">
              <div className="text-5xl font-devanagari font-black text-[#C6A568]/30">
                लेख
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#F7F3EA]">
                LEKHA — The Written Record
              </h3>
              <p className="text-sm text-[#EDE2CC]/80 leading-relaxed font-sans">
                The mindful written ledger that transforms ambiguous financial anxiety into conscious lucidity. By actively
                recording where your money flows, you reclaim complete sovereignty over your future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECTION 02 — FINANCIAL INTELLIGENCE (CAPABILITIES)         */}
      {/* Warm Ivory base (#F7F3EA) with spacious architectural blocks  */}
      {/* ------------------------------------------------------------- */}
      <section
        id="intelligence"
        className="relative z-10 w-full py-28 px-6 sm:px-12 md:px-16 border-t border-[#C6A568]/25 bg-[#F7F3EA] text-[#251D16]"
      >
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#80613F]">
              <PieChart className="w-4 h-4 text-[#A9874F]" />
              <span>02 / FINANCIAL INTELLIGENCE</span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#251D16]">
              INTELLIGENT FINANCIAL CLARITY.
            </h2>
            <p className="text-base text-[#251D16]/80 leading-relaxed font-sans">
              Raw rows of figures fatigue the mind. DHANLEKHA structures your personal wealth into transparent,
              actionable streams.
            </p>
          </div>

          {/* Architectural Layout of Actual Product Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Capability 1: Inflow & Available Balance */}
            <div className="p-7 rounded-xl bg-white border border-[#C6A568]/25 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#251D16] border border-[#C6A568]/30 flex items-center justify-center text-[#C6A568]">
                <Wallet className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#251D16]">
                Income & Balance
              </h4>
              <p className="text-xs text-[#80613F] leading-relaxed font-sans">
                Set monthly salary anchors, track available liquid capital, and monitor your retained savings rate in real time.
              </p>
            </div>

            {/* Capability 2: Custom Budget Allocation */}
            <div className="p-7 rounded-xl bg-white border border-[#C6A568]/25 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#251D16] border border-[#C6A568]/30 flex items-center justify-center text-[#C6A568]">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#251D16]">
                Custom Budgeting
              </h4>
              <p className="text-xs text-[#80613F] leading-relaxed font-sans">
                No rigid 50/30/20 constraints. Define exact amounts for rent, SIP investments, and lifestyle with unallocated buffers.
              </p>
            </div>

            {/* Capability 3: 3D Spatial Intelligence */}
            <div className="p-7 rounded-xl bg-white border border-[#C6A568]/25 space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#251D16] border border-[#C6A568]/30 flex items-center justify-center text-[#C6A568]">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-editorial text-xl font-bold text-[#251D16]">
                Spending Analytics
              </h4>
              <p className="text-xs text-[#80613F] leading-relaxed font-sans">
                Examine category breakdown via extruded 3D geometry, mean ticket size metrics, and ledger velocity analysis.
              </p>
            </div>
          </div>

          {/* Action Callout Box */}
          <div className="p-8 sm:p-10 rounded-xl bg-[#251D16] border border-[#C6A568]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-xl text-[#F7F3EA]">
            <div className="space-y-1">
              <h4 className="font-editorial text-2xl font-bold text-[#F7F3EA]">
                Step into sovereign wealth clarity.
              </h4>
              <p className="text-xs text-[#EDE2CC]/75">
                Zero database footprint. Ephemeral in-memory privacy.
              </p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 rounded-lg bg-[#C6A568] hover:bg-[#E5D2A9] text-[#111111] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
            >
              CREATE YOUR ACCOUNT
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. MINIMAL LUXURY FOOTER — OBSIDIAN BLACK (#111111)           */}
      {/* ------------------------------------------------------------- */}
      <footer className="relative z-10 w-full border-t border-[#C6A568]/20 bg-[#111111] px-6 sm:px-12 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#EDE2CC]/65">
        <div className="flex items-center gap-2">
          <span className="font-devanagari font-bold text-[#C6A568]">धनलेख</span>
          <span>•</span>
          <span className="uppercase tracking-widest text-[#F7F3EA]">DHANLEKHA</span>
          <span>— Personal Finance / India</span>
        </div>
        <div className="text-[11px] text-[#EDE2CC]/50">
          "Every rupee has a story." • In-Memory Architecture
        </div>
      </footer>
    </div>
  );
};
