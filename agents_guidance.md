# AI Agent Guidance (agents.md)

This document defines the **rules, constraints, and expectations for AI agents** assisting in the development of the PromptVault project.

The purpose of this file is to ensure that AI-assisted development remains **predictable, maintainable, and safe** as the system evolves.

Agents must follow these rules strictly.

---

# Project Overview

PromptVault is a small software product that:

1. Converts simple user text into structured AI prompts
2. Automatically categorizes prompts using AI
3. Stores prompts in a PostgreSQL database
4. Allows searching prompts by keyword and category

Technology stack:

Frontend: React (deployed on Vercel)
Backend: Python + Flask API (deployed on Render)
Database: PostgreSQL
AI Model: Gemini 2.5 Flash

The system must remain **simple, understandable, and easy to extend**.

---

# Development Philosophy

The goal of this project is **clarity and correctness**, not complexity.

Agents must prioritize:

* simple architecture
* predictable code behavior
* small focused functions
* clear boundaries between system layers

Avoid clever abstractions or unnecessary frameworks.

Simple, readable code is preferred.

---

# Architecture Rules

The backend follows a layered architecture.

routes → HTTP endpoints
services → business logic
models → database models
schemas → input validation

Rules:

Routes must remain thin.

Routes should only:

* receive requests
* validate inputs
* call services
* return responses

Business logic must never live inside route handlers.

AI integration must exist inside **services**.

---

# Frontend Rules

Frontend must remain focused on:

* UI rendering
* user interaction
* calling backend APIs

Frontend must not:

* implement business logic
* communicate directly with AI APIs
* manipulate database data structures

All AI generation must happen in the backend.

---

# AI Integration Rules

The Gemini 2.5 Flash model is used for:

1. prompt generation
2. prompt categorization

AI calls must go through a **dedicated AI service module**.

Agents must never call AI APIs directly inside route handlers.

All AI responses must be sanitized before being stored.

Expected AI output format:

Prompt text
Category

Agents must validate that responses contain both values.

---

# Database Rules

Database: PostgreSQL

Database access must occur only through model layers.

Agents must not:

* write raw SQL inside route handlers
* bypass models
* modify schema without explicit instruction

Schema changes must be documented.

---

# Validation Rules

All user inputs must be validated before processing.

Validation requirements:

* input text must not be empty
* maximum input length enforced
* prompt output must not exceed defined size
* category must match allowed categories

Invalid requests must return structured error responses.

Example error response:

{
"status": "error",
"message": "invalid input"
}

---

# API Design Rules

All endpoints must follow REST principles.

Endpoints must:

* return JSON
* use appropriate HTTP status codes
* include meaningful error messages

Examples:

200 OK
201 Created
400 Bad Request
500 Internal Server Error

Responses must be structured.

Example success response:

{
"status": "success",
"data": {...}
}

---

# Observability Rules

Agents must include logging for important events.

Examples:

* AI generation failures
* database errors
* unexpected exceptions

Logging must not expose API keys or sensitive data.

---

# Error Handling

Agents must ensure failures are visible and diagnosable.

Requirements:

* try/catch blocks for AI calls
* clear error messages
* safe fallbacks where possible

If AI generation fails, return an informative response.

---

# Testing Rules

Any new functionality must include basic tests.

Tests should verify:

* prompt generation endpoint
* prompt storage
* prompt retrieval
* deletion behavior

Tests should validate API responses and database writes.

---

# Dependency Rules

Agents must avoid introducing unnecessary dependencies.

Prefer standard libraries where possible.

New libraries must be justified by clear benefits.

---

# Security Rules

Agents must ensure:

* environment variables store API keys
* API keys are never committed to the repository
* user inputs are sanitized

Sensitive data must never be logged.

---

# Code Style Guidelines

Prefer:

* small functions
* clear naming
* consistent structure

Avoid:

* overly abstract patterns
* deep inheritance
* unnecessary complexity

Files should remain reasonably small and focused.

---

# Deployment Constraints

Frontend must remain deployable on Vercel.

Backend must remain deployable on Render.

Environment variables must be used for:

* database connection
* AI API key

Agents must not hardcode secrets.

---

# Allowed Categories

AI categorization must map prompts to one of the following:

Coding
Writing
Marketing
Design
Research
Productivity
General

If AI returns an unknown category, fallback to **General**.

---

# Change Safety

Agents must avoid changes that create widespread impact.

When introducing new features:

* maintain API stability
* avoid breaking database schema
* keep existing endpoints functional

Backward compatibility must be preserved where possible.

---

# Goal of AI Assistance

AI assistance should help accelerate development while maintaining:

* correctness
* clarity
* maintainability

Agents must produce code that **remains understandable to human developers**.
