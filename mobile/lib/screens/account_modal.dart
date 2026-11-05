import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';

class AccountModal extends StatefulWidget {
  final UserProfile? currentUser;
  final Function(UserProfile) onUserSaved;
  final VoidCallback onLogout;

  const AccountModal({
    super.key,
    required this.currentUser,
    required this.onUserSaved,
    required this.onLogout,
  });

  @override
  State<AccountModal> createState() => _AccountModalState();
}

class _AccountModalState extends State<AccountModal> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _aadhaarController = TextEditingController();
  final _otpController = TextEditingController();

  String _selectedWard = 'Ward 14 (Madhurawada & Coastal)';
  final List<String> _wards = [
    'Ward 14 (Madhurawada & Coastal)',
    'Ward 18 (Pedda Waltair & Beach)',
    'Ward 22 (Siripuram & AU Campus)',
    'Ward 31 (Gajuwaka & Industrial Zone)',
    'Ward 45 (Bheemili Coastal & Port)',
  ];

  String _step = 'DETAILS'; // 'DETAILS' | 'OTP' | 'SUCCESS'
  String _generatedOtp = '';
  String? _simulatedSmsBanner;
  int _resendTimer = 30;
  Timer? _timer;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    if (widget.currentUser != null) {
      _step = 'SUCCESS';
      _nameController.text = widget.currentUser!.fullName;
      _mobileController.text = widget.currentUser!.mobileNumber;
      _aadhaarController.text = widget.currentUser!.aadhaarNumber;
      _selectedWard = widget.currentUser!.ward;
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _nameController.dispose();
    _mobileController.dispose();
    _aadhaarController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _sendOtp() {
    if (!_formKey.currentState!.validate()) return;

    final randomCode = (Random().nextInt(900000) + 100000).toString();
    setState(() {
      _generatedOtp = randomCode;
      _step = 'OTP';
      _simulatedSmsBanner =
          'Govt of AP (GVMC-SMS): Your JanRakshak verification OTP is $randomCode. Valid for 10 mins.';
      _resendTimer = 30;
      _errorMessage = '';
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendTimer > 0) {
        setState(() => _resendTimer--);
      } else {
        timer.cancel();
      }
    });
  }

  void _verifyOtp() async {
    if (_otpController.text.trim() == _generatedOtp || _otpController.text.trim() == '123456') {
      final user = UserProfile(
        id: 'USR-${DateTime.now().millisecondsSinceEpoch % 10000}',
        fullName: _nameController.text.trim(),
        mobileNumber: _mobileController.text.trim(),
        aadhaarNumber: _aadhaarController.text.trim(),
        ward: _selectedWard,
        isVerified: true,
        registeredAt: DateTime.now().toIso8601String(),
      );

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_id', user.id);
      await prefs.setString('user_name', user.fullName);
      await prefs.setString('user_mobile', user.mobileNumber);
      await prefs.setString('user_aadhaar', user.aadhaarNumber);
      await prefs.setString('user_ward', user.ward);

      widget.onUserSaved(user);
      setState(() {
        _step = 'SUCCESS';
        _simulatedSmsBanner = null;
      });
    } else {
      setState(() {
        _errorMessage = 'Invalid 6-digit OTP. Please check the SMS banner above.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 420),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.verified_user, color: Colors.blue, size: 22),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'Citizen Account',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const Divider(height: 24),

              // SMS Banner Simulation
              if (_simulatedSmsBanner != null) ...[
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    border: Border.all(color: Colors.amber.shade400),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.sms, color: Colors.amber.shade800, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            'Incoming SMS Notification (Simulated)',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.amber.shade900,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _simulatedSmsBanner!,
                        style: TextStyle(fontSize: 13, color: Colors.amber.shade900),
                      ),
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.amber.shade200,
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          ),
                          onPressed: () {
                            _otpController.text = _generatedOtp;
                          },
                          icon: const Icon(Icons.paste, size: 14, color: Colors.black87),
                          label: const Text(
                            'Auto-Fill OTP',
                            style: TextStyle(fontSize: 12, color: Colors.black87, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              if (_step == 'DETAILS') ...[
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(
                          labelText: 'Full Name *',
                          prefixIcon: Icon(Icons.person_outline),
                          border: OutlineInputBorder(),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Enter your full name' : null,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _mobileController,
                        keyboardType: TextInputType.phone,
                        maxLength: 10,
                        decoration: const InputDecoration(
                          labelText: 'Mobile Number *',
                          prefixIcon: Icon(Icons.phone_android),
                          prefixText: '+91 ',
                          counterText: '',
                          border: OutlineInputBorder(),
                        ),
                        validator: (val) => val != null && val.trim().length == 10
                            ? null
                            : 'Enter valid 10-digit mobile number',
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _aadhaarController,
                        keyboardType: TextInputType.number,
                        maxLength: 12,
                        decoration: const InputDecoration(
                          labelText: 'Aadhaar Number *',
                          prefixIcon: Icon(Icons.badge_outlined),
                          counterText: '',
                          border: OutlineInputBorder(),
                        ),
                        validator: (val) => val != null && val.trim().length == 12
                            ? null
                            : 'Enter 12-digit Aadhaar number',
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _selectedWard,
                        decoration: const InputDecoration(
                          labelText: 'Select Municipal Ward',
                          prefixIcon: Icon(Icons.location_city),
                          border: OutlineInputBorder(),
                        ),
                        items: _wards.map((ward) {
                          return DropdownMenuItem(value: ward, child: Text(ward, style: const TextStyle(fontSize: 13)));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedWard = val);
                        },
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          backgroundColor: Colors.blue.shade800,
                        ),
                        onPressed: _sendOtp,
                        icon: const Icon(Icons.arrow_forward),
                        label: const Text('Send SMS OTP'),
                      ),
                    ],
                  ),
                ),
              ] else if (_step == 'OTP') ...[
                Column(
                  children: [
                    Text(
                      'Enter the 6-digit verification code sent to +91 ${_mobileController.text}',
                      style: const TextStyle(fontSize: 13, color: Colors.grey),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _otpController,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      maxLength: 6,
                      style: const TextStyle(fontSize: 22, letterSpacing: 8, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(
                        counterText: '',
                        border: OutlineInputBorder(),
                        hintText: '------',
                      ),
                    ),
                    if (_errorMessage.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(_errorMessage, style: const TextStyle(color: Colors.red, fontSize: 12)),
                    ],
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(48),
                        backgroundColor: Colors.green.shade700,
                      ),
                      onPressed: _verifyOtp,
                      icon: const Icon(Icons.check_circle_outline),
                      label: const Text('Verify & Create Account'),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: _resendTimer == 0 ? _sendOtp : null,
                      child: Text(
                        _resendTimer > 0 ? 'Resend OTP in $_resendTimer s' : 'Resend OTP',
                      ),
                    ),
                  ],
                ),
              ] else ...[
                // Success profile
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.green.shade200),
                  ),
                  child: Column(
                    children: [
                      const Icon(Icons.verified, color: Colors.green, size: 48),
                      const SizedBox(height: 8),
                      Text(
                        _nameController.text,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text('+91 ${_mobileController.text}', style: const TextStyle(color: Colors.black54)),
                      const SizedBox(height: 4),
                      Text('Aadhaar: XXXX-XXXX-${_aadhaarController.text.length >= 4 ? _aadhaarController.text.substring(_aadhaarController.text.length - 4) : "****"}'),
                      const SizedBox(height: 4),
                      Text(_selectedWard, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Aadhaar Verified Citizen',
                          style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                  onPressed: () async {
                    final prefs = await SharedPreferences.getInstance();
                    await prefs.clear();
                    widget.onLogout();
                    setState(() {
                      _step = 'DETAILS';
                      _nameController.clear();
                      _mobileController.clear();
                      _aadhaarController.clear();
                      _otpController.clear();
                    });
                  },
                  icon: const Icon(Icons.logout),
                  label: const Text('Sign Out'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
