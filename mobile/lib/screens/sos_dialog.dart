import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SosDialog extends StatefulWidget {
  final VoidCallback onSosTriggered;

  const SosDialog({super.key, required this.onSosTriggered});

  @override
  State<SosDialog> createState() => _SosDialogState();
}

class _SosDialogState extends State<SosDialog> {
  int _countdown = 5;
  Timer? _countdownTimer;
  bool _isDispatched = false;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown > 1) {
        setState(() => _countdown--);
      } else {
        timer.cancel();
        _dispatchSos();
      }
    });
  }

  void _dispatchSos() async {
    setState(() => _isDispatched = true);
    await ApiService.triggerSOS(
      latitude: 17.7285,
      longitude: 83.3150,
      batteryLevel: 82,
      emergencyType: 'CRITICAL_CYCLONE_EVACUATION',
    );
    widget.onSosTriggered();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🚨 SOS Alert broadcasted to NDRF 10th Bn and nearest volunteers!'),
          backgroundColor: Colors.red,
          duration: Duration(seconds: 4),
        ),
      );
    }
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF250D0D),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.warning_amber_rounded, size: 54, color: Colors.amberAccent),
            const SizedBox(height: 12),
            const Text(
              'EMERGENCY SOS BROADCAST',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              _isDispatched
                  ? 'SOS Beacon Activated! Coordinates sent to NDRF War Room.'
                  : 'Dispatching GPS & Medical telemetry in:',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Colors.white70),
            ),
            const SizedBox(height: 20),
            if (!_isDispatched) ...[
              Container(
                width: 90,
                height: 90,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.red.shade900,
                  border: Border.all(color: Colors.redAccent, width: 4),
                ),
                child: Text(
                  '$_countdown',
                  style: const TextStyle(fontSize: 44, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black87,
                  minimumSize: const Size.fromHeight(48),
                ),
                onPressed: () {
                  _countdownTimer?.cancel();
                  Navigator.of(context).pop();
                },
                icon: const Icon(Icons.cancel),
                label: const Text('CANCEL SOS (False Alarm)'),
              ),
            ] else ...[
              const CircularProgressIndicator(color: Colors.redAccent),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade700),
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Close'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
