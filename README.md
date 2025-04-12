**ECE1724 Project: Relationship Enhancement Web Application**

**Shirley Qin**
Department of Electrical and Computer Engineering
University of Toronto
Toronto, Canada
shirley.qin@mail.utoronto.ca

**Yuyang(Ryan) Zeng**
Department of Electrical and Computer Engineering
University of Toronto
Toronto, Canada
ryanyy.zeng@mail.utoronto.ca

## **1. Motivation**

Maintaining a strong and healthy relationship requires effort, communication, and shared experiences. Many couples struggle with organizing important dates, preserving memories, and staying connected, especially in long-distance relationships or busy daily lives. While several existing applications address individual aspects of relationship management, there is no single solution that integrates event tracking, shared albums with commenting, and real-time location sharing into a unified experience.

As a team of two developers who are also a couple, we personally experience the challenges of managing different aspects of our relationship using multiple apps. We often find ourselves using separate platforms for tracking important dates, sharing travel photos, and occasionally checking each other’s location for convenience. However, juggling between different apps is inefficient and impersonal. We wanted to create a single platform designed specifically for couples that seamlessly integrates these essential features into one space.

This project is not just a technical challenge for us—it is a meaningful application that we would personally use, making it an exciting opportunity to build something practical and valuable for other couples as well.

### **Problem Statement**

Many couples like us have used multiple apps to manage different aspects of their relationships:

​ • **Calendar Apps** (DaysMatter) for tracking important dates.

​ • **Photo Sharing Apps** (iCloud) for sharing and storing memories.

​ • **Location Sharing Apps** (Zenly) for staying connected.

However, these apps are not designed specifically for couples and lack a dedicated, integrated experience. Managing multiple apps can be inconvenient, disjointed, and impersonal. Couples often want a personalized space where they can track their relationship milestones, cherish shared moments, and stay connected in real-time.

Our project aims to bridge this gap by creating a couple-centric web application that combines:

​ 1. **Tracking important dates** (anniversaries, birthdays, and special milestones).

​ 2. **A shared album with commenting** (to store and discuss photos together).

​ 3. **Real-time location sharing** (to improve connection and safety).

#### **Target Users**

​ • **Committed Couples**: Couples looking to maintain and strengthen their relationships.

​ • **Long-Distance Couples**: Those who rely on technology to stay connected.

​ • **Busy Professionals**: Those who need an easy-to-use, organized way to track their relationship.

​ • **New Couples**: Those wanting a digital way to document and celebrate their relationship milestones.

---

## **2. Objective and Key Features**

### **Objective**

Develop a full-stack web application where couples can track important dates, share photos with comments, and view each other’s real-time location in a seamlessly integrated experience.

#### **Key Features**

​ 1. **User Registration & Authentication**

​ • Email/password login with email verification.

​ • Google login integration using NextAuth.js.

​ • Users can register with their name, email, and password.

​ • Users will need to verify their email to activate the account.

​ • To ensure security, hash password using bcrypt.js

​ 2. **Partner Linking System**

​ • Users who sign up will initially access only their own data.

​ • A user can generate a unique partner code.

​ • Their partner can enter this code to establish a relationship link.

​ • Once linked, they will have shared access to features.

​ • A user account can only generate one unique partner code and link to one other user.

​ • Once two users are linked, the feature disappears (no option to generate a new code).

​ • No unlinking is allowed, ensuring that users remain permanently linked (ensuring that the application remains exclusive for couples and prevents unintended misuse, such as linking with multiple people or frequent partner switching)

​ 3. **Important Date Tracking**

​ • Users can add, edit, and delete significant dates (anniversaries, birthdays)

​ • Linked partners can see and share their important dates.

​ • Automated reminders for upcoming events (TBD - optional feature)

​ • Dates stored in PostgreSQL, ensuring structured relational data.

​ 4. **Shared Photo Albums with Commenting**

​ • Users can upload photos to shared albums.

​ • Photos are stored securely using cloud storage (AWS S3 /Supabase Storage).

​ • Real-time commenting for each photo.

​ • Uses WebSockets (socket.io) or Supabase Realtime to provide instant updates.

​ 5. **Real-Time Location Sharing**

​ • Users can choose to share their live location with their partner.

​ • Google Maps API integration to display location visually.

​ • Uses WebSockets for real-time updates.

​ • Users can toggle location sharing ON/OFF (TBD - optional feature)

#### **Technical Implementation Approach**

**Architecture Choice: Next.js Full-Stack**

We will implement **Next.js 13+ with the App Router** for both frontend and backend logic.

​ **Frontend**

​ • **Framework:** Next.js 13+ (Server Components).

​ • **Styling:** Tailwind CSS + shadcn/ui for UI components.

​ • **Authentication:** NextAuth.js for email/password & Google login.

​ • **State Management:** Server Actions for form handling and API mutations.

​ • **Real-time Interactivity:** WebSockets for comments and location sharing.

​ **Backend**

​ • **Database:** PostgreSQL, managed using Prisma ORM.

​ • **API Routes:** Built-in Next.js API Routes for data handling.

​ • **File Handling:** Cloud storage for photo uploads (AWS S3/Supabase Storage).

​ • **WebSockets (socket.io)**: Real-time communication for location tracking and comments.

---

This project will help couples maintain stronger relationships by combining important date tracking, shared photo albums with real-time commenting, and real-time location sharing into a single, integrated web application. Using Next.js Full-Stack, we ensure efficient performance, scalability, and ease of deployment. By dividing tasks effectively, we can realistically complete the project within the course timeframe.
