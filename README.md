# SlotSwapper

SlotSwapper is a peer-to-peer time-slot scheduling application. The core concept allows users to mark their busy calendar slots as "swappable," making them visible to other users. Anyone can then browse these available slots and request to trade one of their own swappable slots for it. This creates a flexible marketplace for time management.

This project is a fully-featured frontend prototype built with React and TypeScript, demonstrating the complete user flow from authentication to the core swapping logic.

![SlotSwapper Screenshot](https://i.imgur.com/8a3gY2k.png)

---

## Table of Contents

- [Design Choices](#design-choices)
- [Local Setup & Running the Project](#local-setup--running-the-project)
- [How to Use the Application](#how-to-use-the-application)
- [Simulated API Endpoints](#simulated-api-endpoints)
- [Assumptions and Challenges](#assumptions-and-challenges)

---

## Design Choices

### 1. Technology Stack

-   **Frontend:** The application is built using **React** with **TypeScript**. This combination provides a robust, scalable, and maintainable foundation for a modern web application. React's component-based architecture is ideal for building a complex UI, while TypeScript adds static typing to prevent common errors.
-   **Styling:** **Tailwind CSS** is used for styling. This utility-first framework allows for rapid development of a clean, responsive, and consistent user interface directly within the markup, avoiding the need for separate CSS files.
-   **Backend & Database Simulation:** To focus on building a complete frontend experience, the backend and database are simulated directly in the browser.
    -   **Mock API (`services/mockApi.ts`):** All backend logic, including user authentication, event management, and the swap request lifecycle, is handled by a mock service class. This service mimics the behavior of a real REST API.
    -   **Browser `localStorage`:** All application data (users, events, swap requests) is persisted in the browser's `localStorage`. This makes the prototype stateful across page reloads without requiring a database setup. In a production environment, this would be replaced with a real database like PostgreSQL or MongoDB.

### 2. State Management

-   For this prototype, we've used React's built-in hooks (`useState`, `useEffect`, `useCallback`) for state management. This approach is lightweight and sufficient for the current scale of the application, avoiding the need for external libraries like Redux or MobX. State is fetched from the mock API upon page navigation to ensure data is fresh.

### 3. User Experience (UX)

-   The UI is designed to be clean, intuitive, and task-oriented.
-   A central modal is used for the "Request Swap" flow, guiding the user through selecting one of their own slots to offer in exchange.
-   Visual cues, such as status pills and loading spinners, provide immediate feedback to the user about the state of their events and requests.

---

## Local Setup & Running the Project

This project is designed for maximum simplicity in setup. **No build tools, package managers (like npm), or local servers are required.**

**Step-by-step instructions:**

1.  **Download the Files:** Ensure you have all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) in a single folder on your computer.
2.  **Open in Browser:** Simply open the `index.html` file in any modern web browser (like Google Chrome, Firefox, or Microsoft Edge).

That's it! The application will run directly in your browser.

---

## How to Use the Application

The application is pre-seeded with three sample users and their events to allow for immediate testing of the core functionality.

**Sample User Credentials:**

| Name      | Email                 | Password      |
| --------- | --------------------- | ------------- |
| Alice     | `alice@example.com`   | `password123` |
| Bob       | `bob@example.com`     | `password123` |
| Charlie   | `charlie@example.com` | `password123` |

**Recommended Test Flow:**

1.  Log in as **Alice**.
2.  Navigate to the **Dashboard** to see her events. You can create new events or mark her "Team Meeting" as `SWAPPABLE`.
3.  Navigate to the **Marketplace**. You will see swappable slots from Bob and Charlie.
4.  Click "Request Swap" on Bob's "Design Review" slot. A modal will appear.
5.  In the modal, select Alice's "Focus Block" to offer in the trade and send the request.
6.  **Log out**, then log back in as **Bob**.
7.  Navigate to the **Requests** page. You will see an incoming request from Alice.
8.  Click **Accept**. The swap is executed.
9.  Navigate to the **Dashboard**. You will now see that Bob owns the "Focus Block" event, and his "Design Review" event is gone (it now belongs to Alice).

---

## Simulated API Endpoints

The `services/mockApi.ts` file simulates the following backend API endpoints. All functions are asynchronous and include a simulated delay.

| Method                                      | Description                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `signUp(name, email, password)`             | Creates a new user account and logs them in.                                                            |
| `logIn(email, password)`                    | Authenticates a user and creates a session.                                                             |
| `logOut()`                                  | Clears the current user's session.                                                                      |
| `getOwnEvents()`                            | Fetches all calendar events belonging to the currently logged-in user.                                  |
| `createEvent(title, startTime, endTime)`    | Creates a new calendar event for the current user with a default `BUSY` status.                         |
| `updateEventStatus(eventId, status)`        | Updates the status of an event (e.g., from `BUSY` to `SWAPPABLE`).                                      |
| `getSwappableSlots()`                       | **(Marketplace)** Fetches all events from other users that are marked as `SWAPPABLE`.                   |
| `createSwapRequest(mySlotId, theirSlotId)`  | Creates a new `PENDING` swap request and sets the status of both involved slots to `SWAP_PENDING`.        |
| `getSwapRequests()`                         | **(Requests Page)** Fetches all `PENDING` incoming and outgoing swap requests for the current user.     |
| `respondToSwapRequest(requestId, accepted)` | Responds to an incoming request. If accepted, it swaps the `userId` on the two events. If rejected, it reverts their status back to `SWAPPABLE`. |

---

## Assumptions and Challenges

### Assumptions

-   **Frontend Focus:** The primary goal was to deliver a high-quality, fully-functional frontend prototype that covers all user stories. The backend is mocked for this purpose.
-   **No Real-time Updates:** The application does not use WebSockets. Data is refreshed on page navigation, which is sufficient for a prototype. In a real-world scenario, real-time notifications for new swap requests would be a key feature.
-   **Simplified Security:** User authentication is basic. Passwords are not hashed and are stored in plain text in `localStorage`. This is purely for demonstration purposes.
-   **Time Zone Handling:** All date and time operations rely on the user's browser and local system settings. No complex time zone logic has been implemented.

### Challenges

-   **Client-Side Transactional Logic:** The most complex logic was simulating the "transaction" of accepting a swap. This required carefully updating the state of the `SwapRequest` and both `Event` objects in `localStorage` in the correct order to ensure data integrity.
-   **State Management:** Managing the various loading and error states across different pages and components required careful planning to provide a smooth user experience. The `handleApiCall` wrapper function was created to centralize this logic.
-   **UI for Swap Selection:** Designing an intuitive modal for the swap request flow was challenging. It needed to clearly show the target slot while providing a simple way for the user to select one of their own available slots to offer in return.
