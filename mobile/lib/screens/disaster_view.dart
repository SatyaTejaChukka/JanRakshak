import 'package:flutter/material.dart';
import 'sos_dialog.dart';
import 'evacuation_map_screen.dart';
import 'shelters_screen.dart';
import 'call_dialog.dart';

class DisasterView extends StatelessWidget {
  const DisasterView({super.key});

  @override
  Widget build(BuildContext context) {
    // 4 Emergency Disaster Helplines in 2 rows & 2 columns
    final helplines = [
      {
        'title': 'NDRF Rescue Command',
        'phone': '1078',
        'dept': '10th Bn Motorized Boats & Cutters',
        'badge': 'URGENT RESCUE',
        'operator': 'Commandant R. S. Pathak',
        'icon': Icons.shield,
        'color': Colors.red,
      },
      {
        'title': 'Coastal Marine Police',
        'phone': '1093',
        'dept': 'Tidal Surge & Harbor Defense',
        'badge': 'COASTAL PATROL',
        'operator': 'DSP Coastal Security Wing',
        'icon': Icons.directions_boat,
        'color': Colors.blue,
      },
      {
        'title': 'State Disaster Ops Center',
        'phone': '1070',
        'dept': 'AP State Disaster Management (APSDMA)',
        'badge': 'GOVT WAR ROOM',
        'operator': 'State Relief Commissioner',
        'icon': Icons.campaign,
        'color': Colors.amber,
      },
      {
        'title': 'GVMC Disaster Control',
        'phone': '18004250001',
        'dept': 'Municipal Emergency Waterlogging Desk',
        'badge': 'TOLL FREE 24/7',
        'operator': 'Municipal Commissioner War Desk',
        'icon': Icons.business,
        'color': Colors.teal,
      },
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Collector Red Alert Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF7F1D1D),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.redAccent, width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.warning, color: Colors.amberAccent, size: 22),
                        SizedBox(width: 8),
                        Text(
                          'CYCLONE PROTOCOL ACTIVE',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.red.shade900,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text('STAGE 4 ALERT', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Collector Emergency Powers Enacted for Visakhapatnam Coastal Belt.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Big Emergency SOS Button
          InkWell(
            onTap: () {
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (ctx) => SosDialog(
                  onSosTriggered: () {},
                ),
              );
            },
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFDC2626), Color(0xFF991B1B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(color: Colors.red.withOpacity(0.4), blurRadius: 16, offset: const Offset(0, 6)),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white,
                    ),
                    child: const Icon(Icons.sos, size: 36, color: Color(0xFFDC2626)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'TRIGGER EMERGENCY SOS',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Broadcasts GPS & medical telemetry to NDRF 10th Bn',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 18),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Safe Evacuation Route Card
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (ctx) => const EvacuationMapScreen()),
              );
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1515),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.green.shade600, width: 1.5),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.alt_route, color: Colors.greenAccent, size: 28),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Safe Evacuation Route Map',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Live route avoiding waterlogging & fallen power lines',
                          style: TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Colors.greenAccent),
                ],
              ),
            ),
          ),
          const SizedBox(height: 22),

          // 2x2 Emergency Disaster Helplines Grid
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Emergency Disaster Helplines',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              Text(
                '2x2 Grid • Direct Call',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
          const SizedBox(height: 12),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.95,
            ),
            itemCount: helplines.length,
            itemBuilder: (context, index) {
              final h = helplines[index];
              return InkWell(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => EmergencyCallDialog(
                      title: h['title'] as String,
                      phoneNumber: h['phone'] as String,
                      department: h['dept'] as String,
                      operatorName: h['operator'] as String,
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF221515),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.red.withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Icon(h['icon'] as IconData, color: h['color'] as Color, size: 24),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.red.shade900,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              h['badge'] as String,
                              style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            h['title'] as String,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            h['dept'] as String,
                            style: const TextStyle(fontSize: 10, color: Colors.white60),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.red.shade800,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.call, size: 12, color: Colors.white),
                            const SizedBox(width: 4),
                            Text(
                              'Dial ${h['phone']}',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 18),

          // Cyclone Shelters Quick Access Card
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (ctx) => const SheltersScreen()),
              );
            },
            borderRadius: BorderRadius.circular(14),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF221515),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white12),
              ),
              child: Row(
                children: const [
                  Icon(Icons.night_shelter, color: Colors.amberAccent, size: 24),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'View Cyclone Relief Shelters & Live Bed Availability',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                    ),
                  ),
                  Icon(Icons.arrow_forward, color: Colors.white70, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
