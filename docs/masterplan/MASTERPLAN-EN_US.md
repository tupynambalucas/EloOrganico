# **Project Master Plan**

## **Organic Sharing and Management Platform**

| Status: | 🟢 Living Document (Updated January 22, 2026) |
| :--- | :--- |
| **Project:** | Elo Orgânico |
| **Main Scope:** | Digitalization and Optimization of the Organic Product Sharing Chain. |

### **🚀 Phase 1: Functional Proposal and Scope**

This document details the development of a robust digital platform for the optimized management of sharing organic products from the ecovillage. Our strategic goal is to migrate manual processes based on spreadsheets and messages to a centralized, high-performance, and scalable system.

#### **1.1. Scope and Operational Flow**

The solution is architected in two integrated environments: an **Administrative Panel (Backend)** and a **Customer Portal (Frontend)**.

**End-to-End Cycle Flow:**

*   **Cycle Configuration:** The administrator defines and schedules purchase windows (cycles) with opening and closing dates.
*   **Product Ingestion:** A plain text list of products is processed by an intelligent parser that performs automatic validation, typing, and structuring.
*   **Opening of Purchases:** The catalog is automatically enabled for members on the scheduled date.
*   **Order Execution:** Members assemble custom baskets and submit their orders through the portal.
*   **Payment Processing:** Direct integration with the **EFI Bank** API for Pix payments.
*   **Confirmation:** The system performs bank reconciliation and confirms the order automatically.

### **1.2. Summarized Technological Architecture**

A modern and independent stack to ensure agility and control:

| Component | Technology | Primary Benefit |
| :--- | :--- | :--- |
| **Backend** | Fastify (Node.js) + Zod | High performance, strict typing (security), and efficiency. |
| **Frontend** | React 19, Vite, and Zustand | Fast, responsive Single Page Application (SPA) with optimized state management. |
| **Database** | MongoDB Cluster (Self-hosted Replica Set) | Schema flexibility and high transactional availability (ACID). |
| **Infrastructure** | Docker on a Linux VPS (Hetzner Cloud) | Total control, low fixed cost, and portability. |

### **1.3. Key Modules and Features**

| Module | Critical Business Functionalities |
| :--- | :--- |
| **Admin Panel** | 🔒 High-Level Authentication • Complete Cycle Management (CRUD) • **Intelligent Product Parser** • Logistical and Fiscal Reports. |
| **Customer Portal** | 👤 Login/Registration (Fauna Avatars Theme) • **Dynamic and Seasonal Catalog** • Optimized Cart and Checkout • Simplified Payment via **Pix (QR Code / Copy-Paste)**. |

## **⚙️ Phase 2: Technical Specification and Architecture**

### **2.1. Executive Summary**

The architecture is based on a cohesive web application using the JavaScript/TypeScript stack. We prioritize robustness, strict typing (TypeScript Strict Mode), and vendor lock-in independence. The deployment is fully containerized (Docker Compose) on virtual private servers (VPS) in the **Hetzner Cloud**.

### **2.2. Confirmed Technology Stack**

*   **Code Management:** Monorepo managed via NPM Workspaces (backend, frontend, shared).
*   **Backend:** Fastify v5 (API focus, high throughput), Mongoose, Sentry (Error Monitoring).
*   **Frontend:** React 19, Vite (Build performance), Zustand (State Management), TailwindCSS (Styling), GSAP (Animations), i18next (Internationalization).
*   **Language:** TypeScript (Global Strict Mode, ensuring type safety).
*   **Database:** MongoDB (Replica Set for transactional integrity).
*   **Cache & Queues:** Redis and BullMQ (High-speed in-memory cache and job processing).
*   **Source of Truth:** `@elo-organico/shared` package (Contains shared Zod schemas for full-stack validation).
*   **Payment Gateway:** **EFI Bank** Pix API (`sdk-node-apis-efi`).

### **2.3. Design and Infrastructure Decisions**

#### **Hosting Infrastructure (Self-Hosted on Hetzner)**

Adopting a fully containerized architecture maximizes control and optimizes operational costs.

*   **Server:** Low-cost Linux VPS (Ubuntu/Debian) on Hetzner Cloud.
*   **Orchestration:** **Docker Compose** managing the stack in the same private internal network, ensuring security and minimal latency:
    *   `backend`: Node.js API.
    *   `frontend`: Nginx server (Reverse Proxy/Static server).
    *   `db`: MongoDB configured as a Replica Set (rs0) for ACID transactions.
    *   `redis`: In-memory cache for sessions and processing queues.
*   **Competitive Advantage:** Elimination of dependencies on expensive managed services. Communication between the API and the DB occurs via the internal Docker network, resulting in **sub-millisecond** latency.

#### **Data Modeling (Domain-Driven Design - DDD)**

The business logic is organized into domains to facilitate maintenance and scalability:

*   **Auth:** Manages the user lifecycle (User), JWT authentication, and secure sessions persisted in Redis.
*   **Cycle:** Controls the shopping window (openingDate, closingDate, isVisible).
*   **Product:** Catalog of available items, prices, units, and categories.

## **💰 Phase 3: Cost Estimation**

### **3.1. Cost Breakdown**

The **"Self-Hosted"** strategy on Hetzner Cloud provides a highly favorable and predictable cost-benefit ratio.

| Cost Category | Details | Estimated Monthly Cost |
| :--- | :--- | :--- |
| **Hosting (Hetzner Cloud VPS)** | High-Performance Server (Linux VPS) covering Application, Database, and Cache. | **€5.00 to €7.00** (Fixed) |
| **Database & Cache** | Utilization of the VPS's own resources (MongoDB/Redis). | **Zero Additional Cost** |
| **Payment Gateway (EFI Bank)** | Fixed fee per received Pix transaction. | **Variable** (Competitive vs. percentage rates) |
| **Domain and DNS** | Annual registration and maintenance of the domain name. | **Standard Annual Cost** |

### **3.2. Financial Conclusion**

The selected architecture ensures **total predictability** of infrastructure costs. The fixed monthly cost is extremely low, regardless of database query volume or traffic, ensuring the project's long-term financial sustainability.

## **🎨 Phase 4: Brand Development and Visual Identity**

### **4.1. Brand Strategy**

*   **Chosen Name:** Elo Orgânico
*   **Core Concept:** "From peer to peer, from soil to table."
*   **Archetype:** The Everyman / The Neighbor (Accessible, Empathetic, Realistic, and Community-oriented).
*   **Pillars:** Belonging, Honest Simplicity, Human Connection.
*   **Tone of Voice:** Approachable, Uncomplicated, and Partner-like ("We" instead of "The System").

| Slogan | Focus |
| :--- | :---: |
| **Main** | "Your community, our harvest." |
| **Functional** | "Organic sharing, easy as it should be." |
| **Impact (Marketing)** | "As natural as our friendship." |

*   **Logo Concept:** A visual fusion of connection (**Elo**) and nature (**Orgânico**). A symbol with two fluid shapes intertwining to form a link, with one end finishing in the stylized silhouette of a leaf.
*   **Typography:** Friendly, rounded Nunito font, with **Elo** in Bold weight and **Orgânico** in Regular weight.

### **4.2. Design System: Color Palette**
The color identity was developed to evoke the naturalness of the countryside combined with the simplicity of a welcoming community, prioritizing accessibility (WCAG AAA) and semantic flexibility.

*(The color palette details are omitted for brevity but are identical to the Portuguese version).*

## **🔄 Phase 5: Operational Flowchart**

This flow details the complete journey of a sharing cycle in the new **"Always-on"** infrastructure.

### **1. Preparation Stage (Administrator) ⚙️**

*   **Access:** The Administrator accesses the Management Panel (Available 24/7).
*   **Data Ingestion:** The Admin pastes the raw list of products. The Frontend processes (Regex) and structures the data into JSON format.
*   **Cycle Opening:** The Admin sets the opening and closing dates and activates the cycle. The Backend persists the data in the local MongoDB Cluster.

### **2. Shopping Stage (Customer) 🛒**

*   **Navigation:** The Customer accesses the portal and views only the products actively available in the cycle.
*   **Cart:** Adds items (defining quantity and weight, if applicable) and reviews the total order.
*   **Checkout:** Final order confirmation and stock allocation.
*   **Payment:** The system interacts with the EFI Bank API to generate and display the unique **Pix QR Code** for the transaction.

### **3. Closing Stage (Admin/System) 📦**

*   **Closing:** The system **automatically** blocks the creation of new orders at the configured deadline.
*   **Consolidation:** The Admin accesses consolidated order reports (total per product/producer) to begin logistics.
*   **History:** The data is permanently archived and remains available for future consultation and *Business Intelligence* (BI).

## **🌐 Phase 6: Long-Term Scaling to SaaS (Post-v1.0)**

### **6.1. Strategic Vision**
**IMPORTANT:** This phase describes the long-term evolution of the project. The current focus is strictly on Phase 1-5 to deliver a polished single-instance product. SaaS development will only commence after the core application is fully operational.
The long-term goal of Elo Orgânico is to evolve from a single-instance community tool into a **Robust Multi-tenant SaaS Platform**. This will allow other ecovillages, condominiums, and private communities to subscribe and manage their own independent organic sharing cycles.

### **6.2. Key SaaS Features**
*   **Tenant Isolation:** Independent data and configuration for each community (subdomains or tenant IDs).
*   **Producer Self-Management:** Farmers gain their own login to manage catalogs, prices, and stock directly, reducing the Admin's workload.
*   **Subscription Management:** Tiered service levels for communities based on order volume or feature requirements.
*   **Global Catalog:** Ability for producers to list products across multiple community "tenants" they serve.

### **6.3. Architectural Evolution**
*   **Database:** Shift to a multi-tenant schema (shared database with tenant isolation or separate databases per tenant).
*   **API:** Dynamic routing and authentication middleware capable of identifying and isolating tenant-specific requests.
*   **Infrastructure:** Scalable cluster (Kubernetes or similar) to handle growing traffic from multiple communities simultaneously.
