class HazardIncident {
  final String id;
  final String type;
  final double latitude;
  final double longitude;
  final String affectedRoad;
  final String severity; // Extreme, High, Moderate
  final String reportedAt;
  final String recommendedAction;
  final bool isEvacuationRouteImpacted;

  HazardIncident({
    required this.id,
    required this.type,
    required this.latitude,
    required this.longitude,
    required this.affectedRoad,
    required this.severity,
    required this.reportedAt,
    required this.recommendedAction,
    this.isEvacuationRouteImpacted = true,
  });

  factory HazardIncident.fromJson(Map<String, dynamic> json) => HazardIncident(
    id: json['id'] ?? '',
    type: json['type'] ?? 'Road Waterlogging',
    latitude: (json['latitude'] as num?)?.toDouble() ??
        (json['coordinates']?['latitude'] as num?)?.toDouble() ??
        17.7200,
    longitude: (json['longitude'] as num?)?.toDouble() ??
        (json['coordinates']?['longitude'] as num?)?.toDouble() ??
        83.3100,
    affectedRoad: json['affectedRoad'] ?? 'Beach Road',
    severity: json['severity'] ?? 'High',
    reportedAt: json['reportedAt'] ?? DateTime.now().toIso8601String(),
    recommendedAction: json['recommendedAction'] ?? 'Avoid area, use diversion',
    isEvacuationRouteImpacted: json['isEvacuationRouteImpacted'] ?? true,
  );
}
