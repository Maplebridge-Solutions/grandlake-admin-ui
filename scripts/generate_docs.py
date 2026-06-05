"""
GLK Transit Admin UI — Technical Documentation PDF Generator
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, Image
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# ─── Brand colors ───────────────────────────────────────────────────────────
GREEN       = colors.HexColor("#40843c")
GREEN_LIGHT = colors.HexColor("#e8f5e2")
GREEN_MID   = colors.HexColor("#c5e0c3")
DARK        = colors.HexColor("#1a1a1a")
GRAY_700    = colors.HexColor("#374151")
GRAY_500    = colors.HexColor("#6b7280")
GRAY_300    = colors.HexColor("#d1d5db")
GRAY_100    = colors.HexColor("#f3f4f6")
WHITE       = colors.white
ACCENT      = colors.HexColor("#2d6b2a")

PAGE_W, PAGE_H = A4
MARGIN_LEFT  = 2.5 * cm
MARGIN_RIGHT = 2.5 * cm
MARGIN_TOP   = 2.5 * cm
MARGIN_BOT   = 2.5 * cm
CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "GLK_Transit_Admin_UI_Technical_Documentation.pdf")
LOGO_PATH   = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "logo.png")


# ─── Page-number canvas ─────────────────────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved_page_states)
        for i, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            if i > 0:           # skip cover
                self._draw_footer(i + 1, total)
            super().showPage()
        super().save()

    def _draw_footer(self, page, total):
        self.saveState()
        self.setStrokeColor(GREEN)
        self.setLineWidth(0.5)
        self.line(MARGIN_LEFT, MARGIN_BOT - 5 * mm, PAGE_W - MARGIN_RIGHT, MARGIN_BOT - 5 * mm)
        self.setFont("Helvetica", 8)
        self.setFillColor(GRAY_500)
        self.drawString(MARGIN_LEFT, MARGIN_BOT - 10 * mm, "GLK Transit Admin UI — Technical Documentation")
        self.drawRightString(PAGE_W - MARGIN_RIGHT, MARGIN_BOT - 10 * mm, f"Page {page} of {total}")
        self.restoreState()


# ─── Styles ──────────────────────────────────────────────────────────────────
def build_styles():
    base = getSampleStyleSheet()

    def S(name, **kw):
        return ParagraphStyle(name, **kw)

    return {
        "cover_title": S("cover_title",
            fontName="Helvetica-Bold", fontSize=30, textColor=WHITE,
            leading=36, alignment=TA_LEFT, spaceAfter=6),
        "cover_sub": S("cover_sub",
            fontName="Helvetica", fontSize=14, textColor=GREEN_LIGHT,
            leading=18, alignment=TA_LEFT),
        "cover_meta": S("cover_meta",
            fontName="Helvetica", fontSize=10, textColor=GREEN_MID,
            alignment=TA_LEFT),

        "h1": S("h1",
            fontName="Helvetica-Bold", fontSize=18, textColor=WHITE,
            leading=22, spaceBefore=0, spaceAfter=4),
        "h2": S("h2",
            fontName="Helvetica-Bold", fontSize=13, textColor=ACCENT,
            leading=16, spaceBefore=14, spaceAfter=4,
            borderPadding=(0, 0, 2, 0)),
        "h3": S("h3",
            fontName="Helvetica-Bold", fontSize=11, textColor=DARK,
            leading=14, spaceBefore=10, spaceAfter=3),
        "h4": S("h4",
            fontName="Helvetica-BoldOblique", fontSize=10, textColor=GRAY_700,
            leading=13, spaceBefore=8, spaceAfter=2),

        "body": S("body",
            fontName="Helvetica", fontSize=10, textColor=GRAY_700,
            leading=15, spaceBefore=2, spaceAfter=4, alignment=TA_JUSTIFY),
        "bullet": S("bullet",
            fontName="Helvetica", fontSize=10, textColor=GRAY_700,
            leading=14, leftIndent=14, bulletIndent=4,
            spaceBefore=1, spaceAfter=1, bulletText="•"),
        "bullet2": S("bullet2",
            fontName="Helvetica", fontSize=9.5, textColor=GRAY_500,
            leading=13, leftIndent=28, bulletIndent=18,
            spaceBefore=0, spaceAfter=0, bulletText="–"),
        "code": S("code",
            fontName="Courier", fontSize=8.5, textColor=DARK,
            leading=12, leftIndent=10, rightIndent=10,
            backColor=GRAY_100, borderPadding=6,
            spaceBefore=4, spaceAfter=6),
        "table_header": S("table_header",
            fontName="Helvetica-Bold", fontSize=9, textColor=WHITE,
            leading=12, alignment=TA_LEFT),
        "table_cell": S("table_cell",
            fontName="Helvetica", fontSize=9, textColor=GRAY_700,
            leading=12, alignment=TA_LEFT),
        "caption": S("caption",
            fontName="Helvetica-Oblique", fontSize=8.5, textColor=GRAY_500,
            alignment=TA_CENTER, spaceBefore=2, spaceAfter=8),
        "toc_h1": S("toc_h1",
            fontName="Helvetica-Bold", fontSize=11, textColor=DARK,
            leading=16, spaceBefore=4),
        "toc_h2": S("toc_h2",
            fontName="Helvetica", fontSize=10, textColor=GRAY_700,
            leading=14, leftIndent=14),
    }


# ─── Reusable helpers ────────────────────────────────────────────────────────
def section_banner(title, styles):
    """Full-width green banner for a section heading."""
    data = [[Paragraph(title, styles["h1"])]]
    t = Table(data, colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
        ("LEFTPADDING",  (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING",   (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[GREEN]),
    ]))
    return [t, Spacer(1, 8)]


def divider():
    return HRFlowable(width="100%", thickness=0.5, color=GRAY_300,
                      spaceAfter=6, spaceBefore=4)


def info_table(rows, styles, col_widths=None):
    """Generic 2-column info table."""
    if col_widths is None:
        col_widths = [CONTENT_W * 0.3, CONTENT_W * 0.7]
    data = [[Paragraph(k, styles["table_header"]), Paragraph(v, styles["table_header"])]
            if i == 0 else
            [Paragraph(k, styles["table_cell"]), Paragraph(v, styles["table_cell"])]
            for i, (k, v) in enumerate(rows)]
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, 0), GREEN),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, GRAY_100]),
        ("GRID",         (0, 0), (-1, -1), 0.4, GRAY_300),
        ("LEFTPADDING",  (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING",   (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 5),
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
    ]))
    return [t, Spacer(1, 8)]


def multi_col_table(header_row, data_rows, styles, col_widths=None):
    """Generic multi-column table."""
    if col_widths is None:
        n = len(header_row)
        col_widths = [CONTENT_W / n] * n

    all_rows = [[Paragraph(h, styles["table_header"]) for h in header_row]]
    for row in data_rows:
        all_rows.append([Paragraph(str(c), styles["table_cell"]) for c in row])

    t = Table(all_rows, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), GREEN),
        ("ROWBACKGROUNDS",(0, 1),(-1,-1), [WHITE, GRAY_100]),
        ("GRID",          (0, 0), (-1,-1), 0.4, GRAY_300),
        ("LEFTPADDING",   (0, 0), (-1,-1), 7),
        ("RIGHTPADDING",  (0, 0), (-1,-1), 7),
        ("TOPPADDING",    (0, 0), (-1,-1), 5),
        ("BOTTOMPADDING", (0, 0), (-1,-1), 5),
        ("VALIGN",        (0, 0), (-1,-1), "TOP"),
    ]))
    return [t, Spacer(1, 10)]


def code_block(text, styles):
    lines = text.strip().split("\n")
    safe = "<br/>".join(line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                        for line in lines)
    return [Paragraph(safe, styles["code"]), Spacer(1, 4)]


# ─── Cover page ──────────────────────────────────────────────────────────────
def cover_page(canvas_obj, doc):
    canvas_obj.saveState()
    w, h = PAGE_W, PAGE_H

    # Full-page dark background
    canvas_obj.setFillColor(DARK)
    canvas_obj.rect(0, 0, w, h, fill=1, stroke=0)

    # Green accent bar (left)
    canvas_obj.setFillColor(GREEN)
    canvas_obj.rect(0, 0, 1.2 * cm, h, fill=1, stroke=0)

    # Green bottom band
    canvas_obj.setFillColor(GREEN)
    canvas_obj.rect(0, 0, w, 2.5 * cm, fill=1, stroke=0)

    # Logo (top-left, offset from accent bar)
    logo_x = 2 * cm
    logo_y = h - 3.5 * cm
    if os.path.exists(LOGO_PATH):
        try:
            canvas_obj.drawImage(LOGO_PATH, logo_x, logo_y, width=3.5 * cm, height=1.8 * cm,
                                  preserveAspectRatio=True, mask="auto")
        except Exception:
            pass

    # Thin horizontal rule below logo
    canvas_obj.setStrokeColor(GREEN)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(2 * cm, logo_y - 0.4 * cm, w - 2 * cm, logo_y - 0.4 * cm)

    # Main title
    canvas_obj.setFont("Helvetica-Bold", 32)
    canvas_obj.setFillColor(WHITE)
    canvas_obj.drawString(2 * cm, h * 0.54, "GLK Transit")
    canvas_obj.drawString(2 * cm, h * 0.54 - 2.2 * cm, "Admin UI")

    # Subtitle
    canvas_obj.setFont("Helvetica", 14)
    canvas_obj.setFillColor(GREEN_LIGHT)
    canvas_obj.drawString(2 * cm, h * 0.54 - 3.6 * cm, "Technical Documentation")

    # Decorative rule
    canvas_obj.setStrokeColor(GREEN_MID)
    canvas_obj.setLineWidth(0.7)
    canvas_obj.line(2 * cm, h * 0.54 - 4.2 * cm, 10 * cm, h * 0.54 - 4.2 * cm)

    # Meta block
    meta = [
        ("Version", "1.0"),
        ("Date", datetime.now().strftime("%B %d, %Y")),
        ("Organization", "Grand Lake Municipality"),
        ("Classification", "Internal — Confidential"),
    ]
    canvas_obj.setFont("Helvetica", 10)
    canvas_obj.setFillColor(GRAY_300)
    y_meta = h * 0.54 - 5 * cm
    for label, val in meta:
        canvas_obj.setFont("Helvetica-Bold", 9)
        canvas_obj.setFillColor(GREEN_LIGHT)
        canvas_obj.drawString(2 * cm, y_meta, label + ":")
        canvas_obj.setFont("Helvetica", 9)
        canvas_obj.setFillColor(GRAY_300)
        canvas_obj.drawString(5.5 * cm, y_meta, val)
        y_meta -= 0.55 * cm

    # Bottom band text
    canvas_obj.setFont("Helvetica", 9)
    canvas_obj.setFillColor(WHITE)
    canvas_obj.drawString(2 * cm, 0.9 * cm,
                           "Grand Lake Municipality — Transit Operations Division")
    canvas_obj.setFillColor(GREEN_LIGHT)
    canvas_obj.drawRightString(w - 2 * cm, 0.9 * cm,
                                "glktransit-admin-ui  •  v0.1.0")

    canvas_obj.restoreState()


# ─── Document build ──────────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=MARGIN_LEFT,
        rightMargin=MARGIN_RIGHT,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOT + 1.2 * cm,
        title="GLK Transit Admin UI — Technical Documentation",
        author="Grand Lake Municipality",
        subject="Technical Documentation",
    )

    styles = build_styles()
    story  = []

    # ── Cover (drawn via onFirstPage callback) ────────────────────────────────
    story.append(PageBreak())   # Slide 1 is drawn by cover_page callback below

    # ── 1. Table of Contents ─────────────────────────────────────────────────
    story += section_banner("Table of Contents", styles)
    toc = [
        ("1.", "Project Overview"),
        ("2.", "Technology Stack"),
        ("3.", "System Architecture"),
        ("4.", "Application Routes & Pages"),
        ("5.", "Component Library"),
        ("6.", "API Layer & Backend Integration"),
        ("7.", "Authentication & Authorization"),
        ("8.", "State Management"),
        ("9.", "Real-Time Features"),
        ("10.", "Key Features"),
        ("11.", "Data Types & Models"),
        ("12.", "Configuration & Environment"),
        ("13.", "Styling & Design System"),
        ("14.", "Developer Guide"),
        ("15.", "Security Considerations"),
        ("16.", "Appendix"),
    ]
    data = [[Paragraph(n, styles["toc_h1"]), Paragraph(t, styles["toc_h1"])] for n, t in toc]
    toc_table = Table(data, colWidths=[1.2 * cm, CONTENT_W - 1.2 * cm])
    toc_table.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
        ("TOPPADDING",    (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("ROWBACKGROUNDS",(0, 0), (-1, -1), [WHITE, GRAY_100]),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.3, GRAY_300),
    ]))
    story += [toc_table, PageBreak()]

    # ── Section 1: Project Overview ───────────────────────────────────────────
    story += section_banner("1. Project Overview", styles)
    story.append(Paragraph(
        "The GLK Transit Admin UI is the primary administrative dashboard for managing "
        "public transit operations within the Grand Lake Municipality. It provides "
        "transit authority staff with a centralized, web-based interface to monitor "
        "fleet status, manage drivers and routes, handle ticketing and payments, "
        "and administer system-wide role-based permissions.",
        styles["body"]))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Document Purpose", styles["h2"]))
    story.append(Paragraph(
        "This document describes the technical architecture, component structure, "
        "API integration patterns, and operational configuration of the GLK Transit "
        "Admin UI. It is intended for software developers, system architects, and "
        "technical operations staff responsible for maintaining and extending the "
        "platform.", styles["body"]))

    story.append(Paragraph("Project Identifiers", styles["h2"]))
    story += info_table([
        ("Field", "Value"),
        ("Project Name", "GLK Transit Admin UI"),
        ("Repository", "glktransit-admin-ui"),
        ("Version", "0.1.0"),
        ("Status", "Active Development"),
        ("Organization", "Grand Lake Municipality — Transit Operations Division"),
        ("API Base URL", "https://api.grandlakemunicipality.ca/api/v1/"),
        ("Target Environment", "Production (DigitalOcean Spaces for assets)"),
    ], styles)

    story.append(Paragraph("Core Capabilities at a Glance", styles["h2"]))
    capabilities = [
        "Real-time fleet monitoring and bus operations dashboard",
        "Full CRUD management for buses, maintenance records, and mechanics",
        "Driver lifecycle management — registration, shift assignment, incident reporting",
        "Route and schedule management with stop-level configuration",
        "Ticket catalog management and payment transaction history",
        "Refund processing and pass issuance workflows",
        "Role-based admin management with a visual permission matrix",
        "Comprehensive audit trails and login log reporting",
        "WebSocket-driven real-time notifications",
        "Responsive, mobile-compatible interface",
    ]
    for cap in capabilities:
        story.append(Paragraph(cap, styles["bullet"]))
    story.append(PageBreak())

    # ── Section 2: Technology Stack ───────────────────────────────────────────
    story += section_banner("2. Technology Stack", styles)

    story.append(Paragraph("Core Framework", styles["h2"]))
    story += multi_col_table(
        ["Technology", "Version", "Role"],
        [
            ["Next.js", "16.2.1", "Full-stack React framework (App Router)"],
            ["React", "19.2.4", "UI component library"],
            ["TypeScript", "5.x", "Typed JavaScript superset"],
            ["Node.js", "LTS", "Runtime environment"],
        ], styles, col_widths=[CONTENT_W * 0.28, CONTENT_W * 0.14, CONTENT_W * 0.58])

    story.append(Paragraph("UI & Styling", styles["h2"]))
    story += multi_col_table(
        ["Library", "Version", "Purpose"],
        [
            ["TailwindCSS", "4.x", "Utility-first CSS framework with CSS variable theme"],
            ["shadcn/ui", "Latest", "Pre-built accessible component library (Base-Mira style)"],
            ["Base-UI React", "1.3.0", "Low-level accessible UI primitives"],
            ["Lucide React", "Latest", "Primary icon set"],
            ["Hugeicons", "Latest", "Secondary icon set"],
            ["Class Variance Authority", "Latest", "Component variant management"],
            ["Tailwind Merge", "Latest", "Conflict-safe Tailwind class merging"],
            ["tw-animate-css", "Latest", "Animation utilities"],
        ], styles, col_widths=[CONTENT_W * 0.25, CONTENT_W * 0.12, CONTENT_W * 0.63])

    story.append(Paragraph("Data & Communication", styles["h2"]))
    story += multi_col_table(
        ["Library", "Version", "Purpose"],
        [
            ["Axios", "1.14.0", "HTTP client with request/response interceptors"],
            ["Socket.io-client", "4.8.3", "WebSocket client for real-time notifications"],
            ["Zustand", "5.0.12", "Lightweight global state management with persistence"],
            ["jose", "Latest", "JWT signing and verification for session tokens"],
        ], styles, col_widths=[CONTENT_W * 0.25, CONTENT_W * 0.12, CONTENT_W * 0.63])

    story.append(Paragraph("Utilities", styles["h2"]))
    story += multi_col_table(
        ["Library", "Version", "Purpose"],
        [
            ["Sonner", "2.0.7", "Toast notification system"],
            ["React Phone Number Input", "3.4.16", "Formatted international phone fields"],
            ["Geist / Work Sans / Inter", "Next.js Font", "Optimized web fonts"],
        ], styles, col_widths=[CONTENT_W * 0.32, CONTENT_W * 0.15, CONTENT_W * 0.53])

    story.append(Paragraph("Development Tooling", styles["h2"]))
    story += multi_col_table(
        ["Tool", "Purpose"],
        [
            ["ESLint 9 + Next.js config", "Static analysis and code quality"],
            ["PostCSS 4", "CSS transformation pipeline"],
            ["TypeScript strict mode", "Compile-time type safety"],
            ["Next.js Image Optimization", "Automatic image resizing and CDN caching"],
        ], styles, col_widths=[CONTENT_W * 0.35, CONTENT_W * 0.65])
    story.append(PageBreak())

    # ── Section 3: System Architecture ───────────────────────────────────────
    story += section_banner("3. System Architecture", styles)

    story.append(Paragraph(
        "The application follows the Next.js App Router architecture with a clear "
        "separation between authentication routes, protected main application routes, "
        "server-side API utilities, and a rich client-side component layer.",
        styles["body"]))

    story.append(Paragraph("High-Level Architecture Diagram", styles["h2"]))
    arch_text = """\
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js App Router                                 │   │
│  │                                                     │   │
│  │  ┌──────────────┐   ┌──────────────────────────┐   │   │
│  │  │  (auth)/     │   │  (main)/                 │   │   │
│  │  │  login       │   │  AuthProvider (guard)    │   │   │
│  │  │  forgot-pwd  │   │  ├─ /             (Dashboard)│  │
│  │  │  change-pwd  │   │  ├─ /manage-buses          │   │
│  │  └──────────────┘   │  ├─ /manage-drivers        │   │
│  │                     │  ├─ /manage-routes         │   │
│  │                     │  ├─ /tickets               │   │
│  │                     │  └─ /permissions           │   │
│  │                     └──────────────────────────┘    │   │
│  │                                                     │   │
│  │  Zustand Store          Axios HTTP Client           │   │
│  │  (authStore.ts)         + Request Interceptor       │   │
│  │                                                     │   │
│  │  Socket.io Client → Real-time Notifications        │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │  HTTPS                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                 ┌──────────▼──────────┐
                 │  GLK Transit API    │
                 │  (api.grandlake...) │
                 │  REST + WebSocket   │
                 └─────────────────────┘"""
    story += code_block(arch_text, styles)

    story.append(Paragraph("Directory Structure", styles["h2"]))
    dir_text = """\
glktransit-admin-ui/
├── app/                      # Next.js App Router root
│   ├── (auth)/               # Public auth routes (no sidebar)
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── change-password/
│   ├── (main)/               # Protected routes (sidebar + topbar)
│   │   ├── layout.tsx        # Shell with AuthProvider, Sidebar, Topbar
│   │   ├── page.tsx          # Dashboard
│   │   ├── manage-buses/
│   │   ├── manage-drivers/
│   │   ├── manage-routes/
│   │   ├── tickets/
│   │   └── permissions/
│   ├── layout.tsx            # Root HTML shell + font providers
│   └── globals.css           # CSS variable theme + global resets
│
├── components/               # React components
│   ├── ui/                   # shadcn primitives (25+ files)
│   ├── manage-buses/         # Bus & maintenance components
│   ├── manage-drivers/       # Driver management components
│   ├── manage-routes/        # Route management components
│   ├── tickets/              # Ticket & payment components
│   ├── permissions/          # Admin/role/audit components
│   ├── authProvider.tsx      # Session guard
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   └── notificationModal.tsx
│
├── lib/
│   ├── api/                  # Typed Axios wrappers (10 modules)
│   ├── stores/               # Zustand global stores
│   ├── types/                # TypeScript interfaces & types
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Formatting & helper utilities
│   ├── constants/            # App-wide constants
│   ├── client.ts             # Axios instance configuration
│   └── config.ts             # Runtime configuration
│
├── public/assets/            # Static images & logos
├── .env                      # Environment variables
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json"""
    story += code_block(dir_text, styles)
    story.append(PageBreak())

    # ── Section 4: Routes & Pages ─────────────────────────────────────────────
    story += section_banner("4. Application Routes & Pages", styles)

    story.append(Paragraph("Route Map", styles["h2"]))
    story += multi_col_table(
        ["Route", "File", "Protected", "Description"],
        [
            ["/login", "app/(auth)/login/page.tsx", "No", "Email/password login form"],
            ["/forgot-password", "app/(auth)/forgot-password/page.tsx", "No", "Initiate password reset flow"],
            ["/change-password", "app/(auth)/change-password/page.tsx", "No", "Set new password after reset"],
            ["/", "app/(main)/page.tsx", "Yes", "Dashboard: KPIs, fleet overview, alerts"],
            ["/manage-buses", "app/(main)/manage-buses/page.tsx", "Yes", "Bus CRUD, maintenance, mechanics"],
            ["/manage-drivers", "app/(main)/manage-drivers/page.tsx", "Yes", "Driver profiles, shifts, incidents"],
            ["/manage-routes", "app/(main)/manage-routes/page.tsx", "Yes", "Route CRUD, stop configuration, schedules"],
            ["/tickets", "app/(main)/tickets/page.tsx", "Yes", "Ticket catalog, transactions, refunds, passes"],
            ["/permissions", "app/(main)/permissions/page.tsx", "Yes", "Admin users, roles, permission matrix, audit logs"],
        ], styles, col_widths=[CONTENT_W*0.18, CONTENT_W*0.27, CONTENT_W*0.10, CONTENT_W*0.45])

    story.append(Paragraph("Route Groups & Layouts", styles["h2"]))
    story.append(Paragraph(
        "Next.js route groups (parenthesized folder names) share layout files without "
        "adding URL segments:", styles["body"]))
    for item in [
        "<b>(auth)</b>: Minimal layout — centered card, no navigation. Applies to login, forgot-password, and change-password pages.",
        "<b>(main)</b>: Full shell layout — AuthProvider session guard wraps a persistent Sidebar and Topbar. All protected routes live here.",
    ]:
        story.append(Paragraph(item, styles["bullet"]))

    story.append(Paragraph("Dashboard Page Detail", styles["h2"]))
    story.append(Paragraph(
        "The root dashboard page is the primary entry point for authenticated users. "
        "It aggregates live metrics and operational data:", styles["body"]))
    for item in [
        "Four KPI summary cards: Total Ridership, Ticket Sales, Revenue Collected, Ticket Validations — each with period comparison",
        "Tabbed bus operations table (All / Active / Inactive) with inline map modal for live bus location",
        "Time period filter: Today, This Week, This Month, This Year",
        "Real-time alerts sidebar showing system warnings (e.g. maintenance overdue, route anomalies)",
        "Personalized greeting using the authenticated admin's display name from Zustand store",
    ]:
        story.append(Paragraph(item, styles["bullet"]))
    story.append(PageBreak())

    # ── Section 5: Component Library ──────────────────────────────────────────
    story += section_banner("5. Component Library", styles)

    story.append(Paragraph("Layout & Shell Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "File", "Responsibility"],
        [
            ["AuthProvider", "components/authProvider.tsx", "Validates session on mount; redirects to /login on failure; shows spinner during check"],
            ["Sidebar", "components/sidebar.tsx", "Fixed navigation with links to all main sections; active link highlighting; user profile logo; collapsible on mobile"],
            ["Topbar", "components/topbar.tsx", "Search bar; notification bell with modal; user profile dropdown with logout"],
            ["NotificationModal", "components/notificationModal.tsx", "Lists real-time and historical notifications from the API; uses Socket.io hook"],
            ["BusMap", "components/bus-map.tsx", "Map visualization for live bus location display"],
        ], styles, col_widths=[CONTENT_W*0.22, CONTENT_W*0.30, CONTENT_W*0.48])

    story.append(Paragraph("Bus Management Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "Responsibility"],
        [
            ["BusList", "Paginated, searchable, filterable table of all buses with status badges and action menus"],
            ["BusForm", "Add/edit modal: tracking ID, bus number, route assignment, bus type, accessibility features"],
            ["MaintenanceManagement", "View and manage maintenance records linked to a specific bus"],
            ["MaintenanceLogs", "History view of all maintenance work performed by mechanics"],
            ["MaintenanceForm", "Create/edit maintenance record with type, date, notes, cost"],
            ["AddMechanicModal", "Register a new mechanic with name and contact details"],
            ["DeleteBusModal", "Confirmation dialog before permanently removing a bus record"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("Driver Management Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "Responsibility"],
        [
            ["DriverList", "Paginated driver table with search, date-range filter, status filter, and action menu"],
            ["DriverForm", "Register/edit driver: name, email, phone, staff ID, assigned route, date of birth"],
            ["DriverProfile", "Detailed view: avatar, personal info, document verification status, incident history"],
            ["AssignShiftModal", "Assign driver to a bus/route combination for a given shift period"],
            ["IncidentReportModal", "File an incident report with description, date, severity, and optional file attachments"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("Route Management Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "Responsibility"],
        [
            ["RouteList", "Filterable list of all transit routes with creation date and action menu"],
            ["RouteForm", "Create/edit route with stop names, distances between stops, and estimated travel time"],
            ["ScheduleModal", "View and manage timed schedules associated with a route"],
            ["DeleteRouteModal", "Confirmation dialog for route deletion"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("Ticket & Payment Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "Responsibility"],
        [
            ["TransactionList", "Full paginated transaction history with status filters and receipt download"],
            ["TicketTypeList", "Manage the ticket catalog — single rides and period passes by rider type and route"],
            ["RefundManagement", "Process and review refund requests; approve or reject with notes"],
            ["PassManagement", "Issue/revoke transit passes (UI present, currently disabled pending backend)"],
            ["RefundSettings", "Configure automatic refund rules and thresholds"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("Permissions Components", styles["h2"]))
    story += multi_col_table(
        ["Component", "Responsibility"],
        [
            ["ManageAdminsView", "List all admin users; invite new admins; activate/deactivate accounts; reassign roles"],
            ["ManageRolesView", "Visual permission matrix editor: role × menu item × action → toggle boolean access"],
            ["AuditTrailsTable", "Searchable, paginated log of all admin actions with timestamp, actor, and action type"],
            ["LoginLogsTable", "Admin login history showing timestamp, IP address, device, and role at login time"],
            ["PermissionsDetailModal", "Displays which roles currently have access to a selected system action"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("UI Primitives (shadcn/ui)", styles["h2"]))
    primitives = [
        "Button, Input, Textarea, Label — form controls",
        "Card, CardHeader, CardContent, CardFooter — content containers",
        "Dialog, DialogTrigger, DialogContent — modal dialogs",
        "Table, TableHeader, TableBody, TableRow, TableCell — data grids",
        "Tabs, TabsList, TabsTrigger, TabsContent — tabbed interfaces",
        "Badge — status indicators",
        "Select, DropdownMenu, Checkbox, Switch — selection controls",
        "Avatar — user/entity profile images with fallback initials",
        "Pagination — page navigation",
        "ScrollArea — custom scrollable regions",
        "PhoneInput — formatted international phone number input",
    ]
    for p in primitives:
        story.append(Paragraph(p, styles["bullet"]))
    story.append(PageBreak())

    # ── Section 6: API Layer ──────────────────────────────────────────────────
    story += section_banner("6. API Layer & Backend Integration", styles)

    story.append(Paragraph("Axios Client Configuration", styles["h2"]))
    story.append(Paragraph(
        "A single Axios instance (<b>lib/client.ts</b>) is shared across all API modules. "
        "It is pre-configured with:", styles["body"]))
    for item in [
        "Base URL from <code>NEXT_PUBLIC_API_BASE_URL</code> environment variable",
        "30-second request timeout",
        "Request interceptor: reads the <code>auth_token_client</code> cookie and injects <code>Authorization: Bearer &lt;token&gt;</code> on every outbound request",
        "Response interceptor: normalizes error payloads from the backend and handles HTTP error codes (401 → session expired, 403 → forbidden, 404 → not found, 422 → validation error, 500 → server error)",
    ]:
        story.append(Paragraph(item, styles["bullet"]))

    story.append(Paragraph("API Modules", styles["h2"]))
    story += multi_col_table(
        ["Module", "File", "Key Endpoints"],
        [
            ["Auth", "lib/api/auth.ts", "login(), getUser(), logout() — server-side only (uses jose JWT)"],
            ["Fleet", "lib/api/fleet.ts", "getBuses(), addBus(), updateBus(), deleteBus(), createMaintenance(), updateMaintenance(), assignShift(), createMechanic(), getMechanics()"],
            ["Drivers", "lib/api/drivers.ts", "registerDriver(), getAllDrivers(), getDriver(), updateDriver(), deleteDriver(), uploadDriverDocuments(), uploadDriverPicture()"],
            ["Routes", "lib/api/routes.ts", "createRoute(), getAllRoutes(), updateRoute(), deleteRoute()"],
            ["Tickets", "lib/api/tickets.ts", "getAllTicketCatalog(), createTicketEntry(), updateTicketEntry(), deleteTicketEntry()"],
            ["Transactions", "lib/api/transactions.ts", "getTransactionOrders(), getTransactionById(), createTransactionOrders()"],
            ["Admin", "lib/api/admin.ts", "registerAdmin(), getAllAdmins(), getAllLoginLogs(), getAllAuditTrails(), getAllRoleMatrix(), updateRoleMatrix(), deactivateAdmin(), activateAdmin(), reassignAdminRole(), revokeAdminInvitation(), resendAdminInvitation()"],
            ["Dashboard", "lib/api/dashboard.ts", "getDashboardOverview() — KPI metrics by time period"],
            ["Notifications", "lib/api/notifications.ts", "Fetch notification history"],
            ["User", "lib/api/user.ts", "User profile utilities"],
        ], styles, col_widths=[CONTENT_W*0.14, CONTENT_W*0.22, CONTENT_W*0.64])

    story.append(Paragraph("File Upload Pattern", styles["h2"]))
    story.append(Paragraph(
        "Document and image uploads use the <code>multipart/form-data</code> encoding. "
        "API functions such as <code>uploadDriverDocuments()</code> and "
        "<code>uploadBusDocuments()</code> accept a FormData object and forward it "
        "directly to the backend. Supported upload types include:", styles["body"]))
    for item in [
        "Driver profile pictures (JPEG/PNG)",
        "Driver licence and certification documents (PDF/JPEG)",
        "Bus registration and compliance documents",
        "Incident report attachments",
    ]:
        story.append(Paragraph(item, styles["bullet"]))

    story.append(Paragraph("Pagination & Filtering", styles["h2"]))
    story.append(Paragraph(
        "List endpoints consistently accept query parameters for server-side "
        "pagination and filtering:", styles["body"]))
    story += multi_col_table(
        ["Parameter", "Type", "Description"],
        [
            ["page", "number", "Current page index (1-based)"],
            ["limit", "number", "Number of records per page"],
            ["search", "string", "Full-text search across relevant fields"],
            ["status", "string", "Filter by entity status (active/inactive/pending)"],
            ["startDate / endDate", "ISO date string", "Date range filter for time-bounded queries"],
        ], styles, col_widths=[CONTENT_W*0.22, CONTENT_W*0.14, CONTENT_W*0.64])

    story.append(Paragraph("Error Handling Convention", styles["h2"]))
    story.append(Paragraph(
        "All API calls are wrapped in try/catch blocks. On error, the Axios response "
        "interceptor normalizes the error message. Components display errors via "
        "Sonner toast notifications. Backend validation errors (HTTP 422) expose "
        "per-field messages that are mapped to form error states.", styles["body"]))
    story.append(PageBreak())

    # ── Section 7: Auth & Authorization ──────────────────────────────────────
    story += section_banner("7. Authentication & Authorization", styles)

    story.append(Paragraph("Authentication Flow", styles["h2"]))
    flow_text = """\
1. Admin navigates to /login
2. Submits credentials (email + password)
3. Client calls → POST /auth/login (via lib/api/auth.ts)
4. Backend returns { token, user, profile }
5. Server action signs a JWT using jose (HS256, JWT_SECRET)
6. Two cookies are set:
   • auth_token      → HttpOnly, secure, sameSite:lax  (1 day)
   • auth_token_client → readable, sameSite:lax         (1 day)
7. Zustand authStore.setUser({ user, profile }) is called
8. Admin is redirected to / (Dashboard)

On every protected page load:
9.  AuthProvider calls getUser()
10. getUser() reads auth_token cookie, verifies JWT
11. On success → session valid, page renders
12. On failure → cookies cleared, redirect to /login"""
    story += code_block(flow_text, styles)

    story.append(Paragraph("Session Token Architecture", styles["h2"]))
    story += multi_col_table(
        ["Cookie", "Accessible By", "Purpose"],
        [
            ["auth_token", "Server only (HttpOnly)", "Used by server-side getUser() for JWT verification; inaccessible to JavaScript"],
            ["auth_token_client", "Client JavaScript", "Read by Axios request interceptor to inject Bearer token into API requests"],
        ], styles, col_widths=[CONTENT_W*0.22, CONTENT_W*0.20, CONTENT_W*0.58])

    story.append(Paragraph("Role-Based Authorization", styles["h2"]))
    story.append(Paragraph(
        "The system uses a backend-enforced role-based access control (RBAC) model. "
        "The Admin UI provides a visual management interface for the permission matrix "
        "but does not perform client-side enforcement — all authorization decisions "
        "are made by the backend API.", styles["body"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Roles", styles["h3"]))
    for role in [
        "<b>superAdmin</b>: Full system access including permission matrix management",
        "<b>admin</b>: General administrative access to operational modules",
        "<b>operationsAdmin</b>: Access to fleet, routes, and driver management",
        "<b>supportStaff</b>: Read-only or limited-write access to tickets and transactions",
    ]:
        story.append(Paragraph(role, styles["bullet"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Permission Matrix Structure", styles["h3"]))
    story.append(Paragraph(
        "The matrix is a three-dimensional mapping: <b>Role × Menu Item × Action → Boolean</b>. "
        "It is stored in the backend database and fetched via <code>getAllRoleMatrix()</code>. "
        "Admins with appropriate permissions can toggle individual cells and persist "
        "changes via <code>updateRoleMatrix(records)</code>.", styles["body"]))
    story.append(PageBreak())

    # ── Section 8: State Management ───────────────────────────────────────────
    story += section_banner("8. State Management", styles)

    story.append(Paragraph("Zustand Auth Store", styles["h2"]))
    story.append(Paragraph(
        "Global application state is minimal. The primary global store is "
        "<b>lib/stores/authStore.ts</b>, implemented with Zustand and the "
        "persistence middleware:", styles["body"]))
    store_text = """\
interface AuthState {
  user: UserData | null;          // { user: User, profile: Profile }
  _hasHydrated: boolean;          // True after localStorage rehydration
  setUser: (user: UserData) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

// Persisted to localStorage key: "auth-user"
// Only the 'user' field is persisted across page refreshes"""
    story += code_block(store_text, styles)

    story.append(Paragraph(
        "The <code>_hasHydrated</code> flag prevents flash-of-unauthenticated-content "
        "by allowing components to defer rendering until the persisted state has been "
        "loaded from localStorage.", styles["body"]))

    story.append(Paragraph("Local Component State", styles["h2"]))
    story.append(Paragraph(
        "All other state is managed locally within components using React's "
        "<code>useState</code> and <code>useCallback</code> hooks:", styles["body"]))
    for item in [
        "List filters, search query, and pagination index in list components",
        "Form field values and validation errors in form components",
        "Modal open/close state in parent page components",
        "Loading and error flags for async data fetch operations",
        "Selected row/entity for detail or edit operations",
    ]:
        story.append(Paragraph(item, styles["bullet"]))

    story.append(Paragraph("Data Fetching Pattern", styles["h2"]))
    fetch_text = """\
// Typical data fetch pattern used across the application
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const res = await apiModule.getAll({ page, limit, search });
    setData(res.data);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
}, [page, limit, search]);

useEffect(() => { fetchData(); }, [fetchData]);"""
    story += code_block(fetch_text, styles)
    story.append(PageBreak())

    # ── Section 9: Real-Time Features ─────────────────────────────────────────
    story += section_banner("9. Real-Time Features", styles)

    story.append(Paragraph("WebSocket Notification System", styles["h2"]))
    story.append(Paragraph(
        "The application maintains a persistent WebSocket connection using Socket.io "
        "to receive real-time notifications from the backend. This is implemented "
        "via a custom hook at <b>lib/hooks/useNotificationSocket.ts</b>.",
        styles["body"]))

    story.append(Paragraph("Connection Configuration", styles["h3"]))
    story += multi_col_table(
        ["Setting", "Value"],
        [
            ["Server URL", "NEXT_PUBLIC_API_BASE_URL (same as REST API)"],
            ["Transport", "WebSocket only (no long-polling fallback)"],
            ["Authentication", "JWT token passed in Socket.io handshake auth object"],
            ["Reconnection attempts", "5 (then gives up)"],
            ["Event subscribed", "notification:new"],
        ], styles, col_widths=[CONTENT_W*0.35, CONTENT_W*0.65])

    story.append(Paragraph("Usage", styles["h3"]))
    socket_text = """\
// lib/hooks/useNotificationSocket.ts
const socket = io(baseUrl, {
  auth: { token },           // JWT from auth_token_client cookie
  transports: ["websocket"],
  reconnectionAttempts: 5,
});

socket.on("notification:new", (notification: Notification) => {
  onNewNotification(notification);   // callback updates topbar badge
});

// Component usage (Topbar)
useNotificationSocket({
  token,
  onNewNotification: (n) => setNotifications(prev => [n, ...prev]),
});"""
    story += code_block(socket_text, styles)

    story.append(Paragraph("Notification Types", styles["h2"]))
    story.append(Paragraph(
        "Notifications are displayed in the Topbar notification modal and may include:",
        styles["body"]))
    for item in [
        "Fleet alerts (maintenance overdue, bus offline)",
        "Driver incident reports filed",
        "Refund requests requiring attention",
        "System-level administrative alerts",
        "Shift assignment confirmations",
    ]:
        story.append(Paragraph(item, styles["bullet"]))
    story.append(PageBreak())

    # ── Section 10: Key Features ───────────────────────────────────────────────
    story += section_banner("10. Key Features", styles)

    story += multi_col_table(
        ["Feature", "Module", "Details"],
        [
            ["Dashboard Analytics", "Dashboard (/)", "KPI cards (ridership, sales, revenue, validations) with period comparison; bus operations table; real-time alert sidebar"],
            ["Fleet Management", "Manage Buses", "CRUD operations for buses; route assignment; bus type & accessibility configuration; status tracking (online/offline); document uploads"],
            ["Maintenance Tracking", "Manage Buses", "Log maintenance events with type, date, notes, and cost; assign mechanics; view full maintenance history per bus"],
            ["Driver Management", "Manage Drivers", "Driver registration with staff ID; profile documents and picture upload; shift assignment to bus/route; incident reporting with attachments"],
            ["Route Management", "Manage Routes", "Create routes with ordered stops, inter-stop distances, and estimated travel time; schedule management per route"],
            ["Ticket Catalog", "Tickets", "Define ticket types by rider category (adult, student, senior), route applicability, price, and validity period"],
            ["Transaction History", "Tickets", "View all payment transactions with status (completed, pending, failed); search and date filter; downloadable receipt"],
            ["Refund Processing", "Tickets", "Review refund requests; approve or reject with written justification; configure automatic refund rules"],
            ["Admin Management", "Permissions", "Register new admins via direct creation or invitation email; activate/deactivate accounts; reassign roles"],
            ["Permission Matrix", "Permissions", "Interactive grid editor mapping roles to menu-item/action combinations; changes saved immediately to backend"],
            ["Audit Logs", "Permissions", "Immutable log of all admin actions with actor identity, action type, timestamp, and affected resource"],
            ["Login Logs", "Permissions", "Login history for all admin accounts including IP address, device, timestamp, and role at time of login"],
            ["Real-Time Notifications", "Topbar", "Socket.io-driven notification badge and modal for instant operational alerts"],
            ["Responsive Design", "All", "Mobile-first layout; collapsible sidebar on small screens; adaptive data grids"],
        ], styles, col_widths=[CONTENT_W*0.22, CONTENT_W*0.16, CONTENT_W*0.62])
    story.append(PageBreak())

    # ── Section 11: Data Types & Models ───────────────────────────────────────
    story += section_banner("11. Data Types & Models", styles)

    story.append(Paragraph("Auth Types (lib/types/auth.ts)", styles["h2"]))
    auth_types = """\
interface User {
  id: string;
  email: string;
  role: "superAdmin" | "admin" | "operationsAdmin" | "supportStaff";
  isActive: boolean;
  createdAt: string;
}

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

interface UserData { user: User; profile: Profile; }"""
    story += code_block(auth_types, styles)

    story.append(Paragraph("Bus Types (lib/types/buses.ts)", styles["h2"]))
    bus_types = """\
interface Bus {
  id: string;
  trackingId: string;
  busNumber: string;
  routeId: string;
  type: "standard" | "articulated" | "minibus";
  isAccessible: boolean;
  status: "active" | "inactive" | "maintenance";
  documents: BusDocument[];
}

interface Maintenance {
  id: string;
  busId: string;
  type: string;
  date: string;
  notes: string;
  cost: number;
  mechanicId: string;
}

interface Mechanic {
  id: string;
  name: string;
  phone: string;
  email: string;
}"""
    story += code_block(bus_types, styles)

    story.append(Paragraph("Driver Types (lib/types/drivers.ts)", styles["h2"]))
    driver_types = """\
interface Driver {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  routeId?: string;
  status: "active" | "inactive" | "suspended";
  profilePictureUrl?: string;
  documents: DriverDocument[];
  incidents: Incident[];
}"""
    story += code_block(driver_types, styles)

    story.append(Paragraph("Route Types (lib/types/routes.ts)", styles["h2"]))
    route_types = """\
interface Route {
  id: string;
  name: string;
  stops: Stop[];
  estimatedDuration: number;   // minutes
  createdAt: string;
}

interface Stop {
  name: string;
  order: number;
  distanceFromPrevious: number; // km
}

interface Schedule {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  days: string[];
}"""
    story += code_block(route_types, styles)

    story.append(Paragraph("Ticket & Transaction Types (lib/types/tickets.ts)", styles["h2"]))
    ticket_types = """\
interface TicketCatalogEntry {
  id: string;
  name: string;
  riderType: "adult" | "student" | "senior" | "child";
  routeId?: string;
  price: number;
  validityDays?: number;
  type: "single" | "pass";
  isActive: boolean;
}

interface Transaction {
  id: string;
  ticketId: string;
  userId: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  createdAt: string;
  receiptUrl?: string;
}"""
    story += code_block(ticket_types, styles)

    story.append(Paragraph("Permissions Types (lib/types/permissions.ts)", styles["h2"]))
    perm_types = """\
interface AdminUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  inviteStatus?: "pending" | "accepted";
  createdAt: string;
}

interface RoleMatrixRecord {
  roleId: string;
  menuItemId: string;
  actionId: string;
  hasPermission: boolean;
}

interface AuditTrail {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
}"""
    story += code_block(perm_types, styles)
    story.append(PageBreak())

    # ── Section 12: Configuration ──────────────────────────────────────────────
    story += section_banner("12. Configuration & Environment", styles)

    story.append(Paragraph("Environment Variables", styles["h2"]))
    story += multi_col_table(
        ["Variable", "Required", "Description"],
        [
            ["NEXT_PUBLIC_API_BASE_URL", "Yes", "Base URL for the backend REST API and WebSocket server (e.g. https://api.grandlakemunicipality.ca/api/v1/)"],
            ["JWT_SECRET", "Yes (server-side)", "Hex-encoded secret used by jose to sign and verify session JWTs. Must be at least 256 bits."],
            ["NODE_TLS_REJECT_UNAUTHORIZED", "Dev only", "Set to 0 in development environments with self-signed certificates. Must NOT be set in production."],
        ], styles, col_widths=[CONTENT_W*0.30, CONTENT_W*0.12, CONTENT_W*0.58])

    story.append(Paragraph("Next.js Configuration (next.config.ts)", styles["h2"]))
    next_config = """\
// Configured remote image patterns for Next.js Image Optimization:
remotePatterns: [
  { hostname: "picsum.photos" },
  { hostname: "api-dev.grandlakemunicipality.ca" },
  { hostname: "*.digitaloceanspaces.com" },
]"""
    story += code_block(next_config, styles)

    story.append(Paragraph("TypeScript Configuration (tsconfig.json)", styles["h2"]))
    story += multi_col_table(
        ["Setting", "Value"],
        [
            ["target", "ES2017"],
            ["strict", "true (full strict mode)"],
            ["moduleResolution", "bundler"],
            ["Path alias @/*", "Root directory — import @/lib/api/auth resolves from project root"],
            ["jsx", "preserve (Next.js handles JSX transform)"],
        ], styles, col_widths=[CONTENT_W*0.30, CONTENT_W*0.70])
    story.append(PageBreak())

    # ── Section 13: Styling & Design System ───────────────────────────────────
    story += section_banner("13. Styling & Design System", styles)

    story.append(Paragraph("CSS Variable Theme", styles["h2"]))
    story.append(Paragraph(
        "The application uses a token-based CSS variable system defined in "
        "<b>app/globals.css</b>. All components reference these variables, "
        "enabling consistent theming and straightforward dark mode support.",
        styles["body"]))
    story += multi_col_table(
        ["Token Group", "Variables", "Purpose"],
        [
            ["Brand", "--color-brand-primary (#40843c), --color-brand-dark (#2d6b2a)", "Primary green brand color and darker variant for hover/focus states"],
            ["Content", "--color-content-primary, --color-content-secondary, --color-content-tertiary", "Text color hierarchy from high-contrast to muted"],
            ["Surface", "--color-surface-primary, --color-surface-secondary, --color-surface-elevated", "Background layer colors for cards, modals, and page backgrounds"],
            ["Status", "--color-error-*, --color-warning-*, --color-info-*, --color-success-*", "Semantic color groups for feedback states"],
            ["Border", "--color-border-default, --color-border-strong", "Stroke colors for dividers and component borders"],
        ], styles, col_widths=[CONTENT_W*0.16, CONTENT_W*0.38, CONTENT_W*0.46])

    story.append(Paragraph("Typography", styles["h2"]))
    story += multi_col_table(
        ["Font", "Usage", "Loading"],
        [
            ["Work Sans", "Primary UI font — headings, labels, body text", "next/font/google, variable font, preloaded"],
            ["Inter", "Secondary UI font — data tables, code-adjacent text", "next/font/google, variable font, preloaded"],
            ["Geist", "Tertiary / monospace alternative", "next/font/google"],
        ], styles, col_widths=[CONTENT_W*0.20, CONTENT_W*0.50, CONTENT_W*0.30])

    story.append(Paragraph("Responsive Breakpoints (TailwindCSS defaults)", styles["h2"]))
    story += multi_col_table(
        ["Breakpoint", "Min Width", "Typical Use"],
        [
            ["sm", "640px", "Compact single-column layouts, small modal widths"],
            ["md", "768px", "Two-column grid layouts, visible sidebar toggle"],
            ["lg", "1024px", "Full sidebar always visible, multi-column grids"],
            ["xl", "1280px", "Wider content areas, additional data table columns"],
        ], styles, col_widths=[CONTENT_W*0.20, CONTENT_W*0.20, CONTENT_W*0.60])

    story.append(Paragraph("Utility Composition Pattern", styles["h2"]))
    cn_text = """\
// lib/utils/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in components:
<button className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  disabled && "disabled-classes",
  className  // allow external override
)} />"""
    story += code_block(cn_text, styles)
    story.append(PageBreak())

    # ── Section 14: Developer Guide ────────────────────────────────────────────
    story += section_banner("14. Developer Guide", styles)

    story.append(Paragraph("Prerequisites", styles["h2"]))
    story += multi_col_table(
        ["Requirement", "Version", "Notes"],
        [
            ["Node.js", "18+ LTS", "Required for Next.js 16 and React 19"],
            ["npm / yarn / pnpm", "Latest", "Package manager of choice"],
            ["Git", "Any", "Source control"],
            ["GLK Transit API", "Running instance", "Either local or pointing to staging/production via NEXT_PUBLIC_API_BASE_URL"],
        ], styles, col_widths=[CONTENT_W*0.22, CONTENT_W*0.14, CONTENT_W*0.64])

    story.append(Paragraph("Local Development Setup", styles["h2"]))
    setup_text = """\
# 1. Clone the repository
git clone <repository-url>
cd glktransit-admin-ui

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env:
#   NEXT_PUBLIC_API_BASE_URL=https://api.grandlakemunicipality.ca/api/v1/
#   JWT_SECRET=<your-256-bit-hex-secret>
#   NODE_TLS_REJECT_UNAUTHORIZED=0   # dev only

# 4. Start development server
npm run dev
# App available at http://localhost:3000"""
    story += code_block(setup_text, styles)

    story.append(Paragraph("Available Scripts", styles["h2"]))
    story += multi_col_table(
        ["Script", "Command", "Description"],
        [
            ["Development", "npm run dev", "Start Next.js dev server with hot reload on http://localhost:3000"],
            ["Build", "npm run build", "Compile and optimize for production"],
            ["Start", "npm run start", "Serve the production build locally"],
            ["Lint", "npm run lint", "Run ESLint across the codebase"],
        ], styles, col_widths=[CONTENT_W*0.18, CONTENT_W*0.22, CONTENT_W*0.60])

    story.append(Paragraph("Adding a New Feature Module", styles["h2"]))
    story.append(Paragraph(
        "Follow these conventions when adding a new feature area:", styles["body"]))
    for step in [
        "Create a new page at <code>app/(main)/&lt;feature-name&gt;/page.tsx</code>",
        "Add navigation link to <code>components/sidebar.tsx</code>",
        "Create feature components in <code>components/&lt;feature-name&gt;/</code>",
        "Add typed API functions in <code>lib/api/&lt;feature&gt;.ts</code>",
        "Add TypeScript interfaces in <code>lib/types/&lt;feature&gt;.ts</code> and export from <code>lib/types/index.ts</code>",
        "Use the <code>cn()</code> utility for all dynamic class composition",
        "Display all async errors with <code>toast.error()</code> (Sonner)",
        "Use async/await with try/catch — do not use .then() chains",
    ]:
        story.append(Paragraph(step, styles["bullet"]))

    story.append(Paragraph("Code Conventions", styles["h2"]))
    story += multi_col_table(
        ["Convention", "Detail"],
        [
            ["Client components", "Add 'use client' directive at the top of any component using hooks, browser APIs, or event handlers"],
            ["Server functions", "Authentication utilities in lib/api/auth.ts use 'use server' and run exclusively in the Node.js runtime"],
            ["Async data fetching", "Use useCallback + useEffect pattern; always handle loading and error states"],
            ["Search debouncing", "Debounce user search inputs at 400ms before triggering API calls"],
            ["Error feedback", "All user-facing errors displayed via Sonner toast, never alert() or console.log() only"],
            ["Modal pattern", "Modals controlled by parent-level isOpen boolean state; callbacks for onClose and onSuccess"],
            ["Icon imports", "Prefer Lucide React for consistency; Hugeicons for specialized icons listed in components.json"],
        ], styles, col_widths=[CONTENT_W*0.28, CONTENT_W*0.72])
    story.append(PageBreak())

    # ── Section 15: Security ───────────────────────────────────────────────────
    story += section_banner("15. Security Considerations", styles)

    story.append(Paragraph("Session Security", styles["h2"]))
    for item in [
        "<b>HttpOnly cookies</b>: The primary <code>auth_token</code> cookie is HttpOnly, preventing JavaScript access and mitigating XSS-based token theft.",
        "<b>Short-lived sessions</b>: JWT tokens expire after 24 hours, limiting the window of exposure for stolen tokens.",
        "<b>Secure flag</b>: Both session cookies are marked <code>secure: true</code> in production, ensuring they are only transmitted over HTTPS.",
        "<b>SameSite: Lax</b>: Provides protection against most CSRF attacks while allowing top-level navigation.",
    ]:
        story.append(Paragraph(item, styles["bullet"]))

    story.append(Paragraph("Backend Authorization", styles["h2"]))
    story.append(Paragraph(
        "The Admin UI relies entirely on the backend API for authorization enforcement. "
        "Every API request carries the Bearer token and the backend validates permissions "
        "server-side for each operation. The client-side permission matrix UI is "
        "informational only and does not gate access in the browser.",
        styles["body"]))

    story.append(Paragraph("Production Checklist", styles["h2"]))
    story += multi_col_table(
        ["Item", "Status / Action Required"],
        [
            ["TLS certificate", "Ensure HTTPS is enforced; remove NODE_TLS_REJECT_UNAUTHORIZED=0"],
            ["JWT_SECRET strength", "Use a cryptographically random 256-bit (32-byte) hex secret; rotate periodically"],
            ["API base URL", "Must be HTTPS in production"],
            ["CORS policy", "Backend must restrict allowed origins to the deployed Admin UI domain"],
            ["Content Security Policy", "Add CSP headers via Next.js middleware to restrict script/style sources"],
            ["Dependency audit", "Run npm audit before each production deployment"],
            ["Error logging", "Integrate a server-side error tracking service (e.g. Sentry) for production visibility"],
        ], styles, col_widths=[CONTENT_W*0.32, CONTENT_W*0.68])

    story.append(Paragraph("Known Limitations", styles["h2"]))
    for item in [
        "Client-side RBAC is not enforced — UI elements are not hidden by role; the backend API must enforce all access control.",
        "The <code>NODE_TLS_REJECT_UNAUTHORIZED=0</code> setting in <code>.env</code> must be removed before production deployment.",
        "Pass Management feature is present in the UI but disabled pending full backend implementation.",
        "The search bar in the Topbar is a UI placeholder with no connected search functionality at this time.",
    ]:
        story.append(Paragraph(item, styles["bullet"]))
    story.append(PageBreak())

    # ── Section 16: Appendix ──────────────────────────────────────────────────
    story += section_banner("16. Appendix", styles)

    story.append(Paragraph("A. Complete Dependency List", styles["h2"]))
    story += multi_col_table(
        ["Package", "Version", "Category"],
        [
            ["next", "16.2.1", "Framework"],
            ["react", "19.2.4", "Framework"],
            ["react-dom", "19.2.4", "Framework"],
            ["typescript", "5.x", "Language"],
            ["tailwindcss", "4.x", "Styling"],
            ["@base-ui-components/react", "1.3.0", "UI"],
            ["class-variance-authority", "latest", "UI"],
            ["tailwind-merge", "latest", "UI"],
            ["clsx", "latest", "UI"],
            ["lucide-react", "latest", "Icons"],
            ["@hugeicons/react", "latest", "Icons"],
            ["tw-animate-css", "latest", "Animation"],
            ["axios", "1.14.0", "HTTP"],
            ["socket.io-client", "4.8.3", "WebSocket"],
            ["zustand", "5.0.12", "State"],
            ["jose", "latest", "Auth"],
            ["sonner", "2.0.7", "Notifications"],
            ["react-phone-number-input", "3.4.16", "Forms"],
            ["eslint", "9.x", "DevTools"],
            ["postcss", "4.x", "DevTools"],
        ], styles, col_widths=[CONTENT_W*0.40, CONTENT_W*0.18, CONTENT_W*0.42])

    story.append(Paragraph("B. API Error Codes", styles["h2"]))
    story += multi_col_table(
        ["HTTP Status", "Meaning", "Admin UI Behavior"],
        [
            ["200 OK", "Success", "Data rendered; success toast on mutations"],
            ["201 Created", "Resource created", "Success toast; list refreshed"],
            ["400 Bad Request", "Invalid request payload", "Error toast with message from backend"],
            ["401 Unauthorized", "Token invalid/expired", "Session cleared; redirect to /login"],
            ["403 Forbidden", "Insufficient permissions", "Error toast; no redirect"],
            ["404 Not Found", "Resource does not exist", "Error toast"],
            ["422 Unprocessable Entity", "Validation failure", "Field-level error messages displayed in form"],
            ["500 Internal Server Error", "Backend error", "Generic error toast"],
        ], styles, col_widths=[CONTENT_W*0.18, CONTENT_W*0.24, CONTENT_W*0.58])

    story.append(Paragraph("C. External Services", styles["h2"]))
    story += multi_col_table(
        ["Service", "Purpose", "Configuration"],
        [
            ["Grand Lake Transit API", "Primary REST + WebSocket backend", "NEXT_PUBLIC_API_BASE_URL"],
            ["DigitalOcean Spaces", "Static asset storage (bus/driver documents, images)", "Configured as Next.js remote image hostname"],
            ["picsum.photos", "Placeholder images in development", "Configured as Next.js remote image hostname"],
        ], styles, col_widths=[CONTENT_W*0.25, CONTENT_W*0.38, CONTENT_W*0.37])

    story.append(Paragraph("D. Glossary", styles["h2"]))
    story += multi_col_table(
        ["Term", "Definition"],
        [
            ["App Router", "Next.js 13+ routing system based on the file system within the app/ directory"],
            ["AuthProvider", "React component that guards protected routes by validating the user session"],
            ["RBAC", "Role-Based Access Control — restricts system access based on assigned user roles"],
            ["Permission Matrix", "Three-dimensional mapping (Role × Menu Item × Action) that defines access rights"],
            ["Zustand", "Lightweight React state management library with persistence middleware support"],
            ["jose", "JavaScript library for JSON Web Token (JWT) signing and verification in Node.js"],
            ["Socket.io", "Library enabling real-time bidirectional event-based communication over WebSockets"],
            ["shadcn/ui", "Open-source component collection built on Radix UI primitives with Tailwind styling"],
            ["CVA", "Class Variance Authority — utility for defining component style variants"],
            ["Sonner", "Toast notification library for React with a clean accessible API"],
            ["KPI", "Key Performance Indicator — dashboard summary metrics (ridership, revenue, etc.)"],
            ["Audit Trail", "Immutable, timestamped log of administrative actions for compliance and accountability"],
        ], styles, col_widths=[CONTENT_W*0.25, CONTENT_W*0.75])

    story.append(Spacer(1, 20))
    story.append(divider())
    story.append(Paragraph(
        f"Document generated on {datetime.now().strftime('%B %d, %Y')}  •  "
        "Grand Lake Municipality — Transit Operations Division  •  "
        "GLK Transit Admin UI v0.1.0",
        styles["caption"]))

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(
        story,
        onFirstPage=cover_page,
        canvasmaker=NumberedCanvas,
    )
    print(f"PDF generated: {os.path.abspath(OUTPUT_PATH)}")


if __name__ == "__main__":
    build_pdf()
