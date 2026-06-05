"""
GLK Transit Admin UI — Product Overview PDF (non-technical, user-facing)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, Image
)
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# ── Brand palette ─────────────────────────────────────────────────────────────
GREEN        = colors.HexColor("#40843c")
GREEN_DARK   = colors.HexColor("#2d6b2a")
GREEN_PALE   = colors.HexColor("#e8f5e2")
GREEN_MID    = colors.HexColor("#c5e0c3")
DARK         = colors.HexColor("#1a1a1a")
GRAY_700     = colors.HexColor("#374151")
GRAY_500     = colors.HexColor("#6b7280")
GRAY_300     = colors.HexColor("#d1d5db")
GRAY_100     = colors.HexColor("#f3f4f6")
AMBER        = colors.HexColor("#f59e0b")
AMBER_BG     = colors.HexColor("#fffbeb")
BLUE         = colors.HexColor("#3b82f6")
BLUE_BG      = colors.HexColor("#eff6ff")
WHITE        = colors.white

PAGE_W, PAGE_H = A4
ML = 2.4 * cm
MR = 2.4 * cm
MT = 2.4 * cm
MB = 2.4 * cm
CW = PAGE_W - ML - MR

LOGO_PATH   = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "logo.png")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "GLK_Transit_Admin_UI_Product_Overview.pdf")


# ── Page canvas with footer ────────────────────────────────────────────────────
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
            if i > 0:
                self._draw_footer(i + 1, total)
            super().showPage()
        super().save()

    def _draw_footer(self, page, total):
        self.saveState()
        self.setStrokeColor(GREEN)
        self.setLineWidth(0.5)
        self.line(ML, MB - 5 * mm, PAGE_W - MR, MB - 5 * mm)
        self.setFont("Helvetica", 8)
        self.setFillColor(GRAY_500)
        self.drawString(ML, MB - 10 * mm, "GLK Transit Admin UI — Product Overview")
        self.drawRightString(PAGE_W - MR, MB - 10 * mm, f"Page {page} of {total}")
        self.restoreState()


# ── Styles ─────────────────────────────────────────────────────────────────────
def styles():
    def S(name, **kw):
        return ParagraphStyle(name, **kw)

    return {
        "h1": S("h1", fontName="Helvetica-Bold", fontSize=17, textColor=WHITE,
                leading=22, spaceBefore=0, spaceAfter=4),
        "h2": S("h2", fontName="Helvetica-Bold", fontSize=13, textColor=GREEN_DARK,
                leading=17, spaceBefore=16, spaceAfter=5),
        "h3": S("h3", fontName="Helvetica-Bold", fontSize=11, textColor=DARK,
                leading=14, spaceBefore=10, spaceAfter=3),
        "body": S("body", fontName="Helvetica", fontSize=10.5, textColor=GRAY_700,
                  leading=16, spaceBefore=2, spaceAfter=5, alignment=TA_JUSTIFY),
        "bullet": S("bullet", fontName="Helvetica", fontSize=10.5, textColor=GRAY_700,
                    leading=15, leftIndent=16, bulletIndent=4,
                    spaceBefore=2, spaceAfter=2, bulletText="•"),
        "bullet2": S("bullet2", fontName="Helvetica", fontSize=10, textColor=GRAY_500,
                     leading=14, leftIndent=32, bulletIndent=20,
                     spaceBefore=1, spaceAfter=1, bulletText="–"),
        "caption": S("caption", fontName="Helvetica-Oblique", fontSize=8.5,
                     textColor=GRAY_500, alignment=TA_CENTER,
                     spaceBefore=2, spaceAfter=8),
        "table_hdr": S("table_hdr", fontName="Helvetica-Bold", fontSize=9.5,
                       textColor=WHITE, leading=13),
        "table_cell": S("table_cell", fontName="Helvetica", fontSize=9.5,
                        textColor=GRAY_700, leading=13),
        "tag": S("tag", fontName="Helvetica-Bold", fontSize=9, textColor=GREEN_DARK,
                 leading=12, alignment=TA_CENTER),
        "intro": S("intro", fontName="Helvetica", fontSize=11.5, textColor=GRAY_700,
                   leading=17, spaceBefore=4, spaceAfter=6, alignment=TA_JUSTIFY),
        "toc": S("toc", fontName="Helvetica", fontSize=11, textColor=GRAY_700,
                 leading=18),
        "toc_bold": S("toc_bold", fontName="Helvetica-Bold", fontSize=11,
                      textColor=DARK, leading=18),
        "callout_body": S("callout_body", fontName="Helvetica", fontSize=10,
                          textColor=GRAY_700, leading=15),
    }


# ── Reusable helpers ───────────────────────────────────────────────────────────
def banner(title, st):
    t = Table([[Paragraph(title, st["h1"])]], colWidths=[CW])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), GREEN),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return [t, Spacer(1, 10)]


def feature_card(icon_char, title, body_lines, st, accent=GREEN):
    """A rounded card with an icon column and text column."""
    icon_cell = Paragraph(f'<font color="#{accent.hexval()[2:]}">{icon_char}</font>',
                          ParagraphStyle("icon", fontName="Helvetica-Bold",
                                         fontSize=22, textColor=accent,
                                         leading=26, alignment=TA_CENTER))
    title_para = Paragraph(f"<b>{title}</b>",
                           ParagraphStyle("ft", fontName="Helvetica-Bold",
                                          fontSize=11, textColor=DARK, leading=14,
                                          spaceAfter=4))
    body_paras = [title_para]
    for line in body_lines:
        body_paras.append(Paragraph(line, st["callout_body"]))

    from reportlab.platypus import KeepInFrame
    inner = Table([[p] for p in body_paras], colWidths=[CW * 0.78])
    inner.setStyle(TableStyle([
        ("LEFTPADDING",   (0, 0), (-1, -1), 0),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 0),
        ("TOPPADDING",    (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))

    card = Table([[icon_cell, inner]],
                 colWidths=[CW * 0.10, CW * 0.86])
    card.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), GREEN_PALE),
        ("ROUNDEDCORNERS",(0, 0), (-1, -1), [8, 8, 8, 8]),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("TOPPADDING",    (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    return [card, Spacer(1, 8)]


def two_col_table(rows, st, col_w=None):
    if col_w is None:
        col_w = [CW * 0.30, CW * 0.70]
    data = []
    for i, (a, b) in enumerate(rows):
        style = st["table_hdr"] if i == 0 else st["table_cell"]
        data.append([Paragraph(a, style), Paragraph(b, style)])
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), GREEN),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, GRAY_100]),
        ("GRID",          (0, 0), (-1, -1), 0.4, GRAY_300),
        ("LEFTPADDING",   (0, 0), (-1, -1), 9),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 9),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    return [t, Spacer(1, 10)]


def multi_table(headers, rows, st, col_ws=None):
    if col_ws is None:
        col_ws = [CW / len(headers)] * len(headers)
    data = [[Paragraph(h, st["table_hdr"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), st["table_cell"]) for c in row])
    t = Table(data, colWidths=col_ws, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), GREEN),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, GRAY_100]),
        ("GRID",          (0, 0), (-1, -1), 0.4, GRAY_300),
        ("LEFTPADDING",   (0, 0), (-1, -1), 9),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 9),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    return [t, Spacer(1, 10)]


def callout(text, st, bg=BLUE_BG, border=BLUE):
    t = Table([[Paragraph(text, st["callout_body"])]], colWidths=[CW])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), bg),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("TOPPADDING",    (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEAFTER",     (0, 0), (0, -1), 4, border),
    ]))
    return [t, Spacer(1, 8)]


def divider():
    return HRFlowable(width="100%", thickness=0.5, color=GRAY_300,
                      spaceAfter=6, spaceBefore=4)


# ── Cover ──────────────────────────────────────────────────────────────────────
def cover_page(c, doc):
    c.saveState()
    w, h = PAGE_W, PAGE_H

    # Dark background
    c.setFillColor(DARK)
    c.rect(0, 0, w, h, fill=1, stroke=0)

    # Left accent bar
    c.setFillColor(GREEN)
    c.rect(0, 0, 1.2 * cm, h, fill=1, stroke=0)

    # Bottom band
    c.setFillColor(GREEN)
    c.rect(0, 0, w, 2.5 * cm, fill=1, stroke=0)

    # Logo
    if os.path.exists(LOGO_PATH):
        try:
            c.drawImage(LOGO_PATH, 2 * cm, h - 3.5 * cm,
                        width=3.5 * cm, height=1.8 * cm,
                        preserveAspectRatio=True, mask="auto")
        except Exception:
            pass

    # Divider under logo
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    c.line(2 * cm, h - 3.9 * cm, w - 2 * cm, h - 3.9 * cm)

    # Main title
    c.setFont("Helvetica-Bold", 34)
    c.setFillColor(WHITE)
    c.drawString(2 * cm, h * 0.53, "GLK Transit")
    c.drawString(2 * cm, h * 0.53 - 2.3 * cm, "Admin Portal")

    # Subtitle
    c.setFont("Helvetica", 15)
    c.setFillColor(GREEN_MID)
    c.drawString(2 * cm, h * 0.53 - 3.7 * cm, "Product Overview & User Guide")

    # Rule
    c.setStrokeColor(GREEN_MID)
    c.setLineWidth(0.7)
    c.line(2 * cm, h * 0.53 - 4.3 * cm, 11 * cm, h * 0.53 - 4.3 * cm)

    # Meta
    meta = [
        ("Prepared for", "Grand Lake Municipality — Transit Operations Division"),
        ("Version", "1.0"),
        ("Date", datetime.now().strftime("%B %d, %Y")),
        ("Classification", "Internal Use"),
    ]
    y = h * 0.53 - 5.1 * cm
    for label, val in meta:
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(GREEN_MID)
        c.drawString(2 * cm, y, label + ":")
        c.setFont("Helvetica", 9)
        c.setFillColor(GRAY_300)
        c.drawString(6 * cm, y, val)
        y -= 0.6 * cm

    # Bottom text
    c.setFont("Helvetica", 9)
    c.setFillColor(WHITE)
    c.drawString(2 * cm, 0.9 * cm,
                 "Grand Lake Municipality — Transit Operations Division")
    c.setFillColor(GREEN_MID)
    c.drawRightString(w - 2 * cm, 0.9 * cm, "Confidential — Internal Use Only")

    c.restoreState()


# ── Main build ─────────────────────────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=ML, rightMargin=MR, topMargin=MT,
        bottomMargin=MB + 1.2 * cm,
        title="GLK Transit Admin UI — Product Overview",
        author="Grand Lake Municipality",
        subject="Product Overview",
    )

    st = styles()
    story = []

    # Cover placeholder
    story.append(PageBreak())

    # ── Table of Contents ─────────────────────────────────────────────────────
    story += banner("Table of Contents", st)
    toc_items = [
        ("1.", "About the GLK Transit Admin Portal"),
        ("2.", "Who Uses This System"),
        ("3.", "How to Access the Portal"),
        ("4.", "Dashboard — Your Command Centre"),
        ("5.", "Bus & Fleet Management"),
        ("6.", "Driver & Staff Management"),
        ("7.", "Routes & Schedule Management"),
        ("8.", "Tickets & Payment"),
        ("9.", "User Permissions & Admin Management"),
        ("10.", "Notifications"),
        ("11.", "Frequently Asked Questions"),
    ]
    toc_data = [[Paragraph(n, st["toc_bold"]), Paragraph(t, st["toc"])]
                for n, t in toc_items]
    toc_t = Table(toc_data, colWidths=[1.2 * cm, CW - 1.2 * cm])
    toc_t.setStyle(TableStyle([
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS",(0, 0), (-1, -1), [WHITE, GRAY_100]),
        ("LINEBELOW",     (0, 0), (-1, -1), 0.3, GRAY_300),
    ]))
    story += [toc_t, PageBreak()]

    # ── 1. About ──────────────────────────────────────────────────────────────
    story += banner("1. About the GLK Transit Admin Portal", st)
    story.append(Paragraph(
        "The <b>GLK Transit Admin Portal</b> is the central management platform for the "
        "Grand Lake Municipality's public transit system. It gives authorized transit "
        "staff a single, secure web-based workspace to oversee every aspect of daily "
        "bus operations — from tracking vehicles in real time to processing passenger "
        "refunds and managing staff shifts.",
        st["intro"]))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The portal replaces manual, paper-based processes and disconnected "
        "spreadsheets with a live, organized system that keeps every team member "
        "working from the same up-to-date information.",
        st["body"]))

    story.append(Paragraph("What the Portal Does", st["h2"]))
    for item in [
        "Gives a live snapshot of the entire fleet — which buses are running, on which routes, and whether they are on schedule",
        "Manages the complete lifecycle of every bus, from registration and document upload through to maintenance scheduling",
        "Stores driver profiles, work history, and incident records in one place",
        "Defines and publishes transit routes with stops, distances, and departure schedules",
        "Handles the ticket catalog so staff can create, price, and update fare products without contacting a developer",
        "Displays a full history of passenger transactions and supports the processing of refund requests",
        "Controls who inside the municipality has access to which parts of the system, through a role-based permissions model",
        "Records a permanent, tamper-evident log of every administrative action taken in the system",
    ]:
        story.append(Paragraph(item, st["bullet"]))
    story.append(PageBreak())

    # ── 2. Who Uses ───────────────────────────────────────────────────────────
    story += banner("2. Who Uses This System", st)
    story.append(Paragraph(
        "The portal is designed for the internal staff of the Grand Lake Municipality "
        "transit division. Different staff members are assigned different roles, and "
        "each role controls what that person can see and do inside the portal.",
        st["body"]))

    story += multi_table(
        ["Role", "Typical User", "What They Can Do"],
        [
            ["Super Admin",
             "System Administrator",
             "Full access to every part of the portal, including creating other admins and editing the permission matrix"],
            ["Admin",
             "Transit Operations Manager",
             "General administrative access — manages buses, drivers, routes, tickets, and can view logs"],
            ["Operations Admin",
             "Fleet / Scheduling Officer",
             "Focused access to fleet management, route configuration, driver scheduling, and shift assignments"],
            ["Support Staff",
             "Customer Support Agent",
             "Can view transaction history and process passenger refund requests; read-only access to most other areas"],
        ],
        st,
        col_ws=[CW * 0.18, CW * 0.22, CW * 0.60],
    )

    story += callout(
        "<b>Note:</b> The specific pages and actions available to each role are "
        "configured by a Super Admin through the User Permissions section. The table "
        "above describes the default intended use of each role.",
        st, bg=BLUE_BG, border=BLUE)
    story.append(PageBreak())

    # ── 3. Access ─────────────────────────────────────────────────────────────
    story += banner("3. How to Access the Portal", st)

    story.append(Paragraph("Logging In", st["h2"]))
    story.append(Paragraph(
        "The portal is a secure web application. To access it, open a web browser "
        "and navigate to the portal address provided by your system administrator. "
        "You will be presented with a login screen asking for your email address and "
        "password.", st["body"]))

    for step in [
        "Enter the email address associated with your admin account",
        "Enter your password",
        "Click <b>Sign In</b>",
        "You will be taken directly to the Dashboard",
    ]:
        story.append(Paragraph(step, st["bullet"]))

    story.append(Paragraph("Forgot Your Password?", st["h2"]))
    story.append(Paragraph(
        "If you cannot remember your password, click the <b>Forgot Password</b> link "
        "on the login page. Enter your registered email address and follow the "
        "instructions sent to your inbox to set a new password.",
        st["body"]))

    story.append(Paragraph("Logging Out", st["h2"]))
    story.append(Paragraph(
        "To log out, click on your name or profile icon in the top-right corner of "
        "any page, then select <b>Log out</b> from the dropdown menu. Your session "
        "will end and you will be returned to the login screen.",
        st["body"]))

    story += callout(
        "<b>Security reminder:</b> Always log out when you finish your session, "
        "especially on shared computers. Your login session expires automatically "
        "after 24 hours of inactivity.",
        st, bg=AMBER_BG, border=AMBER)
    story.append(PageBreak())

    # ── 4. Dashboard ─────────────────────────────────────────────────────────
    story += banner("4. Dashboard — Your Command Centre", st)
    story.append(Paragraph(
        "After logging in, the first screen you see is the <b>Dashboard</b>. "
        "This is your real-time overview of the entire transit operation. "
        "It is designed to give you the most important information at a glance, "
        "without having to navigate to individual sections.",
        st["body"]))

    story.append(Paragraph("Summary Cards", st["h2"]))
    story.append(Paragraph(
        "Across the top of the Dashboard are four summary cards. Each one shows a "
        "key operational figure for the time period you have selected:",
        st["body"]))

    story += multi_table(
        ["Card", "What it Shows"],
        [
            ["Ridership Summary", "The total number of passengers who have travelled in the selected period"],
            ["Ticket Sales", "The total number of tickets sold in the selected period"],
            ["Ticket Revenues", "The total dollar value of ticket sales in the selected period, in Canadian dollars"],
            ["Ticket Validations", "The number of times a ticket has been scanned or validated on a bus"],
        ],
        st, col_ws=[CW * 0.28, CW * 0.72])

    story.append(Paragraph("Changing the Time Period", st["h3"]))
    story.append(Paragraph(
        "In the top-right corner of the Dashboard there is a period selector button. "
        "Click it to choose between <b>Today</b>, <b>This Week</b>, "
        "<b>This Month</b>, or <b>This Year</b>. All four summary cards will "
        "instantly update to reflect the selected period.",
        st["body"]))

    story.append(Paragraph("Latest Bus Operations Table", st["h2"]))
    story.append(Paragraph(
        "Below the summary cards is a live table showing the most recent activity "
        "for every bus in the fleet. Each row in the table shows:",
        st["body"]))

    story += multi_table(
        ["Column", "Meaning"],
        [
            ["Fleet Number", "The internal identifier of the bus (e.g. T-365)"],
            ["Route Long Name", "The full name of the route the bus is currently assigned to"],
            ["GPS", "Whether the bus's GPS tracker is currently Online or Offline"],
            ["Delay", "Whether the bus is on time, ahead of schedule, or how many minutes behind"],
            ["Status", "Whether the bus is Active (in service) or Inactive"],
        ],
        st, col_ws=[CW * 0.22, CW * 0.78])

    story.append(Paragraph(
        "You can filter the table to show <b>All buses</b>, <b>Active only</b>, "
        "or <b>Inactive only</b> using the tab buttons above the table. "
        "Clicking on any row opens a <b>live map view</b> of that bus's current "
        "location.", st["body"]))

    story.append(Paragraph("Real-Time Alerts", st["h2"]))
    story.append(Paragraph(
        "On the right side of the Dashboard is a live alerts panel. This shows the "
        "most recent operational alerts from the system, such as buses running "
        "significantly behind or ahead of schedule. Alerts are colour-coded: "
        "<b>red</b> for urgent issues and <b>amber</b> for warnings.",
        st["body"]))
    story.append(PageBreak())

    # ── 5. Buses ──────────────────────────────────────────────────────────────
    story += banner("5. Bus & Fleet Management", st)
    story.append(Paragraph(
        "The <b>Bus / Fleet Management</b> section is where transit staff maintain "
        "the registry of every bus in the municipal fleet. All information about "
        "a bus — its identification, assigned route, current status, official "
        "documents, and maintenance history — is stored and managed here.",
        st["body"]))
    story.append(Paragraph("Navigate here via: <b>Manage Buses</b> in the left sidebar.",
                            st["body"]))

    story.append(Paragraph("The Bus List", st["h2"]))
    story.append(Paragraph(
        "The main view is a searchable, paginated table of all registered buses. "
        "You can search by fleet number or tracking ID, and filter by status. "
        "Each row shows the bus number, its assigned route, type, accessibility "
        "status, and whether it is currently active. From the action menu on each "
        "row you can edit the bus details, open its maintenance records, or "
        "permanently remove it from the system.",
        st["body"]))

    story.append(Paragraph("Adding a New Bus", st["h2"]))
    for step in [
        "Click the <b>Add a Bus</b> button in the top-right corner",
        "Fill in the required details: Tracking ID, Bus Number, assigned Route, Bus Type (standard, articulated, or minibus), and whether it has accessibility features",
        "Upload any required official documents (e.g. vehicle registration, compliance certificate)",
        "Click <b>Save</b> to register the bus in the system",
    ]:
        story.append(Paragraph(step, st["bullet"]))

    story.append(Paragraph("Maintenance Management", st["h2"]))
    story.append(Paragraph(
        "The Maintenance area tracks all servicing work performed on each bus. "
        "Click the <b>Maintenance</b> button on the fleet page to access it.",
        st["body"]))

    story += two_col_table([
        ("Action", "What it Does"),
        ("View maintenance records", "See all past and upcoming maintenance events for any bus, with dates, cost, and notes"),
        ("Log a maintenance event", "Record a completed or scheduled service with type, date, cost, notes, and the assigned mechanic"),
        ("Add a mechanic", "Register a new mechanic in the system so they can be assigned to maintenance jobs"),
        ("View maintenance logs", "Browse the full history of all maintenance work across the entire fleet"),
    ], st)
    story.append(PageBreak())

    # ── 6. Drivers ────────────────────────────────────────────────────────────
    story += banner("6. Driver & Staff Management", st)
    story.append(Paragraph(
        "The <b>Driver / Staff Management</b> section is the complete personnel "
        "record system for all bus drivers and relevant staff. It holds each "
        "driver's personal details, employment documents, shift assignments, "
        "and any incident history.",
        st["body"]))
    story.append(Paragraph("Navigate here via: <b>Manage Drivers</b> in the left sidebar.",
                            st["body"]))

    story.append(Paragraph("The Driver List", st["h2"]))
    story.append(Paragraph(
        "The main view shows all registered drivers in a searchable, paginated "
        "table. You can search by name or staff ID, filter by status (active, "
        "inactive, suspended), and filter by registration date range. "
        "Each row shows the driver's name, staff ID, assigned route, contact "
        "details, and current status.",
        st["body"]))

    story.append(Paragraph("Registering a New Driver", st["h2"]))
    for step in [
        "Click <b>Add New Driver</b>",
        "Enter the driver's personal information: full name, email address, phone number, staff ID, date of birth, and assigned route",
        "Upload the driver's profile picture",
        "Upload required documents such as driver's licence and any certifications",
        "Click <b>Save</b>",
    ]:
        story.append(Paragraph(step, st["bullet"]))

    story.append(Paragraph("Viewing a Driver Profile", st["h2"]))
    story.append(Paragraph(
        "Clicking on a driver's name opens their full profile. The profile page "
        "shows their photo, personal information, the status of their uploaded "
        "documents (verified or pending), their current and past shift assignments, "
        "and any incident reports on record.",
        st["body"]))

    story.append(Paragraph("Assigning Shifts", st["h2"]))
    story.append(Paragraph(
        "Use the <b>Assign Shift</b> button — available both from the driver list "
        "page and from an individual driver profile — to assign a driver to a "
        "specific bus and route for a defined period. The system records the "
        "assignment and it will appear on the driver's profile.",
        st["body"]))

    story.append(Paragraph("Filing Incident Reports", st["h2"]))
    story.append(Paragraph(
        "If an incident occurs involving a driver, it can be logged directly in "
        "the system from the driver's profile page. The report captures the date, "
        "a description of the incident, severity level, and allows supporting "
        "files or documents to be attached. All incident reports are stored "
        "permanently on the driver's record.",
        st["body"]))
    story.append(PageBreak())

    # ── 7. Routes ─────────────────────────────────────────────────────────────
    story += banner("7. Routes & Schedule Management", st)
    story.append(Paragraph(
        "The <b>Routes & Schedule Management</b> section is where all transit "
        "routes are defined and maintained. A route describes the path a bus "
        "takes — the stops it visits, the distances between them, and the "
        "timetable it follows.",
        st["body"]))
    story.append(Paragraph("Navigate here via: <b>Manage Routes</b> in the left sidebar.",
                            st["body"]))

    story.append(Paragraph("The Routes List", st["h2"]))
    story.append(Paragraph(
        "The main view lists all defined routes with the date they were created. "
        "From the action menu on each row you can view the full route details, "
        "edit it, or delete it.", st["body"]))

    story.append(Paragraph("Creating a New Route", st["h2"]))
    for step in [
        "Click <b>Create New Routes</b>",
        "Give the route a name",
        "Add each stop in order: stop name, and the distance from the previous stop",
        "Set the estimated total travel time for the full route",
        "Click <b>Save</b>",
    ]:
        story.append(Paragraph(step, st["bullet"]))

    story.append(Paragraph("Viewing Schedules", st["h2"]))
    story.append(Paragraph(
        "When viewing a route's details, click the <b>View Schedule</b> button to "
        "see all timetabled departures for that route. The schedule modal shows "
        "each departure time, arrival time, and the days of the week it operates.",
        st["body"]))

    story += callout(
        "<b>Tip:</b> When you register a bus or assign a driver to a shift, "
        "you select from the routes defined here. Keeping routes up to date "
        "ensures the correct options are always available throughout the portal.",
        st, bg=GREEN_PALE, border=GREEN)
    story.append(PageBreak())

    # ── 8. Tickets ────────────────────────────────────────────────────────────
    story += banner("8. Tickets & Payment", st)
    story.append(Paragraph(
        "The <b>Tickets & Payment</b> section covers everything related to how "
        "passengers pay for transit — the types of tickets available, the history "
        "of all transactions, and the handling of refund requests.",
        st["body"]))
    story.append(Paragraph("Navigate here via: <b>Tickets</b> in the left sidebar.",
                            st["body"]))

    story.append(Paragraph("Transactions", st["h2"]))
    story.append(Paragraph(
        "The default view when you open this section is the <b>Transaction History</b>. "
        "This is a complete, filterable record of every payment ever made on the "
        "GLK Transit system. You can search by passenger or transaction ID, filter "
        "by date range and payment status, and click on any transaction to see its "
        "full details, including a downloadable receipt.",
        st["body"]))

    story += multi_table(
        ["Status", "Meaning"],
        [
            ["Completed", "Payment was successful and the ticket was issued"],
            ["Pending", "Payment is being processed and has not yet been confirmed"],
            ["Failed", "The payment attempt was unsuccessful"],
            ["Refunded", "The original payment was returned to the passenger"],
        ],
        st, col_ws=[CW * 0.22, CW * 0.78])

    story.append(Paragraph("Ticket Types (Fare Catalog)", st["h2"]))
    story.append(Paragraph(
        "Click <b>All Tickets</b> to manage the fare catalog — the list of all "
        "available ticket products that passengers can purchase. This includes "
        "single-ride tickets and period passes.",
        st["body"]))
    story.append(Paragraph(
        "For each ticket type you define:", st["body"]))
    for item in [
        "<b>Name</b> — a descriptive label (e.g. \"Adult Single Ride — Route 1\")",
        "<b>Rider type</b> — Adult, Student, Senior, or Child",
        "<b>Route</b> — whether the ticket applies to a specific route or all routes",
        "<b>Price</b> — the fare amount in Canadian dollars",
        "<b>Validity</b> — how many days the ticket is valid for (for passes)",
        "<b>Type</b> — Single ride or Period pass",
    ]:
        story.append(Paragraph(item, st["bullet"]))

    story.append(Paragraph("Managing Refunds", st["h2"]))
    story.append(Paragraph(
        "Click <b>Manage Refunds</b> to see all outstanding and processed refund "
        "requests from passengers. For each request you can review the reason "
        "provided by the passenger, then either <b>Approve</b> the refund (which "
        "triggers the return of funds) or <b>Reject</b> it with a written "
        "explanation.",
        st["body"]))
    story.append(PageBreak())

    # ── 9. Permissions ────────────────────────────────────────────────────────
    story += banner("9. User Permissions & Admin Management", st)
    story.append(Paragraph(
        "The <b>User Permissions</b> section is where Super Admins control who has "
        "access to the portal and what each person is allowed to do. It is also "
        "the home of the system's complete audit and login logs.",
        st["body"]))
    story.append(Paragraph("Navigate here via: <b>User Permissions</b> in the left sidebar. "
                            "This section is only accessible to users with sufficient privileges.",
                            st["body"]))

    story.append(Paragraph("Login Logs", st["h2"]))
    story.append(Paragraph(
        "The default view shows a log of every successful and failed login attempt "
        "across all admin accounts. Each entry records the account, the date and "
        "time, the IP address of the device used, and the role of the account at "
        "the time of login. This is useful for spotting unauthorized access "
        "attempts.", st["body"]))

    story.append(Paragraph("Audit Trails", st["h2"]))
    story.append(Paragraph(
        "Switch to the <b>Audit Trails</b> tab to see a complete, chronological "
        "record of every action taken inside the portal by any admin user — "
        "such as adding a bus, editing a driver's profile, or approving a refund. "
        "Each entry shows who performed the action, what the action was, which "
        "record was affected, and when it happened. This log cannot be edited "
        "or deleted.", st["body"]))

    story.append(Paragraph("Managing Admin Users", st["h2"]))
    story.append(Paragraph(
        "Click <b>Manage Admins</b> to see a list of everyone with an admin "
        "account. From this view you can:",
        st["body"]))
    for item in [
        "<b>Add a new admin</b> — invite a new staff member by email (they receive an invitation link) or create their account directly with an immediate password",
        "<b>Reassign a role</b> — change the role assigned to an existing admin",
        "<b>Deactivate an account</b> — prevent a staff member from logging in without deleting their history",
        "<b>Reactivate an account</b> — restore access to a previously deactivated account",
        "<b>Resend or revoke an invitation</b> — manage outstanding invitation links that have not yet been accepted",
    ]:
        story.append(Paragraph(item, st["bullet"]))

    story.append(Paragraph("Managing Roles & Permissions", st["h2"]))
    story.append(Paragraph(
        "Click <b>Manage Roles</b> to open the permission matrix. This is a grid "
        "where each row is a specific action available in the portal (for example, "
        "\"Add a bus\" or \"Approve a refund\") and each column is an admin role. "
        "Each cell in the grid has a toggle: if it is switched on, that role is "
        "allowed to perform that action; if it is off, they cannot.",
        st["body"]))
    story.append(Paragraph(
        "When you are satisfied with your changes, click the <b>Save Changes</b> "
        "button at the top of the page. Changes take effect immediately.",
        st["body"]))

    story += callout(
        "<b>Important:</b> Changing the permission matrix affects every user with "
        "that role immediately. Review changes carefully before saving, as a "
        "mistake could unintentionally lock staff out of parts of the system "
        "they need to do their jobs.",
        st, bg=AMBER_BG, border=AMBER)
    story.append(PageBreak())

    # ── 10. Notifications ─────────────────────────────────────────────────────
    story += banner("10. Notifications", st)
    story.append(Paragraph(
        "The portal includes a real-time notification system. A bell icon in the "
        "top-right corner of every page shows a badge count when there are unread "
        "notifications.", st["body"]))

    story.append(Paragraph("Viewing Notifications", st["h2"]))
    story.append(Paragraph(
        "Click the bell icon to open the notifications panel. This panel lists "
        "all recent system notifications in reverse chronological order. "
        "Notifications are pushed to you live — you do not need to refresh "
        "the page to receive them.",
        st["body"]))

    story.append(Paragraph("Types of Notifications", st["h2"]))
    story += two_col_table([
        ("Notification Type", "Example"),
        ("Fleet alert", "\"Bus T-365 GPS has gone offline\""),
        ("Maintenance reminder", "\"Bus T-12 maintenance is overdue\""),
        ("Driver incident filed", "\"An incident report has been submitted for Driver J. Smith\""),
        ("Refund request", "\"A new passenger refund request requires your attention\""),
        ("Shift assignment", "\"Driver A. Brown has been successfully assigned to Route 5\""),
        ("System alert", "\"A configuration change was made to the permission matrix\""),
    ], st, col_w=[CW * 0.30, CW * 0.70])
    story.append(PageBreak())

    # ── 11. FAQ ───────────────────────────────────────────────────────────────
    story += banner("11. Frequently Asked Questions", st)

    faqs = [
        ("I cannot log in. What should I try?",
         [
             "Make sure you are using the correct email address for your admin account.",
             "Check that CAPS LOCK is not enabled when typing your password.",
             "Use the Forgot Password link on the login page to reset your password.",
             "If the problem persists, contact your Super Admin to check that your account is active.",
         ]),
        ("I can see a section in the sidebar but cannot perform any actions inside it.",
         [
             "Your admin role may not have permission for that specific action.",
             "Contact your Super Admin and ask them to review your role's permissions in the Manage Roles screen.",
         ]),
        ("A bus I just added is not appearing on the Dashboard.",
         [
             "The Dashboard shows the most recently active buses. A newly registered bus with no GPS activity may not appear immediately.",
             "Check the Manage Buses page — the bus should be listed there. Confirm its status is set to Active.",
         ]),
        ("A driver's documents show as unverified. How do I verify them?",
         [
             "Open the driver's profile and locate the Documents section.",
             "If the documents have been uploaded, they will be visible there for review.",
             "Document verification status is updated by an admin reviewing the uploaded files.",
         ]),
        ("I approved a refund but the passenger says they have not received it.",
         [
             "Refund processing times depend on the passenger's bank or payment provider — this is outside the portal's control.",
             "Open the transaction detail for that payment and confirm that its status shows as Refunded.",
             "If the status is still Pending, wait for the payment processor to confirm.",
             "For further help, escalate to the Finance team with the transaction ID.",
         ]),
        ("How do I add a new staff member who needs portal access?",
         [
             "Go to User Permissions → Manage Admins.",
             "Click Add Admin User.",
             "Enter their email address and select the appropriate role.",
             "Choose whether to send them an invitation email or set up their account directly.",
         ]),
        ("Can I undo a change I made by mistake?",
         [
             "Most changes (editing a bus, updating a driver's details) can be undone by editing the record again.",
             "Deleted records cannot be recovered — always use the Deactivate option instead of Delete when you are unsure.",
             "Permission matrix changes take effect immediately but can be reversed by toggling the settings back and saving again.",
         ]),
    ]

    for q, answers in faqs:
        story.append(Paragraph(f"<b>Q: {q}</b>", st["h3"]))
        for a in answers:
            story.append(Paragraph(a, st["bullet"]))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 12))
    story.append(divider())
    story.append(Paragraph(
        f"Document prepared {datetime.now().strftime('%B %d, %Y')}  •  "
        "Grand Lake Municipality — Transit Operations Division  •  "
        "GLK Transit Admin Portal",
        st["caption"]))

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(story, onFirstPage=cover_page, canvasmaker=NumberedCanvas)
    print(f"PDF generated: {os.path.abspath(OUTPUT_PATH)}")


if __name__ == "__main__":
    build_pdf()
