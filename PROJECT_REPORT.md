# SkyStream Airlines - Project Report

## 1. Introduction
SkyStream Airlines is a modern web-based Airline Reservation System designed to provide users with a seamless experience for searching, booking, and managing flight reservations. The application leverages a full-stack architecture with a React frontend and a Node.js/Express backend, integrated with Firebase for real-time data management.

## 2. Objective
The primary objective of this project is to simplify the flight booking process for passengers while providing a robust administrative framework for managing flight schedules and user reservations. Key goals include:
- Real-time flight availability tracking.
- Secure user authentication and profile management.
- Intuitive seat selection and booking workflow.
- Efficient booking history and cancellation management.

## 3. Existing System
Traditional airline reservation systems often suffer from:
- Fragmented user interfaces that are difficult to navigate.
- Lack of real-time updates for seat availability.
- Complex booking processes requiring multiple steps.
- Poor mobile responsiveness.

## 4. Proposed System
SkyStream Airlines addresses these issues by offering:
- **Clean, Modern UI:** Built with Tailwind CSS and Framer Motion for smooth interactions.
- **Real-time Synchronization:** Using Firestore to ensure seat availability is always accurate.
- **Unified Dashboard:** A single place for users to view search results, book tickets, and manage history.
- **Secure Authentication:** Integrated Firebase Auth for safe user data handling.

## 5. Modules Description
- **Authentication Module:** Handles user registration, login, and profile creation.
- **Search Module:** Allows users to filter flights based on source, destination, and date.
- **Booking Module:** Manages passenger details input, seat selection, and reservation logic.
- **Management Module:** Provides users with a history of their bookings and the ability to cancel reservations.
- **Backend API:** An Express.js server that handles health checks and sample data seeding.

## 6. System Architecture
- **Frontend:** React 19, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Express.js.
- **Database:** Firebase Firestore (NoSQL).
- **Authentication:** Firebase Auth.
- **Hosting:** Cloud Run (via AI Studio Build).

## 7. Implementation Details
- **Frontend Logic:** Uses React hooks (`useState`, `useEffect`) and `react-router-dom` for navigation.
- **Database Logic:** Firestore security rules ensure that users can only access their own bookings.
- **Styling:** Utility-first CSS using Tailwind for rapid and consistent design.

## 8. Output Screens
- **Home Page:** Features a hero section with a call-to-action and popular destinations.
- **Flight Search:** A clean interface with filters and detailed flight cards.
- **Booking Page:** A split-view layout showing passenger forms and a fare summary.
- **Confirmation:** A high-impact success screen with a digital ticket view.
- **History:** A list-based view of all past and current reservations with status indicators.

## 9. Conclusion
SkyStream Airlines demonstrates a modern approach to travel technology. By combining a responsive frontend with a scalable serverless backend, it provides a reliable and user-friendly platform for the next generation of travelers.
