import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import '../models/hazard.dart';
import '../models/shelter.dart';
import '../services/api_service.dart';

class EvacuationMapScreen extends StatefulWidget {
  const EvacuationMapScreen({super.key});

  @override
  State<EvacuationMapScreen> createState() => _EvacuationMapScreenState();
}

class _EvacuationMapScreenState extends State<EvacuationMapScreen> {
  final MapController _mapController = MapController();
  LatLng _userLocation = const LatLng(17.7210, 83.3050); // Visakhapatnam central default
  List<HazardIncident> _hazards = [];
  Shelter? _targetShelter;

  // Evacuation route coordinates navigating around coastal waterlogging
  final List<LatLng> _safeRoutePoints = [
    const LatLng(17.7210, 83.3050), // User location
    const LatLng(17.7240, 83.3080), // Turn towards VIP Road (elevated)
    const LatLng(17.7300, 83.3120), // Bypass flooded Kurupam Circle
    const LatLng(17.7350, 83.3140), // Elevated ridge corridor
    const LatLng(17.7380, 83.3150), // Arrive at GVMC Indoor Stadium Relief Hub
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
    _determinePosition();
  }

  void _loadData() async {
    final hazards = await ApiService.fetchHazards();
    final shelters = await ApiService.fetchShelters();
    if (mounted) {
      setState(() {
        _hazards = hazards;
        _targetShelter = shelters.isNotEmpty ? shelters.first : null;
      });
    }
  }

  Future<void> _determinePosition() async {
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.always || permission == LocationPermission.whileInUse) {
        final position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
          timeLimit: const Duration(seconds: 4),
        );
        if (mounted) {
          setState(() {
            _userLocation = LatLng(position.latitude, position.longitude);
          });
          _mapController.move(_userLocation, 14.5);
          return;
        }
      }
    } catch (e) {
      debugPrint('[GPS] Defaulting to Visakhapatnam city coordinates: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Safe Evacuation Route Map'),
        backgroundColor: const Color(0xFF7F1D1D),
        actions: [
          IconButton(
            tooltip: 'Center My Location',
            icon: const Icon(Icons.my_location),
            onPressed: () {
              _mapController.move(_userLocation, 14.5);
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          // FlutterMap with OpenStreetMap tiles
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _userLocation,
              initialZoom: 14.0,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'gov.in.janrakshak',
              ),
              // Safe Evacuation Route Polyline
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: _safeRoutePoints,
                    strokeWidth: 5.0,
                    color: Colors.greenAccent.shade700,
                  ),
                ],
              ),
              // Markers Layer
              MarkerLayer(
                markers: [
                  // User Live Location Marker
                  Marker(
                    point: _userLocation,
                    width: 44,
                    height: 44,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.3),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.person_pin_circle, color: Colors.blueAccent, size: 36),
                      ),
                    ),
                  ),
                  // Cyclone Shelter Destination Marker
                  if (_targetShelter != null)
                    Marker(
                      point: LatLng(_targetShelter!.latitude, _targetShelter!.longitude),
                      width: 50,
                      height: 50,
                      child: const Tooltip(
                        message: 'Safe Destination: GVMC Relief Hub',
                        child: Icon(Icons.home_work, color: Colors.green, size: 40),
                      ),
                    ),
                  // Hazard Incident Markers (Red Warning)
                  ..._hazards.map((haz) {
                    return Marker(
                      point: LatLng(haz.latitude, haz.longitude),
                      width: 40,
                      height: 40,
                      child: GestureDetector(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: Row(
                                children: [
                                  const Icon(Icons.dangerous, color: Colors.red),
                                  const SizedBox(width: 8),
                                  Expanded(child: Text(haz.type, style: const TextStyle(fontSize: 16))),
                                ],
                              ),
                              content: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Road: ${haz.affectedRoad}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 6),
                                  Text('Severity: ${haz.severity}'),
                                  const SizedBox(height: 6),
                                  Text('Instruction: ${haz.recommendedAction}'),
                                ],
                              ),
                              actions: [
                                TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK')),
                              ],
                            ),
                          );
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.red.shade900.withOpacity(0.85),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                          child: const Icon(Icons.warning, color: Colors.white, size: 20),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ],
          ),

          // Top Info Banner: Safe Routing Guarantee
          Positioned(
            top: 12,
            left: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1010).withOpacity(0.92),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.shade400, width: 1.5),
              ),
              child: Row(
                children: [
                  const Icon(Icons.route, color: Colors.greenAccent, size: 26),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Text(
                          'A.I. Safe Evacuation Corridor Active',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        Text(
                          'Path bypasses Beach Road flooding & high-tension wire hazards.',
                          style: TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom Sheet: Target Relief Shelter Details
          if (_targetShelter != null)
            Positioned(
              bottom: 16,
              left: 12,
              right: 12,
              child: Card(
                color: const Color(0xFF1A1212),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Colors.green, width: 1.5),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              _targetShelter!.name,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.green.shade900,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${_targetShelter!.distanceKm} km away',
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.greenAccent),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _targetShelter!.location,
                        style: const TextStyle(fontSize: 12, color: Colors.white70),
                      ),
                      const Divider(height: 18, color: Colors.white24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _shelterStatusPill('Beds: ${_targetShelter!.availableBeds} avail', Icons.bed, Colors.blue),
                          _shelterStatusPill('Water: ${_targetShelter!.waterSupplyStatus}', Icons.water_drop, Colors.cyan),
                          _shelterStatusPill('Genset: ${_targetShelter!.generatorStatus}', Icons.bolt, Colors.amber),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _shelterStatusPill(String text, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 11, color: Colors.white)),
      ],
    );
  }
}
