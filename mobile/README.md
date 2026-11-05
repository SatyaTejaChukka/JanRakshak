# JanRakshak Mobile App (Flutter)

> **Dual-Mode Civic Governance & Disaster Evacuation Mobile Platform**  
> Built with Flutter (Dart), OpenStreetMap (`flutter_map`), GPS Location (`geolocator`), and REST API integration with FastAPI.

---

## 📱 Features Included

1. **Aadhaar & OTP Citizen Onboarding**:
   - Fields: Full Name, 10-digit Mobile, 12-digit Aadhaar, Municipal Ward selector.
   - Interactive SMS banner simulation with random 6-digit OTP and one-click auto-fill.
   - Verified Citizen badge stored locally in `SharedPreferences`.

2. **Dual-Mode Switching (Civic ↔ Disaster)**:
   - Instant live toggle in AppBar.
   - Dynamic theme switching: Navy/Emerald (Civic) vs Dark Crimson (Disaster).

3. **Disaster Hub & 2×2 Emergency Helplines Grid**:
   - 2 rows × 2 columns grid:
     1. NDRF Disaster Rescue Command (`1078`)
     2. Coastal Marine Police & Coast Guard (`1093`)
     3. AP State Disaster Ops Center (`1070`)
     4. GVMC Disaster Control Room (`1800-425-0001`)
   - Direct automated dialing dialog with live call timer and native dialer trigger.

4. **Live Evacuation Map with Hazard Avoidance**:
   - Live GPS tracking of citizen position.
   - OpenStreetMap vector rendering.
   - Dynamic red hazard pins (flooded roads, fallen 11kV wires).
   - Safe evacuation route polyline bypassing hazard zones to the nearest Cyclone Shelter.

5. **Civic Grievance Reporting**:
   - Pothole & Craters, Drainage Blocks, Fallen Power Lines, Streetlight Outages.
   - Auto-detected GPS coordinates, severity level, geotagged photo proof attachment.

6. **Cyclone Shelter Capacity Monitor**:
   - Real-time occupancy percentage bar, available beds count.
   - Amenities badges (RO Water, Genset, Mobile Clinic).
   - Direct call button to Medical Officer on duty.

7. **5-Second SOS Panic Trigger**:
   - Countdown timer with instant cancel button to prevent false alarms.
   - Automatic dispatch of coordinates to NDRF 10th Battalion.

---

## 🚀 How to Run in VS Code

1. **Open Folder in VS Code**:
   - Click `File` -> `Open Folder...` -> Select `C:\janrakshak\janrakshak_mobile`.

2. **Download Flutter SDK (if prompted)**:
   - If VS Code asks to locate the SDK: press `Ctrl + Shift + P`, select `Flutter: Download SDK`, and pick a directory like `C:\src\flutter`.

3. **Fetch Dependencies**:
   ```powershell
   flutter pub get
   ```

4. **Launch Application**:
   - Select your target device (Android Emulator, Physical Phone with USB Debugging, or Chrome Web).
   - Press `F5` or run:
     ```powershell
     flutter run
     ```
