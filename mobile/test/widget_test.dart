import 'package:flutter_test/flutter_test.dart';
import 'package:janrakshak_mobile/main.dart';

void main() {
  testWidgets('JanRakshak smoke test and title verification', (WidgetTester tester) async {
    await tester.pumpWidget(const JanRakshakApp());
    expect(find.text('JanRakshak'), findsOneWidget);
  });
}
