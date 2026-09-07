from pathlib import Path
import re
import uuid

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from core.config import UPLOADS_DIR
from core.sample_data import get_sample_cases, get_sample_by_id
from core.forensic_engine import analyze_media


router = APIRouter(prefix="/api", tags=["Analysis"])


# ============================================================
# CONSTANTS
# ============================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tiff",
    ".tif",
}


# ============================================================
# HELPERS
# ============================================================

def _normalize_text(value: str) -> str:
    """
    Normalize text so that sample IDs/names can be compared
    against filenames safely.
    """
    if not value:
        return ""

    value = str(value).lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return value.strip()


def _filename_candidates(sample: dict, sample_id: str):
    """
    Build possible filename candidates from whatever metadata
    exists in sample_data.py.

    sample_data.py does NOT need a filename field.
    """

    candidates = []

    # Explicit filename fields, if they ever exist
    for key in (
        "filename",
        "image",
        "image_filename",
        "image_file",
        "file",
        "file_name",
        "image_path",
    ):
        value = sample.get(key)

        if value:
            value = Path(str(value)).name

            if value:
                candidates.append(value)

    # Sample ID
    if sample_id:
        candidates.append(f"{sample_id}.png")
        candidates.append(f"{sample_id}.jpg")
        candidates.append(f"{sample_id}.jpeg")
        candidates.append(f"{sample_id}.webp")

    # Name
    name = sample.get("name", "")

    if name:
        normalized = _normalize_text(name)

        if normalized:
            slug = normalized.replace(" ", "_")

            candidates.extend(
                [
                    f"{slug}.png",
                    f"{slug}.jpg",
                    f"{slug}.jpeg",
                    f"{slug}.webp",
                ]
            )

    # Remove duplicates while preserving order
    unique = []

    for candidate in candidates:
        if candidate not in unique:
            unique.append(candidate)

    return unique


def _find_sample_image(sample: dict, sample_id: str) -> Path | None:
    """
    Locate the image belonging to a benchmark sample.

    Priority:
    1. Explicit filename from sample metadata
    2. Exact sample ID filename
    3. Name-based filename
    4. Fuzzy filename matching inside uploads directory
    """

    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    candidates = _filename_candidates(sample, sample_id)

    # --------------------------------------------------------
    # 1. Exact candidate filename
    # --------------------------------------------------------

    for candidate in candidates:
        candidate_path = UPLOADS_DIR / Path(candidate).name

        if candidate_path.exists() and candidate_path.is_file():
            return candidate_path

    # --------------------------------------------------------
    # 2. Search all image files in uploads directory
    # --------------------------------------------------------

    try:
        image_files = [
            path
            for path in UPLOADS_DIR.iterdir()
            if path.is_file()
            and path.suffix.lower() in ALLOWED_EXTENSIONS
        ]
    except Exception:
        image_files = []

    if not image_files:
        return None

    # --------------------------------------------------------
    # 3. Exact normalized ID match
    # --------------------------------------------------------

    normalized_id = _normalize_text(sample_id)

    if normalized_id:
        id_tokens = set(normalized_id.split())

        best_match = None
        best_score = 0

        for path in image_files:
            filename_text = _normalize_text(path.stem)
            filename_tokens = set(filename_text.split())

            score = len(id_tokens.intersection(filename_tokens))

            if score > best_score:
                best_score = score
                best_match = path

        if best_match is not None and best_score > 0:
            return best_match

    # --------------------------------------------------------
    # 4. Name-based fuzzy matching
    # --------------------------------------------------------

    sample_name = _normalize_text(sample.get("name", ""))

    if sample_name:
        name_tokens = {
            token
            for token in sample_name.split()
            if len(token) >= 3
        }

        best_match = None
        best_score = 0

        for path in image_files:
            filename_text = _normalize_text(path.stem)

            score = sum(
                1
                for token in name_tokens
                if token in filename_text
            )

            if score > best_score:
                best_score = score
                best_match = path

        if best_match is not None and best_score >= 1:
            return best_match

    return None


def _build_sample_title(sample: dict) -> str:
    """
    Safely obtain a display title without requiring a title field.
    """

    return sample.get(
        "title",
        sample.get(
            "name",
            "TRUVENA Demo Specimen"
        )
    )


# ============================================================
# SAMPLE ENDPOINT
# ============================================================

@router.get("/samples")
async def get_samples():
    """
    Return all benchmark/demo specimens.
    """

    samples = get_sample_cases()

    return {
        "count": len(samples),
        "samples": samples,
    }


# ============================================================
# ANALYSIS ENDPOINT
# ============================================================

@router.post("/analyze")
async def run_analysis(
    file: UploadFile = File(None),
    sample_id: str = Form(None),
    selected_sample_id: str = Form(None),
):
    """
    Analyze either:

    1. A custom uploaded image
    OR
    2. A benchmark/demo specimen selected from the UI.
    """

    # --------------------------------------------------------
    # Resolve sample ID
    # --------------------------------------------------------

    selected_id = sample_id or selected_sample_id

    # ========================================================
    # CASE 1 — CUSTOM UPLOAD
    # ========================================================

    if file and file.filename:

        original_filename = Path(file.filename).name

        if not original_filename:
            raise HTTPException(
                status_code=400,
                detail="Invalid filename."
            )

        extension = Path(original_filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported image format. "
                    "Allowed formats: JPG, JPEG, PNG, WEBP, "
                    "BMP, TIFF and TIF."
                ),
            )

        # ----------------------------------------------------
        # Read uploaded bytes
        # ----------------------------------------------------

        try:
            file_bytes = await file.read()

        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Unable to read uploaded image: {exc}",
            )

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty.",
            )

        # ----------------------------------------------------
        # Save uploaded image
        # ----------------------------------------------------

        stored_filename = (
            f"{uuid.uuid4().hex[:12]}_{original_filename}"
        )

        upload_path = UPLOADS_DIR / stored_filename

        UPLOADS_DIR.mkdir(
            parents=True,
            exist_ok=True
        )

        try:
            upload_path.write_bytes(file_bytes)

        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Unable to save uploaded image: {exc}",
            )

        # ----------------------------------------------------
        # Run forensic analysis
        # ----------------------------------------------------

        try:

            report = analyze_media(
                file_bytes,
                filename=original_filename,
                sample_id=None,
            )

        except ValueError as exc:

            try:
                upload_path.unlink(
                    missing_ok=True
                )
            except Exception:
                pass

            raise HTTPException(
                status_code=400,
                detail=str(exc),
            )

        except Exception as exc:

            try:
                upload_path.unlink(
                    missing_ok=True
                )
            except Exception:
                pass

            raise HTTPException(
                status_code=500,
                detail=f"Forensic analysis failed: {exc}",
            )

        # ----------------------------------------------------
        # Attach frontend metadata
        # ----------------------------------------------------

        report["preview_url"] = (
            f"/uploads/{stored_filename}"
        )

        report["stored_filename"] = stored_filename

        report["original_filename"] = (
            original_filename
        )

        report["sample_id"] = None

        return report

    # ========================================================
    # CASE 2 — BENCHMARK / DEMO SAMPLE
    # ========================================================

    if selected_id:

        # ----------------------------------------------------
        # Get sample metadata
        # ----------------------------------------------------

        sample = get_sample_by_id(selected_id)

        if not sample:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Sample '{selected_id}' "
                    "was not found."
                ),
            )

        # ----------------------------------------------------
        # IMPORTANT:
        #
        # sample_data.py does NOT contain filename.
        #
        # Therefore we locate the image automatically.
        # ----------------------------------------------------

        sample_path = _find_sample_image(
            sample,
            selected_id
        )

        if sample_path is None:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Unable to locate the image for "
                    f"sample '{selected_id}'. "
                    f"Please make sure the corresponding "
                    f"sample image exists inside: "
                    f"{UPLOADS_DIR}"
                ),
            )

        safe_sample_filename = sample_path.name

        # ----------------------------------------------------
        # Read sample image
        # ----------------------------------------------------

        try:

            file_bytes = sample_path.read_bytes()

        except Exception as exc:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Unable to read sample image: {exc}"
                ),
            )

        if not file_bytes:

            raise HTTPException(
                status_code=500,
                detail="Sample image is empty.",
            )

        # ----------------------------------------------------
        # Run forensic analysis
        # ----------------------------------------------------

        try:

            report = analyze_media(
                file_bytes,
                filename=safe_sample_filename,
                sample_id=selected_id,
            )

        except ValueError as exc:

            raise HTTPException(
                status_code=400,
                detail=str(exc),
            )

        except Exception as exc:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Forensic analysis failed: {exc}"
                ),
            )

        # ----------------------------------------------------
        # Frontend metadata
        # ----------------------------------------------------

        report["preview_url"] = (
            f"/uploads/{safe_sample_filename}"
        )

        report["stored_filename"] = (
            safe_sample_filename
        )

        report["original_filename"] = (
            safe_sample_filename
        )

        report["sample_id"] = selected_id

        report["sample_title"] = (
            _build_sample_title(sample)
        )

        return report

    # ========================================================
    # NO INPUT
    # ========================================================

    raise HTTPException(
        status_code=400,
        detail=(
            "Please upload an image or select "
            "a benchmark specimen."
        ),
    )