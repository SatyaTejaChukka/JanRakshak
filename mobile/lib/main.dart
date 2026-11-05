import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const JanRakshakApp());
}

class JanRakshakApp extends StatefulWidget {
  const JanRakshakApp({super.key});

  @override
  State<JanRakshakApp> createState() => _JanRakshakAppState();
}

class _JanRakshakAppState extends State<JanRakshakApp> {
  // Dual-mode: false = Civic Mode (Default), true = Disaster Mode
  bool _isDisasterMode = false;

  void _toggleMode(bool isDisaster) {
    setState(() {
      _isDisasterMode = isDisaster;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JanRakshak - Dual-Mode Civic & Disaster Platform',
      debugShowCheckedModeBanner: false,
      theme: _isDisasterMode ? AppTheme.disasterTheme : AppTheme.civicTheme,
      home: HomeScreen(
        isDisasterMode: _isDisasterMode,
        onModeChanged: _toggleMode,
      ),
    );
  }
}
