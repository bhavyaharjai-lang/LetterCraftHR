import io
import os
import re
import uuid
import zipfile
from datetime import datetime
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

try:
    from reportlab.lib.pagesizes import LETTER
    from reportlab.pdfgen import canvas

    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False


app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / "template.txt"

# In-memory store for parsed rows by session id.
# For production, replace with Redis/DB/object storage.
SESSION_STORE = {}

REQUIRED_COLUMNS = ["Name", "Role", "Salary", "Joining"]


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Trim incoming Excel headers for predictable matching."""
    df.columns = [str(col).strip() for col in df.columns]
    return df


def validate_columns(df: pd.DataFrame) -> None:
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")


def safe_filename(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9_-]+", "_", value.strip())
    return cleaned.strip("_") or "candidate"


def format_record(record: dict) -> dict:
    """Convert pandas/numpy values to JSON-safe strings."""
    formatted = {}
    for key, val in record.items():
        if pd.isna(val):
            formatted[key] = ""
        elif isinstance(val, (datetime, pd.Timestamp)):
            formatted[key] = val.strftime("%Y-%m-%d")
        else:
            formatted[key] = str(val)
    return formatted


def load_template() -> str:
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError("template.txt not found in backend directory.")
    return TEMPLATE_PATH.read_text(encoding="utf-8")


def render_offer_letter(template: str, row: dict) -> str:
    content = template
    for key, value in row.items():
        content = content.replace(f"{{{key}}}", value)
    return content


def read_uploaded_dataframe(uploaded_file) -> pd.DataFrame:
    filename = uploaded_file.filename.lower()
    if filename.endswith(".csv"):
        df = pd.read_csv(uploaded_file)
    elif filename.endswith(".xlsx"):
        df = pd.read_excel(uploaded_file, engine="openpyxl")
    else:
        raise ValueError("Unsupported file type. Please upload .csv or .xlsx")
    return normalize_columns(df)


def build_pdf_bytes(text: str) -> bytes:
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER
    x_margin = 50
    y = height - 70

    for line in text.splitlines():
        if y < 60:
            pdf.showPage()
            y = height - 70
        pdf.drawString(x_margin, y, line)
        y -= 16

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/", methods=["GET"])
def root():
    return jsonify(
        {
            "message": "Offer Letter Generator API is running.",
            "endpoints": {
                "health": "/api/health",
                "preview": "POST /api/preview",
                "generate": "POST /api/generate",
            },
        }
    )


@app.route("/api/preview", methods=["POST"])
def preview():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files["file"]
    if not uploaded_file or uploaded_file.filename == "":
        return jsonify({"error": "Empty file upload"}), 400

    try:
        df = read_uploaded_dataframe(uploaded_file)
        validate_columns(df)
        rows = [format_record(record) for record in df.to_dict(orient="records")]
        session_id = str(uuid.uuid4())
        SESSION_STORE[session_id] = rows
        return jsonify({"session_id": session_id, "columns": REQUIRED_COLUMNS, "rows": rows})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@app.route("/api/generate", methods=["POST"])
def generate():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("session_id")
    output_format = (payload.get("format") or "txt").lower()

    if not session_id:
        return jsonify({"error": "session_id is required"}), 400
    if session_id not in SESSION_STORE:
        return jsonify({"error": "Invalid or expired session_id"}), 404
    if output_format not in {"txt", "pdf"}:
        return jsonify({"error": "format must be 'txt' or 'pdf'"}), 400
    if output_format == "pdf" and not REPORTLAB_AVAILABLE:
        return jsonify({"error": "PDF generation requires reportlab"}), 500

    try:
        template = load_template()
        rows = SESSION_STORE[session_id]

        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for index, row in enumerate(rows, start=1):
                letter_text = render_offer_letter(template, row)
                candidate = safe_filename(row.get("Name", f"candidate_{index}"))
                extension = "pdf" if output_format == "pdf" else "txt"
                filename = f"{index:02d}_{candidate}.{extension}"

                if output_format == "txt":
                    zf.writestr(filename, letter_text)
                else:
                    zf.writestr(filename, build_pdf_bytes(letter_text))

        zip_buffer.seek(0)
        return send_file(
            zip_buffer,
            mimetype="application/zip",
            as_attachment=True,
            download_name=f"offer_letters_{output_format}.zip",
        )
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)