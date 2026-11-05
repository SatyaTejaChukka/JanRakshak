import 'package:flutter/material.dart';

class AppTheme {
  // Civic Theme Colors
  static const Color civicPrimary = Color(0xFF0F172A); // Slate 900
  static const Color civicAccent = Color(0xFF059669);  // Emerald 600
  static const Color civicSurface = Color(0xFFF8FAFC); // Slate 50
  static const Color civicCard = Colors.white;

  // Disaster Theme Colors
  static const Color disasterPrimary = Color(0xFF7F1D1D); // Red 900
  static const Color disasterAccent = Color(0xFFDC2626);  // Red 600
  static const Color disasterWarning = Color(0xFFF59E0B); // Amber 500
  static const Color disasterSurface = Color(0xFF450A0A); // Dark Red
  static const Color disasterCard = Color(0xFF1E1B1B);   // Deep Dark

  static ThemeData get civicTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: civicPrimary,
      scaffoldBackgroundColor: civicSurface,
      colorScheme: ColorScheme.fromSeed(
        seedColor: civicAccent,
        primary: civicPrimary,
        secondary: civicAccent,
        surface: civicSurface,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: civicPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: civicCard,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: civicAccent,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }

  static ThemeData get disasterTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: disasterAccent,
      scaffoldBackgroundColor: const Color(0xFF120B0B),
      colorScheme: const ColorScheme.dark(
        primary: disasterAccent,
        secondary: disasterWarning,
        surface: Color(0xFF1E1515),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: disasterPrimary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF221515),
        elevation: 3,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: disasterAccent,
          foregroundColor: Colors.white,
          elevation: 4,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }
}
