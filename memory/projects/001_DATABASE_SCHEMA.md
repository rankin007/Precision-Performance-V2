created: 27/03/2026
last_updated: 27/03/2026
status: active

# Project 001: Supabase Database Schema Design

## Objective
Establish the foundational PostgreSQL schema to support multi-tenant portals, equine bio-analysis logs (urine/saliva), and performance tracking.

## Requirements
- **Tenancy:** Trainers must manage multiple Horses; Clients must view specific Horses.
- **Bio-Logs:** Support for Brix, pH (Urine/Saliva), Conductivity, Nitrates, Temperature, and Weight.
- **Performance:** Tracking for 'Results of Event', 'Distance', and 'Time'.
- **Media:** Integration with Supabase Storage for the Photo Gallery.
- **Comments:** Threaded 'Trainer Comments' for every data input entry.

## Status
- [x] Initial Schema Draft
- [x] Relationship Mapping (Logic Map)
- [x] SQL Migration Script for Supabase
