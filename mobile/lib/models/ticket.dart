class Coordinates {
  final double latitude;
  final double longitude;

  Coordinates({required this.latitude, required this.longitude});

  Map<String, dynamic> toJson() => {'latitude': latitude, 'longitude': longitude};
  factory Coordinates.fromJson(Map<String, dynamic> json) => Coordinates(
    latitude: (json['latitude'] as num?)?.toDouble() ?? 17.6868,
    longitude: (json['longitude'] as num?)?.toDouble() ?? 83.2185,
  );
}

class Ticket {
  final String id;
  final String category;
  final String title;
  final String location;
  final Coordinates coordinates;
  final String reportedAt;
  final String currentStage; // submitted, deduplicated, assigned, in_progress, resolved
  final String citizenName;
  final String citizenPhone;
  final int mergedCount;
  final String severity; // Critical, High, Medium, Low
  final String? workerName;
  final String? workerPhone;

  Ticket({
    required this.id,
    required this.category,
    required this.title,
    required this.location,
    required this.coordinates,
    required this.reportedAt,
    required this.currentStage,
    required this.citizenName,
    required this.citizenPhone,
    this.mergedCount = 1,
    required this.severity,
    this.workerName,
    this.workerPhone,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) => Ticket(
    id: json['id'] ?? '',
    category: json['category'] ?? 'Pothole & Craters',
    title: json['title'] ?? '',
    location: json['location'] ?? '',
    coordinates: Coordinates.fromJson(json['coordinates'] ?? {}),
    reportedAt: json['reportedAt'] ?? DateTime.now().toIso8601String(),
    currentStage: json['currentStage'] ?? 'submitted',
    citizenName: json['citizenName'] ?? 'Citizen',
    citizenPhone: json['citizenPhone'] ?? '',
    mergedCount: json['mergedCount'] ?? 1,
    severity: json['severity'] ?? 'Medium',
    workerName: json['assignedCrew']?['workerName'],
    workerPhone: json['assignedCrew']?['phone'],
  );
}
