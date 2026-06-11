#  IrshadStore POS & Inventory Dashboard

A high-performance, professional **Point of Sale (POS)** and **Sales Analytics** dashboard. This application is designed to streamline retail operations with a focus on speed, data persistence, and a premium "Deep Blue" aesthetic.

### 🔗 [Live Demo on Vercel]( https://sales-tracker-cyan.vercel.app/ )

---

##  Overview
IrshadStore is a React-based solution for small to medium-sized retail businesses. It bridges the gap between simple data entry and business intelligence by providing real-time sales tracking, automated goal monitoring, and one-click data portability.

##  Key Features

### **1. Professional POS Interface**
* **Smart Search:** Real-time filtering across 50+ inventory items using optimized search logic.
* **Dynamic Categorization:** Items sorted by 'Loose', 'Fixed', and 'Count' with professional color-coded badges.
* **Advanced Modal Logic:**
    * **Sliding Unit Toggle:** Seamlessly switch between KG/Grams or Litre/ML with a custom-animated slider.
    * **Quantity Presets:** Quick-select buttons for fixed-unit items (e.g., 1.0 Unit, 500 Sub) to speed up checkout.

### **2. Business Analytics (Reporting Page)**
* **Daily Goal Tracking:** A visual progress bar monitors daily revenue against a **50,000 PKR target**.
* **Automated Insights:** Real-time calculation of **Top Selling Item** and **Average Order Value**.
* **Transaction History:** A detailed table of all daily sales with a **VOID** feature to manage and correct entry errors.

### **3. Data Management**
* **Persistence:** Leverages the `localStorage` API to ensure sales data survives browser refreshes or accidental tab closures.
* **CSV Export:** Professional-grade export feature to download sales data for Excel, Google Sheets, or accounting software.

## 🛠️ Technical Stack
* **Core Framework:** React.js (Functional Components & Hooks)
* **State Management:** `useState` for UI, `useEffect` for data sync, and `useMemo` for search performance.
* **Styling:** Advanced CSS3 (Custom Properties, Glassmorphism, CSS Grid & Flexbox).
* **Typography:** Outfit (via Google Fonts).
* **Deployment:** Vercel.

## 📂 Project Structure
```text
src/
├── App.js         # Main Application logic & Analytics Engine
├── App.css        # Premium Dark Theme & Responsive Layouts
├── Inventory.js   # Structured product database (50+ items)
└── index.js       # React Entry point
