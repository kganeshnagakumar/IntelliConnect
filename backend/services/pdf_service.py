from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from datetime import datetime
import os

class PDFService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_style = ParagraphStyle(
            'CustomStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            leading=14,
            spaceAfter=10
        )

    def generate_meeting_pdf(self, output_path, meeting_title, context_summary, role_summaries, personal_tasks=None, recipient_name=None):
        """Generates a structured PDF for a meeting."""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        elements = []

        # Header
        elements.append(Paragraph(f"Meeting Report: {meeting_title}", self.styles['Title']))
        elements.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", self.styles['Normal']))
        elements.append(Spacer(1, 20))

        # Context Summary
        elements.append(Paragraph("Context Summary", self.styles['Heading2']))
        elements.append(Paragraph(context_summary, self.custom_style))
        elements.append(Spacer(1, 15))

        # Role Based Summaries
        elements.append(Paragraph("Role-Based Insights", self.styles['Heading2']))
        for role in role_summaries:
            elements.append(Paragraph(f"<b>{role['role']}</b>", self.styles['Heading3']))
            elements.append(Paragraph(role['content'], self.custom_style))
        elements.append(Spacer(1, 15))

        # Personal Tasks (If any)
        if personal_tasks:
            elements.append(Paragraph(f"Personalized Action Items for {recipient_name or 'You'}", self.styles['Heading2']))
            data = [["Task", "Priority", "Deadline"]]
            for task in personal_tasks:
                data.append([task['task'], task['priority'], task.get('deadline', 'N/A')])
            
            t = Table(data, colWidths=[300, 80, 100])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(t)

        doc.build(elements)
        return output_path
