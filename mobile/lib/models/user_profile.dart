class UserProfile {
  final String id;
  final String fullName;
  final String mobileNumber;
  final String aadhaarNumber;
  final String ward;
  final bool isVerified;
  final String registeredAt;

  UserProfile({
    required this.id,
    required this.fullName,
    required this.mobileNumber,
    required this.aadhaarNumber,
    required this.ward,
    this.isVerified = true,
    required this.registeredAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'mobileNumber': mobileNumber,
    'aadhaarNumber': aadhaarNumber,
    'ward': ward,
    'isVerified': isVerified,
    'registeredAt': registeredAt,
  };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id: json['id'] ?? '',
    fullName: json['fullName'] ?? '',
    mobileNumber: json['mobileNumber'] ?? '',
    aadhaarNumber: json['aadhaarNumber'] ?? '',
    ward: json['ward'] ?? 'Ward 14 (Madhurawada & Coastal)',
    isVerified: json['isVerified'] ?? false,
    registeredAt: json['registeredAt'] ?? DateTime.now().toIso8601String(),
  );
}
