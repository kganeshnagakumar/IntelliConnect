# Supabase Connect Django Backend

This is a Django backend project configured to connect to a Supabase PostgreSQL database.

## Setup

1. Ensure you have Python installed.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`

## Database Configuration

The database is configured in `supabase_connect/settings.py` using `dj-database-url`.

Make sure your `DATABASE_URL` is set correctly with your Supabase credentials.

## Models

- `api.Meeting`: Stores overall meeting information (ID, title, date, time, etc.)
- `api.Participant`: Stores participant details linked to meetings
- `api.Task`: Stores extracted action items from meetings
- `api.Document`: Stores generated documents (MOM, Summary, etc.)

## Running Migrations

To create tables in Supabase:

```bash
python manage.py migrate
```

Note: This Supabase host currently resolves only to IPv6. If your environment cannot route IPv6, Django will fail with `Network is unreachable` when connecting to the database. In that case, use the Supabase SQL Editor to create tables and insert data, or switch to a network/machine with IPv6 support.

## Running the Server

```bash
python manage.py runserver
```

## Requirements

- Django
- psycopg2-binary
- dj-database-url