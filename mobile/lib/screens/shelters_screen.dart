import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/shelter.dart';
import '../services/api_service.dart';

class SheltersScreen extends StatefulWidget {
  const SheltersScreen({super.key});

  @override
  State<SheltersScreen> createState() => _SheltersScreenState();
}

class _SheltersScreenState extends State<SheltersScreen> {
  List<Shelter> _shelters = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchShelters();
  }

  void _fetchShelters() async {
    final shelters = await ApiService.fetchShelters();
    if (mounted) {
      setState(() {
        _shelters = shelters;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cyclone Relief Shelters'),
        backgroundColor: const Color(0xFF7F1D1D),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async => _fetchShelters(),
              child: ListView.builder(
                padding: const EdgeInsets.all(14),
                itemCount: _shelters.length,
                itemBuilder: (context, index) {
                  final shelter = _shelters[index];
                  final percent = shelter.occupancyPercent;

                  Color statusColor = Colors.green;
                  if (percent > 0.85) {
                    statusColor = Colors.red;
                  } else if (percent > 0.6) {
                    statusColor = Colors.orange;
                  }

                  return Card(
                    margin: const EdgeInsets.only(bottom: 14),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.red.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.night_shelter, color: Colors.redAccent, size: 28),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      shelter.name,
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      shelter.location,
                                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Occupancy Bar
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Occupancy: ${shelter.currentOccupants} / ${shelter.totalCapacity}',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                '${shelter.availableBeds} beds free',
                                style: TextStyle(fontSize: 12, color: statusColor, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: LinearProgressIndicator(
                              value: percent.clamp(0.0, 1.0),
                              minHeight: 8,
                              backgroundColor: Colors.grey.shade300,
                              valueColor: AlwaysStoppedAnimation<Color>(statusColor),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Amenities
                          Wrap(
                            spacing: 6,
                            runSpacing: 4,
                            children: shelter.amenities.map((a) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.06),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                                ),
                                child: Text(a, style: const TextStyle(fontSize: 11)),
                              );
                            }).toList(),
                          ),
                          const Divider(height: 20),

                          // Medical officer and call button
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    shelter.medicalOfficer,
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    shelter.contactNumber,
                                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                                  ),
                                ],
                              ),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green.shade700,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                ),
                                onPressed: () async {
                                  final uri = Uri.parse('tel:${shelter.contactNumber}');
                                  if (await canLaunchUrl(uri)) await launchUrl(uri);
                                },
                                icon: const Icon(Icons.phone, size: 16),
                                label: const Text('Call Desk', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
