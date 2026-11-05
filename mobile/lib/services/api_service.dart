import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/ticket.dart';
import '../models/shelter.dart';
import '../models/hazard.dart';
import 'mock_data.dart';

class ApiService {
  // 10.0.2.2 is localhost for Android Emulator, localhost for iOS/Web/Desktop
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  // --- Tickets ---
  static Future<List<Ticket>> fetchTickets() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/tickets'))
          .timeout(const Duration(seconds: 2));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Ticket.fromJson(item)).toList();
      }
    } catch (e) {
      debugPrint('[ApiService] Backend offline, returning mock tickets: $e');
    }
    return MockData.seedTickets;
  }

  static Future<Ticket> createTicket({
    required String category,
    required String title,
    required String location,
    required double latitude,
    required double longitude,
    required String citizenName,
    required String citizenPhone,
    required String severity,
  }) async {
    final newTicket = Ticket(
      id: 'TKT-${DateTime.now().millisecondsSinceEpoch % 10000}',
      category: category,
      title: title,
      location: location,
      coordinates: Coordinates(latitude: latitude, longitude: longitude),
      reportedAt: 'Just now',
      currentStage: 'submitted',
      citizenName: citizenName,
      citizenPhone: citizenPhone,
      severity: severity,
    );

    try {
      await http.post(
        Uri.parse('$baseUrl/tickets'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'category': category,
          'title': title,
          'location': location,
          'coordinates': {'latitude': latitude, 'longitude': longitude},
          'citizenName': citizenName,
          'citizenPhone': citizenPhone,
          'severity': severity,
        }),
      ).timeout(const Duration(seconds: 2));
    } catch (e) {
      debugPrint('[ApiService] Fallback local ticket creation');
    }

    MockData.seedTickets.insert(0, newTicket);
    return newTicket;
  }

  // --- Shelters ---
  static Future<List<Shelter>> fetchShelters() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/shelters'))
          .timeout(const Duration(seconds: 2));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => Shelter.fromJson(item)).toList();
      }
    } catch (e) {
      debugPrint('[ApiService] Returning mock shelters: $e');
    }
    return MockData.seedShelters;
  }

  // --- Hazards ---
  static Future<List<HazardIncident>> fetchHazards() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/hazards'))
          .timeout(const Duration(seconds: 2));
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((item) => HazardIncident.fromJson(item)).toList();
      }
    } catch (e) {
      debugPrint('[ApiService] Returning mock hazards: $e');
    }
    return MockData.seedHazards;
  }

  // --- Trigger SOS ---
  static Future<bool> triggerSOS({
    required double latitude,
    required double longitude,
    required int batteryLevel,
    required String emergencyType,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/sos/trigger'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'coordinates': {'latitude': latitude, 'longitude': longitude},
          'batteryPercentage': batteryLevel,
          'triggerType': emergencyType,
        }),
      ).timeout(const Duration(seconds: 2));
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      debugPrint('[ApiService] Fallback SOS simulation: $e');
      return true;
    }
  }
}
