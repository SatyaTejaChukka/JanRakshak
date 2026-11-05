import 'dart:async';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class EmergencyCallDialog extends StatefulWidget {
  final String title;
  final String phoneNumber;
  final String department;
  final String operatorName;

  const EmergencyCallDialog({
    super.key,
    required this.title,
    required this.phoneNumber,
    required this.department,
    required this.operatorName,
  });

  @override
  State<EmergencyCallDialog> createState() => _EmergencyCallDialogState();
}

class _EmergencyCallDialogState extends State<EmergencyCallDialog> {
  String _status = 'CONNECTING...'; // CONNECTING, CONNECTED
  int _durationSeconds = 0;
  Timer? _callTimer;

  @override
  void initState() {
    super.initState();
    // Simulate connection after 1.5 seconds
    Future.delayed(const Duration(milliseconds: 1500), () {
      if (mounted) {
        setState(() => _status = 'CONNECTED');
        _startTimer();
      }
    });
  }

  void _startTimer() {
    _callTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() => _durationSeconds++);
      }
    });
  }

  @override
  void dispose() {
    _callTimer?.cancel();
    super.dispose();
  }

  String _formatDuration(int totalSecs) {
    final mins = (totalSecs ~/ 60).toString().padLeft(2, '0');
    final secs = (totalSecs % 60).toString().padLeft(2, '0');
    return '$mins:$secs';
  }

  void _launchNativePhoneCall() async {
    final uri = Uri.parse('tel:${widget.phoneNumber}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1E1010),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
        constraints: const BoxConstraints(maxWidth: 380),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _status == 'CONNECTED' ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2),
              ),
              child: Icon(
                Icons.phone_in_talk,
                size: 40,
                color: _status == 'CONNECTED' ? Colors.greenAccent : Colors.redAccent,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              widget.title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 6),
            Text(
              widget.department,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Colors.white70),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: _status == 'CONNECTED' ? Colors.green.shade900 : Colors.red.shade900,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _status == 'CONNECTED' ? 'LIVE • ${_formatDuration(_durationSeconds)}' : 'DIALING DISPATCH...',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Officer: ${widget.operatorName}',
              style: const TextStyle(fontSize: 13, color: Colors.amberAccent, fontStyle: FontStyle.italic),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Real Phone App Trigger
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade700,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                  onPressed: _launchNativePhoneCall,
                  icon: const Icon(Icons.call, size: 18),
                  label: const Text('Native Dialer', style: TextStyle(fontSize: 12)),
                ),
                // End Call
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red.shade700,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.call_end, size: 18),
                  label: const Text('End Call', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
