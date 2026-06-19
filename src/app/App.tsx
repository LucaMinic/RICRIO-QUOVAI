import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  LayoutDashboard, FilePlus, Building2, FileText, Users, Settings,
  Bell, Globe, ChevronRight, Search, Download, Send, Save,
  X, Moon, Sun, LogOut, ArrowLeft, ChevronDown,
  CheckCircle2, Clock, AlertCircle, Archive, MapPin, Users2,
  Eye, Edit3, MoreHorizontal, TrendingUp, Sparkles, Menu, Check,
  BellRing, XCircle, CreditCard, Ban, CalendarDays
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "login" | "dashboard" | "bookings" | "booking-detail" | "new-contract" | "contracts" | "contract-detail" | "settings";
type ContractStatus = "Bozza" | "Inviato" | "Firmato" | "Archiviato" | "Annullata";
type Language = "it" | "en" | "de";
type ClientStatus = "Nuovo Cliente" | "Cliente Abituale" | "VIP" | "Storico";

interface Villa {
  id: string;
  name: string;
  location: string;
  guests: number;
  bedrooms: number;
  photo: string;
  status: "Available" | "Occupied" | "Maintenance";
  languages: Language[];
}

interface Booking {
  id: string;
  villaId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  passport: string;
  codiceFiscale: string;
  luogoNascita: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  price: string;
  deposit: string;
  securityDeposit: string;
  paymentMethod: string;
  paymentDueDate: string;
  extras: string;
  notes: string;
}

interface ContractForm {
  villaId: string;
  language: Language;
  secondaryLanguage: Language | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  passport: string;
  codiceFiscale: string;
  luogoNascita: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  price: string;
  deposit: string;
  securityDeposit: string;
  paymentMethod: string;
  paymentDueDate: string;
  extras: string;
  notes: string;
}

interface Contract {
  id: string;
  customer: string;
  villa: string;
  language: Language;
  secondaryLanguage?: Language;
  status: ContractStatus;
  date: string;
  amount: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
  nationality: string;
  email: string;
  phone: string;
  status: ClientStatus;
  preferredLanguage: Language;
  totalBookings: number;
  lastBooking: string;
  lastVilla: string;
  totalSpent: string;
  avatar?: string;
  address?: string;
  notes?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const VILLAS: Villa[] = [
  { id: "1", name: "Villa Ricrio", location: "Guardistallo (PI)", guests: 14, bedrooms: 7, photo: "1678902177251-7ec8fea483a3", status: "Available", languages: ["it", "en", "de"] },
  { id: "2", name: "Dependance Villa Ricrio", location: "Guardistallo (PI)", guests: 4, bedrooms: 2, photo: "1664462114298-dd29ba198f7a", status: "Occupied", languages: ["it", "en"] },
  { id: "3", name: "Villa Bacio", location: "Guardistallo (PI)", guests: 10, bedrooms: 5, photo: "1713971346138-6a3b2494c942", status: "Available", languages: ["it", "en", "de"] },
  { id: "4", name: "Villa Luisa", location: "Guardistallo (PI)", guests: 8, bedrooms: 4, photo: "1623873133836-30fdaeaa7f9d", status: "Available", languages: ["it", "en"] },
  { id: "5", name: "Villa Poggio al Vento", location: "Guardistallo (PI)", guests: 12, bedrooms: 6, photo: "1694974249671-2a921a644a1c", status: "Maintenance", languages: ["it", "en", "de"] },
  { id: "6", name: "Villa Camperi", location: "Guardistallo (PI)", guests: 8, bedrooms: 4, photo: "1605447302541-bd14aa1417ab", status: "Available", languages: ["it", "en"] },
  { id: "7", name: "Villa Gigliola", location: "Guardistallo (PI)", guests: 6, bedrooms: 3, photo: "1624356417152-a1069f183130", status: "Occupied", languages: ["it", "en", "de"] },
  { id: "8", name: "Podere I Gotti", location: "Guardistallo (PI)", guests: 4, bedrooms: 2, photo: "1630511390971-7c2b778656b8", status: "Available", languages: ["it", "en"] },
  { id: "9", name: "Podere Macchia al Loto", location: "Guardistallo (PI)", guests: 6, bedrooms: 3, photo: "1649686809749-836f4d219cd8", status: "Available", languages: ["it", "en", "de"] },
  { id: "10", name: "Podere Casale", location: "Guardistallo (PI)", guests: 10, bedrooms: 5, photo: "1608476037397-7b53ace4c871", status: "Available", languages: ["it", "en"] },
  { id: "11", name: "Podere Casacce", location: "Guardistallo (PI)", guests: 6, bedrooms: 3, photo: "1598928506311-c55ded91a20c", status: "Occupied", languages: ["it", "en", "de"] },
  { id: "12", name: "Podere Leccino", location: "Guardistallo (PI)", guests: 4, bedrooms: 2, photo: "1600596542815-ffad4c1539a9", status: "Available", languages: ["it", "en"] },
  { id: "13", name: "Podere Ginepraia", location: "Guardistallo (PI)", guests: 8, bedrooms: 4, photo: "1602941525421-8f8b81d3edbb", status: "Available", languages: ["it", "en", "de"] },
  { id: "14", name: "Podere Montalto", location: "Guardistallo (PI)", guests: 6, bedrooms: 3, photo: "1613490493576-7fde63acd811", status: "Available", languages: ["it", "en", "de"] },
  { id: "15", name: "Podere Nocciolo", location: "Guardistallo (PI)", guests: 5, bedrooms: 3, photo: "1600585154340-be6161a56a0c", status: "Available", languages: ["it", "en"] },
  { id: "16", name: "Podere Santa Maria", location: "Guardistallo (PI)", guests: 7, bedrooms: 4, photo: "1587974928442-77dc3e0dba72", status: "Available", languages: ["it", "en", "de"] },
];

const CONTRACTS: Contract[] = [
  { id: "TR-2025-0041", customer: "James Whitmore", villa: "Villa Ricrio", language: "it", secondaryLanguage: "en", status: "Firmato", date: "2025-05-18", amount: "€ 8.400", email: "j.whitmore@email.com" },
  { id: "TR-2025-0040", customer: "Brigitte Müller", villa: "Villa Bacio", language: "it", secondaryLanguage: "de", status: "Inviato", date: "2025-05-15", amount: "€ 5.200", email: "b.mueller@email.de" },
  { id: "TR-2025-0039", customer: "Marco Ferretti", villa: "Podere Casale", language: "it", status: "Firmato", date: "2025-05-12", amount: "€ 6.800", email: "m.ferretti@email.it" },
  { id: "TR-2025-0038", customer: "Sarah Thornton", villa: "Villa Poggio al Vento", language: "it", secondaryLanguage: "en", status: "Bozza", date: "2025-05-10", amount: "€ 3.900", email: "s.thornton@email.com" },
  { id: "TR-2025-0037", customer: "Luca Bianchi", villa: "Villa Luisa", language: "it", status: "Firmato", date: "2025-05-07", amount: "€ 4.600", email: "l.bianchi@email.it" },
  { id: "TR-2025-0036", customer: "Klaus Wagner", villa: "Podere Ginepraia", language: "it", secondaryLanguage: "de", status: "Archiviato", date: "2025-04-30", amount: "€ 5.800", email: "k.wagner@email.de" },
  { id: "TR-2025-0035", customer: "Alice Dupont", villa: "Villa Gigliola", language: "it", secondaryLanguage: "en", status: "Inviato", date: "2025-04-28", amount: "€ 3.200", email: "a.dupont@email.fr" },
  { id: "TR-2025-0034", customer: "Roberto Mancini", villa: "Villa Camperi", language: "it", status: "Firmato", date: "2025-04-22", amount: "€ 4.400", email: "r.mancini@email.it" },
];

const CHART_DATA = [
  { id: "m1", month: "Gen", contracts: 4, amount: 22 },
  { id: "m2", month: "Feb", contracts: 6, amount: 31 },
  { id: "m3", month: "Mar", contracts: 9, amount: 48 },
  { id: "m4", month: "Apr", contracts: 14, amount: 72 },
  { id: "m5", month: "Mag", contracts: 18, amount: 94 },
  { id: "m6", month: "Giu", contracts: 22, amount: 118 },
  { id: "m7", month: "Lug", contracts: 28, amount: 151 },
  { id: "m8", month: "Ago", contracts: 31, amount: 174 },
  { id: "m9", month: "Set", contracts: 24, amount: 132 },
  { id: "m10", month: "Ott", contracts: 17, amount: 89 },
  { id: "m11", month: "Nov", contracts: 11, amount: 56 },
  { id: "m12", month: "Dic", contracts: 8, amount: 42 },
];

const LANG_LABELS: Record<Language, string> = { it: "Italiano", en: "English", de: "Deutsch" };
const LANG_FLAGS: Record<Language, string> = { it: "🇮🇹", en: "🇬🇧", de: "🇩🇪" };

const NATIONALITY_FLAGS: Record<string, string> = {
  "USA": "🇺🇸", "UK": "🇬🇧", "Germany": "🇩🇪", "France": "🇫🇷",
  "Italy": "🇮🇹", "Switzerland": "🇨🇭", "Spain": "🇪🇸", "Netherlands": "🇳🇱"
};

const CLIENTS: Client[] = [
  { id: "CL-001", name: "John Miller", nationality: "USA", email: "john.miller@email.com", phone: "+1 555 123 4567", status: "VIP", preferredLanguage: "en", totalBookings: 5, lastBooking: "2025-05-18", lastVilla: "Villa Ricrio", totalSpent: "€ 42.000", address: "New York, NY, USA" },
  { id: "CL-002", name: "Emma Thompson", nationality: "UK", email: "emma.thompson@email.co.uk", phone: "+44 20 7123 4567", status: "Cliente Abituale", preferredLanguage: "en", totalBookings: 3, lastBooking: "2025-05-15", lastVilla: "Villa Bacio", totalSpent: "€ 18.600", address: "London, UK" },
  { id: "CL-003", name: "Hans Müller", nationality: "Germany", email: "h.mueller@email.de", phone: "+49 30 1234567", status: "Cliente Abituale", preferredLanguage: "de", totalBookings: 4, lastBooking: "2025-04-30", lastVilla: "Podere Ginepraia", totalSpent: "€ 23.200", address: "Berlin, Germany" },
  { id: "CL-004", name: "Sophie Laurent", nationality: "France", email: "sophie.laurent@email.fr", phone: "+33 1 42 12 34 56", status: "Nuovo Cliente", preferredLanguage: "en", totalBookings: 1, lastBooking: "2025-04-28", lastVilla: "Villa Gigliola", totalSpent: "€ 3.200", address: "Paris, France" },
  { id: "CL-005", name: "Marco Bianchi", nationality: "Italy", email: "m.bianchi@email.it", phone: "+39 06 1234567", status: "VIP", preferredLanguage: "it", totalBookings: 7, lastBooking: "2025-05-12", lastVilla: "Podere Casale", totalSpent: "€ 47.600", address: "Roma, Italia" },
  { id: "CL-006", name: "Anna Schneider", nationality: "Switzerland", email: "anna.schneider@email.ch", phone: "+41 44 123 4567", status: "Cliente Abituale", preferredLanguage: "de", totalBookings: 3, lastBooking: "2025-03-22", lastVilla: "Villa Luisa", totalSpent: "€ 13.800", address: "Zurich, Switzerland" },
  { id: "CL-007", name: "David Wilson", nationality: "UK", email: "d.wilson@email.com", phone: "+44 161 234 5678", status: "Storico", preferredLanguage: "en", totalBookings: 2, lastBooking: "2024-08-15", lastVilla: "Villa Camperi", totalSpent: "€ 8.800", address: "Manchester, UK" },
  { id: "CL-008", name: "Claire Dupont", nationality: "France", email: "c.dupont@email.fr", phone: "+33 4 91 12 34 56", status: "Cliente Abituale", preferredLanguage: "en", totalBookings: 2, lastBooking: "2025-02-10", lastVilla: "Podere I Gotti", totalSpent: "€ 7.200", address: "Marseille, France" },
  { id: "CL-009", name: "Lukas Weber", nationality: "Germany", email: "lukas.weber@email.de", phone: "+49 89 1234567", status: "Nuovo Cliente", preferredLanguage: "de", totalBookings: 1, lastBooking: "2025-05-10", lastVilla: "Villa Poggio al Vento", totalSpent: "€ 3.900", address: "Munich, Germany" },
  { id: "CL-010", name: "Giulia Rossi", nationality: "Italy", email: "g.rossi@email.it", phone: "+39 02 1234567", status: "VIP", preferredLanguage: "it", totalBookings: 6, lastBooking: "2025-05-07", lastVilla: "Villa Luisa", totalSpent: "€ 27.600", address: "Milano, Italia" },
];

const BOOKINGS: Booking[] = [
  {
    id: "BK-2025-001",
    villaId: "1",
    firstName: "James", lastName: "Whitmore",
    email: "j.whitmore@email.com", phone: "+44 20 7123 4567",
    address: "45 Kensington Gardens, London W2 4BB, UK",
    passport: "GB12345678", codiceFiscale: "", luogoNascita: "London (UK)",
    guests: "10", checkIn: "2025-07-12", checkOut: "2025-07-26",
    price: "8400", deposit: "2520", securityDeposit: "900",
    paymentMethod: "Bonifico bancario", paymentDueDate: "2025-06-12",
    extras: "Servizio chef, Degustazione vini",
    notes: "Arriving late evening, airport transfer needed.",
  },
  {
    id: "BK-2025-002",
    villaId: "3",
    firstName: "Brigitte", lastName: "Müller",
    email: "b.mueller@email.de", phone: "+49 89 1234567",
    address: "Maximilianstraße 12, 80539 München, Germany",
    passport: "DE98765432", codiceFiscale: "", luogoNascita: "München (DE)",
    guests: "8", checkIn: "2025-08-02", checkOut: "2025-08-16",
    price: "5200", deposit: "1560", securityDeposit: "900",
    paymentMethod: "Bonifico bancario", paymentDueDate: "2025-07-02",
    extras: "Pulizie giornaliere",
    notes: "Anniversario di matrimonio — richieste decorazioni floreali.",
  },
  {
    id: "BK-2025-003",
    villaId: "4",
    firstName: "Marco", lastName: "Ferretti",
    email: "m.ferretti@email.it", phone: "+39 02 1234567",
    address: "Via Montenapoleone 8, 20121 Milano, Italia",
    passport: "IT456789A", codiceFiscale: "FRRMRC80A01F205A", luogoNascita: "Milano (MI)",
    guests: "6", checkIn: "2025-07-20", checkOut: "2025-07-27",
    price: "4200", deposit: "1260", securityDeposit: "500",
    paymentMethod: "Bonifico bancario", paymentDueDate: "2025-06-20",
    extras: "", notes: "",
  },
  {
    id: "BK-2025-004",
    villaId: "5",
    firstName: "Sarah", lastName: "Thornton",
    email: "s.thornton@email.com", phone: "+1 212 555 0147",
    address: "220 Central Park South, New York, NY 10019, USA",
    passport: "US78901234", codiceFiscale: "", luogoNascita: "New York (USA)",
    guests: "12", checkIn: "2025-08-23", checkOut: "2025-09-06",
    price: "11200", deposit: "3360", securityDeposit: "900",
    paymentMethod: "Carta di credito", paymentDueDate: "2025-07-23",
    extras: "Jacuzzi privata, Transfer aeroporto, Noleggio biciclette",
    notes: "Celebrazione compleanno — richieste candele e champagne all'arrivo.",
  },
  {
    id: "BK-2025-005",
    villaId: "7",
    firstName: "Anna", lastName: "Schneider",
    email: "anna.schneider@email.ch", phone: "+41 44 123 4567",
    address: "Bahnhofstrasse 45, 8001 Zürich, Switzerland",
    passport: "CH11223344", codiceFiscale: "", luogoNascita: "Zürich (CH)",
    guests: "4", checkIn: "2025-09-06", checkOut: "2025-09-13",
    price: "3200", deposit: "960", securityDeposit: "500",
    paymentMethod: "Bonifico bancario", paymentDueDate: "2025-08-06",
    extras: "Degustazione vini",
    notes: "Preferenza piano superiore.",
  },
];

function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

// ─── Utility Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContractStatus | ClientStatus | "Available" | "Occupied" | "Maintenance" }) {
  const styles: Record<string, string> = {
    Bozza: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Inviato: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Firmato: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    Archiviato: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Annullata: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Available: "bg-emerald-100 text-emerald-800",
    Occupied: "bg-orange-100 text-orange-800",
    Maintenance: "bg-gray-100 text-gray-600",
    "Nuovo Cliente": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Cliente Abituale": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    "VIP": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "Storico": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}

function Btn({
  children, onClick, variant = "primary", size = "md", disabled = false, className = ""
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg"; disabled?: boolean; className?: string;
}) {
  const base = "inline-flex items-center gap-2 font-medium rounded transition-all duration-150 select-none cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
    ghost: "text-foreground hover:bg-muted active:bg-muted/80",
    outline: "border border-border text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

function FormField({
  label, type = "text", value, onChange, placeholder = "", required = false, as = "input"
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; as?: "input" | "textarea" | "select"; children?: React.ReactNode;
}) {
  const base = "w-full px-3 py-2.5 bg-input-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}{required && <span className="text-primary ml-1">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={base + " resize-none"}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{label}</p>
        <p className="text-2xl font-display font-semibold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function villaPhoto(id: string, w = 600, h = 400) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "bookings", label: "Prenotazioni", icon: <CalendarDays size={16} /> },
  { id: "contracts", label: "Contratti", icon: <FileText size={16} /> },
];

function Sidebar({ page, onNav, collapsed, onToggle }: {
  page: Page; onNav: (p: Page) => void; collapsed: boolean; onToggle: () => void;
}) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground flex flex-col z-30 transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-display font-bold text-primary-foreground">TR</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-display font-semibold text-sidebar-foreground leading-tight">Tenuta Ricrio</p>
            <p className="text-[10px] text-sidebar-foreground/50 font-mono tracking-widest uppercase">Management</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = page === item.id || (item.id === "bookings" && (page === "new-contract" || page === "booking-detail"));
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 text-left
                ${active
                  ? "bg-primary/20 text-primary border border-primary/25"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
            >
              <span className={`flex-shrink-0 ${active ? "text-primary" : ""}`}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <button
            onClick={() => onNav("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 text-left
              ${page === "settings"
                ? "bg-primary/20 text-primary border border-primary/25"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
          >
            <Settings size={16} className="flex-shrink-0" />
            {!collapsed && <span>Impostazioni</span>}
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-primary-foreground">LC</span>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">Paola</p>
            <p className="text-[10px] text-sidebar-foreground/40 truncate">Admin</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex-shrink-0"
        >
          <Menu size={14} />
        </button>
      </div>
    </aside>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({ title, dark, onToggleDark, onLogout }: {
  title: string; dark: boolean; onToggleDark: () => void; onLogout: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 gap-4 flex-shrink-0">
      <h1 className="text-lg font-display font-semibold text-foreground truncate">{title}</h1>
      <div className="flex items-center gap-2">
        {/* Lang */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">IT</span>
            <ChevronDown size={12} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 w-32 z-50">
              {(["IT", "EN", "DE"] as const).map(l => (
                <button key={l} onClick={() => setLangOpen(false)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2">
                  <span>{l === "IT" ? "🇮🇹" : l === "EN" ? "🇬🇧" : "🇩🇪"}</span>
                  <span>{l}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-xl w-72 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Notifiche</p>
              </div>
              {[
                { id: "n1", icon: <CheckCircle2 size={14} className="text-emerald-500" />, text: "Contratto TR-2025-0041 firmato", time: "2 ore fa" },
                { id: "n2", icon: <AlertCircle size={14} className="text-amber-500" />, text: "Deposit in scadenza — Villa Bacio", time: "5 ore fa" },
                { id: "n3", icon: <Send size={14} className="text-blue-500" />, text: "Contratto TR-2025-0040 inviato", time: "Ieri" },
              ].map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b border-border/50 last:border-0">
                  <div className="mt-0.5 flex-shrink-0">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Esci</span>
        </button>
      </div>
    </header>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPage({ onNewContract, onViewContract }: {
  onNewContract: () => void; onViewContract: (id: string) => void;
}) {
  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Lunedì, 26 Maggio 2025</p>
          <h2 className="text-2xl font-display font-semibold text-foreground mt-1">
            Buongiorno, Paola <span className="text-primary">✦</span>
          </h2>
        </div>
        <Btn onClick={onNewContract} variant="primary">
          <CalendarDays size={15} />
          Prenotazioni
        </Btn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Contratti Generati" value="41" sub="+8 questo mese"
          icon={<FileText size={16} className="text-primary" />} color="bg-primary/10" />
        <StatCard label="Contratti Firmati" value="34" sub="82.9% del totale"
          icon={<CheckCircle2 size={16} className="text-emerald-600" />} color="bg-emerald-100" />
        <StatCard label="In Attesa" value="5" sub="2 in scadenza"
          icon={<Clock size={16} className="text-amber-600" />} color="bg-amber-100" />
        <StatCard label="Ville Attive" value="11" sub="2 occupate oggi"
          icon={<Building2 size={16} className="text-secondary" />} color="bg-secondary/10" />
      </div>

      {/* Chart + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Attività Contratti</p>
              <p className="text-lg font-display font-semibold text-foreground mt-0.5">2025 — Anno in Corso</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              <span>+24%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="areaGradientContracts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BF5730" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#BF5730" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(39,20,9,0.07)" />
              <XAxis key="area-x" dataKey="month" tick={{ fontSize: 10, fill: "#7C6450" }} axisLine={false} tickLine={false} />
              <YAxis key="area-y" tick={{ fontSize: 10, fill: "#7C6450" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                labelStyle={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted-foreground)" }}
              />
              <Area key="area-contracts" type="monotone" dataKey="contracts" stroke="#BF5730" strokeWidth={2} fill="url(#areaGradientContracts)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Valore Mensile (k€)</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={CHART_DATA.slice(9).map((d, i) => ({ ...d, id: `bar-${i}` }))} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(39,20,9,0.07)" />
              <XAxis key="bar-x" dataKey="month" tick={{ fontSize: 10, fill: "#7C6450" }} axisLine={false} tickLine={false} />
              <YAxis key="bar-y" tick={{ fontSize: 10, fill: "#7C6450" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
              />
              <Bar key="bar-amount" dataKey="amount" fill="#C49838" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fatturato YTD</span>
              <span className="font-mono font-medium text-foreground">€ 1.029.000</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Media contratto</span>
              <span className="font-mono font-medium text-foreground">€ 5.234</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent contracts */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Contratti Recenti</p>
          <button className="text-xs text-primary hover:underline font-mono">Vedi tutti →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Cliente", "Villa", "Lingua", "Stato", "Data", "Importo"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTRACTS.slice(0, 5).map(c => (
                <tr key={c.id}
                  onClick={() => onViewContract(c.id)}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{c.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.villa}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span>{LANG_FLAGS[c.language]}</span>
                      {c.secondaryLanguage && (
                        <>
                          <span className="text-muted-foreground text-xs">+</span>
                          <span>{LANG_FLAGS[c.secondaryLanguage]}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{fmtDate(c.date)}</td>
                  <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">{c.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Bookings List ────────────────────────────────────────────────────────────

function BookingsPage({ onPreview, onGenerateContract }: {
  onPreview: (b: Booking) => void;
  onGenerateContract: (b: Booking) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = BOOKINGS.filter(b => {
    const villa = VILLAS.find(v => v.id === b.villaId);
    const s = search.toLowerCase();
    return (
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(s) ||
      (villa?.name.toLowerCase().includes(s) ?? false) ||
      b.email.toLowerCase().includes(s)
    );
  });

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Sistema Esterno</p>
          <h1 className="text-xl font-display font-semibold text-foreground">Prenotazioni</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca ospite o villa..."
              className="pl-8 pr-4 py-2 bg-input-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 w-56"
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-full whitespace-nowrap">
            {filtered.length} prenotazioni
          </span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Totale</p>
          <p className="text-2xl font-display font-semibold text-foreground">{BOOKINGS.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Questo mese</p>
          <p className="text-2xl font-display font-semibold text-foreground">
            {BOOKINGS.filter(b => b.checkIn.startsWith("2025-07") || b.checkIn.startsWith("2025-08")).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Ospiti totali</p>
          <p className="text-2xl font-display font-semibold text-foreground">
            {BOOKINGS.reduce((sum, b) => sum + Number(b.guests), 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Valore totale</p>
          <p className="text-xl font-display font-semibold text-foreground">
            € {BOOKINGS.reduce((sum, b) => sum + Number(b.price), 0).toLocaleString("it-IT")}
          </p>
        </div>
      </div>

      {/* Booking cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-muted-foreground text-sm">
            Nessuna prenotazione trovata
          </div>
        ) : filtered.map(b => {
          const villa = VILLAS.find(v => v.id === b.villaId);
          const nights = villa
            ? Math.round((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000)
            : 0;
          return (
            <div key={b.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              {/* Villa thumbnail */}
              {villa && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                  <img src={villaPhoto(villa.photo, 128, 128)} alt={villa.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Info grid */}
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Ospite</p>
                  <p className="font-display font-semibold text-foreground text-sm truncate">{b.firstName} {b.lastName}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{b.email}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Villa</p>
                  <p className="font-medium text-foreground text-sm truncate">{villa?.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Users2 size={9} />{b.guests} ospiti</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Periodo</p>
                  <p className="font-medium text-foreground text-sm">{fmtDate(b.checkIn)}</p>
                  <p className="text-xs text-muted-foreground">→ {fmtDate(b.checkOut)} <span className="font-mono">({nights}n)</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Importo</p>
                  <p className="font-mono font-semibold text-foreground text-sm">€ {Number(b.price).toLocaleString("it-IT")}</p>
                  <p className="text-xs text-muted-foreground">dep. € {Number(b.deposit).toLocaleString("it-IT")}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 flex flex-col gap-2">
                <Btn onClick={() => onPreview(b)} variant="outline" size="sm">
                  <Eye size={13} />
                  Anteprima
                </Btn>
                <Btn onClick={() => onGenerateContract(b)} variant="primary" size="sm">
                  <FilePlus size={13} />
                  Genera Contratto
                </Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Booking Detail ───────────────────────────────────────────────────────────

function BookingDetailPage({ booking, onBack, onGenerateContract }: {
  booking: Booking;
  onBack: () => void;
  onGenerateContract: (b: Booking) => void;
}) {
  const villa = VILLAS.find(v => v.id === booking.villaId);
  const nights = Math.round(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000
  );

  function Field({ label, value }: { label: string; value: string }) {
    return (
      <div>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{booking.id}</p>
          <h1 className="text-xl font-display font-semibold text-foreground truncate">
            {booking.firstName} {booking.lastName}
          </h1>
        </div>
        <Btn onClick={() => onGenerateContract(booking)} variant="primary" size="sm">
          <FilePlus size={13} />
          Genera Contratto
        </Btn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left / main column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Guest */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Dati Ospite</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nome" value={booking.firstName} />
              <Field label="Cognome" value={booking.lastName} />
              <Field label="Email" value={booking.email} />
              <Field label="Telefono" value={booking.phone} />
              <div className="sm:col-span-2">
                <Field label="Indirizzo" value={booking.address} />
              </div>
              <Field label="Passaporto / Documento" value={booking.passport} />
              <Field label="Codice Fiscale" value={booking.codiceFiscale} />
              <Field label="Luogo di Nascita" value={booking.luogoNascita} />
              <Field label="Numero Ospiti" value={`${booking.guests} persone`} />
            </div>
          </div>

          {/* Period */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Periodo di Soggiorno</p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Check-in" value={fmtDate(booking.checkIn)} />
              <Field label="Check-out" value={fmtDate(booking.checkOut)} />
              <Field label="Durata" value={`${nights} notti`} />
            </div>
          </div>

          {/* Financials */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Condizioni Economiche</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Prezzo Affitto" value={`€ ${Number(booking.price).toLocaleString("it-IT")}`} />
              <Field label="Deposito a Garanzia" value={`€ ${Number(booking.deposit).toLocaleString("it-IT")}`} />
              <Field
                label="Deposito Cauzionale"
                value={booking.securityDeposit ? `€ ${Number(booking.securityDeposit).toLocaleString("it-IT")}` : "—"}
              />
              <Field label="Metodo Pagamento" value={booking.paymentMethod} />
              <Field label="Scadenza Pagamento" value={fmtDate(booking.paymentDueDate)} />
            </div>
          </div>

          {/* Extras & Notes */}
          {(booking.extras || booking.notes) && (
            <div className="bg-card border border-border rounded-lg p-5 space-y-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Extra & Note</p>
              {booking.extras && (
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Servizi Aggiuntivi</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.extras.split(",").map(e => e.trim()).filter(Boolean).map(ex => (
                      <span key={ex} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {booking.notes && (
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Note</p>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg px-4 py-3">{booking.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right / sidebar */}
        <div className="space-y-5">

          {/* Villa card */}
          {villa && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="h-36 overflow-hidden">
                <img src={villaPhoto(villa.photo, 500, 280)} alt={villa.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <p className="font-display font-semibold text-foreground">{villa.name}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin size={11} />{villa.location}</p>
                  <p className="flex items-center gap-1.5"><Users2 size={11} />Fino a {villa.guests} ospiti · {villa.bedrooms} camere</p>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {villa.languages.map(l => (
                    <span key={l} className="text-base" title={LANG_LABELS[l]}>{LANG_FLAGS[l]}</span>
                  ))}
                  <span className="text-[10px] text-muted-foreground font-mono ml-1">Lingue contratto</span>
                </div>
              </div>
            </div>
          )}

          {/* Summary box */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Riepilogo</p>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Soggiorno</span>
                <span className="font-mono font-medium text-foreground">{nights} notti</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ospiti</span>
                <span className="font-mono font-medium text-foreground">{booking.guests}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dep. garanzia</span>
                <span className="font-mono font-medium text-foreground">€ {Number(booking.deposit).toLocaleString("it-IT")}</span>
              </div>
              {booking.securityDeposit && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dep. cauzionale</span>
                  <span className="font-mono font-medium text-foreground">€ {Number(booking.securityDeposit).toLocaleString("it-IT")}</span>
                </div>
              )}
              <div className="border-t border-border pt-2.5 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Totale affitto</span>
                <span className="font-mono font-semibold text-foreground text-base">
                  € {Number(booking.price).toLocaleString("it-IT")}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Language & Contract Steps ────────────────────────────────────────────────

function Step2Language({ form, onChange }: { form: ContractForm; onChange: (f: Partial<ContractForm>) => void }) {
  const secondaryLangs: { code: Language; label: string; flag: string; desc: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧", desc: "Aggiungi traduzione in inglese" },
    { code: "de", label: "Deutsch", flag: "🇩🇪", desc: "Aggiungi traduzione in tedesco" },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-display font-semibold text-foreground mb-1">Lingua del Contratto</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Il contratto verrà sempre generato in italiano. È possibile aggiungere una seconda lingua per il cliente.
      </p>

      {/* Italian - Mandatory */}
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Lingua Principale (Obbligatoria)</p>
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5">
          <span className="text-3xl flex-shrink-0">🇮🇹</span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground">Italiano</p>
            <p className="text-xs text-muted-foreground mt-0.5">Contratto principale in lingua italiana</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Secondary Language - Optional */}
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Lingua Aggiuntiva (Opzionale)</p>
        <div className="space-y-3">
          <button
            onClick={() => onChange({ secondaryLanguage: null })}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${form.secondaryLanguage === null
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-muted/30 bg-card"}`}>
            <span className="text-3xl flex-shrink-0 opacity-40">—</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-foreground">Nessuna</p>
              <p className="text-xs text-muted-foreground mt-0.5">Solo contratto in italiano</p>
            </div>
            {form.secondaryLanguage === null && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-primary-foreground" />
              </div>
            )}
          </button>

          {secondaryLangs.map(l => (
            <button key={l.code}
              onClick={() => onChange({ secondaryLanguage: l.code })}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group
                ${form.secondaryLanguage === l.code
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-muted/30 bg-card"}`}>
              <span className="text-3xl flex-shrink-0">{l.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground">{l.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
              </div>
              {form.secondaryLanguage === l.code && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


const LOREM_IT = `Il presente contratto di locazione turistica è stipulato tra il locatore, Tenuta Ricrio S.r.l., con sede legale in Guardistallo (PI), e il conduttore come indicato in intestazione. Il conduttore prende in locazione l'immobile per uso esclusivamente turistico, ai sensi dell'art. 53 del D.Lgs. n. 79/2011, per il periodo indicato. Il conduttore si impegna a utilizzare l'immobile con diligenza, a non sublocarlo e a riconsegnarlo nelle medesime condizioni in cui lo ha ricevuto. Il canone di locazione, il deposito cauzionale e la caparra confirmatoria sono stabiliti nelle condizioni economiche del presente contratto. In caso di danni all'immobile o agli arredi, il locatore è autorizzato a trattenere il deposito cauzionale. Il presente contratto è disciplinato dalla legge italiana.`;
const LOREM_EN = `This short-term holiday rental agreement is entered into between the Landlord, Tenuta Ricrio S.r.l., registered in Guardistallo (PI), and the Tenant as detailed herein. The Tenant agrees to use the property solely for holiday/tourist purposes in accordance with applicable Italian law. The Tenant undertakes to treat the property with care, not to sublet it, and to return it in the same condition as received. The rental fee, security deposit, and advance payment are as specified in the financial conditions herein. In the event of damage to the property or furnishings, the Landlord reserves the right to retain the security deposit. This Agreement is governed by Italian law.`;
const LOREM_DE = `Dieser Ferienmietvertrag wird zwischen dem Vermieter, Tenuta Ricrio S.r.l. mit Sitz in Guardistallo (PI), und dem Mieter gemäß den hierin enthaltenen Angaben abgeschlossen. Der Mieter verpflichtet sich, die Unterkunft ausschließlich für Urlaubszwecke gemäß dem geltenden italienischen Recht zu nutzen. Der Mieter verpflichtet sich, die Unterkunft pfleglich zu behandeln, nicht unterzuvermieten und im selben Zustand zurückzugeben, in dem er sie erhalten hat. Mietpreis, Kaution und Anzahlung sind in den finanziellen Bedingungen dieser Vereinbarung festgelegt. Das vorliegende Abkommen unterliegt dem italienischen Recht.`;

function Step5Preview({
  form, onSend, onDownload, onSaveDraft
}: {
  form: ContractForm;
  onSend: () => void;
  onDownload: () => void;
  onSaveDraft: () => void;
}) {
  const villa = VILLAS.find(v => v.id === form.villaId);
  const today = new Date().toLocaleDateString("it-IT");
  const hasBilingual = form.secondaryLanguage !== null;
  const secondLang = form.secondaryLanguage;

  const contractNumber = `TR-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  const bilingualClause = secondLang === "de"
    ? "Il presente contratto è redatto in lingua italiana e tedesca. In caso di discrepanze interpretative, prevale il testo italiano."
    : "Il presente contratto è redatto in lingua italiana e inglese. In caso di discrepanze interpretative, prevale il testo italiano.";

  const renderSection = (lang: Language) => {
    const legalText = lang === "de" ? LOREM_DE : lang === "en" ? LOREM_EN : LOREM_IT;
    const title = lang === "de" ? "MIETVERTRAG" : lang === "en" ? "RENTAL AGREEMENT" : "CONTRATTO DI LOCAZIONE TURISTICA";

    return (
      <div className={hasBilingual && lang !== "it" ? "pt-8 mt-8 border-t-2 border-gray-200" : ""}>
        {/* Language indicator for secondary language */}
        {hasBilingual && lang !== "it" && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-accent rounded" />
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400">Translation</p>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>{LANG_FLAGS[lang]}</span>
                  <span>{LANG_LABELS[lang]}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 text-sm" style={{ color: "#271409" }}>
          {/* Title */}
          <div>
            <h3 className="text-base font-display font-semibold text-gray-800">{title}</h3>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                {lang === "it" ? "Locatore" : lang === "en" ? "Landlord" : "Vermieter"}
              </p>
              <p className="font-semibold text-gray-800">Tenuta Ricrio S.r.l.</p>
              <p className="text-xs text-gray-500 mt-1">Guardistallo (PI)</p>
              <p className="text-xs text-gray-500">P.IVA IT 01234567890</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                {lang === "it" ? "Conduttore" : lang === "en" ? "Tenant" : "Mieter"}
              </p>
              <p className="font-semibold text-gray-800">{form.firstName || "—"} {form.lastName}</p>
              <p className="text-xs text-gray-500 mt-1">{form.address || "—"}</p>
              <p className="text-xs text-gray-500">Doc: {form.passport || "—"}</p>
            </div>
          </div>

          {/* Villa + Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Villa</p>
              <p className="font-semibold text-gray-800">{villa?.name ?? "—"}</p>
              <p className="text-xs text-gray-500">{villa?.location}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                {lang === "it" ? "Periodo" : lang === "en" ? "Period" : "Zeitraum"}
              </p>
              <p className="font-semibold text-gray-800">{fmtDate(form.checkIn)}</p>
              <p className="text-xs text-gray-500">→ {fmtDate(form.checkOut)}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                {lang === "it" ? "Ospiti" : lang === "en" ? "Guests" : "Gäste"}
              </p>
              <p className="font-semibold text-gray-800">{form.guests} {lang === "it" ? "persone" : lang === "en" ? "people" : "Personen"}</p>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">
              {lang === "it" ? "Condizioni Economiche" : lang === "en" ? "Financial Terms" : "Finanzielle Bedingungen"}
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">
                  {lang === "it" ? "Canone Affitto" : lang === "en" ? "Rental Fee" : "Mietpreis"}
                </p>
                <p className="font-mono font-semibold text-gray-800 mt-0.5">€ {form.price ? Number(form.price).toLocaleString("it-IT") : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {lang === "it" ? "Deposito a garanzia" : lang === "en" ? "Security Deposit" : "Sicherheitsleistung"}
                </p>
                <p className="font-mono font-semibold text-gray-800 mt-0.5">€ {form.deposit ? Number(form.deposit).toLocaleString("it-IT") : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  {lang === "it" ? "Deposito Cauzionale" : lang === "en" ? "Security Deposit" : "Kaution"}
                </p>
                <p className="font-mono font-semibold text-gray-800 mt-0.5">€ {form.securityDeposit ? Number(form.securityDeposit).toLocaleString("it-IT") : "—"}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {lang === "it" ? "Pagamento" : lang === "en" ? "Payment" : "Zahlung"}: {form.paymentMethod}
                </p>
                {form.extras && <p className="text-xs text-gray-500">Extra: {form.extras}</p>}
              </div>
              {form.paymentDueDate && (
                <p className="text-xs text-gray-500">
                  {lang === "it" ? "Scadenza pagamento" : lang === "en" ? "Payment due date" : "Zahlungsfrist"}: <span className="font-mono font-medium text-gray-700">{fmtDate(form.paymentDueDate)}</span>
                </p>
              )}
            </div>
          </div>

          {/* Legal text */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
              {lang === "it" ? "Condizioni Contrattuali" : lang === "en" ? "Terms & Conditions" : "Vertragsbedingungen"}
            </p>
            <p className="text-xs leading-relaxed text-gray-600">{legalText}</p>
            <p className="text-xs leading-relaxed text-gray-600 mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">Anteprima Contratto</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Verifica i dati prima di inviare. {hasBilingual
              ? `Contratto bilingue: Italiano + ${secondLang === "en" ? "English" : "Deutsch"}.`
              : "Contratto in italiano."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Btn onClick={onSaveDraft} variant="outline" size="sm"><Save size={13} />Salva Bozza</Btn>
          <Btn onClick={onDownload} variant="secondary" size="sm"><Download size={13} />Scarica PDF</Btn>
          <Btn onClick={onSend} variant="primary" size="sm"><Send size={13} />Invia Contratto</Btn>
        </div>
      </div>

      {/* Single Unified Contract Document */}
      <div className="bg-white border border-border rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto">
        {/* Header */}
        <div className="px-10 py-7 border-b border-gray-100" style={{ background: "#FDFAF3" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-2xl font-bold tracking-tight" style={{ color: "#271409" }}>Tenuta Ricrio</p>
              <p className="text-xs text-gray-500 font-mono mt-1">Contratto N° {contractNumber}</p>
            </div>
            <div className="text-right">
              {hasBilingual ? (
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#BF5730", color: "white" }}>
                    <span>🇮🇹</span>
                    <span>IT</span>
                  </div>
                  <span className="text-gray-400">+</span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "#C49838", color: "white" }}>
                    <span>{secondLang === "en" ? "🇬🇧" : "🇩🇪"}</span>
                    <span>{secondLang === "en" ? "EN" : "DE"}</span>
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2" style={{ background: "#BF5730", color: "white" }}>
                  <span>🇮🇹</span>
                  <span>Italiano</span>
                </div>
              )}
              <p className="text-xs text-gray-500 font-mono">{today}</p>
              <p className="text-xs text-gray-400 mt-0.5">Guardistallo (PI)</p>
            </div>
          </div>
        </div>

        {/* Contract Body */}
        <div className="px-10 py-7">
          {/* Italian Version (Always first) */}
          {renderSection("it")}

          {/* Secondary Language (if bilingual) */}
          {hasBilingual && secondLang && renderSection(secondLang)}

          {/* Legal Bilingual Clause */}
          {hasBilingual && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs leading-relaxed text-gray-700 italic">
                  {bilingualClause}
                </p>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-10 mt-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Locatore / Landlord</p>
              <div className="h-14 border-b border-dashed border-gray-300 mt-2" />
              <p className="text-xs text-gray-400 mt-1">Firma e data / Signature and date</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Conduttore / Tenant</p>
              <div className="h-14 border-b border-dashed border-gray-300 mt-2" />
              <p className="text-xs text-gray-400 mt-1">Firma e data / Signature and date</p>
            </div>
          </div>

          <p className="text-[10px] text-gray-300 text-center font-mono mt-8">
            Tenuta Ricrio S.r.l. — Documento generato automaticamente
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Contract from Booking ────────────────────────────────────────────────────

const BOOKING_STEPS = ["Lingua", "Contratto"];

function ContractFromBookingPage({ booking, onBack }: { booking: Booking; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [secondaryLanguage, setSecondaryLanguage] = useState<Language | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const villa = VILLAS.find(v => v.id === booking.villaId);

  const form: ContractForm = {
    villaId: booking.villaId,
    language: "it",
    secondaryLanguage,
    firstName: booking.firstName,
    lastName: booking.lastName,
    email: booking.email,
    phone: booking.phone,
    address: booking.address,
    passport: booking.passport,
    codiceFiscale: booking.codiceFiscale,
    luogoNascita: booking.luogoNascita,
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    price: booking.price,
    deposit: booking.deposit,
    securityDeposit: booking.securityDeposit,
    paymentMethod: booking.paymentMethod,
    paymentDueDate: booking.paymentDueDate,
    extras: booking.extras,
    notes: booking.notes,
  };

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {booking.firstName} {booking.lastName} · {villa?.name ?? "—"}
          </p>
          <h1 className="text-xl font-display font-semibold text-foreground">Genera Contratto</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-0 mb-8">
        {BOOKING_STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-300
                ${i < step ? "bg-primary text-primary-foreground" :
                  i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wide hidden sm:block whitespace-nowrap
                ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < BOOKING_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 transition-colors duration-300 ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[420px]">
        {step === 0 && (
          <Step2Language
            form={form}
            onChange={f => { if (f.secondaryLanguage !== undefined) setSecondaryLanguage(f.secondaryLanguage ?? null); }}
          />
        )}
        {step === 1 && (
          <Step5Preview
            form={form}
            onSend={() => setShowSuccess(true)}
            onDownload={() => {}}
            onSaveDraft={() => {}}
          />
        )}
      </div>

      {/* Navigation — only shown on language step */}
      {step === 0 && (
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-border">
          <Btn onClick={onBack} variant="ghost">
            <ArrowLeft size={14} />
            Indietro
          </Btn>
          <Btn onClick={() => setStep(1)} variant="primary">
            Genera Contratto
            <ChevronRight size={14} />
          </Btn>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowSuccess(false); onBack(); }}>
          <div className="bg-card rounded-2xl border border-border shadow-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">Contratto Inviato!</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Il contratto è stato inviato con successo a
            </p>
            <p className="text-sm font-medium text-foreground mb-5">{booking.email}</p>
            <div className="bg-muted rounded-lg p-3 mb-6 text-xs text-muted-foreground font-mono">
              {booking.firstName} {booking.lastName} · {villa?.name}
            </div>
            <Btn onClick={() => { setShowSuccess(false); onBack(); }} variant="primary" className="w-full justify-center">
              Torna alle Prenotazioni
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contracts Archive ─────────────────────────────────────────────────────────

function PaymentSollecitoToast({ customer, onClose }: { customer: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-card border border-border rounded-xl shadow-xl px-4 py-3 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <BellRing size={14} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">Sollecito inviato</p>
        <p className="text-xs text-muted-foreground mt-0.5">Email di promemoria inviata a <span className="font-medium">{customer}</span></p>
      </div>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0">
        <X size={13} />
      </button>
    </div>
  );
}

function CancelConfirmDialog({ contract, onConfirm, onClose }: {
  contract: Contract; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border border-border shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ban size={22} className="text-red-600" />
        </div>
        <h3 className="text-base font-display font-semibold text-foreground text-center mb-1">Annulla prenotazione</h3>
        <p className="text-sm text-muted-foreground text-center mb-1">
          Sei sicuro di voler annullare questa prenotazione?
        </p>
        <p className="text-xs font-mono text-muted-foreground text-center mb-5 bg-muted rounded-lg px-3 py-2 mt-3">
          {contract.id} · {contract.customer} · {contract.villa}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Mantieni
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Ban size={13} />
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}

function ContractsPage({ onViewContract }: { onViewContract: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContractStatus | "All">("All");
  const [sortField, setSortField] = useState<keyof Contract>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  // Payment & cancellation local state (contractId → bool/status)
  const [paidMap, setPaidMap] = useState<Record<string, boolean>>({});
  const [statusOverride, setStatusOverride] = useState<Record<string, ContractStatus>>({});
  const [sollecitoToast, setSollecitoToast] = useState<string | null>(null); // customer name
  const [cancelTarget, setCancelTarget] = useState<Contract | null>(null);

  const getStatus = (c: Contract): ContractStatus => statusOverride[c.id] ?? c.status;

  const filtered = CONTRACTS
    .filter(c =>
      (filterStatus === "All" || getStatus(c) === filterStatus) &&
      (c.customer.toLowerCase().includes(search.toLowerCase()) ||
        c.villa.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = (sortField === "status" ? getStatus(a) : a[sortField]) as string;
      const bv = (sortField === "status" ? getStatus(b) : b[sortField]) as string;
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSort = (field: keyof Contract) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    setStatusOverride(prev => ({ ...prev, [cancelTarget.id]: "Annullata" }));
    setCancelTarget(null);
  };

  const STATUSES: (ContractStatus | "All")[] = ["All", "Bozza", "Inviato", "Firmato", "Archiviato", "Annullata"];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Archivio</p>
          <h1 className="text-xl font-display font-semibold text-foreground">Contratti</h1>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          {filtered.length} contratti
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cerca contratti..."
            className="w-full pl-8 pr-3 py-2 bg-input-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${filterStatus === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/40"}`}>
              {s === "All" ? "Tutti" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />  {/* ID */}
            <col style={{ width: "17%" }} />  {/* Cliente */}
            <col style={{ width: "14%" }} />  {/* Villa */}
            <col style={{ width: "8%" }} />   {/* Lingua */}
            <col style={{ width: "9%" }} />   {/* Stato */}
            <col style={{ width: "9%" }} />   {/* Data */}
            <col style={{ width: "8%" }} />   {/* Importo */}
            <col style={{ width: "10%" }} />  {/* Pagato */}
            <col style={{ width: "15%" }} />  {/* Azioni */}
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {([
                { col: "id" as keyof Contract, label: "ID" },
                { col: "customer" as keyof Contract, label: "Cliente" },
                { col: "villa" as keyof Contract, label: "Villa" },
                { col: "language" as keyof Contract, label: "Lingua" },
                { col: "status" as keyof Contract, label: "Stato" },
                { col: "date" as keyof Contract, label: "Data" },
                { col: "amount" as keyof Contract, label: "Importo" },
              ]).map(({ col, label }) => (
                <th key={col}
                  onClick={() => toggleSort(col)}
                  className="px-3 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest cursor-pointer hover:text-foreground select-none">
                  <span className="flex items-center gap-0.5">
                    {label}
                    {sortField === col && <span className="text-primary ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1"><CreditCard size={9} />Pagato</span>
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} className="px-5 py-10 text-center text-muted-foreground text-sm">Nessun contratto trovato</td></tr>
            ) : paginated.map(c => {
              const status = getStatus(c);
              const isPaid = paidMap[c.id] ?? false;
              const isCancelled = status === "Annullata";
              return (
                <tr key={c.id}
                  className={`border-b border-border/50 last:border-0 transition-colors ${isCancelled ? "opacity-60 bg-red-50/30 dark:bg-red-950/10" : "hover:bg-muted/30 cursor-pointer"}`}
                  onClick={() => !isCancelled && onViewContract(c.id)}>

                  {/* ID */}
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground truncate">{c.id}</td>

                  {/* Cliente */}
                  <td className="px-3 py-3 min-w-0">
                    <p className="font-medium text-foreground text-xs truncate">{c.customer}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{c.email}</p>
                  </td>

                  {/* Villa */}
                  <td className="px-3 py-3 min-w-0">
                    <span
                      className="text-xs text-muted-foreground truncate block"
                      title={c.villa}>
                      {c.villa}
                    </span>
                  </td>

                  {/* Lingua — compact flags + code */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="text-sm leading-none">{LANG_FLAGS[c.language]}</span>
                      {c.secondaryLanguage ? (
                        <>
                          <span className="text-[10px] text-muted-foreground">+</span>
                          <span className="text-sm leading-none">{LANG_FLAGS[c.secondaryLanguage]}</span>
                        </>
                      ) : null}
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5 whitespace-nowrap">
                      {c.secondaryLanguage ? `IT+${c.secondaryLanguage.toUpperCase()}` : "IT"}
                    </p>
                  </td>

                  {/* Stato */}
                  <td className="px-3 py-3"><StatusBadge status={status} /></td>

                  {/* Data */}
                  <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">{fmtDate(c.date)}</td>

                  {/* Importo */}
                  <td className="px-3 py-3 font-mono text-xs font-medium text-foreground whitespace-nowrap">{c.amount}</td>

                  {/* Pagato — checkbox compatta */}
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    {isCancelled ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <label className="flex items-center gap-1.5 cursor-pointer select-none group w-max">
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isPaid}
                            onChange={e => setPaidMap(prev => ({ ...prev, [c.id]: e.target.checked }))}
                            className="sr-only"
                          />
                          <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all duration-150 ${isPaid
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-border bg-input-background group-hover:border-emerald-400"}`}>
                            {isPaid && <Check size={9} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>
                        <span className={`text-[11px] font-medium transition-colors whitespace-nowrap ${isPaid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground group-hover:text-foreground"}`}>
                          {isPaid ? "Pagato" : "—"}
                        </span>
                      </label>
                    )}
                  </td>

                  {/* Azioni — solo icone con tooltip */}
                  <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-0.5">
                      {/* Visualizza */}
                      <button
                        onClick={() => onViewContract(c.id)}
                        disabled={isCancelled}
                        title="Visualizza contratto"
                        className="relative group/tip p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Eye size={13} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-20">Visualizza</span>
                      </button>

                      {/* Scarica */}
                      <button
                        disabled={isCancelled}
                        title="Scarica PDF"
                        className="relative group/tip p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <Download size={13} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-20">Scarica PDF</span>
                      </button>

                      <div className="w-px h-3.5 bg-border mx-0.5 flex-shrink-0" />

                      {/* Sollecito pagamento */}
                      <button
                        onClick={() => setSollecitoToast(c.customer)}
                        disabled={isCancelled || isPaid}
                        title="Sollecito pagamento"
                        className="relative group/tip p-1.5 rounded text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <BellRing size={13} />
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-20">Sollecito pagamento</span>
                      </button>

                      {/* Annulla prenotazione */}
                      {!isCancelled ? (
                        <button
                          onClick={() => setCancelTarget(c)}
                          title="Annulla prenotazione"
                          className="relative group/tip p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <XCircle size={13} />
                          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity z-20">Annulla prenotazione</span>
                        </button>
                      ) : (
                        <span className="p-1.5 text-red-400" title="Prenotazione annullata">
                          <Ban size={13} />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-mono">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} di {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={`page-${i + 1}`}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-mono transition-colors ${page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sollecito toast notification */}
      {sollecitoToast && (
        <PaymentSollecitoToast customer={sollecitoToast} onClose={() => setSollecitoToast(null)} />
      )}

      {/* Cancel confirmation dialog */}
      {cancelTarget && (
        <CancelConfirmDialog
          contract={cancelTarget}
          onConfirm={handleConfirmCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Contract Detail ──────────────────────────────────────────────────────────

function ContractDetailPage({ contractId, onBack }: { contractId: string; onBack: () => void }) {
  const contract = CONTRACTS.find(c => c.id === contractId) ?? CONTRACTS[0];
  const villa = VILLAS.find(v => v.name === contract.villa);

  const timeline = [
    { label: "Contratto creato", date: contract.date, icon: <FilePlus size={13} />, color: "text-blue-500" },
    { label: "Inviato al cliente", date: contract.date, icon: <Send size={13} />, color: "text-amber-500" },
    ...(contract.status === "Signed" || contract.status === "Archived"
      ? [{ label: "Firmato dal cliente", date: contract.date, icon: <CheckCircle2 size={13} />, color: "text-emerald-500" }]
      : []),
    ...(contract.status === "Archived"
      ? [{ label: "Archiviato", date: contract.date, icon: <Archive size={13} />, color: "text-gray-400" }]
      : []),
  ];

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{contract.id}</p>
          <h1 className="text-xl font-display font-semibold text-foreground">{contract.customer}</h1>
        </div>
        <StatusBadge status={contract.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contract preview card */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">Anteprima Contratto</p>
              <div className="flex items-center gap-2">
                <Btn variant="outline" size="sm"><Eye size={12} />Visualizza</Btn>
                <Btn variant="outline" size="sm"><Download size={12} />Scarica</Btn>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-6 text-center">
              <FileText size={36} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">
                {contract.secondaryLanguage ? "Contratti Bilingue" : "Contratto di Locazione"}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {contract.id} · {contract.secondaryLanguage
                  ? `IT + ${contract.secondaryLanguage.toUpperCase()}`
                  : "Italiano"
                }
              </p>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Dati Cliente</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Nome Completo", contract.customer],
                ["Email", contract.email],
                ["Villa", contract.villa],
                ["Importo", contract.amount],
                ["Lingue Contratto", contract.secondaryLanguage
                  ? `${LANG_FLAGS[contract.language]} IT + ${LANG_FLAGS[contract.secondaryLanguage]} ${contract.secondaryLanguage.toUpperCase()}`
                  : `${LANG_FLAGS[contract.language]} Italiano`
                ],
                ["Data Creazione", fmtDate(contract.date)],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-0.5">{k}</p>
                  <p className="text-sm text-foreground font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-card border border-border rounded-lg p-5 space-y-2.5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Azioni</p>
            <Btn variant="primary" className="w-full justify-center"><Send size={13} />Invia Nuovamente</Btn>
            <Btn variant="outline" className="w-full justify-center"><Edit3 size={13} />Modifica</Btn>
            <Btn variant="ghost" className="w-full justify-center text-muted-foreground"><Archive size={13} />Archivia</Btn>
          </div>

          {/* Villa */}
          {villa && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="h-28 bg-muted">
                <img src={villaPhoto(villa.photo, 400, 200)} alt={villa.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-sm text-foreground">{villa.name}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin size={10} />{villa.location}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Users2 size={10} />{villa.guests} ospiti</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Timeline</p>
            <div className="space-y-3">
              {timeline.map((t) => (
                <div key={t.label} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${t.color}`}>{t.icon}</div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{t.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{fmtDate(t.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "contracts" | "villas" | "email" | "users" | "appearance" | "security" | "integrations">("general");
  const [darkMode, setDarkMode] = useState(false);
  const [italianMandatory, setItalianMandatory] = useState(true);

  const tabs = [
    { id: "general" as const, label: "Generali", icon: <Settings size={14} /> },
    { id: "contracts" as const, label: "Contratti", icon: <FileText size={14} /> },
    { id: "villas" as const, label: "Ville", icon: <Building2 size={14} /> },
    { id: "email" as const, label: "Email & Notifiche", icon: <Bell size={14} /> },
    { id: "users" as const, label: "Utenti", icon: <Users size={14} /> },
    { id: "appearance" as const, label: "Aspetto", icon: <Sparkles size={14} /> },
    { id: "security" as const, label: "Sicurezza", icon: <AlertCircle size={14} /> },
    { id: "integrations" as const, label: "Integrazioni", icon: <Globe size={14} /> },
  ];

  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Configurazione</p>
        <h1 className="text-xl font-display font-semibold text-foreground">Impostazioni</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-2 space-y-0.5">
            {tabs.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all text-left
                  ${activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">
          {activeTab === "general" && (
            <>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Informazioni Aziendali</h3>
                <div className="space-y-4">
                  <FormField label="Nome Struttura" value="Tenuta Ricrio" onChange={() => {}} placeholder="Tenuta Ricrio" />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Email Aziendale" type="email" value="info@tenutar icrio.it" onChange={() => {}} />
                    <FormField label="Telefono" type="tel" value="+39 0588 123456" onChange={() => {}} />
                  </div>
                  <FormField label="Indirizzo" value="Guardistallo (PI), Toscana" onChange={() => {}} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Preferenze Regionali</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fuso Orario</label>
                    <select className="w-full px-3 py-2.5 bg-input-background border border-border rounded-md text-sm">
                      <option>Europe/Rome (GMT+1)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lingua Predefinita</label>
                    <select className="w-full px-3 py-2.5 bg-input-background border border-border rounded-md text-sm">
                      <option>🇮🇹 Italiano</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "contracts" && (
            <>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Configurazione Contratti</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Italiano Obbligatorio</p>
                      <p className="text-xs text-muted-foreground mt-0.5">I contratti saranno sempre generati in italiano</p>
                    </div>
                    <button
                      onClick={() => setItalianMandatory(!italianMandatory)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${italianMandatory ? "bg-primary" : "bg-muted-foreground/30"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${italianMandatory ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lingue Aggiuntive Disponibili</label>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm">🇬🇧 English</button>
                      <button className="px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm">🇩🇪 Deutsch</button>
                    </div>
                  </div>

                  <FormField label="Prefisso Numerazione Contratti" value="TR-2025-" onChange={() => {}} />

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Firma Digitale</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Abilita firma digitale per i contratti</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-primary transition-colors">
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "villas" && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Gestione Ville</h3>
              <p className="text-sm text-muted-foreground mb-4">Configura le impostazioni predefinite per le tue proprietà.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Ville Attive</p>
                  <p className="font-mono text-sm text-foreground">{VILLAS.length}</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Disponibili</p>
                  <p className="font-mono text-sm text-emerald-600">{VILLAS.filter(v => v.status === "Available").length}</p>
                </div>
                <Btn variant="primary" className="w-full justify-center mt-4"><Building2 size={13} />Gestisci Ville</Btn>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Notifiche Email</h3>
                <div className="space-y-3">
                  {[
                    { label: "Conferma Invio Contratto", desc: "Notifica quando un contratto viene inviato al cliente" },
                    { label: "Reminder Firma", desc: "Promemoria automatico per contratti non firmati" },
                    { label: "Contratto Firmato", desc: "Notifica quando un cliente firma il contratto" },
                    { label: "Nuova Prenotazione", desc: "Avviso per ogni nuova prenotazione creata" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <button className="relative w-11 h-6 rounded-full bg-primary transition-colors">
                        <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Gestione Utenti</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">PC</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Paola</p>
                    <p className="text-xs text-muted-foreground">Admin · paola@tenutar icrio.it</p>
                  </div>
                  <StatusBadge status="Signed" />
                </div>
              </div>
              <Btn variant="outline" className="w-full justify-center"><Users size={13} />Aggiungi Utente</Btn>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Tema e Aspetto</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Modalità Scura</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Attiva il tema scuro per la dashboard</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted-foreground/30"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sidebar Compatta</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Riduci la larghezza della barra laterale</p>
                  </div>
                  <button className="relative w-11 h-6 rounded-full bg-muted-foreground/30 transition-colors">
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <>
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Sicurezza Account</h3>
                <div className="space-y-4">
                  <Btn variant="outline" className="w-full justify-center"><Settings size={13} />Cambia Password</Btn>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Autenticazione a Due Fattori</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Proteggi il tuo account con 2FA</p>
                    </div>
                    <button className="relative w-11 h-6 rounded-full bg-muted-foreground/30">
                      <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Sessioni Attive</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Chrome · Mac OS</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">Questa sessione · 192.168.1.1</p>
                    </div>
                    <span className="text-xs text-emerald-600 font-mono">Attiva</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "integrations" && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Integrazioni</h3>
              <p className="text-sm text-muted-foreground mb-4">Connetti servizi esterni per automatizzare il tuo workflow.</p>
              <div className="space-y-3">
                {[
                  { name: "Stripe", desc: "Pagamenti e fatturazione", connected: true },
                  { name: "Google Drive", desc: "Archiviazione documenti", connected: true },
                  { name: "EccoFirm", desc: "Firma elettronica", connected: false },
                  { name: "Airbnb", desc: "Sincronizza prenotazioni", connected: false },
                  { name: "Booking.com", desc: "Gestione booking", connected: false },
                ].map((int) => (
                  <div key={int.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{int.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{int.desc}</p>
                    </div>
                    {int.connected ? (
                      <span className="text-xs text-emerald-600 font-mono bg-emerald-100 px-2 py-1 rounded">Connesso</span>
                    ) : (
                      <Btn variant="outline" size="sm">Connetti</Btn>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-muted">
        <img
          src="https://images.unsplash.com/photo-1649686809749-836f4d219cd8?w=1200&h=900&fit=crop&auto=format"
          alt="Tenuta Ricrio — Guardistallo, Toscana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="max-w-sm">
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-3">Guardistallo (PI), Toscana</p>
            <h2 className="font-display text-4xl font-semibold text-white leading-tight mb-3">
              Gestisci i contratti<br />della tua tenuta
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Piattaforma professionale per la generazione automatica di contratti di locazione per ville di lusso in Toscana.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 lg:px-14 bg-background">
        {/* Mobile hero */}
        <div className="lg:hidden mb-8">
          <div className="h-48 rounded-xl overflow-hidden bg-muted mb-6">
            <img
              src="https://images.unsplash.com/photo-1649686809749-836f4d219cd8?w=800&h=400&fit=crop&auto=format"
              alt="Tenuta Ricrio"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground">TR</span>
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-lg leading-tight">Tenuta Ricrio</p>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">Management Platform</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Accedi</h1>
          <p className="text-sm text-muted-foreground">Inserisci le credenziali per accedere alla piattaforma.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="laura.conti@tenutar icrio.it"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-colors"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded" />
              Ricordami
            </label>
            <button className="text-primary hover:underline">Password dimenticata?</button>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Accesso in corso...</>
            ) : (
              "Accedi alla Piattaforma"
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Accesso riservato al personale autorizzato di Tenuta Ricrio.
          </p>
          <p className="text-[10px] text-center text-muted-foreground/50 font-mono mt-1.5">v2.4.1 · © 2025 Tenuta Ricrio S.r.l.</p>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ children, page, onNav, dark, onToggleDark, onLogout, collapsed, onToggleCollapse }: {
  children: React.ReactNode;
  page: Page;
  onNav: (p: Page) => void;
  dark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const PAGE_TITLES: Record<Page, string> = {
    login: "",
    dashboard: "Dashboard",
    bookings: "Prenotazioni",
    "booking-detail": "Dettaglio Prenotazione",
    "new-contract": "Genera Contratto",
    contracts: "Archivio Contratti",
    "contract-detail": "Dettaglio Contratto",
    settings: "Impostazioni",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar page={page} onNav={onNav} collapsed={collapsed} onToggle={onToggleCollapse} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "ml-16" : "ml-56"}`}>
        <TopBar title={PAGE_TITLES[page]} dark={dark} onToggleDark={onToggleDark} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const navigate = (p: Page) => setPage(p);

  const viewContract = (id: string) => {
    setSelectedContract(id);
    setPage("contract-detail");
  };

  const handlePreview = (booking: Booking) => {
    setSelectedBooking(booking);
    setPage("booking-detail");
  };

  const handleGenerateContract = (booking: Booking) => {
    setSelectedBooking(booking);
    setPage("new-contract");
  };

  if (page === "login") {
    return <LoginPage onLogin={() => setPage("dashboard")} />;
  }

  return (
    <AppShell
      page={page}
      onNav={navigate}
      dark={dark}
      onToggleDark={toggleDark}
      onLogout={() => setPage("login")}
      collapsed={collapsed}
      onToggleCollapse={() => setCollapsed(c => !c)}
    >
      {page === "dashboard" && (
        <DashboardPage
          onNewContract={() => setPage("bookings")}
          onViewContract={viewContract}
        />
      )}
      {page === "bookings" && (
        <BookingsPage onPreview={handlePreview} onGenerateContract={handleGenerateContract} />
      )}
      {page === "booking-detail" && selectedBooking && (
        <BookingDetailPage
          booking={selectedBooking}
          onBack={() => setPage("bookings")}
          onGenerateContract={booking => { setSelectedBooking(booking); setPage("new-contract"); }}
        />
      )}
      {page === "new-contract" && selectedBooking && (
        <ContractFromBookingPage
          booking={selectedBooking}
          onBack={() => setPage("bookings")}
        />
      )}
      {page === "contracts" && (
        <ContractsPage onViewContract={viewContract} />
      )}
      {page === "contract-detail" && (
        <ContractDetailPage contractId={selectedContract} onBack={() => setPage("contracts")} />
      )}
      {page === "settings" && <SettingsPage />}
    </AppShell>
  );
}
