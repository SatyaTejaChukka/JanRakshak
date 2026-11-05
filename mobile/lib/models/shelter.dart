class Shelter {
  final String id;
  final String name;
  final String location;
  final double distanceKm;
  final int totalCapacity;
  final int currentOccupants;
  final List<String> amenities;
  final String medicalOfficer;
  final String contactNumber;
  final String waterSupplyStatus;
  final String generatorStatus;
  final String safeRouteStatus;
  final double latitude;
  final double longitude;

  Shelter({
    required this.id,
    required this.name,
    required this.location,
    required this.distanceKm,
    required this.totalCapacity,
    required this.currentOccupants,
    required this.amenities,
    required this.medicalOfficer,
    required this.contactNumber,
    required this.waterSupplyStatus,
    required this.generatorStatus,
    required this.safeRouteStatus,
    required this.latitude,
    required this.longitude,
  });

  int get availableBeds => (totalCapacity - currentOccupants).clamp(0, totalCapacity);
  double get occupancyPercent => totalCapacity > 0 ? (currentOccupants / totalCapacity) : 0.0;

  factory Shelter.fromJson(Map<String, dynamic> json) => Shelter(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    location: json['location'] ?? '',
    distanceKm: (json['distanceKm'] as num?)?.toDouble() ?? 1.2,
    totalCapacity: json['totalCapacity'] ?? 500,
    currentOccupants: json['currentOccupants'] ?? 0,
    amenities: List<String>.from(json['amenities'] ?? []),
    medicalOfficer: json['medicalOfficer'] ?? 'Dr. S. Rama Rao',
    contactNumber: json['contactNumber'] ?? '0891-2754400',
    waterSupplyStatus: json['waterSupplyStatus'] ?? 'Abundant',
    generatorStatus: json['generatorStatus'] ?? 'Operational',
    safeRouteStatus: json['safeRouteStatus'] ?? 'Clear & Elevated',
    latitude: (json['coordinates']?['latitude'] as num?)?.toDouble() ?? 17.7285,
    longitude: (json['coordinates']?['longitude'] as num?)?.toDouble() ?? 83.3150,
  );
}
