# TRUVENA - Media DNA Extraction Engine
# Multidimensional Forensic Representation and Signal Processing
import io
import base64
import hashlib
import numpy as np
from PIL import Image, ImageChops, ImageFilter, ImageOps
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def generate_fft_spectrum_base64(image: Image.Image) -> str:
    """
    Compute 2D Fast Fourier Transform (FFT) magnitude spectrum.
    Visualizes frequency power distribution, high-frequency roll-off, and periodic lattice artifacts.
    """
    try:
        gray = image.convert('L').resize((384, 384))
        img_arr = np.array(gray, dtype=np.float32)
        f = np.fft.fft2(img_arr)
        fshift = np.fft.fftshift(f)
        mag = 20 * np.log(np.abs(fshift) + 1.0)
        norm_mag = (mag - mag.min()) / (mag.max() - mag.min() + 1e-8)
        fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
        fig.patch.set_facecolor('#0a0d14')
        ax.set_facecolor('#0a0d14')
        ax.imshow(norm_mag, cmap='inferno')
        ax.axis('off')
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
        buf = io.BytesIO()
        plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), edgecolor='none', pad_inches=0)
        plt.close(fig)
        buf.seek(0)
        return 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')
    except Exception as e:
        print('FFT error:', e)
        return ''

def generate_noise_residual_base64(image: Image.Image) -> str:
    """
    Extract high-frequency residual map using Laplacian high-pass spatial filtering.
    Isolates fine edge gradients and high-frequency residual noise patterns.
    """
    try:
        gray = image.convert('L').resize((384, 384))
        edges = gray.filter(ImageFilter.FIND_EDGES)
        enhanced = ImageOps.autocontrast(edges)
        arr = np.array(enhanced, dtype=np.float32) / 255.0
        fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
        fig.patch.set_facecolor('#0a0d14')
        ax.set_facecolor('#0a0d14')
        ax.imshow(arr, cmap='viridis')
        ax.axis('off')
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
        buf = io.BytesIO()
        plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), edgecolor='none', pad_inches=0)
        plt.close(fig)
        buf.seek(0)
        return 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')
    except Exception as e:
        print('Residual map error:', e)
        return ''

def generate_ela_base64(image: Image.Image, quality: int = 90, scale: int = 15) -> str:
    """
    Perform Error Level Analysis (ELA).
    Reveals compression variance across image regions by calculating difference against resaved JPEG baseline.
    """
    try:
        rgb_img = image.convert('RGB').resize((384, 384))
        buf_resaved = io.BytesIO()
        rgb_img.save(buf_resaved, 'JPEG', quality=quality)
        buf_resaved.seek(0)
        resaved_img = Image.open(buf_resaved)
        diff = ImageChops.difference(rgb_img, resaved_img)
        diff_arr = np.array(diff, dtype=np.float32) * scale
        diff_arr = np.clip(diff_arr, 0, 255).astype(np.uint8)
        gray_diff = np.mean(diff_arr, axis=2) / 255.0
        fig, ax = plt.subplots(figsize=(4, 4), dpi=100)
        fig.patch.set_facecolor('#0a0d14')
        ax.set_facecolor('#0a0d14')
        ax.imshow(gray_diff, cmap='plasma')
        ax.axis('off')
        plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
        buf = io.BytesIO()
        plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), edgecolor='none', pad_inches=0)
        plt.close(fig)
        buf.seek(0)
        return 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')
    except Exception as e:
        print('ELA error:', e)
        return ''

def check_provenance_and_watermarks(image_bytes: bytes, image: Image.Image) -> dict:
    """
    Inspect container for C2PA manifests and watermark status with scientific accuracy.
    Distinguishes:
    - C2PA Detected (Not Cryptographically Verified)
    - C2PA Not Found
    """
    findings = {
        'c2pa_status': 'C2PA: Not Found',
        'c2pa_details': 'No C2PA JUMBF metadata manifest detected in container.',
        'c2pa_verified': False,
        'watermark_status': 'Watermark verification unavailable for this specimen.',
        'watermark_details': 'Specialized proprietary watermark decoders are not active in this environment.',
        'exif_present': False,
        'camera_metadata': None,
        'software_signature': None
    }
    
    lower_bytes = image_bytes.lower()
    if b'c2pa' in lower_bytes or b'jumb' in lower_bytes or b'contentcredentials' in lower_bytes:
        findings['c2pa_status'] = 'C2PA Claim Detected (Not Cryptographically Verified)'
        findings['c2pa_details'] = 'C2PA provenance manifest container present in stream; full cryptographic certificate chain verification is not implemented.'
        findings['c2pa_verified'] = False
    
    try:
        exif = image.getexif()
        if exif and len(exif) > 0:
            findings['exif_present'] = True
            make = exif.get(271, '')
            model = exif.get(272, '')
            software = exif.get(305, '')
            if make or model:
                findings['camera_metadata'] = f'{make} {model}'.strip()
            if software:
                findings['software_signature'] = str(software).strip()
    except Exception:
        pass
        
    return findings

def extract_media_dna_signals(image: Image.Image, raw_bytes: bytes) -> dict:
    sha256 = hashlib.sha256(raw_bytes).hexdigest()
    gray = image.convert('L').resize((256, 256))
    arr = np.array(gray, dtype=np.float32)
    
    # 1. Frequency calculation (high freq energy ratio via FFT)
    f = np.fft.fft2(arr)
    fshift = np.fft.fftshift(f)
    h, w = arr.shape
    cy, cx = h // 2, w // 2
    total_energy = np.sum(np.abs(fshift)) + 1e-6
    center_energy = np.sum(np.abs(fshift[cy-20:cy+20, cx-20:cx+20]))
    high_freq_ratio = float((total_energy - center_energy) / total_energy)
    
    # 2. High-frequency residual variance (Laplacian)
    edges = np.array(gray.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
    noise_var = float(np.var(edges) / 1000.0)
    
    # 3. Texture dispersion
    texture_disp = float(np.std(arr) / 64.0)
    
    return {
        'sha256': sha256,
        'dimensions': {'width': image.width, 'height': image.height, 'format': image.format or 'JPEG'},
        'signal_metrics': {
            'high_freq_ratio': round(high_freq_ratio, 4),
            'noise_variance': round(noise_var, 4),
            'texture_dispersion': round(texture_disp, 4)
        },
        'visualizations': {
            'fft_spectrum': generate_fft_spectrum_base64(image),
            'noise_residual': generate_noise_residual_base64(image),
            'ela_artifact': generate_ela_base64(image)
        }
    }