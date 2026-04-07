# 🗺️ Elo Orgânico - Strategic Roadmap

This document outlines the development trajectory of the Elo Orgânico platform, categorizing goals into immediate implementation milestones and long-term architectural evolutions.

---

## 🚀 Next Milestone: "Feirinha" (Farmer's Market)

**Status:** Planned / Next Up  
**Objective:** Expand the platform's utility beyond scheduled cycles to manage physical, real-time sales events.

### Core Requirements
- **Data Isolation:** Dedicated database models for "Feirinha" events to differentiate them from "Partilha" (Sharing Cycle) sales.
- **Pay-as-you-go Model:** Mandatory immediate payment processing (Pix) for all transactions, bypassing the internal credit/debit system used for community members.
- **Administrative Control:** A dedicated management panel for event creation, product tracking, and financial reconciliation specifically for physical market events.
- **Stateless Operation:** Ability to run multiple concurrent or successive market events independently of the global sharing cycle state.

---

## 🔭 Long-Term Vision (SaaS Evolution)

**Focus:** Transitioning from "Single-Instance Mastery" to a "Multi-Tenant Marketplace."

### 1. SaaS Transition & Multi-Tenancy
- Evolve the architecture to support multiple ecovillages and private condominiums within a single infrastructure.
- Implement tenant-level branding and configuration.

### 2. Specialized Portals
- **Producer Portal:** Empower farmers to manage their own inventories, pricing, and availability directly within their community's instance.
- **Logistics Dashboard:** Advanced reporting for consolidated cycle data and harvest planning.

### 3. Advanced Features
- **Subscription Model:** Automated recurring baskets for loyal community members.
- **Smart Routing:** Geolocation-based optimization for delivery routes based on consolidated cycle data.
- **Community Insights:** BI dashboards to visualize consumption trends and assist local producers in production planning.

---

*Last Updated: April 2026*
