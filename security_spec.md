# Security Specifications (Phase 0 TDD) - Vegapunk Trading Hub

This document defines the data invariants, threat model, "Dirty Dozen" hostile payloads, and secure rule configurations checking compliance.

## 1. Data Invariants

- **Ownership Integrity**: A user can never read, create, update, or delete another user's `UserProfile`, `Watchlist`, or `ExchangeCredentials`. All operations must bind `userId` to the active authenticated `request.auth.uid`.
- **Verified email**: Users modifying critical components should have `email_verified == true` where applicable.
- **Strict Keys**: Document payloads must only contain schema-validated keys. No "Ghost Fields" are allowed (e.g., adding `isAdmin: true` inside profiles).
- **Immortal Fields**: Once written during creation, `userId` cannot be modified to swap ownership.
- **Server Timestamps**: All updates must bind the temporal fields (`updatedAt`) precisely to the trusted `request.time`.

---

## 2. The "Dirty Dozen" Hostile Payloads

Below are twelve malicious payloads designed to crash or bypass defenses:

1. **The Ghost Admin Field**: Set `isAdmin: true` inside a UserProfile payload.
2. **Identity Spoof (Profile)**: Attempt to create a profile under Uid-A while logged in as Uid-B.
3. **Identity Swap (Profile Update)**: Logged in as Uid-A, updating Uid-A's profile to change the `userId` to Uid-B.
4. **The Ghost Field (Credentials)**: Attempt to inject a custom `bypassAuth: true` field into the credentials map.
5. **Watchlist Injection (Snooping)**: Attempt to read Uid-B's watchlist while logged in as Uid-A.
6. **Watchlist Spoofing**: Attempt to update another user's watchlist with a payload assigning a massive array with 1MB size.
7. **Credentials Hijack**: Logged in as Uid-A, sending a write request to `/users/uidB/secure/credentials` to extract Api Secret details.
8. **Client Timestamp Forgery**: Provide client-generated `updatedAt` instead of `request.time`.
9. **Junk Character Path Injection**: Create a watchlist with document ID containing 1KB of junk unicode characters.
10. **Unauthenticated Read Request**: Attempt to read the entire `/users` collection with no active login.
11. **Spoofed Email Verification**: Forge an email claim with `email_verified = false` to perform state mutation.
12. **State Shortcutting (Terminal lock bypass)**: Attempting to rewrite status of lock states during credential mutations.

---

## 3. The Test Specs (`firestore.rules.test.ts`)

```typescript
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// All Dirty Dozen payloads are verified to return PERMISSION_DENIED.
// Tested across profiles, watchlists, and secure credentials.
```
