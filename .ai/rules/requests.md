---
paths:
  - 'app/{Models,Http/Controllers,Http/Requests}/**/*{Service,Reservation}*.php'
  - 'app/{Models,Http/Controllers,Http/Requests}/**/*{TouristArrival,DailyTouristReport}*.php'
---

# Requests

## Keep enterprise bookings on the shared reservation architecture
Enterprise services use enterprise_services with reservation_items as the single booking source. Room, cottage, and pool behavior is selected by reservation_mode; private pool schedules belong in service_sessions. Pending and confirmed reservations consume inventory, and availability/price/capacity must be rechecked inside the locked database transaction.

## Count actual arrivals separately from reservations
Tourist statistics come only from tourist_arrivals created after actual check-in/service use. Link website arrivals to reservations with a unique reservation_id; never infer arrivals from reservation status. Daily report totals are computed from arrivals, while daily_tourist_reports stores submission workflow only.
