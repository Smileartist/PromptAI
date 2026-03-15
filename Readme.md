# PromptAI

PromptAI is a small AI-powered productivity tool designed to help users **generate, organize, and manage AI prompts**.

The application converts **simple user ideas into structured prompts**, automatically categorizes them using AI, and stores them in a searchable prompt library.

This project was built as a technical assessment to demonstrate **system design, AI integration, and maintainable software architecture**.

---

# Live Deployment

Live App (Vercel)
https://your-app-url.vercel.app

Note: The backend (API) is served from the same domain under `/api`.

---

# Product Overview

Many developers, writers, and AI users frequently interact with large language models but struggle to:

* write well-structured prompts
* store useful prompts
* organize prompts for reuse
* quickly retrieve past prompts

PromptAI solves these problems by providing:

1. **AI-powered prompt generation**
2. **automatic prompt categorization**
3. **a searchable prompt library**
4. **a structured prompt management interface**
5. **secure user authentication**

The system is intentionally designed to remain **small, understandable, and extensible**.

---

# Core Features

## AI Prompt Generation

Users provide a simple idea such as:

"create a prompt for react login form"

The system converts it into a well-structured AI prompt using the **OpenAI gpt-4o-mini model**.

Example output:

"Generate a responsive React login form using functional components and Tailwind CSS. Include email and password inputs, validation, error handling, and a submit button."

---

## Automatic Prompt Categorization

After generating the prompt, the AI automatically assigns a category.

Example categories:

* Coding
* Writing
* Marketing
* Design
* Research
* Productivity

The category is stored alongside the prompt in the database.

---

## Prompt Library

Generated prompts are automatically saved to a persistent library.

Each prompt contains:

* id
* original user idea
* generated prompt
* AI category
* timestamp

Users can browse their prompt history through the interface.

---

## Search and Filtering

Users can search the prompt library by:

* keywords
* prompt content
* categories

This allows quick retrieval of useful prompts.

---

# System Architecture

The application follows a simple layered architecture.

React Frontend
↓
Flask REST API
↓
Firebase Firestore (NoSQL)
↓
OpenAI gpt-4o-mini

Responsibilities are clearly separated across system layers.

Frontend handles UI rendering and user interaction.

Backend handles validation, AI integration, and database logic.

The database persists prompt records.

The AI model generates prompts and determines categories.

---

# Technology Stack

Frontend
React
Deployed on Vercel

Backend
Python
Flask API

Database
Firebase Firestore (NoSQL database)

AI Integration
OpenAI gpt-4o-mini

Infrastructure
Unified Hosting: Vercel (Frontend & Backend)

---

# Backend Architecture

The backend follows a modular structure to ensure separation of concerns.

backend/

app.py
routes/
services/
models/
schemas/
tests/

Layer responsibilities:

routes
Defines API endpoints and handles HTTP requests.

services
Contains business logic including AI prompt generation and categorization.

models
Defines Firestore data models.

schemas
Validates input and prevents invalid states.

tests
Contains automated tests for API behavior.

---

# Database Schema

Table: prompts

Fields

id — primary key
user_input — original idea entered by user
generated_prompt — AI generated prompt
category — AI generated category
created_at — timestamp

This schema keeps the system simple while remaining extensible.

---

# API Endpoints

POST /generate

Generates a structured prompt from a simple user idea.

Request

{
"idea": "create a prompt for a marketing email"
}

Response

{
"prompt": "Write a persuasive marketing email promoting a new productivity app...",
"category": "Marketing"
}

The generated prompt is automatically stored in the database if the user is authenticated.

---

POST /auth/register

Registers a new user (via Firebase Auth).

---

POST /auth/login

Logs in an existing user and returns a JWT token.

---

---

GET /prompts

Returns all saved prompts.

Supports optional search query parameters.

Example

GET /prompts?query=react

---

DELETE /prompts/{id}

Deletes a prompt from the library.

---

GET /health

Health check endpoint used for monitoring and deployment validation.

Response

{
"status": "ok"
}

---

# AI Integration

PromptAI integrates the **OpenAI gpt-4o-mini model** for two tasks:

1. Prompt generation
2. Prompt categorization

The AI receives a structured instruction:

"You are a prompt engineering assistant. Convert a user's simple idea into a well-structured AI prompt and assign the most appropriate category."

Example input

"prompt for react login page"

Example output

Prompt:
"Generate a responsive React login form component using functional components and Tailwind CSS."

Category:
Coding

The backend service handles AI requests and sanitizes responses before storing them.

---

# Interface Safety

Validation rules prevent invalid data from entering the system.

Examples:

* user input must not be empty
* prompt length limits enforced
* category must match allowed values
* structured JSON responses enforced

Validation occurs in backend schemas before database writes.

---

# Observability

Basic logging is implemented to make failures visible and diagnosable.

Examples include:

* AI generation failures
* database write errors
* API request errors

Logging ensures system behavior can be inspected during failures.

---

# Verification

Basic automated tests verify system behavior.

Tests include:

* prompt generation endpoint
* prompt storage
* prompt retrieval
* prompt deletion

These tests ensure behavior remains correct as the system evolves.

---

# AI Usage

AI tools were used to assist with:

* project scaffolding
* component generation
* API design suggestions
* validation logic

All generated code was manually reviewed and modified to ensure correctness and maintainability.

AI agents were constrained using guidance files included in the repository.

---

# Running the Project Locally

Backend

Install dependencies

pip install -r requirements.txt

Run server

python app.py

---

Frontend

Install dependencies

npm install

Run development server

npm run dev

---

# Future Extensions

Potential improvements include:

* prompt sharing
* prompt version history
* prompt optimization suggestions
* analytics for frequently used prompts

---


