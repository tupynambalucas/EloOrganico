# New Feature Implementation: "Feirinha" (Farmer's Market)

**Objective:** Implement a new system feature called "Feirinha" (Farmer's Market). This feature will manage sales at special, physically-located events.

## Key Differences from "Partilha" (Cycle Sharing)

- **Location:** Unlike the main "Partilha" system, which is tied to the Ecovila, "Feirinha" events can take place anywhere.
- **State:** The "Partilha" operates with clear states (Open, Pending, Closed). A "Feirinha" is stateless; multiple events can run concurrently or in close succession without influencing each other.
- **Ordering:** If a "Feirinha" date coincides with a "Partilha" date, orders are processed together, but they remain logically separate entities.

## Core Requirements

### 1. Data Isolation

- **Separate Tracking:** "Feirinha" products must be tracked independently from "Partilha" products.
- **Dedicated Database Document:** A separate database model/document must be created for "Feirinha" events and sales. This is crucial for administrators to monitor event progress and differentiate sales channels (Feirinha vs. Partilha).

### 2. Payment Processing

- **Immediate Payment:** All "Feirinha" purchases must be paid for at the time of the transaction.
- **No Credit/Debit System:** The existing credit/debit system used in "Partilha" (where members can carry a balance) does **not** apply to the "Feirinha". Because these events can happen anywhere with potentially non-recurring customers, a "pay-as-you-go" model is mandatory.
- **Payment Registration:** The system must record "Feirinha" payments separately from "Partilha" payments to ensure clear financial accounting for administrators.

### 3. Administrative Interface

- **Dedicated Panel:** Just as the "Partilha" has its own management panel, the "Feirinha" feature requires its own dedicated interface within the admin dashboard. This will allow for the creation, management, and monitoring of market events and their associated sales.
