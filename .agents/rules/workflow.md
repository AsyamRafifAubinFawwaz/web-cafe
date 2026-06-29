---
trigger: always_on
---

# WORKFLOW EXECUTION BINDING (WORKFLOW.MD)
**Alur Kerja Sekuensial:** `prd.md` ➔ `guideline.md` ➔ `task.md` ➔ `plan` ➔ `build`

---

## 1. Rincian Tahapan Eksekusi

*   **TAHAP 1: PRD & DBML** ➔ Pahami batasan paket fitur dan relasi skema database.
*   **TAHAP 2: GUIDELINE** ➔ Terapkan aturan teknis wajib (*soft deletes*, *snapshot pricing*, *state machine*, dan *regex parser*).
*   **TAHAP 3: TASK** ➔ Pilih **satu** sub-task spesifik yang akan dikerjakan dari `task.md`.
*   **TAHAP 4: PLAN** ➔ Sebelum koding, jabarkan rencana teknis:
    *   Daftar file yang akan dibuat/diubah.
    *   Logika kode & dampak database.
    *   *Minta persetujuan user sebelum lanjut.*
*   **TAHAP 5: BUILD** ➔ Tulis kode, pastikan bebas eror, dan berikan centang `[x]` pada `task.md` setelah selesai.

---

## 2. Aturan Mutlak (Guardrails)

*   **No Plan, No Code:** Jangan menulis kode satu baris pun tanpa melalui tahap *PLAN* dan persetujuan user.
*   **Anti-Context Drift:** Tetap fokus pada spesifikasi dokumen. Tolak atau ingatkan jika instruksi melenceng dari cakupan.
*   **Defensive Coding:** Wajib sertakan *error handling* (*try-catch*) dan sanitasi input pada setiap manipulasi data.