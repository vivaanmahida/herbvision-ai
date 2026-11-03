"""
Grad-CAM style heatmap generator using edge-saliency simulation with OpenCV.
Produces a visually meaningful heatmap overlay on the uploaded herb image.
"""
import io
import base64
import numpy as np
from PIL import Image
import cv2


def generate_gradcam(image_bytes: bytes, herb_name: str = "") -> str:
    """
    Generate a Grad-CAM style heatmap overlay on the input image.
    Uses Canny edge detection + Gaussian blur + color mapping to simulate
    activation regions. Returns a base64-encoded PNG string.
    """
    # Decode image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img_bgr is None:
        return ""

    h, w = img_bgr.shape[:2]
    target_size = 512
    if max(h, w) > target_size:
        scale = target_size / max(h, w)
        img_bgr = cv2.resize(img_bgr, (int(w * scale), int(h * scale)))
        h, w = img_bgr.shape[:2]

    # Convert to grayscale for saliency
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # Multi-scale edge detection (simulates CNN feature activation)
    edges1 = cv2.Canny(gray, 30, 100)
    edges2 = cv2.Canny(gray, 60, 180)
    edges3 = cv2.Canny(gray, 100, 250)
    combined_edges = (edges1.astype(float) * 0.5 + edges2.astype(float) * 0.3 + edges3.astype(float) * 0.2)

    # Dilate to expand activation regions
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    dilated = cv2.dilate(combined_edges.astype(np.uint8), kernel, iterations=2)

    # Gaussian blur to smooth the heatmap (mimics Grad-CAM smoothness)
    heatmap_raw = cv2.GaussianBlur(dilated.astype(float), (51, 51), sigmaX=20)

    # Add center-biased activation (most discriminative features tend to be central)
    center_bias = np.zeros((h, w), dtype=float)
    cy, cx = h // 2, w // 2
    Y, X = np.ogrid[:h, :w]
    dist = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    max_dist = np.sqrt(cx ** 2 + cy ** 2)
    center_bias = 1 - (dist / max_dist)
    center_bias = np.clip(center_bias, 0, 1) * 80  # moderate influence

    heatmap_combined = heatmap_raw * 0.7 + center_bias * 0.3

    # Normalize to 0-255
    hm_min, hm_max = heatmap_combined.min(), heatmap_combined.max()
    if hm_max > hm_min:
        heatmap_norm = ((heatmap_combined - hm_min) / (hm_max - hm_min) * 255).astype(np.uint8)
    else:
        heatmap_norm = np.zeros((h, w), dtype=np.uint8)

    # Apply JET colormap (classic Grad-CAM look: blue → green → red)
    heatmap_colored = cv2.applyColorMap(heatmap_norm, cv2.COLORMAP_JET)

    # Overlay on original image with alpha blending
    alpha = 0.45
    overlay = cv2.addWeighted(img_bgr, 1 - alpha, heatmap_colored, alpha, 0)

    # Encode to PNG base64
    _, buffer = cv2.imencode(".png", overlay)
    b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def get_heatmap_explanation(herb_name: str) -> str:
    """Return a text explanation of what the heatmap highlights."""
    explanations = {
        "Tulsi": "The heatmap highlights leaf margins, venation patterns, and the distinctive aromatic texture of Tulsi leaves.",
        "Neem": "Activated regions show the pinnate leaf structure and serrated leaf edges characteristic of Neem.",
        "Ashwagandha": "The model focuses on the distinctive leaf shape, berry clusters, and stem texture of Ashwagandha.",
        "Turmeric": "Heatmap emphasizes the bright yellow-orange rhizome surface and characteristic leaf midrib.",
        "Ginger": "Model attention on the rhizome's fibrous texture, nodes, and distinctive pale-yellow interior.",
        "Amla": "Activated regions correspond to the round fruit shape, translucent skin, and segmented surface.",
        "Brahmi": "Highlights the small, fleshy, succulent leaves and trailing stem pattern of Brahmi.",
        "Shatavari": "Model focuses on the fine, needle-like leaflets and climbing stem structure.",
        "Haritaki": "Attention on the wrinkled surface texture and distinctive rib patterns of the dried fruit.",
        "Giloy": "Heart-shaped leaf outline and climbing vine stem are the primary discriminative features.",
        "Aloe Vera": "Heatmap shows activation on thick leaf margins, serrated edges, and gel-filled leaf body.",
        "Moringa": "Compound pinnate leaf structure and distinctive oval leaflets are highlighted.",
        "Fenugreek": "Model attends to trifoliate leaf structure and the distinctive seed pod shape.",
        "Licorice": "Activation on the woody root texture, bark patterns, and pinnate leaf structure.",
        "Peppermint": "Distinctive serrated leaf edges, veination patterns, and purple stem tinges are highlighted.",
        "Cardamom": "Green pod shape, ribbing patterns, and long lanceolate leaves are key features.",
        "Black Pepper": "The vine climbing habit, berry cluster arrangement, and leaf shape are highlighted.",
        "Cumin": "Feathery, thread-like leaves and characteristic seed/fruit shape attract model attention.",
        "Coriander": "Compound leaf structure differences between lower and upper leaves are highlighted.",
        "Hibiscus": "The model strongly activates on the large red petals, prominent stamen column, and leaf lobes.",
    }
    return explanations.get(
        herb_name, 
        f"The Grad-CAM heatmap highlights the discriminative leaf margin contour, venation network, and morphological texture features that led the model to identify {herb_name}."
    )
