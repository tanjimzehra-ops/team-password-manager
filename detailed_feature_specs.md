# 📝 Detailed Feature Specifications: Jigsaw 1.6 RSA

This document defines exactly how we will build the core interactions for cards, colors, and performance features. **This is a local proposal for review before any code is written.**

---

## 1. 📂 Node Detail Sidebar (View Mode)
When a user clicks a card in "View" mode, the sidebar opens. Here is the data hierarchy we will implement:

| Section | Data Included | Purpose |
| :--- | :--- | :--- |
| **Top Banner** | Title, ID, Category Badge | Instant recognition of what the user clicked. |
| **Description** | Long-form "Strategic Intent" text | Explaining the *Why* behind this resource or outcome. |
| **Performance Quickview** | Current KPI Value + Monthly Trend | See if the node is "Red" or "Green" without deep clicking. |
| **Dependency Links** | "Connected to..." list | Visual list of other cards that share this resource. |
| **ERIC Integration** | Direct Report Button | Link to the high-level data source for deep analysis. |

---

## 2. ✏️ Node Edit Logic (Edit Mode)
When in "Edit" mode, clicking a card opens the **Edit Popup**.

*   **Primary Data**: Title and Strategic Description.
*   **KPI Tuning**: A slider or input to set a **Target KPI** (e.g., "Aim for 85%").
*   **Color Override**: A boutique color picker to change the card's identity color manually.
*   **Logic Link**: A selector to choose which category it belongs to (Outcome, Value-Chain, or Resource).

---

## 3. 🎨 The Strategic Color System
We move from "random colors" to a meaningful **Dual-Layer Strategy**:

### Layer 1: Identity (Planning)
*   **Teal/Indigo**: Represents **Strategic Direction** (Purpose & Outcomes). 
*   **Steel/Blue**: Represents **Operational Strength** (Value Chain).
*   **Green/Sage**: Represents **Resilience & Growth** (Resources).

### Layer 2: Performance (Monitoring)
When "Performance Mode" is active, colors temporarily shift to health indicators:
*   **Inner Core**: The "Identity" color moves to a small badge in the corner.
*   **Glow/Border**: The card pulses with **Healthy Green (90%+ )**, **Warning Amber (60%-89%)**, or **Critical Red (<60%)**.

---

## 4. 📈 Performance Mode Enhancements
You asked about the "Color/Order Mode" in Performance View. **Decision: We should separate them.**

*   **View Performance**: Focus is strictly on "Monitoring." We hide drag handles and color pickers.
*   **Add Sparklines**: We will add a tiny "Heartbeat" chart to every card in Performance Mode. This shows the trend (Going up? Going down?) without having to open the Sidebar.

---

## 5. 🖥️ Dashboard Architecture (Client vs. Admin)
The Dashboard is the "Nerve Center" that greets users. We differentiate between those running a strategy and those managing the whole platform.

### A. 🏢 Client Dashboard (The "Strategic Cockpit")
*Focus: Execution, Monitoring, and Momentum.*
*   **Health Donut**: A visual breakdown of Healthy vs. At-Risk nodes across all their systems.
*   **Strategic Queue**: A prioritized list of "Weak Links" that need data updates or budget reviews.
*   **Recent Collaborations**: A mini-feed of who in their team updated the models recently.
*   **Library Recommendations**: Intelligent cards from the Master Library that fit their industry (e.g., Energy, Health, HR).

### B. 🛠️ Admin Dashboard (The "Control Tower")
*Focus: Management, Standardization, and Oversight.*
*   **Portfolio Pulse**: Total active systems, total nodes, and average KPI health across **all** clients.
*   **Client Manager**: Toggles to enable/disable premium features (Galaxy View, Mirroring) for specific users.
*   **Master Library Editor**: A central location to update the standard cards that are pushed out to all clients.
*   **Global Audit Log**: A detailed history of database changes to track system-wide integrity.
*   **Sync Health**: Real-time monitoring of Convex database connections and environment status.

---

## 🎯 Next Steps & Implementation
Once you approve this logic:
1.  I will update the `NodeDetailSidebar.tsx` to include the **Dependency Links**.
2.  I will create the **Sparkline Component** for the `NodeCard.tsx`.
3.  I will refine the **Performance Modal** charts to use real trend data.
4.  I will create a **Dashboard Mockup** (local file) for the Client/Admin views.

**How does this breakdown look to you?**
