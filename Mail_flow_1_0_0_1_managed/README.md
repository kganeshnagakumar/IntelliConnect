# IntelliConnect Mail Flow Solution

This directory contains the managed Power Automate solution (`Mail_flow_1_0_0_1_managed`) responsible for handling the automated email delivery, notifications, and task assignments for the IntelliConnect platform.

## Overview
Instead of relying solely on the Python backend for email dispatch, IntelliConnect leverages Microsoft Power Automate to seamlessly integrate with enterprise environments. The solution monitors the database (or API triggers) and orchestrates the delivery of:
- Post-meeting PDF reports
- Personalized action item assignments
- Status notifications

## Deployment Instructions

1. **Import the Solution**:
   - Navigate to the [Power Automate Portal](https://make.powerautomate.com/).
   - Go to **Solutions** -> **Import solution**.
   - Select the `Mail_flow_1_0_0_1_managed` package (you may need to zip this folder to import it, depending on your environment setup).
   
2. **Configure Connections**:
   - During the import process, you will be prompted to re-authenticate or map the necessary connections (e.g., Office 365 Outlook, database connectors).

3. **Enable Flows**:
   - Once imported, open the solution and ensure all cloud flows are turned on.

## Development Notes
This is a **Managed** solution. If you need to make changes to the flow:
1. Make the changes in your development environment (using an unmanaged version).
2. Export the updated solution as Managed.
3. Replace the contents of this folder with the newly exported managed solution files.
4. Commit your changes.
