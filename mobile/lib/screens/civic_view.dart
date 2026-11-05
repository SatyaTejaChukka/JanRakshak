import 'package:flutter/material.dart';
import '../models/ticket.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';
import 'report_ticket_screen.dart';

class CivicView extends StatefulWidget {
  final UserProfile? user;
  const CivicView({super.key, this.user});

  @override
  State<CivicView> createState() => _CivicViewState();
}

class _CivicViewState extends State<CivicView> {
  List<Ticket> _tickets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTickets();
  }

  void _loadTickets() async {
    final tickets = await ApiService.fetchTickets();
    if (mounted) {
      setState(() {
        _tickets = tickets;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userName = widget.user?.fullName ?? 'Citizen';
    final ward = widget.user?.ward ?? 'Ward 14 (Madhurawada)';

    return RefreshIndicator(
      onRefresh: () async => _loadTickets(),
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 8, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Namaste, $userName 👋',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF059669),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'CIVIC MODE',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    ward,
                    style: const TextStyle(fontSize: 13, color: Colors.white70),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      _statMiniBadge('48h SLA', 'Strict Clock', Icons.timer),
                      const SizedBox(width: 12),
                      _statMiniBadge('50m Radar', 'Deduplication', Icons.radar),
                      const SizedBox(width: 12),
                      _statMiniBadge('APEPDCL & GVMC', 'Unified Dispatch', Icons.bolt),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Report Grievance Big Action
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF059669),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (ctx) => ReportTicketScreen(onTicketCreated: _loadTickets),
                  ),
                );
              },
              icon: const Icon(Icons.add_photo_alternate, size: 24),
              label: const Text(
                'Report Civic Grievance (Photo & GPS)',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 22),

            // Section: Active Civic Tickets
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Community Grievances',
                  style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                ),
                Text(
                  '${_tickets.length} Active',
                  style: const TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),

            if (_isLoading)
              const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()))
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _tickets.length,
                itemBuilder: (context, index) {
                  final ticket = _tickets[index];
                  return _buildTicketCard(ticket);
                },
              ),
          ],
        ),
      ),
    );
  }

  Widget _statMiniBadge(String title, String subtitle, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Icon(icon, size: 18, color: Colors.greenAccent),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
            Text(subtitle, style: const TextStyle(fontSize: 9, color: Colors.white60)),
          ],
        ),
      ),
    );
  }

  Widget _buildTicketCard(Ticket ticket) {
    Color stageColor = Colors.orange;
    String stageText = 'Submitted';
    if (ticket.currentStage == 'assigned') {
      stageColor = Colors.blue;
      stageText = 'Crew Assigned';
    } else if (ticket.currentStage == 'in_progress') {
      stageColor = Colors.purple;
      stageText = 'In Progress';
    } else if (ticket.currentStage == 'resolved') {
      stageColor = Colors.green;
      stageText = 'Resolved';
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blueGrey.shade50,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    ticket.category,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.blueGrey.shade800),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: stageColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    stageText,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: stageColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              ticket.title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.location_on, size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    ticket.location,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            if (ticket.workerName != null) ...[
              const Divider(height: 18),
              Row(
                children: [
                  const Icon(Icons.engineering, size: 16, color: Colors.blue),
                  const SizedBox(width: 6),
                  Text(
                    'Assigned Crew: ${ticket.workerName}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
