# Frontend Module - Elo Orgânico

This module comprises the user interface (Client-Side) of the Elo Orgânico platform. It is a modern **Single Page Application (SPA)**, developed to offer a fluid, responsive, and accessible experience for both administrators and end customers.

## 🎨 Design System and UX

The interface was built following rigorous usability and visual identity standards:

* **Visual Identity**: Color palette inspired by the Atlantic Forest and **Nunito** typography for readability and visual comfort.
* **Responsiveness**: *Mobile-First* layout, adapting perfectly to mobile devices and desktops.
* **Internationalization (i18n)**: Architecture prepared for multiple languages (default `pt-BR`).

## 🛠 Technology Stack

* **Core**: [React 19](https://react.dev/)
* **Build System**: [Vite](https://vitejs.dev/) (Optimized compilation)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Utility-First CSS)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Simplified data flow)
* **HTTP Communication**: Axios (Interceptors and centralized error handling)

---

## 📂 Directory Structure

The source code is organized by *Features*, promoting cohesion and modularity:

```text
src/
├── assets/           # Static resources (Images, Fonts, SVGs)
├── components/       # Reusable UI component library (Atomic Design)
├── constants/        # Static definitions and configurations
├── domains/          # API integration layer and Stores (Zustand)
├── features/         # Functional Modules
│   ├── admin/        # Control Panel (Management)
│   ├── shop/         # E-commerce and Catalog (Customer)
│   ├── auth/         # Authentication Flows
│   └── landing/      # Institutional Page
├── i18n/             # Translation configurations
└── lib/              # Third-party library configuration
```

---

## 💻 Local Development

To run the frontend in isolation in a development environment:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

> **Technical Note**: for full functionality (Login, Catalog, Checkout), the **Backend** must be running and accessible on the configured port.

---

## 📦 Build and Deploy

The build process generates optimized static assets in the `dist/` directory.

```bash
npm run build
```

In a production environment (Docker), these artifacts are served by a high-performance **Nginx** server, configured as a Reverse Proxy and static file server.