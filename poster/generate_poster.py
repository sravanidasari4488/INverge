#!/usr/bin/env python3
"""
Premium international-conference scientific poster (16:9 / 42\" LCD).
Fully editable PowerPoint-native shapes & text only.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from pptx.oxml import parse_xml
from lxml import etree
import shutil

# ─── Palette ─────────────────────────────────────────────────────
PRIMARY = RGBColor(0x12, 0x35, 0x5B)
SECONDARY = RGBColor(0x2D, 0x6C, 0xDF)
ACCENT = RGBColor(0x00, 0xA6, 0xED)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CARD = RGBColor(0xF2, 0xF7, 0xFC)          # very light blue
CARD_SOFT = RGBColor(0xEA, 0xF3, 0xFA)
BORDER = RGBColor(0xD5, 0xDC, 0xE5)
TEXT = RGBColor(0x2A, 0x31, 0x38)
MUTED = RGBColor(0x5B, 0x65, 0x73)
DIVIDER = RGBColor(0xE6, 0xEC, 0xF2)
PLACEHOLDER = RGBColor(0xE6, 0xEF, 0xF6)
PLACEHOLDER_FG = RGBColor(0x8F, 0xA8, 0xBE)
CALL_BG = RGBColor(0xE9, 0xF6, 0xFD)

FONT = "Calibri"

# 42-inch diagonal 16:9
SW = Inches(36.571)
SH = Inches(20.571)
M = Inches(0.40)          # equal outer margin (8pt grid friendly)
G = Inches(0.24)          # column gap
HEADER_H = Inches(2.85)


def font(run, size, bold=False, color=TEXT, name=FONT):
    run.font.size = size
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = name
    rPr = run._r.get_or_add_rPr()
    for tag in ("latin", "ea", "cs"):
        el = rPr.find(qn(f"a:{tag}"))
        if el is None:
            el = etree.SubElement(rPr, qn(f"a:{tag}"))
        el.set("typeface", name)


def shadow(shape, blur=45000, dist=32000, alpha=16000):
    spPr = shape._element.spPr
    for child in spPr.findall(qn("a:effectLst")):
        spPr.remove(child)
    spPr.append(parse_xml(
        f'<a:effectLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        f'<a:outerShdw blurRad="{blur}" dist="{dist}" dir="2700000" algn="tl" rotWithShape="0">'
        f'<a:prstClr val="black"><a:alpha val="{alpha}"/></a:prstClr>'
        f'</a:outerShdw></a:effectLst>'
    ))


def shape(slide, st, l, t, w, h, fill=None, line=None, lw=Pt(1), corner=None):
    s = slide.shapes.add_shape(st, l, t, w, h)
    if fill is None:
        s.fill.background()
    else:
        s.fill.solid()
        s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = lw
    if corner is not None and st == MSO_SHAPE.ROUNDED_RECTANGLE:
        try:
            s.adjustments[0] = corner
        except Exception:
            pass
    return s


def textbox(slide, l, t, w, h, text, size=Pt(18), bold=False, color=TEXT,
            align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(l, t, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    anchor_map = {MSO_ANCHOR.TOP: "t", MSO_ANCHOR.MIDDLE: "ctr", MSO_ANCHOR.BOTTOM: "b"}
    try:
        tf._txBody.bodyPr.set("anchor", anchor_map[anchor])
    except Exception:
        pass
    p = tf.paragraphs[0]
    p.alignment = align
    p.space_before = Pt(0)
    p.space_after = Pt(0)
    r = p.add_run()
    r.text = text
    font(r, size, bold, color)
    return tb


def card(slide, l, t, w, h, fill=CARD, line=BORDER, soft=True):
    s = shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h,
              fill=fill, line=line, lw=Pt(1), corner=0.07)
    if soft:
        shadow(s)
    return s


def heading(slide, l, t, w, title):
    shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, l, t + Inches(0.10),
          Inches(0.09), Inches(0.28), fill=ACCENT, corner=0.5)
    textbox(slide, l + Inches(0.20), t, w - Inches(0.20), Inches(0.44),
            title, size=Pt(30), bold=True, color=PRIMARY, anchor=MSO_ANCHOR.MIDDLE)


def logo_slot(slide, l, t, w, h, label):
    shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h,
          fill=WHITE, line=BORDER, lw=Pt(1.25), corner=0.10)
    shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
          l + Inches(0.08), t + Inches(0.08), w - Inches(0.16), h - Inches(0.16),
          fill=CARD, corner=0.08)
    textbox(slide, l, t + h / 2 - Inches(0.28), w, Inches(0.56),
            label, size=Pt(13), bold=True, color=MUTED,
            align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def badge(slide, l, t, size, label, fill=SECONDARY):
    c = shape(slide, MSO_SHAPE.OVAL, l, t, size, size, fill=fill)
    shadow(c, blur=28000, dist=18000, alpha=12000)
    textbox(slide, l, t, size, size, label, size=Pt(14), bold=True, color=WHITE,
            align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def build():
    prs = Presentation()
    prs.slide_width = SW
    prs.slide_height = SH
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # Canvas
    shape(slide, MSO_SHAPE.RECTANGLE, 0, 0, SW, SH, fill=WHITE)
    # Soft header atmosphere (not flat white everywhere)
    shape(slide, MSO_SHAPE.RECTANGLE, 0, 0, SW, HEADER_H, fill=RGBColor(0xF6, 0xFA, 0xFD))
    shape(slide, MSO_SHAPE.RECTANGLE, 0, 0, SW, Inches(0.12), fill=PRIMARY)
    # subtle accent gradient strip under primary bar
    shape(slide, MSO_SHAPE.RECTANGLE, 0, Inches(0.12), SW, Inches(0.04), fill=ACCENT)

    # ── Header logos ──────────────────────────────────────────────
    logo_slot(slide, M, Inches(0.36), Inches(1.85), Inches(1.85), "Institution Logo")
    logo_slot(slide, SW - M - Inches(1.85), Inches(0.36), Inches(1.85), Inches(1.85), "Conference Logo")

    hx = M + Inches(2.10)
    hw = SW - 2 * M - Inches(4.20)

    # Category
    shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, hx, Inches(0.30), Inches(5.0), Inches(0.34),
          fill=RGBColor(0xE5, 0xEF, 0xFB), corner=0.5)
    textbox(slide, hx, Inches(0.30), Inches(5.0), Inches(0.34),
            "Neuroradiology  ·  Oncoradiology", size=Pt(14), bold=True,
            color=SECONDARY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # Title (50–60 pt) — most prominent
    textbox(slide, hx, Inches(0.68), hw, Inches(1.20),
            "Connecting the Dots: Multisystem Imaging Clues Leading to the Diagnosis of Von Hippel–Lindau Disease",
            size=Pt(48), bold=True, color=PRIMARY)

    # Authors
    textbox(slide, hx, Inches(1.88), hw, Inches(0.32),
            "Dr. Bikkasani Divya (Postgraduate)    ·    Dr. M. Krishna Sowmya (Assistant Professor)",
            size=Pt(18), color=TEXT)

    # Institution
    textbox(slide, hx, Inches(2.18), hw, Inches(0.28),
            "Dr. Pinnamaneni Siddhartha Institute of Medical Sciences and Research Foundation",
            size=Pt(16), bold=True, color=MUTED)

    # Meta pills
    meta = [
        (Inches(3.2), "REG  APIRIA – 204"),
        (Inches(4.6), "EMAIL  divyasai.bikkasani@gmail.com"),
        (Inches(3.2), "MOBILE  8331836965"),
    ]
    mx = hx
    my = Inches(2.50)
    for w, label in meta:
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, mx, my, w, Inches(0.32),
              fill=WHITE, line=BORDER, lw=Pt(1), corner=0.5)
        textbox(slide, mx + Inches(0.12), my, w - Inches(0.20), Inches(0.32),
                label, size=Pt(13), color=TEXT, anchor=MSO_ANCHOR.MIDDLE)
        mx += w + Inches(0.16)

    # Divider
    shape(slide, MSO_SHAPE.RECTANGLE, M, HEADER_H, SW - 2 * M, Pt(1.5), fill=DIVIDER)

    # ── Columns ───────────────────────────────────────────────────
    body_top = HEADER_H + Inches(0.20)
    body_h = SH - body_top - M - Inches(0.18)  # leave footer
    usable = SW - 2 * M - 2 * G
    left_w = usable * 0.235
    mid_w = usable * 0.475
    right_w = usable * 0.290
    lx = M
    mx_col = lx + left_w + G
    rx = mx_col + mid_w + G

    # ════════════ LEFT ════════════════════════════════════════════
    y = body_top

    # Background
    bg_h = Inches(3.70)
    card(slide, lx, y, left_w, bg_h)
    heading(slide, lx + Inches(0.20), y + Inches(0.14), left_w - Inches(0.40), "Background")
    textbox(slide, lx + Inches(0.24), y + Inches(0.64), left_w - Inches(0.48), bg_h - Inches(0.80),
            "Von Hippel–Lindau (VHL) disease is a rare autosomal dominant hereditary cancer syndrome caused by mutation of the VHL tumor suppressor gene. It is characterized by multisystem involvement including central nervous system hemangioblastomas, pancreatic cysts, renal cysts and renal cell carcinoma. Early recognition of characteristic imaging findings is crucial for timely diagnosis, surveillance and multidisciplinary management.",
            size=Pt(17), color=TEXT)
    y += bg_h + Inches(0.18)

    # Aims
    aims_h = Inches(2.90)
    card(slide, lx, y, left_w, aims_h)
    heading(slide, lx + Inches(0.20), y + Inches(0.14), left_w - Inches(0.40), "Aims & Objectives")
    aims = [
        "To highlight the pivotal role of multimodality imaging in diagnosing VHL disease.",
        "To emphasize recognition of multisystem imaging findings suggestive of hereditary tumour syndromes.",
    ]
    ay = y + Inches(0.68)
    for a in aims:
        shape(slide, MSO_SHAPE.OVAL, lx + Inches(0.28), ay + Inches(0.10),
              Inches(0.14), Inches(0.14), fill=ACCENT)
        textbox(slide, lx + Inches(0.54), ay, left_w - Inches(0.76), Inches(0.95),
                a, size=Pt(17), color=TEXT)
        ay += Inches(0.98)
    y += aims_h + Inches(0.18)

    # Materials & Methods — vertical workflow
    meth_h = body_top + body_h - y
    card(slide, lx, y, left_w, meth_h)
    heading(slide, lx + Inches(0.20), y + Inches(0.14), left_w - Inches(0.40), "Materials & Methods")

    steps = [
        ("1", "Clinical Evaluation",
         "A 39-year-old female with persistent band-like abdominal pain and progressive neurological symptoms was evaluated.",
         SECONDARY, "Hx"),
        ("2", "CT Abdomen",
         "Contrast-enhanced CT abdomen findings were reviewed.",
         ACCENT, "CT"),
        ("3", "MRI Spine",
         "MRI spine findings were reviewed for intramedullary pathology.",
         SECONDARY, "MRI"),
        ("4", "Clinicoradiological Correlation",
         "Findings correlated with clinicoradiological features and relevant literature.",
         ACCENT, "Dx"),
    ]
    st = y + Inches(0.68)
    slot = (meth_h - Inches(0.85)) / len(steps)
    for i, (n, title, desc, col, icon) in enumerate(steps):
        sy = st + i * slot
        if i < len(steps) - 1:
            shape(slide, MSO_SHAPE.RECTANGLE,
                  lx + Inches(0.42), sy + Inches(0.44),
                  Pt(2.5), slot - Inches(0.28), fill=RGBColor(0xC5, 0xD8, 0xEE))
        badge(slide, lx + Inches(0.26), sy + Inches(0.04), Inches(0.40), n, fill=col)
        # small modality icon chip
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              lx + left_w - Inches(0.72), sy + Inches(0.06), Inches(0.48), Inches(0.26),
              fill=RGBColor(0xE8, 0xF1, 0xFB), corner=0.4)
        textbox(slide, lx + left_w - Inches(0.72), sy + Inches(0.06), Inches(0.48), Inches(0.26),
                icon, size=Pt(11), bold=True, color=SECONDARY,
                align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        textbox(slide, lx + Inches(0.78), sy, left_w - Inches(1.55), Inches(0.28),
                title, size=Pt(16), bold=True, color=PRIMARY)
        textbox(slide, lx + Inches(0.78), sy + Inches(0.28), left_w - Inches(1.00), Inches(0.70),
                desc, size=Pt(14), color=MUTED)

    # ════════════ CENTER — Results & Discussion ═══════════════════
    card(slide, mx_col, body_top, mid_w, body_h, fill=RGBColor(0xF9, 0xFC, 0xFE))
    heading(slide, mx_col + Inches(0.22), body_top + Inches(0.14),
            mid_w - Inches(0.44), "Results & Discussion")

    # Highlight callout
    it = body_top + Inches(0.62)
    shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
          mx_col + Inches(0.22), it, mid_w - Inches(0.44), Inches(0.78),
          fill=CALL_BG, line=ACCENT, lw=Pt(1.25), corner=0.10)
    textbox(slide, mx_col + Inches(0.38), it + Inches(0.08),
            mid_w - Inches(0.72), Inches(0.62),
            "Integration of multisystem imaging findings strongly suggested VHL disease, enabling multidisciplinary management, surveillance and genetic counselling.",
            size=Pt(16), bold=True, color=PRIMARY, anchor=MSO_ANCHOR.MIDDLE)

    # 6-image gallery
    gallery = [
        ("CT Abdomen",
         "Multiple pancreatic cysts and bilateral renal cortical cysts on contrast-enhanced CT abdomen.",
         "Multisystem visceral clue"),
        ("MRI Cervical Spine",
         "Long-segment intramedullary cystic lesion (C2–D2) with enhancing mural nodule.",
         "Spinal hemangioblastoma pattern"),
        ("MRI Thoracic Spine",
         "Long-segment intramedullary cystic lesion (D5–D8) with enhancing mural nodule.",
         "Additional spinal involvement"),
        ("Hemangioblastoma",
         "Enhancing mural nodules within intramedullary cystic lesions — hallmark of spinal hemangioblastomas.",
         "Key CNS finding in VHL"),
        ("Pancreatic Cysts",
         "Multiple pancreatic cysts on CT abdomen — characteristic visceral manifestation of VHL.",
         "Visceral hallmark"),
        ("Renal Cysts",
         "Bilateral renal cortical cysts on CT abdomen; VHL spectrum includes renal cell carcinoma risk.",
         "Bilateral renal involvement"),
    ]

    gt = it + Inches(0.94)
    avail = body_h - Inches(1.72)
    row_h = (avail - Inches(0.28)) / 3
    gap = Inches(0.18)
    cell_w = (mid_w - Inches(0.52) - gap) / 2

    for i, (title, finding, callout) in enumerate(gallery):
        r, c = divmod(i, 2)
        gx = mx_col + Inches(0.22) + c * (cell_w + gap)
        gy = gt + r * (row_h + Inches(0.10))

        outer = shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, gx, gy, cell_w, row_h,
                      fill=WHITE, line=BORDER, lw=Pt(1), corner=0.06)
        shadow(outer, blur=32000, dist=20000, alpha=11000)

        img_h = row_h * 0.50
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              gx + Inches(0.10), gy + Inches(0.10), cell_w - Inches(0.20), img_h,
              fill=PLACEHOLDER, line=RGBColor(0xC2, 0xD3, 0xE2), lw=Pt(1), corner=0.05)

        # label chip
        chip_w = Inches(2.45)
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              gx + Inches(0.18), gy + Inches(0.18), chip_w, Inches(0.30),
              fill=PRIMARY, corner=0.4)
        textbox(slide, gx + Inches(0.18), gy + Inches(0.18), chip_w, Inches(0.30),
                title, size=Pt(12), bold=True, color=WHITE,
                align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

        # placeholder mark
        textbox(slide, gx + Inches(0.10), gy + Inches(0.10) + img_h / 2 - Inches(0.14),
                cell_w - Inches(0.20), Inches(0.36),
                "Insert Radiology Image", size=Pt(13), color=PLACEHOLDER_FG,
                align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

        # finding
        ft = gy + Inches(0.10) + img_h + Inches(0.08)
        textbox(slide, gx + Inches(0.14), ft, cell_w - Inches(0.28), Inches(0.78),
                finding, size=Pt(13), color=TEXT)

        # callout
        ct = gy + row_h - Inches(0.40)
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              gx + Inches(0.12), ct, cell_w - Inches(0.24), Inches(0.30),
              fill=RGBColor(0xEE, 0xF5, 0xFB), corner=0.35)
        shape(slide, MSO_SHAPE.RECTANGLE,
              gx + Inches(0.12), ct, Inches(0.06), Inches(0.30), fill=ACCENT)
        textbox(slide, gx + Inches(0.26), ct, cell_w - Inches(0.42), Inches(0.30),
                callout, size=Pt(12), bold=True, color=PRIMARY, anchor=MSO_ANCHOR.MIDDLE)

    # ════════════ RIGHT ═══════════════════════════════════════════
    ry = body_top

    # Clinical Significance
    cs_h = Inches(3.05)
    card(slide, rx, ry, right_w, cs_h)
    heading(slide, rx + Inches(0.20), ry + Inches(0.14), right_w - Inches(0.40), "Clinical Significance")
    sig = [
        "Multimodality imaging (CT + MRI) enables recognition of VHL as a unifying diagnosis.",
        "Early identification supports timely surveillance for CNS hemangioblastomas and visceral lesions, including renal cell carcinoma risk.",
        "Imaging-driven diagnosis facilitates multidisciplinary management and genetic counselling.",
    ]
    sy = ry + Inches(0.64)
    for s in sig:
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              rx + Inches(0.24), sy + Inches(0.06), Inches(0.10), Inches(0.10),
              fill=SECONDARY, corner=0.5)
        textbox(slide, rx + Inches(0.46), sy, right_w - Inches(0.68), Inches(0.72),
                s, size=Pt(15), color=TEXT)
        sy += Inches(0.72)
    ry += cs_h + Inches(0.16)

    # Conclusion — highlighted
    conc_h = Inches(2.85)
    conc = shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, rx, ry, right_w, conc_h,
                 fill=PRIMARY, corner=0.07)
    shadow(conc, blur=55000, dist=35000, alpha=20000)
    shape(slide, MSO_SHAPE.RECTANGLE, rx, ry, right_w, Inches(0.08), fill=ACCENT)
    textbox(slide, rx + Inches(0.28), ry + Inches(0.22), right_w - Inches(0.56), Inches(0.40),
            "Conclusion", size=Pt(30), bold=True, color=WHITE)
    conclusions = [
        "Coexistence of spinal hemangioblastomas with pancreatic and renal cysts should prompt consideration of VHL disease.",
        "Pattern recognition across multiple organ systems enables early diagnosis and improved patient outcomes.",
    ]
    cy = ry + Inches(0.72)
    for c in conclusions:
        shape(slide, MSO_SHAPE.OVAL,
              rx + Inches(0.30), cy + Inches(0.08), Inches(0.14), Inches(0.14), fill=ACCENT)
        textbox(slide, rx + Inches(0.56), cy, right_w - Inches(0.80), Inches(0.90),
                c, size=Pt(16), color=WHITE)
        cy += Inches(0.95)
    ry += conc_h + Inches(0.16)

    # Key Takeaways (5 cards)
    remaining = body_top + body_h - ry
    take_h = remaining * 0.68
    ref_h = remaining - take_h - Inches(0.14)

    card(slide, rx, ry, right_w, take_h)
    heading(slide, rx + Inches(0.20), ry + Inches(0.10), right_w - Inches(0.40), "Key Takeaways")

    takeaways = [
        ("01", "Multimodality imaging is pivotal in diagnosing VHL disease."),
        ("02", "Spinal hemangioblastomas with pancreatic and renal cysts should raise suspicion for VHL."),
        ("03", "Long-segment intramedullary cystic lesions with enhancing mural nodules suggest hemangioblastomas."),
        ("04", "Pattern recognition across organ systems enables early diagnosis."),
        ("05", "Imaging supports multidisciplinary management, surveillance and genetic counselling."),
    ]
    ty = ry + Inches(0.56)
    slot = (take_h - Inches(0.66)) / len(takeaways)
    for num, txt in takeaways:
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              rx + Inches(0.16), ty, right_w - Inches(0.32), slot - Inches(0.08),
              fill=CARD_SOFT, line=BORDER, lw=Pt(0.75), corner=0.14)
        shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE,
              rx + Inches(0.26), ty + (slot - Inches(0.08)) / 2 - Inches(0.15),
              Inches(0.40), Inches(0.30), fill=SECONDARY, corner=0.25)
        textbox(slide, rx + Inches(0.26),
                ty + (slot - Inches(0.08)) / 2 - Inches(0.15),
                Inches(0.40), Inches(0.30),
                num, size=Pt(12), bold=True, color=WHITE,
                align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        textbox(slide, rx + Inches(0.78), ty + Inches(0.04),
                right_w - Inches(1.06), slot - Inches(0.16),
                txt, size=Pt(13), color=TEXT, anchor=MSO_ANCHOR.MIDDLE)
        ty += slot
    ry += take_h + Inches(0.14)

    # References (no invented citations)
    ref_h = body_top + body_h - ry
    card(slide, rx, ry, right_w, ref_h)
    heading(slide, rx + Inches(0.20), ry + Inches(0.08), right_w - Inches(0.40), "References")
    textbox(slide, rx + Inches(0.24), ry + Inches(0.52), right_w - Inches(0.48), ref_h - Inches(0.62),
            "Findings were correlated with clinicoradiological features and relevant published literature on VHL imaging.\n\n"
            "1.  [Insert key VHL imaging reference]\n"
            "2.  [Insert surveillance / management reference]\n"
            "3.  [Insert additional citation as needed]",
            size=Pt(13), color=MUTED)

    # Footer
    shape(slide, MSO_SHAPE.RECTANGLE, 0, SH - Inches(0.28), SW, Inches(0.28), fill=PRIMARY)
    textbox(slide, M, SH - Inches(0.28), SW - 2 * M, Inches(0.28),
            "APIRIA – 204   ·   Von Hippel–Lindau Disease   ·   Multisystem Imaging Diagnosis",
            size=Pt(12), color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    out = "/workspace/poster/VHL_Multisystem_Imaging_Poster.pptx"
    prs.save(out)
    shutil.copy(out, "/opt/cursor/artifacts/VHL_Multisystem_Imaging_Poster.pptx")
    print(f"Saved: {out}")
    print(f"Size: {prs.slide_width.inches:.3f}\" × {prs.slide_height.inches:.3f}\" (16:9)")
    return out


if __name__ == "__main__":
    build()
