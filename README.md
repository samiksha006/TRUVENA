# 🛡️ TRUVENA

## AI-Powered Synthetic Media Forensics & Trust Intelligence Platform

> **Detect the Unknown. Discover the Source. Protect the Truth.**

TRUVENA is an AI-powered synthetic media forensics platform that goes beyond simple **AI vs. Real** classification.

It combines AI-based detection, multi-layer forensic analysis, **Media DNA fingerprinting**, known-generator attribution, unknown-pattern clustering, and emerging-generator intelligence into a unified investigation workflow.

---

## 🚀 Why TRUVENA?

AI-generated media is becoming increasingly realistic, making it harder to distinguish authentic content from synthetic content.

Traditional AI detectors often answer:

> **"Is this media AI-generated?"**

TRUVENA goes further:

- Is the media potentially synthetic?
- What forensic evidence supports the decision?
- Does its forensic fingerprint resemble a known generator?
- If there is no known match, have similar patterns appeared before?
- Is the unknown pattern recurring?
- Could it indicate a potential emerging generator?

### 💡 Core Innovation

> **TRUVENA treats unknown synthetic-media patterns as intelligence rather than as a dead end.**

---

# 🧬 Media DNA

**Media DNA** is the core forensic representation of TRUVENA.

Instead of producing only an AI probability score, TRUVENA creates a multidimensional forensic fingerprint from multiple media characteristics.

### Media DNA includes:

- 🔊 Frequency characteristics
- 🧩 Residual / Edge patterns
- 🎨 Texture characteristics
- 📦 Compression / ELA indicators
- 🧠 Semantic signals
- ⚠️ Visual artifacts
- ⚙️ Generator-related similarity patterns

This fingerprint enables forensic comparison, generator similarity analysis, unknown-pattern detection, and cluster formation.

---

# 🔍 Core Workflow

```text
MEDIA INPUT
     ↓
AI DETECTION
     ↓
FORENSIC ANALYSIS
     ↓
MEDIA DNA
     ↓
GENERATOR REGISTRY
     ↓
 ┌───────────────┐
 │ Known Match?  │
 └───────┬───────|┘
        YES     NO
         ↓       ↓
    ATTRIBUTION  UNKNOWN
                   ↓
             PATTERN CLUSTER
                   ↓
               RECURRING
                   ↓
          EMERGING WATCHLIST

```

# ✨ Features

- 🤖 AI-powered synthetic media detection
- 🔬 Multi-layer forensic analysis
- 🧬 Media DNA fingerprinting
- ⚙️ Known-generator similarity and attribution
- 🔍 Unknown-pattern detection
- 🧩 Dynamic forensic clustering
- 🚨 Emerging-generator watchlist
- 📊 Risk and trust scoring
- 📋 Detailed forensic investigation reports
- 🔐 Provenance and watermark indicators
- 👤 Human validation and registry promotion
        
---

# 🏗️ Architecture

```text
                ┌──────────────────┐
                │    MEDIA INPUT   │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │   AI DETECTION   │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ FORENSIC ENGINE  │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │    MEDIA DNA     │
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ GENERATOR        │
                │ REGISTRY         │
                └────────┬─────────┘
                         ↓
                 ┌───────┴───────┐
                 ↓               ↓
              KNOWN            UNKNOWN
                 ↓               ↓
           ATTRIBUTION      CLUSTERING
                                 ↓
                          RECURRING PATTERN
                                 ↓
                       EMERGING WATCHLIST
```

---

# 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Tailwind CSS
- Vite

### Backend

- Python
- FastAPI
- REST API

### AI / Machine Learning

- Hugging Face
- Image Classification
- Synthetic Media Detection

### Forensic Analysis

- FFT / Frequency Analysis
- Residual / Edge Analysis
- Texture Analysis
- Entropy Analysis
- Error Level Analysis (ELA)
- Media DNA Fingerprinting

### Intelligence Layer

- Generator Registry
- DNA Similarity Analysis
- Unknown-Pattern Clustering
- Emerging-Generator Watchlist
- Risk & Trust Scoring

---

# 📁 Project Structure

```text
TRUVENA/
│
├── backend/
│   ├── api/
│   │   ├── routes_analysis.py
│   │   ├── routes_dashboard.py
│   │   └── routes_intelligence.py
│   │
│   ├── core/
│   │   ├── ai_detector.py
│   │   ├── cluster_engine.py
│   │   ├── config.py
│   │   ├── forensic_engine.py
│   │   ├── generator_registry.py
│   │   ├── media_dna.py
│   │   └── sample_data.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/samiksha006/TRUVENA.git
cd TRUVENA
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

Activate the virtual environment:

```bash
venv\Scripts\activate
```


### Run the Backend

```bash
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open the URL shown by Vite, typically:

```text
http://localhost:5173
```

---

# 🚀 Prototype

TRUVENA has been developed as a **functional web-based prototype** demonstrating an end-to-end synthetic media forensic investigation workflow.

### 🔎 Prototype Capabilities

- Upload and analyze media
- AI-generated media detection
- Multi-layer forensic analysis
- Interactive forensic visualizations
- Media DNA generation
- Known-generator attribution
- Unknown-pattern detection
- Dynamic forensic clustering
- Emerging-generator watchlist
- Risk and trust scoring
- Detailed forensic investigation reports
- Provenance and watermark indicators

### 🧬 Unknown Generator Demonstration

TRUVENA can track previously unseen forensic patterns instead of treating them as a one-time unknown result.

```text
Unknown Media
      ↓
   U-001
      ↓
1 Sample → NEW
      ↓
2 Samples → RECURRING
      ↓
3 Samples → EMERGING GENERATOR
```

### 📊 Demonstrated Result

```text
Cluster ID          : U-001
Samples Observed    : 3
Consistency         : 100%
Known Match         : 0%
Novelty              : 100%
Status              : EMERGING GENERATOR
```

This demonstrates TRUVENA's core intelligence loop:

**Unknown → Cluster → Recurring Pattern → Emerging Generator**

---

### 🖥️ Prototype Interface

The prototype provides dedicated interfaces for:

- Dashboard
- Media Analysis
- Forensic Investigation Report
- Media DNA Explorer
- Unknown Generator Watchlist
- Generator Intelligence
- Adaptive Learning Pipeline

---

# 🔍 Investigation Workflow

TRUVENA follows a structured forensic investigation pipeline:

```text
        MEDIA INPUT
             ↓
       AI DETECTION
             ↓
    FORENSIC ANALYSIS
             ↓
        MEDIA DNA
             ↓
    GENERATOR MATCHING
             ↓
      ┌──────┴──────┐
      ↓             ↓
    KNOWN         UNKNOWN
      ↓             ↓
 ATTRIBUTION    CLUSTERING
                    ↓
            RECURRING PATTERN
                    ↓
          EMERGING WATCHLIST
                    ↓
          HUMAN VALIDATION
                    ↓
          REGISTRY PROMOTION
```

## 🧪 Step-by-Step Investigation

### 1. Media Input
A user uploads an image for forensic investigation.

### 2. AI Detection
TRUVENA estimates the likelihood that the media is AI-generated using an AI image classifier.

### 3. Forensic Analysis
Multiple forensic signals are extracted, including:

- Frequency-domain characteristics
- Residual / edge patterns
- Texture characteristics
- Entropy
- Compression-related evidence

### 4. Media DNA Generation
The extracted signals are combined into a multidimensional **Media DNA fingerprint** representing the forensic characteristics of the media.

### 5. Generator Attribution
The Media DNA is compared against the known generator registry to identify the most similar known generator pattern.

### 6. Unknown Pattern Detection
If the media does not sufficiently match a known generator, TRUVENA treats it as an **unknown forensic pattern** rather than forcing an attribution.

### 7. Dynamic Clustering
Similar unknown Media DNA fingerprints are grouped into the same forensic cluster.

### 8. Emerging Generator Detection
Repeated occurrences of a consistent unknown pattern increase its significance and can place the cluster on the **Emerging Generator Watchlist**.

### 9. Human Validation
Potential emerging patterns can be reviewed and validated before being promoted into the known generator registry.

---

## 🎯 Core Intelligence Loop

**Detect → Analyze → Fingerprint → Attribute → Discover → Track → Alert**

This transforms synthetic-media detection from a **one-time classification task** into a continuous **forensic intelligence workflow**.

---

# 📊 Demonstration / Example Result

TRUVENA was tested using both known synthetic media and previously unseen forensic patterns.

## 🧪 Unknown Generator Detection

A previously unseen media sample produced the following forensic result:

```text
Classification        : UNCERTAIN / POTENTIAL SYNTHETIC
AI Probability        : 78%
Classifier Signal     : 86.5%
Forensic Score        : 69.8%

Known Generator Match : 0%
Novelty Score         : 100%

Cluster ID             : U-001
Samples Observed       : 3
Consistency            : 100%

Status                 : EMERGING GENERATOR
Risk Level             : MEDIUM
```

## 🔄 Recurring Pattern Detection

The same unknown forensic pattern was analyzed repeatedly:

| Observation | Cluster Status |
|---|---|
| 1st sample | 🆕 NEW |
| 2nd sample | 🔁 RECURRING |
| 3rd sample | 🚨 EMERGING GENERATOR |

This demonstrates that TRUVENA does not simply label an unknown sample and stop.

Instead, it **tracks recurring forensic fingerprints** and identifies when an unknown pattern becomes significant enough to investigate as a potential emerging generator.

## 🎯 Key Demonstration

```text
UNKNOWN
   ↓
U-001
   ↓
RECURRING PATTERN
   ↓
3 SAMPLES
   ↓
100% CONSISTENCY
   ↓
EMERGING GENERATOR
```

### 💡 Result

**TRUVENA transforms an unknown synthetic-media pattern into actionable forensic intelligence.**

---

# 🌍 Applications & Use Cases

TRUVENA can support organizations that need to detect, investigate, and track synthetic media.

### 📰 Journalism & Media Verification

- Verify suspicious images before publication
- Investigate potentially manipulated media
- Provide forensic evidence alongside detection results
- Track recurring synthetic-media patterns

### 🛡️ Cybersecurity & Digital Forensics

- Investigate suspicious digital media
- Identify known generator patterns
- Detect previously unseen synthetic patterns
- Monitor potential emerging generator activity

### 📱 Social Media & Content Platforms

- Screen uploaded media for synthetic content
- Flag suspicious or high-risk media
- Track recurring synthetic-media patterns
- Support content moderation workflows

### 🏢 Organizations & Enterprises

- Verify media used in reports and communications
- Assess authenticity of submitted visual evidence
- Support internal digital investigations
- Generate structured forensic reports

### 🔬 Researchers

- Study forensic characteristics of AI-generated media
- Analyze generator-specific patterns
- Maintain evolving generator registries
- Investigate emerging synthetic-media techniques

---

## 🎯 Potential Impact

TRUVENA moves synthetic-media analysis beyond a simple:

**“Is this AI-generated?”**

toward:

**“What forensic evidence does it contain, does it resemble a known generator, and if it is unknown, does the pattern recur?”**

---

# 🔮 Future Scope

TRUVENA can be extended into a broader multimodal forensic intelligence platform.

### 🎥 Video & Audio Forensics

- Extend Media DNA to video and audio
- Detect synthetic speech and deepfake videos
- Analyze temporal and frame-level inconsistencies
- Track recurring synthetic patterns across media

### 🧬 Multimodal Media DNA

- Combine image, video, audio, and metadata signals
- Build unified forensic fingerprints
- Improve cross-modal synthetic-media analysis

### 🌐 Expanded Generator Registry

- Continuously expand the known-generator registry
- Add new generator signatures and forensic patterns
- Improve similarity-based attribution

### 🤝 Human-in-the-Loop Intelligence

- Expert validation of emerging patterns
- Analyst feedback for forensic investigations
- Controlled promotion of validated unknown patterns into the registry

### 📡 Continuous Monitoring

- Monitor large-scale media streams
- Detect recurring synthetic patterns automatically
- Generate alerts for emerging patterns
- Support real-time forensic intelligence workflows

### 🔐 Stronger Provenance & Authenticity

- Deeper integration with content provenance standards
- Stronger cryptographic verification
- Improved watermark detection and validation

### 🚀 Long-Term Vision

TRUVENA aims to evolve from a **synthetic-media detection prototype** into a **continuous forensic intelligence platform** capable of detecting, attributing, tracking, and investigating the evolving synthetic-media ecosystem.

---

# ⚠️ Limitations & Responsible Use

TRUVENA is designed as a **forensic decision-support system**, not as an absolute authority on media authenticity.

### 🔬 Technical Limitations

- AI-generated media detection is probabilistic rather than absolute.
- Forensic signals can vary across different image sources and processing pipelines.
- Unknown-generator attribution cannot guarantee the exact model or creator.
- Similarity with a known generator should be interpreted as evidence-based attribution, not proof of authorship.
- Provenance and watermark indicators depend on the availability and validity of embedded metadata or supported standards.

### 🛡️ Responsible Use

TRUVENA's results should be interpreted together with:

- Forensic evidence
- Confidence scores
- Provenance information
- Contextual investigation
- Human expert review

The system should **not be used as the sole basis for high-impact decisions** such as legal judgments, disciplinary action, or accusations of fraud.

### 🎯 Design Principle

> **TRUVENA provides forensic intelligence and evidence — not unquestionable truth.**

This approach helps ensure that synthetic-media analysis remains **transparent, explainable, and responsibly applied**.

---

# 🧠 What Makes TRUVENA Different

Traditional synthetic-media detection often focuses on answering a single question:

> **“Is this media AI-generated?”**

TRUVENA goes beyond this by combining **detection, forensic fingerprinting, attribution, and unknown-pattern intelligence**.

| Traditional Detection | TRUVENA |
|---|---|
| AI / Real classification | AI detection + forensic evidence |
| One-time analysis | Continuous pattern tracking |
| Focuses mainly on known patterns | Known + unknown pattern analysis |
| Unknown media remains unidentified | Unknown patterns are clustered |
| Limited attribution | Evidence-based generator similarity |
| Detection-focused | Detection + attribution + discovery |
| Static analysis | Adaptive forensic intelligence |

## 🧬 Core Innovation

```text
            MEDIA
              ↓
         AI DETECTION
              ↓
       FORENSIC SIGNALS
              ↓
          MEDIA DNA
              ↓
     ┌────────┴────────┐
     ↓                 ↓
   KNOWN             UNKNOWN
     ↓                 ↓
 ATTRIBUTION       CLUSTERING
                       ↓
                RECURRING PATTERN
                       ↓
              EMERGING WATCHLIST
```

### 🚀 From Unknown → Intelligence

The key innovation of TRUVENA is its ability to **retain and track unknown forensic patterns**.

Instead of:

```text
Unknown → Stop
```

TRUVENA enables:

```text
Unknown
   ↓
Cluster
   ↓
Recurring Pattern
   ↓
Emerging Pattern
   ↓
Human Validation
   ↓
Registry Promotion
```

This creates a pathway from **individual media detection to evolving synthetic-media intelligence**.

---

## 🎯 The TRUVENA Advantage

**Detect the unknown.  
Discover the source.  
Track the pattern.  
Protect the truth.**

---
