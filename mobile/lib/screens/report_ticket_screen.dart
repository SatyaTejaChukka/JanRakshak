import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/api_service.dart';

class ReportTicketScreen extends StatefulWidget {
  final VoidCallback onTicketCreated;

  const ReportTicketScreen({super.key, required this.onTicketCreated});

  @override
  State<ReportTicketScreen> createState() => _ReportTicketScreenState();
}

class _ReportTicketScreenState extends State<ReportTicketScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _locationController = TextEditingController();
  final _nameController = TextEditingController(text: 'Citizen User');
  final _phoneController = TextEditingController(text: '+91 98480 12345');

  String _selectedCategory = 'Pothole & Craters';
  final List<String> _categories = [
    'Pothole & Craters',
    'Drainage Block',
    'Fallen Tree & Power Line',
    'Streetlight Outage',
    'Structural Crack',
  ];

  String _selectedSeverity = 'High';
  final List<String> _severities = ['Critical', 'High', 'Medium', 'Low'];

  double _lat = 17.7285;
  double _lng = 83.3080;
  bool _isLocating = false;
  bool _hasPhoto = false;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _locationController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _fetchLocation() async {
    setState(() => _isLocating = true);
    try {
      Position pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: const Duration(seconds: 4),
      );
      setState(() {
        _lat = pos.latitude;
        _lng = pos.longitude;
        _locationController.text = 'GPS Auto-Detected: Ward 14 (${pos.latitude.toStringAsFixed(4)}, ${pos.longitude.toStringAsFixed(4)})';
      });
    } catch (e) {
      setState(() {
        _locationController.text = 'Dwarka Nagar, Near RTC Complex, Ward 14';
      });
    }
    setState(() => _isLocating = false);
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    await ApiService.createTicket(
      category: _selectedCategory,
      title: _titleController.text.trim(),
      location: _locationController.text.trim(),
      latitude: _lat,
      longitude: _lng,
      citizenName: _nameController.text.trim(),
      citizenPhone: _phoneController.text.trim(),
      severity: _selectedSeverity,
    );

    widget.onTicketCreated();
    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Civic Grievance Registered & Dispatched to GVMC Engineering Wing!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Civic Grievance'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Category
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Issue Category',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.category_outlined),
                ),
                items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                onChanged: (val) => setState(() => _selectedCategory = val!),
              ),
              const SizedBox(height: 14),

              // Title
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Title / Description *',
                  hintText: 'e.g. Hazardous deep pit on road turning',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.edit_note),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Please enter a description' : null,
              ),
              const SizedBox(height: 14),

              // Location + Auto-detect
              TextFormField(
                controller: _locationController,
                decoration: InputDecoration(
                  labelText: 'Location / Landmark *',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.place_outlined),
                  suffixIcon: IconButton(
                    icon: _isLocating
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Icon(Icons.my_location, color: Colors.blue),
                    tooltip: 'Auto-detect GPS',
                    onPressed: _fetchLocation,
                  ),
                ),
                validator: (val) => val == null || val.trim().isEmpty ? 'Specify location or click GPS' : null,
              ),
              const SizedBox(height: 14),

              // Severity
              DropdownButtonFormField<String>(
                value: _selectedSeverity,
                decoration: const InputDecoration(
                  labelText: 'Severity Level',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.flag_outlined),
                ),
                items: _severities.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (val) => setState(() => _selectedSeverity = val!),
              ),
              const SizedBox(height: 16),

              // Camera Photo Capture Simulation
              InkWell(
                onTap: () {
                  setState(() => _hasPhoto = !_hasPhoto);
                },
                child: Container(
                  height: 110,
                  decoration: BoxDecoration(
                    color: _hasPhoto ? Colors.green.shade50 : Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _hasPhoto ? Colors.green : Colors.grey.shade400,
                      style: BorderStyle.solid,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _hasPhoto ? Icons.check_circle : Icons.camera_alt_outlined,
                          size: 34,
                          color: _hasPhoto ? Colors.green : Colors.grey.shade700,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _hasPhoto ? 'Photo Attached (Pothole_evidence.jpg)' : 'Tap to Attach Geotagged Photo',
                          style: TextStyle(
                            fontSize: 13,
                            color: _hasPhoto ? Colors.green.shade800 : Colors.grey.shade700,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                ),
                onPressed: _isSubmitting ? null : _submit,
                icon: const Icon(Icons.send),
                label: Text(
                  _isSubmitting ? 'Submitting...' : 'Register Grievance & Dispatch Crew',
                  style: const TextStyle(fontSize: 15),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
