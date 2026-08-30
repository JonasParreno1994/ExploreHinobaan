---
paths:
  - 'app/{Models,Http/Controllers,Http/Requests,Policies}/**/*{Tourist,Reservation,Verification}*.php'
---

# Requests Policies

## Keep tourist accounts on shared users and reservations
Tourists use the existing web guard with role `Tourist`; registered bookings use nullable reservations.customer_id while guest bookings remain null. Identity documents belong to tourist_verifications on the private local disk and may only be streamed through Administrator/Tourism Staff routes; enterprises receive status only.
