import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';
import 'civic_view.dart';
import 'disaster_view.dart';
import 'account_modal.dart';
import 'evacuation_map_screen.dart';
import 'report_ticket_screen.dart';
import 'shelters_screen.dart';

class HomeScreen extends StatefulWidget {
  final bool isDisasterMode;
  final Function(bool) onModeChanged;

  const HomeScreen({
    super.key,
    required this.isDisasterMode,
    required this.onModeChanged,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  UserProfile? _currentUser;

  @override
  void initState() {
    super.initState();
    _loadStoredUser();
  }

  void _loadStoredUser() async {
    final prefs = await SharedPreferences.getInstance();
    final name = prefs.getString('user_name');
    if (name != null) {
      setState(() {
        _currentUser = UserProfile(
          id: prefs.getString('user_id') ?? 'USR-101',
          fullName: name,
          mobileNumber: prefs.getString('user_mobile') ?? '9848012345',
          aadhaarNumber: prefs.getString('user_aadhaar') ?? '123456789012',
          ward: prefs.getString('user_ward') ?? 'Ward 14 (Madhurawada & Coastal)',
          isVerified: true,
          registeredAt: DateTime.now().toIso8601String(),
        );
      });
    }
  }

  void _openAccountModal() {
    showDialog(
      context: context,
      builder: (ctx) => AccountModal(
        currentUser: _currentUser,
        onUserSaved: (user) {
          setState(() => _currentUser = user);
        },
        onLogout: () {
          setState(() => _currentUser = null);
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: widget.isDisasterMode ? Colors.red.shade800 : const Color(0xFF059669),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.shield, size: 20, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'JanRakshak',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  widget.isDisasterMode ? 'Disaster Response Hub' : 'Civic Grievance Desk',
                  style: const TextStyle(fontSize: 10, color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Dual Mode Switch
          Row(
            children: [
              Text(
                widget.isDisasterMode ? 'DISASTER' : 'CIVIC',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: widget.isDisasterMode ? Colors.amberAccent : Colors.greenAccent,
                ),
              ),
              Switch(
                value: widget.isDisasterMode,
                activeColor: Colors.amberAccent,
                activeTrackColor: Colors.red.shade800,
                inactiveThumbColor: Colors.greenAccent,
                inactiveTrackColor: const Color(0xFF1E293B),
                onChanged: (val) => widget.onModeChanged(val),
              ),
            ],
          ),

          // User Profile Avatar / Modal Trigger
          IconButton(
            tooltip: 'Citizen Profile & Verification',
            icon: Stack(
              children: [
                const Icon(Icons.account_circle, size: 28),
                if (_currentUser != null)
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: const BoxDecoration(
                        color: Colors.greenAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _openAccountModal,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _buildCurrentTab(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        type: BottomNavigationBarType.fixed,
        backgroundColor: widget.isDisasterMode ? const Color(0xFF1E1010) : const Color(0xFF0F172A),
        selectedItemColor: widget.isDisasterMode ? Colors.redAccent : const Color(0xFF059669),
        unselectedItemColor: Colors.white54,
        selectedFontSize: 11,
        unselectedFontSize: 10,
        onTap: (index) {
          if (index == 2) {
            // Quick action: Report Grievance
            Navigator.push(
              context,
              MaterialPageRoute(builder: (ctx) => ReportTicketScreen(onTicketCreated: () {})),
            );
          } else {
            setState(() => _currentIndex = index);
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.alt_route),
            label: 'Evac Route',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_circle, size: 28),
            label: 'Report',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.night_shelter),
            label: 'Shelters',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentTab() {
    switch (_currentIndex) {
      case 0:
        return widget.isDisasterMode ? const DisasterView() : CivicView(user: _currentUser);
      case 1:
        return const EvacuationMapScreen();
      case 3:
        return const SheltersScreen();
      case 4:
        return Center(
          child: ElevatedButton.icon(
            onPressed: _openAccountModal,
            icon: const Icon(Icons.manage_accounts),
            label: const Text('Open Citizen Profile & OTP Verification'),
          ),
        );
      default:
        return widget.isDisasterMode ? const DisasterView() : CivicView(user: _currentUser);
    }
  }
}
